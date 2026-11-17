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

// Sitemap: the public pages people should land on, then every man's page.
// Left out on purpose: me.html (private), profile.html (men/ replaces it), test.html (pulled), design-options/.
const PAGES = ['', 'home.html', 'web.html', 'opinion.html', 'plan.html', 'skills.html', 'chores.html', 'brotherhood.html', 'pickup.html', 'about.html', 'privacy.html'];
const urls = [...PAGES.map(f => `${ORIGIN}/${f}`), ...[...helpKeep].map(f => `${ORIGIN}/${f}`), ...[...keep].sort().map(f => `${ORIGIN}/men/${f}`)];
fs.writeFileSync(path.join(site, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log(`seo-pages: ${keep.size} profile pages in men/, ${removed.length} removed${removed.length ? ` (${removed.join(', ')})` : ''}, sitemap.xml has ${urls.length} links`);
if (skipped.length) console.log(`Skipped (id is not lowercase letters, numbers and dashes): ${skipped.join(', ')}`);
