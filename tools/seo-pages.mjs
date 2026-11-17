// Builds one search-friendly page per man on the boards, plus sitemap.xml.
//
//   node tools/seo-pages.mjs
//
// Each men/<id>.html is a copy of profile.html with his own title, description,
// canonical link and share-preview tags, and his facts written into the page as
// plain HTML (so search engines and no-JS visitors see them). The full profile
// still draws itself from data/people.js, so later edits to his facts show up
// without re-running this. Re-run it whenever men join or leave the boards, or
// profile.html changes (the admin's publish.mjs runs it for you).
// Pages for men no longer on the boards are deleted.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const site = path.resolve(here, '..');
const ORIGIN = 'https://humbored.com';
const SITE_NAME = 'The Real Man Report';

const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['data/people.js', 'data/wires.js']) vm.runInContext(fs.readFileSync(path.join(site, f), 'utf8'), ctx);
const { PEOPLE, CONTROVERSIAL = [] } = ctx.window;
const men = PEOPLE.filter(p => p.list === 'good' || p.list === 'bad');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');
const TIER = { good: 'Real Men', mid: 'Coin Toss', bad: 'Out of Service' };
const tierOf = p => (CONTROVERSIAL.includes(p.id) ? 'mid' : p.list);
const safeId = id => /^[a-z0-9-]+$/.test(id);

// Structured data (schema.org): tells search engines and AI answer tools that the page is a
// profile of this person, and which other pages are about the same man. Only facts already in
// people.js; our verdict (board, card line) stays out. Composites are not real people, so they
// are marked as a plain web page with no Person.
function jsonLd(p, url, title, img) {
  const page = { '@context': 'https://schema.org', url, name: title, isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${ORIGIN}/` } };
  if (p.type !== 'public') return safeJson({ ...page, '@type': 'WebPage' });
  const sameAs = [];
  if (/^https:\/\/en\.wikipedia\.org\/wiki\//.test(p.controversy_url || '')) sameAs.push(p.controversy_url.split('#')[0]);
  if (p.instagram) sameAs.push(`https://www.instagram.com/${p.instagram}/`);
  if (p.tiktok) sameAs.push(`https://www.tiktok.com/@${p.tiktok}`);
  if (p.facebook) sameAs.push(`https://www.facebook.com/${p.facebook}`);
  const person = {
    '@type': 'Person',
    name: p.name,
    ...(p.role && { description: p.role }),
    ...(img && p.photo && { image: img }),
    ...(p.born && { birthDate: String(p.born) }),
    ...(p.died && { deathDate: String(p.died) }),
    ...(sameAs.length && { sameAs }),
  };
  return safeJson({ ...page, '@type': 'ProfilePage', mainEntity: person });
}
// "<" escaped so text in the data can never close the <script> tag.
const safeJson = o => JSON.stringify(o).replace(/</g, '\\u003c');

const template = fs.readFileSync(path.join(site, 'profile.html'), 'utf8');
const need = ['<title>Profile · The Real Man Report</title>', '<div id="app"></div>', '<script src="data/people.js"></script>'];
need.forEach(s => { if (!template.includes(s)) throw new Error(`profile.html no longer contains ${s}; update tools/seo-pages.mjs`); });

const outDir = path.join(site, 'men');
fs.mkdirSync(outDir, { recursive: true });
const keep = new Set();
let skipped = [];

for (const p of men) {
  if (!safeId(p.id)) { skipped.push(p.id); continue; }
  const url = `${ORIGIN}/men/${p.id}.html`;
  const title = `${p.name} · ${SITE_NAME}`;
  const desc = clip(`${p.name}${p.role ? `, ${p.role}` : ''}. ${p.reason || ''} Every fact sourced.`.replace(/\s+/g, ' ').trim(), 160);
  const img = p.photo ? (/^https:/.test(p.photo) ? p.photo : `${ORIGIN}/${p.photo}`) : `${ORIGIN}/images/share.png`;

  const head = [
    `<base href="/">`,
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="profile">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    img && `<meta property="og:image" content="${esc(img)}">`,
    `<meta name="twitter:card" content="summary">`,
    `<script type="application/ld+json">${jsonLd(p, url, title, img)}</script>`,
  ].filter(Boolean).join('\n');

  // Plain-HTML version of the profile; the page script replaces it when it runs.
  const about = Object.entries(p.about || {}).map(([k, v]) => `<li><b>${esc(k)}:</b> ${esc(v)}</li>`).join('');
  const posts = (p.posts || []).map(x => `<li>${x.date ? `<b>${esc(x.date)}</b> ` : ''}${esc(x.text)}${x.source ? ` <a href="${esc(x.source)}" rel="noopener">source</a>` : ''}</li>`).join('');
  const body = `<div id="app"><div class="wrap seo-static" style="padding:24px 16px">
<h1>${esc(p.name)}</h1>
${p.role ? `<p>${esc(p.role)}</p>` : ''}
<p><b>${TIER[tierOf(p)]}.</b> ${esc(p.reason || '')}</p>
${p.status ? `<p>${esc(p.status)}</p>` : ''}
${about ? `<ul>${about}</ul>` : ''}
${posts ? `<h2>Timeline</h2><ul>${posts}</ul>` : ''}
<p>Profiles are our opinion, drawn from the public record. Charges are not convictions. <a href="home.html">See all the men on the boards</a></p>
</div></div>`;

  const html = template
    .replace(need[0], head)
    .replace(need[1], body)
    .replace(need[2], `<script>window.PROFILE_ID = ${JSON.stringify(p.id)};</script>\n${need[2]}`);
  const file = `${p.id}.html`;
  keep.add(file);
  const target = path.join(outDir, file);
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== html) fs.writeFileSync(target, html);
}

