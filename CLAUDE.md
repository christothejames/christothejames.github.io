# humbored.com

A playful personal site: an 80s disco "ENTER THE MANOSPHERE!!" entry screen leading to "MAN RANK", a page that rates men on a 0–100 scale.
Hosted on GitHub Pages from `christothejames/christothejames.github.io`; the `CNAME` file points it at humbored.com.

## Tech
- Plain static HTML. Each page is one self-contained file with its own `<style>` and `<script>`.
- No framework, no build step, no package.json. Pushing to `main` deploys the site.
- Only external dependency: Google Fonts.

## Run it locally
- Open any `.html` file in a browser, or run `python3 -m http.server 8000` and visit http://localhost:8000

## Pages
- `index.html` – "ENTER THE MANOSPHERE!!" entry screen. 80s synthwave look: swinging CSS disco ball, light reflections, striped sunset, moving pink grid floor. The ENTER button goes to `home.html`.
- `home.html` – "MAN RANK" home page: the 0–100 scale with six tiers and a leaderboard. Names, scores and tiers are edited in the `men` and `tiers` lists at the top of its `<script>`; the list sorts itself.
- `CNAME` – custom domain. Never delete or change it.

## Style
- Both pages share one 80s disco look; keep new pages in the same style.
  - Colors: deep purple night sky, hot pink `#ff2fa6`, bubblegum `#ff8fd8`, neon cyan `#3ef2ff`, gold `#ffe66d`; Bungee (bold headings), Monoton (neon titles), Righteous (body).
- Tone: fun, silly, energetic. Short punchy text.
- Must work on phones (touch, small screens). Respect `prefers-reduced-motion` for heavy animation.

## Rules for Claude
- Keep pages self-contained single HTML files unless asked otherwise. No build tools or frameworks without asking.
- New pages: link to them from `home.html` so they can be found.
- Keep images compressed; keep the site fast.
- Only put public figures or made-up names on the leaderboard, never private individuals.
- After changes, open the page in a browser and check it on a narrow (phone) width before saying it's done.
