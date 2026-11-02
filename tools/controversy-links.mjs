// Adds a Wikipedia "controversies" link to every public profile in data/people.js.
//
//   node tools/controversy-links.mjs [--batches N] [--dry-run] [--recheck]
//
// For each man without `controversy_url` it finds his English Wikipedia title
// (`wiki` field, else `qid` via Wikidata, else the Wikipedia page his posts cite,
// else his name), fetches ONLY the section list (action=parse&prop=sections),
// and links the first section whose heading matches KEYWORDS (see pickSection
// for the exclusions). No match = the main article URL with
// `controversy_match: false`. Runs 50 profiles per batch, saves people.js and
// the cache after each batch. Cache: tools/.cache/ (gitignored).
//
// --recheck also re-applies the rules to links this script set earlier and
// prints every heading that changes. A link edited by hand (it no longer matches
// the cache) is never touched, so fix a bad match by editing people.js.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PEOPLE = join(ROOT, 'data', 'people.js');
const CACHE = join(ROOT, 'tools', '.cache', 'controversy.json');
const BATCH = 50;
const KEYWORDS = ['controvers', 'criticism', 'legal', 'lawsuit', 'allegation', 'scandal', 'dispute', 'investigation'];
// Keywords match at the start of a word, so "Undisputed champion" isn't a dispute.
const KEYWORD_RE = new RegExp(`\\b(${KEYWORDS.join('|')})`, 'i');
const UA = 'humbored-controversy-links/1.0 (https://humbored.com; humbored.contact@gmail.com)';
const API = 'https://en.wikipedia.org/w/api.php';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const recheck = args.includes('--recheck');
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
  return { title: data.parse.title, sections: data.parse.sections.map(s => ({ line: s.line, anchor: s.anchor })) };
}

// First heading about him that has a keyword. Skipped:
// - "career" headings ("Legal career" is a job, not a lawsuit);
// - "Criticism of X" when X isn't him (criticism he made of someone else);
// - keywords inside a work's title: italics (<i>A Very Royal Scandal</i>) or quotes.
function pickSection(p, page) {
  const own = new Set([p.name, page.title.replace(/\s*\(.*\)$/, '')]
    .flatMap(n => n.split(/\s+/)).map(norm).filter(w => w.length > 2));
  return page.sections.find(s => {
    const heading = stripTags(s.line);
    if (/\bcareer/i.test(heading)) return false;
    const target = /\bcriticism of (.+)/i.exec(heading)?.[1];
    if (target && !target.split(/\s+/).some(w => own.has(norm(w)))) return false;
    const outsideTitles = s.line.replace(/<i>.*?<\/i>/g, ' ').replace(/"[^"]*"|“[^”]*”/g, ' ');
    return KEYWORD_RE.test(stripTags(outsideTitles));
  });
}

function result(p, page) {
  const hit = pickSection(p, page);
  return hit
    ? { controversy_url: wikiUrl(page.title, hit.anchor), controversy_match: true, section: stripTags(hit.line) }
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
const isScriptSet = p => cache[p.id] && cache[p.id].controversy_url === p.controversy_url &&
  cache[p.id].controversy_match === (p.controversy_match !== false);
const people = loadPeople(src).filter(p => p.type === 'public');
const todo = people.filter(p => !('controversy_url' in p) || (recheck && isScriptSet(p)));
console.log(`${todo.length} profiles to do${dryRun ? ' (dry run, nothing saved)' : ''}`);

const qidTitles = await titlesFromQids([...new Set(todo.filter(p => !p.wiki && p.qid && !cache[p.id]).map(p => p.qid))]);
const failed = [], changed = [];
let matched = 0, unmatched = 0;

for (let b = 0; b * BATCH < todo.length && b < maxBatches; b++) {
  const batch = todo.slice(b * BATCH, (b + 1) * BATCH);
  for (const p of batch) {
    let page = cache[p.id]?.page;
    if (!page) {
      const title = cache[p.id]?.title || p.wiki || qidTitles[p.qid] || titleFromPosts(p) || p.name;
      try { page = await fetchSections(title); } catch (e) { page = { error: e.message }; }
      await sleep(250);
      if (page.error) { failed.push(`${p.id} (${title}): ${page.error}`); continue; }
    }
    const r = result(p, page);
    const before = cache[p.id];
    if (before && before.controversy_url !== r.controversy_url)
      changed.push(`${p.id}: ${before.section || 'main article'} → ${r.section || 'main article'}`);
    cache[p.id] = { ...r, page };
    src = writeFields(src, p, r);
    r.controversy_match ? matched++ : unmatched++;
    console.log(`${r.controversy_match ? '✓' : '·'} ${p.id} → ${r.section || 'main article'}`);
  }
  if (!dryRun) {
    writeFileSync(PEOPLE, src);
    mkdirSync(dirname(CACHE), { recursive: true });
    writeFileSync(CACHE, JSON.stringify(cache, null, 2));
  }
  console.log(`-- batch ${b + 1} done`);
}

console.log(`\n${matched} with a controversy section, ${unmatched} main article only, ${failed.length} failed`);
if (failed.length) console.log(failed.map(f => '  ' + f).join('\n'));
if (changed.length) console.log(`\nHeadings changed:\n${changed.map(c => '  ' + c).join('\n')}`);