const removed = fs.readdirSync(outDir).filter(f => f.endsWith('.html') && !keep.has(f));
removed.forEach(f => fs.unlinkSync(path.join(outDir, f)));

// ---------------------------------------------------------------------------------------------
// Mental Health: help/<area>.html and help/<area>/<situation>.html, copies of plan.html that open
// on their own strategy (window.PLAN_ROUTE), with the strategy written into the page as HTML.
// plan.html's "Every strategy" list (between the help-index markers) links them all.
const pctx = { window: {} };
vm.createContext(pctx);
vm.runInContext(fs.readFileSync(path.join(site, 'data/plans.js'), 'utf8'), pctx);
const { AREAS } = pctx.window;
const planFile = path.join(site, 'plan.html');
const helpUrl = (a, s) => `help/${a.id}${s ? `/${s.id}` : ''}.html`;

// 1. The link list in plan.html (and so in every help page copied from it)
const INDEX_START = '<!-- help-index: GENERATED by tools/seo-pages.mjs from data/plans.js; edits between these markers are overwritten -->';
const INDEX_END = '<!-- /help-index -->';
let planSrc = fs.readFileSync(planFile, 'utf8');
const i0 = planSrc.indexOf(INDEX_START), i1 = planSrc.indexOf(INDEX_END);
if (i0 < 0 || i1 < i0) throw new Error('plan.html lost its help-index markers; put them back after the bottom coach box');
const eol = planSrc.includes('\r\n') ? '\r\n' : '\n';
const index = `<nav class="all-help" aria-label="Every strategy"><details><summary>EVERY STRATEGY</summary><div class="cols">${
  AREAS.map(a => `<div><h3><a href="${helpUrl(a)}">${a.icon} ${esc(a.name)}</a></h3><ul>${
    a.situations.map(s => `<li><a href="${helpUrl(a, s)}">${esc(s.name)}</a></li>`).join('')}</ul></div>`).join('')
}</div></details></nav>`;
const newPlan = planSrc.slice(0, i0 + INDEX_START.length) + eol + index + eol + planSrc.slice(i1);
if (newPlan !== planSrc) fs.writeFileSync(planFile, newPlan);
planSrc = newPlan;

// 2. The pages
const PLAN_NEED = ['<title>Mental Health · The Real Man Report</title>', '<main id="view" aria-live="polite"></main>', '<script src="data/plans.js"></script>'];
PLAN_NEED.forEach(s => { if (!planSrc.includes(s)) throw new Error(`plan.html no longer contains ${s}; update tools/seo-pages.mjs`); });
// plan.html's own description, canonical and share tags are replaced per page
const planBase = planSrc.replace(/^<(meta name="description"|link rel="canonical"|meta property="og:[^"]+"|meta name="twitter:[^"]+")[^>]*>\r?\n/gm, '');

