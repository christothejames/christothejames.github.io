// Adds a Wikipedia "controversies" link to every public profile in data/people.js.
//
//   node tools/controversy-links.mjs [--batches N] [--dry-run] [--recheck [--apply]]
//
// For each man without `controversy_url` it finds his English Wikipedia title
// (`wiki` field, else `qid` via Wikidata, else the Wikipedia page his posts cite,
// else his name), fetches ONLY the section list (action=parse&prop=sections),
// and links the best heading by TIERS (see pickSection for the exclusions).
// No match = the main article URL with `controversy_match: false`. Weak-tier
// matches are saved but listed for review. Runs 50 profiles per batch, saves
// people.js and the cache after each batch. Cache: tools/.cache/ (gitignored).
//
// --recheck re-applies the rules to links this script set earlier and lists
// every heading that would change; nothing is saved without --apply. A link
// set by hand is never touched: fix a bad match in people.js and add
// `controversy_manual: true` to that man.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PEOPLE = join(ROOT, 'data', 'people.js');
const CACHE = join(ROOT, 'tools', '.cache', 'controversy.json');
const BATCH = 50;
// A strong heading beats a weak one anywhere in the article; within a tier the first wins.
// Keywords match at the start of a word, so "Undisputed champion" isn't a dispute.
const TIERS = {
  strong: ['controvers', 'allegation', 'arrest', 'charges', 'conviction', 'trial', 'murder', 'misconduct', 'scandal'],
  weak: ['criticism', 'legal', 'dispute', 'lawsuit', 'investigation'],
};
const TIER_RE = Object.fromEntries(Object.entries(TIERS).map(([t, ks]) => [t, new RegExp(`\\b(${ks.join('|')})`, 'i')]));
// Career-phase and life-stage headings ("2011–2015: …", "Early years: …", "Early life").
const PHASE_RE = /^\s*(\d{4}\s*[–—-]\s*(\d{4}|present)?\s*:|(early|later)\s+(years|life)\b)/i;
const UA = 'humbored-controversy-links/1.0 (https://humbored.com; humbored.contact@gmail.com)';
const API = 'https://en.wikipedia.org/w/api.php';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const recheck = args.includes('--recheck');
// A recheck only lists what would change; --apply writes it.
const save = !dryRun && (!recheck || args.includes('--apply'));
const maxBatches = Number(args[args.indexOf('--batches') + 1]) || Infinity;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const wikiUrl = (title, anchor) =>
  `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_')).replace(/%2F/g, '/').replace(/%3A/g, ':')}` +
  (anchor ? `#${encodeURIComponent(anchor)}` : '');
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const stripTags = s => s.replace(/<[^>]+>/g, '');

async function getJson(url) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
    if (res.ok) return res.json();
    if (attempt >= 3 || (res.status !== 429 && res.status < 500)) throw new Error(`HTTP ${res.status} for ${url}`);
    await sleep(2000 * attempt);
  }
}

// people.js assigns window.PEOPLE; run it in a sandbox to read the data.
function loadPeople(src) {
  const ctx = { window: {} };
  vm.runInNewContext(src, ctx);
  return ctx.window.PEOPLE;
}

