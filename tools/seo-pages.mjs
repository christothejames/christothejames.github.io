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
  const img = p.photo ? (/^https:/.test(p.photo) ? p.photo : `${ORIGIN}/${p.photo}`) : '';

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

// Sitemap: the public pages people should land on, then every man's page.
// Left out on purpose: me.html (private), profile.html (men/ replaces it), test.html (pulled), design-options/.
const PAGES = ['', 'home.html', 'web.html', 'opinion.html', 'plan.html', 'skills.html', 'chores.html', 'brotherhood.html', 'pickup.html', 'about.html', 'privacy.html'];
const urls = [...PAGES.map(f => `${ORIGIN}/${f}`), ...[...keep].sort().map(f => `${ORIGIN}/men/${f}`)];
fs.writeFileSync(path.join(site, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log(`seo-pages: ${keep.size} profile pages in men/, ${removed.length} removed${removed.length ? ` (${removed.join(', ')})` : ''}, sitemap.xml has ${urls.length} links`);
if (skipped.length) console.log(`Skipped (id is not lowercase letters, numbers and dashes): ${skipped.join(', ')}`);