function helpHead(title, desc, url) {
  return [
    `<base href="/">`,
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${ORIGIN}/images/share.png">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ].join('\n');
}
const helpPage = (route, head, main) => planBase
  .replace(PLAN_NEED[0], head)
  .replace(PLAN_NEED[1], `<main id="view" aria-live="polite">${main}</main>`)
  .replace(PLAN_NEED[2], `<script>window.PLAN_ROUTE = ${JSON.stringify(route)};</script>\n${PLAN_NEED[2]}`);

const helpDir = path.join(site, 'help');
const helpKeep = new Set();
const writeIfChanged = (rel, html) => {
  helpKeep.add(rel);
  const f = path.join(site, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== html) fs.writeFileSync(f, html);
};

for (const a of AREAS) {
  // Area page: the situations to pick from (same markup the page script draws)
  const aUrl = `${ORIGIN}/${helpUrl(a)}`;
  const aMain = `<a class="back" href="plan.html">← All areas</a>
<h2>${a.icon} ${esc(a.name)}: what's closest?</h2>
<div class="list">${a.situations.map(s => `<a class="row${s.urgent ? ' urgent' : ''}" href="${helpUrl(a, s)}"><span>${esc(s.name)}</span><span class="go" aria-hidden="true">›</span></a>`).join('')}</div>`;
  writeIfChanged(helpUrl(a), helpPage(a.id,
    helpHead(`${a.name} help for men · ${SITE_NAME}`, clip(`${a.name} help for men: ${a.tag}. Pick what's closest and get your moves, a quick win for today, and when to call in backup.`, 160), aUrl),
    aMain));

  for (const s of a.situations) {
    const sUrl = `${ORIGIN}/${helpUrl(a, s)}`;
    const safety = m => /^Safety first|tap URGENT HELP/i.test(m);
    const sMain = `<a class="back" href="${helpUrl(a)}">← ${esc(a.name)}</a>
<article>
<div class="plan-head"><div class="area">${a.icon} ${esc(a.name)}</div><h3>${esc(s.name)}</h3><p class="read">${esc(s.read)}</p></div>
<div class="plan-grid">
<div class="moves-box"><p class="label">Your moves</p><ol class="moves">${s.moves.map(m => `<li${safety(m) ? ' class="safety"' : ''}><span>${esc(m)}</span></li>`).join('')}</ol></div>
<div class="side">
<div class="quick"><p class="label">Quick win today</p>${esc(s.quickWin)}</div>
<div class="callin"><p class="label">Call in backup if</p><ul>${s.backup.map(b => `<li>${esc(b)}</li>`).join('')}</ul><p class="who"><b>Who:</b> ${esc(s.who)}</p></div>
</div>
</div>
</article>`;
    writeIfChanged(helpUrl(a, s), helpPage(`${a.id}/${s.id}`,
      helpHead(`${s.name} · ${a.name} help for men · ${SITE_NAME}`, clip(`${s.read} Your moves, a quick win for today, and when to call in backup.`, 160), sUrl),
      sMain));
  }
}

// Remove pages for situations that no longer exist
const walk = d => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
const helpRemoved = walk(helpDir).map(f => path.relative(site, f).split(path.sep).join('/')).filter(f => f.endsWith('.html') && !helpKeep.has(f));
helpRemoved.forEach(f => fs.unlinkSync(path.join(site, f)));
console.log(`help pages: ${helpKeep.size} in help/ (${AREAS.length} areas), ${helpRemoved.length} removed${helpRemoved.length ? ` (${helpRemoved.join(', ')})` : ''}`);

// ---------------------------------------------------------------------------------------------
// Board pages: real-men.html, coin-toss.html, out-of-service.html. Every man on that board as a
// plain link, in board order, so search engines (and people) can reach every profile without
// running the home page's script. The page frame (top bar, footer, shared scripts) is copied from
// about.html, so footer changes there reach these pages on the next run.
const ORDER = ctx.window.ORDER || [];
const rankOf = p => { const i = ORDER.indexOf(p.id); return i < 0 ? 1e9 : i; };
const passed = p => /^died\b/i.test(p.status || '') || /\((died \d{4}|\d{4}[–-]\d{4})\)/i.test(p.role || '');
const initials = n => n.replace(/\s*\(.*\)/, '').replace(/^The\s+/i, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

const BOARDS = [
  { tier: 'good', file: 'real-men.html', name: 'Real Men',
    heading: '<div class="plate"><i aria-hidden="true"></i><h1 class="metal">REAL MEN</h1></div>',
    sub: 'Barbecue with these dudes. Eat ribs and whatnot, and listen to salsa music, you see where I\'m coming from?',
    order: 'best first',
    title: 'Real Men: famous men worth looking up to',
    desc: n => `All ${n} men on the Real Men board: famous men ranked on how they really treat people, best first, with every fact sourced on their profiles.` },
  { tier: 'mid', file: 'coin-toss.html', name: 'Coin Toss',
    heading: '<h1>COIN TOSS</h1>',
    sub: 'Fun at the party until he isn’t. Great stories, questionable choices. Your call.',
    order: 'a split record: good and bad',
    title: 'Coin Toss: famous men with a split record',
    desc: n => `All ${n} men on the Coin Toss board: famous men with a split record, good and bad. Every fact sourced on their profiles. You make the call.` },
  { tier: 'bad', file: 'out-of-service.html', name: 'Out of Service',
    heading: '<h1 class="neon"><span class="f1">O</span>UT O<span class="f2">F</span> SER<span class="dead">V</span>I<span class="f3">C</span>E<span class="f4">.</span></h1>',
    sub: 'Shows up uninvited to your BBQ, finishes your beers, blasts his Bluetooth speaker, and walks through your house with dirty shoes on.',
    order: 'worst first',
    title: 'Out of Service: the men at the bottom of our boards',
    desc: n => `All ${n} men on the Out of Service board, worst first. Our opinion from the public record; charges are not convictions, and each profile shows his current legal status.` },
];

const BOARD_CSS = `
/* ---------- Board pages (generated by tools/seo-pages.mjs) ---------- */
  :root { --red: #ff3b3b; --amber: #ff9f1c; }
  .bwrap { max-width: 1000px; }
  .board-top { padding: 36px 0 6px; }
  .board-top h1 { -webkit-background-clip: border-box; background-clip: border-box; background: none; font-size: clamp(28px, 6.4vw, 48px); }
  .board.good .plate { display: inline-block; position: relative; padding: 10px 34px 12px; border-radius: 6px;
    background: repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 4px), linear-gradient(180deg, #4a535e 0%, #2b3139 55%, #1d2228 100%);
    border: 1px solid #6b7580; box-shadow: inset 0 1px 0 #9aa3ad, inset 0 -2px 0 #11151a, 0 6px 0 #0a0d11, 0 10px 22px #000a; }
  .board.good .plate::before, .board.good .plate::after, .board.good .plate i::before, .board.good .plate i::after {
    content: ''; position: absolute; width: 9px; height: 9px; border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #f2f4f7, #7d8792 60%, #2b3139); box-shadow: 0 1px 1px #000; }
  .board.good .plate::before { top: 8px; left: 10px; } .board.good .plate::after { top: 8px; right: 10px; }
  .board.good .plate i::before { bottom: 8px; left: 10px; } .board.good .plate i::after { bottom: 8px; right: 10px; }
  .board.good h1.metal { background: repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 3px), linear-gradient(180deg, #ffffff 0%, #d9dee4 22%, #9aa3ad 46%, #f2f4f7 50%, #b8c0c9 68%, #7d8792 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-stroke: 1px #3a424c;
    filter: drop-shadow(0 -1px 0 #0d1014) drop-shadow(0 1px 0 #6b7580); letter-spacing: 0.02em; }
  @media (max-width: 520px) { .board.good .plate { padding: 8px 24px 10px; } }
  .board.mid h1 { color: var(--amber); }
  .board.bad h1.neon { color: #ffd2d2; letter-spacing: 0.04em; text-shadow: 0 0 4px var(--red), 0 0 12px var(--red), 0 0 28px #ff1a1a, 0 0 46px #ff000088; }
  .board.bad h1.neon .dead { color: #6b2a2a; text-shadow: none; }
  @media (prefers-reduced-motion: no-preference) {
    .board.bad h1.neon .dead { animation: buzz 2.6s steps(1) infinite; }
    .board.bad h1.neon .f1 { animation: flick 4.3s steps(1) infinite 0.7s; }
    .board.bad h1.neon .f2 { animation: flick 3.1s steps(1) infinite 1.9s; }
    .board.bad h1.neon .f3 { animation: flick 5.7s steps(1) infinite 0.2s; }
    .board.bad h1.neon .f4 { animation: flick 2.3s steps(1) infinite 1.1s; }
  }
  @keyframes flick { 0%, 60%, 63%, 66%, 100% { color: #ffd2d2; text-shadow: 0 0 4px var(--red), 0 0 12px var(--red), 0 0 28px #ff1a1a, 0 0 46px #ff000088; } 61%, 64.5% { color: #6b2a2a; text-shadow: none; } }
  @keyframes buzz { 0%, 70%, 74%, 100% { color: #6b2a2a; text-shadow: none; } 72%, 76% { color: #ffd2d2; text-shadow: 0 0 4px var(--red), 0 0 12px var(--red); } }
  .board { --tc: var(--gold); } .board.mid { --tc: var(--amber); } .board.bad { --tc: #ff7a7a; }
  .board-sub { color: var(--muted); margin: 16px 0 6px; max-width: 640px; }
  .board-note { color: var(--muted); font-size: 15px; margin: 0 0 14px; max-width: 640px; }
  .board-note b { color: var(--tc); font-weight: 400; }
  .switch { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 22px; padding: 0; list-style: none; }
  .switch a { display: inline-block; font-family: 'Bungee', sans-serif; font-size: 13px; padding: 8px 14px; border-radius: 999px;
    color: var(--sky); text-decoration: none; box-shadow: inset 0 0 0 1.5px #7cc4ff66; }
  .switch a:hover { color: #fff; box-shadow: inset 0 0 0 1.5px var(--sky); }
  .switch a[aria-current] { color: var(--night); background: var(--tc); box-shadow: none; }
  .switch a:focus-visible, .roll a:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }
  .roll { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; border-top: 1px solid var(--line); }
  @media (min-width: 820px) { .roll { grid-template-columns: 1fr 1fr; column-gap: 28px; } }
  .roll li { border-bottom: 1px solid var(--line); }
  .roll a { display: flex; gap: 14px; align-items: flex-start; padding: 12px 4px; color: var(--text); text-decoration: none; overflow-wrap: normal; }
  .roll a:hover { background: #1e90ff14; }
  .roll a:hover .nm { color: var(--tc); }
  .roll img, .roll .ini { flex: none; width: 56px; height: 56px; border-radius: 8px; object-fit: cover; background: var(--panel);
    box-shadow: inset 0 0 0 2px var(--tc); }
  .roll img { border: 2px solid var(--tc); }
  .roll .ini { display: grid; place-items: center; font-family: 'Bungee', sans-serif; font-size: 18px; color: var(--tc); }
  .roll .txt { min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .roll .nm { font-family: 'Bungee', sans-serif; font-size: 16px; line-height: 1.25; transition: color .15s; }
  .roll .role { color: var(--muted); font-size: 14px; line-height: 1.35; }
  .roll .why { font-size: 15px; line-height: 1.4; margin-top: 3px; }
  .roll .st { color: var(--muted); font-size: 13px; line-height: 1.35; margin-top: 3px; }
  .roll .rsp { font-family: 'Bungee', sans-serif; font-size: 11px; color: var(--gold); margin-left: 6px; vertical-align: 2px; }
  @media (prefers-reduced-motion: reduce) { .roll .nm { transition: none; } }
`;

const aboutSrc = fs.readFileSync(path.join(site, 'about.html'), 'utf8');
const hdrAt = aboutSrc.indexOf('<header class="wrap">'), footAt = aboutSrc.indexOf('<footer class="site-foot">');
const footEnd = aboutSrc.indexOf('</footer>', footAt) + '</footer>'.length;
const sharedScripts = aboutSrc.match(/<script src="(say|top)\.js[^"]*"><\/script>/g) || [];
if (hdrAt < 0 || footAt < 0 || sharedScripts.length !== 2 || !aboutSrc.includes('<title>About us · The Real Man Report</title>'))
  throw new Error('about.html changed shape (header, site footer, say.js/top.js or title); update the board pages part of tools/seo-pages.mjs');
const boardHeadBase = aboutSrc.slice(0, hdrAt)
  .replace(/^<(meta name="description"|link rel="canonical"|meta property="og:[^"]+"|meta name="twitter:[^"]+")[^>]*>\r?\n/gm, '')
  .replace('</style>', BOARD_CSS + '</style>');
const boardFoot = aboutSrc.slice(footAt, footEnd);

const boardFiles = [];
for (const b of BOARDS) {
  const list = men.filter(p => tierOf(p) === b.tier && safeId(p.id))
    .sort((x, y) => b.tier === 'mid' ? CONTROVERSIAL.indexOf(x.id) - CONTROVERSIAL.indexOf(y.id) : rankOf(x) - rankOf(y));
  const url = `${ORIGIN}/${b.file}`;
  const title = `${b.title} · ${SITE_NAME}`;
  const head = helpHead(title, clip(b.desc(list.length), 160), url).replace('<base href="/">\n', '').replace('content="article"', 'content="website"');
  const rows = list.map(p => {
    const img = p.photo
      ? `<img src="${esc(p.photo)}" alt="" width="56" height="56" loading="lazy" data-ini="${esc(initials(p.name))}" onerror="this.outerHTML='&lt;span class=&quot;ini&quot;&gt;'+this.dataset.ini+'&lt;/span&gt;'">`
      : `<span class="ini" aria-hidden="true">${esc(initials(p.name))}</span>`;
    const rsp = b.tier === 'good' && passed(p) ? '<span class="rsp">Respected</span>' : '';
    const st = b.tier !== 'good' && p.status ? `<span class="st">${esc(p.status)}</span>` : '';
    return `<li><a href="men/${p.id}.html">${img}<span class="txt"><span class="nm">${esc(p.name)}${rsp}</span>${p.role ? `<span class="role">${esc(p.role)}</span>` : ''}<span class="why">${esc(p.reason || '')}</span>${st}</span></a></li>`;
  }).join('\n');
  const html = boardHeadBase.replace('<title>About us · The Real Man Report</title>', head) + `<div class="board ${b.tier}">
<header class="wrap bwrap board-top">
  ${b.heading}
  <p class="board-sub">${esc(b.sub)}</p>
</header>

<main class="wrap bwrap">
  <p class="board-note"><b>${list.length} men</b>, ${esc(b.order)}. Our opinion, based on the public record linked on every profile. Charges are not convictions: each profile shows the man's current legal status.</p>
  <ul class="switch" aria-label="The boards">
${BOARDS.map(o => `    <li><a href="${o.file}"${o === b ? ' aria-current="page"' : ''}>${o.name}</a></li>`).join('\n')}
    <li><a href="home.html">All the posters</a></li>
  </ul>
  <ol class="roll">
${rows}
  </ol>
</main>
</div>

${boardFoot}

${sharedScripts.join('\n')}
</body>
</html>
`;
  writeIfChanged(b.file, html);
  boardFiles.push(b.file);
}
console.log(`board pages: ${BOARDS.map(b => b.file).join(', ')}`);

// Sitemap: the public pages people should land on, then every man's page.
// Left out on purpose: me.html (private), profile.html (men/ replaces it), test.html (pulled), design-options/.
const PAGES = ['', 'home.html', 'web.html', 'opinion.html', 'plan.html', 'skills.html', 'chores.html', 'brotherhood.html', 'pickup.html', 'about.html', 'privacy.html'];
const urls = [...PAGES.map(f => `${ORIGIN}/${f}`), ...boardFiles.map(f => `${ORIGIN}/${f}`), ...[...helpKeep].filter(f => f.startsWith('help/')).map(f => `${ORIGIN}/${f}`), ...[...keep].sort().map(f => `${ORIGIN}/men/${f}`)];
fs.writeFileSync(path.join(site, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log(`seo-pages: ${keep.size} profile pages in men/, ${removed.length} removed${removed.length ? ` (${removed.join(', ')})` : ''}, sitemap.xml has ${urls.length} links`);
if (skipped.length) console.log(`Skipped (id is not lowercase letters, numbers and dashes): ${skipped.join(', ')}`);