// The Wikipedia page his own posts cite most, if its title looks like his name.
function titleFromPosts(p) {
  const counts = {};
  for (const post of p.posts || []) {
    const m = /^https?:\/\/en\.wikipedia\.org\/wiki\/([^#?]+)/.exec(post.source || '');
    if (!m) continue;
    const t = decodeURIComponent(m[1]).replace(/_/g, ' ');
    const bare = norm(t.replace(/\s*\(.*\)$/, ''));
    if (bare && (norm(p.name).includes(bare) || bare.includes(norm(p.name)))) counts[t] = (counts[t] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

// Wikidata IDs → enwiki titles, 50 per request.
async function titlesFromQids(qids) {
  const out = {};
  for (let i = 0; i < qids.length; i += BATCH) {
    const ids = qids.slice(i, i + BATCH).join('|');
    const data = await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&sitefilter=enwiki&ids=${ids}`);
    for (const [id, e] of Object.entries(data.entities || {})) if (e.sitelinks?.enwiki) out[id] = e.sitelinks.enwiki.title;
  }
  return out;
}

async function fetchSections(title) {
  const data = await getJson(`${API}?action=parse&format=json&formatversion=2&prop=sections&redirects=1&page=${encodeURIComponent(title)}`);
  if (data.error) return { error: data.error.code };
  return { title: data.parse.title, sections: data.parse.sections.map(s => ({ line: s.line, anchor: s.anchor, level: s.toclevel })) };
}

// Best-tier heading about him that has a keyword. Skipped:
// - "career" headings ("Legal career" is a job, not a lawsuit);
// - career-phase and life-stage headings (PHASE_RE), unless a year range has a strong keyword;
// - "Criticism of X" when X isn't him (criticism he made of someone else);
// - keywords inside a work's title: italics (<i>A Very Royal Scandal</i>) or quotes.
// A strong match inside a weak section ("2013 arrest" under "Legal issues") links the
// weak parent instead, which covers the whole record.
function pickSection(p, page) {
  const own = new Set([p.name, page.title.replace(/\s*\(.*\)$/, '')]
    .flatMap(n => n.split(/\s+/)).map(norm).filter(w => w.length > 2));
  const secs = page.sections.map(s => {
    const heading = stripTags(s.line);
    const text = stripTags(s.line.replace(/<i>.*?<\/i>/g, ' ').replace(/"[^"]*"|“[^”]*”/g, ' '));
    const tier = Object.keys(TIERS).find(t => TIER_RE[t].test(text));
    const target = /\bcriticism of (.+)/i.exec(heading)?.[1];
    const phase = PHASE_RE.test(heading) && !(/^\s*\d{4}\s*[–—-]/.test(heading) && tier === 'strong');
    const usable = !/\bcareer/i.test(heading) && !phase && (!target || target.split(/\s+/).some(w => own.has(norm(w))));
    return { ...s, tier: usable ? tier : undefined };
  });
  const weakParent = i => {
    for (let j = i - 1, level = secs[i].level; j >= 0 && level > 1; j--) {
      if (secs[j].level >= level) continue;
      if (secs[j].tier === 'weak') return secs[j];
      level = secs[j].level;
    }
  };
  for (const tier of Object.keys(TIERS)) {
    const i = secs.findIndex(s => s.tier === tier);
    if (i >= 0) return (tier === 'strong' && weakParent(i)) || secs[i];
  }
}

function result(p, page) {
  const hit = pickSection(p, page);
  return hit
    ? { controversy_url: wikiUrl(page.title, hit.anchor), controversy_match: true, section: stripTags(hit.line), tier: hit.tier }
    : { controversy_url: wikiUrl(page.title), controversy_match: false };
}

// Write the two fields right after his `name:` line, replacing any old ones.
function writeFields(src, p, r) {
  const re = new RegExp(`(\\n([ \\t]*)id: ${JSON.stringify(p.id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},\\r?\\n[ \\t]*name: [^\\r\\n]*(\\r?\\n))` +
    `(?:[ \\t]*controversy_(?:url|match): [^\\r\\n]*\\r?\\n)*`);
  const m = re.exec(src);
  if (!m) throw new Error(`can't find the entry for ${p.id} in people.js`);
  const [whole, head, pad, eol] = m;
  const lines = `${pad}controversy_url: ${JSON.stringify(r.controversy_url)},${eol}` +
    (r.controversy_match ? '' : `${pad}controversy_match: false,${eol}`);
  return src.slice(0, m.index) + head + lines + src.slice(m.index + whole.length);
}

let src = readFileSync(PEOPLE, 'utf8');
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const isScriptSet = p => !p.controversy_manual && cache[p.id] &&cache[p.id].controversy_url === p.controversy_url &&
  cache[p.id].controversy_match === (p.controversy_match !== false);
const people = loadPeople(src).filter(p => p.type === 'public');
const todo = people.filter(p => !('controversy_url' in p) || (recheck && isScriptSet(p)));
console.log(`${todo.length} profiles to do${dryRun ? ' (dry run, nothing saved)' : ''}`);

const qidTitles = await titlesFromQids([...new Set(todo.filter(p => !p.wiki && p.qid && !cache[p.id]).map(p => p.qid))]);
const failed = [], changed = [], weak = [];
let matched = 0, unmatched = 0;

for (let b = 0; b * BATCH < todo.length && b < maxBatches; b++) {
  const batch = todo.slice(b * BATCH, (b + 1) * BATCH);
  for (const p of batch) {
    let page = cache[p.id]?.page;
    // Cache entries from before heading levels were kept are fetched again.
    if (!page || page.sections.some(s => !('level' in s))) {
      const title = page?.title || cache[p.id]?.title || p.wiki || qidTitles[p.qid] || titleFromPosts(p) || p.name;
      try { page = await fetchSections(title); } catch (e) { page = { error: e.message }; }
      await sleep(250);
      if (page.error) { failed.push(`${p.id} (${title}): ${page.error}`); continue; }
    }
    const r = result(p, page);
    const before = cache[p.id];
    const label = x => x.section ? `${x.section}${x.tier ? ` [${x.tier}]` : ''}` : 'main article';
    if (before && before.controversy_url !== r.controversy_url) changed.push(`${p.id}: ${label(before)} → ${label(r)}`);
    if (r.tier === 'weak' && !before) weak.push(`${p.id}: ${r.section}`);
    cache[p.id] = { ...r, page };
    src = writeFields(src, p, r);
    r.controversy_match ? matched++ : unmatched++;
    console.log(`${r.controversy_match ? (r.tier === 'weak' ? '?' : '✓') : '·'} ${p.id} → ${label(r)}`);
  }
  if (save) {
    writeFileSync(PEOPLE, src);
    mkdirSync(dirname(CACHE), { recursive: true });
    writeFileSync(CACHE, JSON.stringify(cache, null, 2));
  }
  console.log(`-- batch ${b + 1} done`);
}

console.log(`\n${matched} with a controversy section, ${unmatched} main article only, ${failed.length} failed`);
if (failed.length) console.log(failed.map(f => '  ' + f).join('\n'));
if (weak.length) console.log(`\nWeak matches to review (saved; set the link by hand if it's wrong):\n${weak.map(w => '  ' + w).join('\n')}`);
if (changed.length) console.log(`\nHeadings ${save ? 'changed' : 'that would change (run with --apply to save)'}:\n${changed.map(c => '  ' + c).join('\n')}`);
