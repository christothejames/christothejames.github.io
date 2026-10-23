# humbored.com

A playful personal site: an 80s disco "ENTER THE MANOSPHERE!!" entry screen leading to "The Real Man Report", a news-style site that scores public figures on how they treat people. The point: ordinary decent men are more masculine than "toxic alpha" influencers.
Hosted on GitHub Pages from `christothejames/christothejames.github.io`; the `CNAME` file points it at humbored.com.

## Tech
- Plain static HTML. Each page has its own `<style>` and `<script>`; the people data lives in `data/people.js`.
- No framework, no build step, no package.json. Pushing to `main` deploys the site.
- Only external dependency: Google Fonts.

## Run it locally
- Open any `.html` file in a browser, or run `python3 -m http.server 8000` and visit http://localhost:8000

## Pages
- `index.html` – "ENTER THE MANOSPHERE!!" entry screen. 80s synthwave look: swinging CSS disco ball, light reflections, striped sunset, moving pink grid floor. The ENTER button goes to `home.html`.
- `home.html` – "The Real Man Report": live ticker, lead story, rankings (sort by category, filter public figures vs everyday men), profile pop-ups with sourced facts, head-to-head compare with radar chart, methodology, and "Add a man" (sliders + photo upload, saved only in that visitor's browser).
- `data/people.js` – all people, scores, categories, tiers and ticker lines. Edit this to add or change people.
- `images/` – profile photos (set `photo: "images/name.jpg"` in people.js).
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
- Only public figures or clearly labelled composites on the site, never private individuals.
- Every factual claim about a real person needs a source link. Charges are allegations: say "charged with" and note if he denies them. Check legal status is current before editing a profile.
- Scores are editorial opinion and must be labelled that way. Categories with no public record get a neutral 75.
- Only use photos we have the right to use (e.g. Wikimedia Commons) and fill in `photoCredit`.
- After changes, open the page in a browser and check it on a narrow (phone) width before saying it's done.
