# humbored.com

A playful personal site: an 80s disco "ENTER THE MANOSPHERE!!" landing page, a browser cat game, and an AI prompting guide.
Hosted on GitHub Pages from `christothejames/christothejames.github.io`; the `CNAME` file points it at humbored.com.

## Tech
- Plain static HTML. Each page is one self-contained file with its own `<style>` and `<script>`.
- No framework, no build step, no package.json. Pushing to `main` deploys the site.
- Only external dependency: Google Fonts.

## Run it locally
- Open any `.html` file in a browser, or run `python3 -m http.server 8000` and visit http://localhost:8000

## Pages
- `index.html` – "ENTER THE MANOSPHERE!!" landing page. 80s synthwave look: swinging CSS disco ball, light reflections, striped sunset, moving pink grid floor. The ENTER button links to the game.
- `cat-shooting-game.html` – "Whisker Watch", a canvas game (guard the fish bowl from mice). Saves the best score in `localStorage` under `whiskerwatch_best`.
- `learn-ai.html` – "Talk to AI Like You Mean It", a guide to prompting (specific, context, format; before/after examples). Not linked from any other page yet.
- `cat.jpg` – old Battle Cat image (~350 KB). Not used by any page right now.
- `CNAME` – custom domain. Never delete or change it.

## Style
- Each page has its own look; keep a page's existing palette and fonts when editing it.
  - Landing: deep purple night sky, hot pink `#ff2fa6`, bubblegum `#ff8fd8`, neon cyan `#3ef2ff`; Bungee (headline), Monoton (neon tagline), Righteous.
  - Game: dark purple with warm orange/pink, Fredoka + Quicksand.
  - Guide: dark teal-slate with orange accents, Space Grotesk + IBM Plex Sans/Mono.
- Tone: fun, silly, energetic. Short punchy text.
- Must work on phones (touch, small screens). Respect `prefers-reduced-motion` for heavy animation.

## Rules for Claude
- Keep pages self-contained single HTML files unless asked otherwise. No build tools or frameworks without asking.
- New pages: add a link to them from `index.html` so they can be found.
- Keep images compressed; keep the site fast.
- Don't break the game's saved high score (`whiskerwatch_best`).
- After changes, open the page in a browser and check it on a narrow (phone) width before saying it's done.
