// Adds `born` (and `died`, if he has died) years to every public profile in data/people.js,
// for the home page's age filter.
//
//   node tools/birth-years.mjs [--dry-run]
//
// Finds his English Wikipedia title (`wiki` field, else the title controversy-links.mjs
// cached, else the Wikipedia page his posts cite, else his name), asks Wikipedia for its
// Wikidata item, then reads date of birth (P569) and date of death (P570) from Wikidata.
// Only men without `born` are done. The fields go right after his `type:` line.
// Men it can't find are listed at the end: add `born: YYYY` by hand, with a source.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PEOPLE = join(ROOT, 'data', 'people.js');
const CACHE = join(ROOT, 'tools', '.cache', 'controversy.json');
const BATCH = 50;
const UA = 'humbored-birth-years/1.0 (https://humbored.com; humbored.contact@gmail.com)';
const dryRun = process.argv.includes('--dry-run');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

async function getJson(url) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
    if (res.ok) return res.json();
    if (attempt >= 3 || (res.status !== 429 && res.status < 500)) throw new Error(`HTTP ${res.status} for ${url}`);
    await sleep(2000 * attempt);
  }
}

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

// Wikipedia titles → Wikidata IDs, following redirects, 50 per request.
async function qidsFromTitles(titles) {
  const out = {};
  for (let i = 0; i < titles.length; i += BATCH) {
    const chunk = titles.slice(i, i + BATCH);
    const data = await getJson(`https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(chunk.join('|'))}`);
    const to = {};
    for (const r of [...(data.query.normalized || []), ...(data.query.redirects || [])]) to[r.from] = r.to;
    const qid = {};
    for (const pg of data.query.pages || []) if (pg.pageprops?.wikibase_item) qid[pg.title] = pg.pageprops.wikibase_item;
    for (const t of chunk) { let x = t; while (to[x]) x = to[x]; if (qid[x]) out[t] = qid[x]; }
    await sleep(250);
  }
  return out;
}

// Wikidata IDs → { born, died } years, 50 per request. Only "human" items count.
async function yearsFromQids(qids) {
  const out = {};
  const year = (e, prop) => {
    const c = (e.claims?.[prop] || []).find(c => c.rank === 'preferred') || e.claims?.[prop]?.[0];
    const t = c?.mainsnak?.datavalue?.value?.time;
    return t ? parseInt(t.slice(1, 5), 10) : undefined;
  };
  for (let i = 0; i < qids.length; i += BATCH) {
    const data = await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims&ids=${qids.slice(i, i + BATCH).join('|')}`);
    for (const [id, e] of Object.entries(data.entities || {})) {
      const human = (e.claims?.P31 || []).some(c => c.mainsnak?.datavalue?.value?.id === 'Q5');
      if (human) out[id] = { born: year(e, 'P569'), died: year(e, 'P570') };
    }
    await sleep(250);
  }
  return out;
}

// Write born/died right after his `type:` line, replacing any old ones.
function writeFields(src, p, y) {
  const id = JSON.stringify(p.id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(\\n[ \\t]*id: ${id},\\r?\\n(?:[ \\t]*(?!type:)\\w+: [^\\r\\n]*\\r?\\n)*?([ \\t]*)type: [^\\r\\n]*(\\r?\\n))` +
    `(?:[ \\t]*(?:born|died): [^\\r\\n]*\\r?\\n)*`);
  const m = re.exec(src);
  if (!m) throw new Error(`can't find the type: line for ${p.id} in people.js`);
  const [whole, head, pad, eol] = m;
  const lines = `${pad}born: ${y.born},${eol}` + (y.died ? `${pad}died: ${y.died},${eol}` : '');
  return src.slice(0, m.index) + head + lines + src.slice(m.index + whole.length);
}

let src = readFileSync(PEOPLE, 'utf8');
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const todo = loadPeople(src).filter(p => p.type === 'public' && !('born' in p));
console.log(`${todo.length} profiles to do${dryRun ? ' (dry run, nothing saved)' : ''}`);

const titleOf = p => p.wiki || cache[p.id]?.page?.title || titleFromPosts(p) || p.name;
const qids = await qidsFromTitles([...new Set(todo.map(titleOf))]);
const years = await yearsFromQids([...new Set(Object.values(qids))]);

const missing = [];
for (const p of todo) {
  const y = years[qids[titleOf(p)]];
  if (!y?.born) { missing.push(`${p.id} (${titleOf(p)})`); continue; }
  src = writeFields(src, p, y);
  console.log(`✓ ${p.id}: ${y.born}${y.died ? `–${y.died}` : ''}`);
}
if (!dryRun) writeFileSync(PEOPLE, src);
console.log(`\n${todo.length - missing.length} done.`);
if (missing.length) console.log(`No birth year found (add by hand):\n  ${missing.join('\n  ')}`);
