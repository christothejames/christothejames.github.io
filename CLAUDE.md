# humbored.com

A playful personal site: an 80s disco "ENTER THE MANOSPHERE!!" entry screen leading to "The Real Man Report": a most-wanted-style board of notable men, good and bad, with Facebook-style profiles. The point: ordinary decent men are more masculine than "toxic alpha" influencers.
Hosted on GitHub Pages from `christothejames/christothejames.github.io`; the `CNAME` file points it at humbored.com.

## Tech
- Plain static HTML. Each page has its own `<style>` and `<script>`; the people data lives in `data/people.js`.
- No framework, no build step, no package.json. Pushing to `main` deploys the site.
- Only external dependency: Google Fonts.

## Run it locally
- Open any `.html` file in a browser, or run `python3 -m http.server 8000` and visit http://localhost:8000

## Pages
- `index.html` – "ENTER THE MANOSPHERE!!" entry screen: the owner's chosen cartoon-king meme (`images/entry-meme.jpg`, full with caption) with a pulsing chrome-blue "ENTER THE MANOSPHERE!!" under the staff head, over the synthwave sky, sunset, light reflections and moving blue grid floor. The ENTER button goes to `home.html`. The meme is a TV still the owner chose to use despite copyright risk; don't swap it without asking.
- `home.html` – random hero card (top right of the Wanted board): photo with a slanted red shout banner; each click shows a different hero. Heroes, shouts and photo credits live in `data/heroes.js`, photos in `images/heroes/` (480×480).
- `home.html` – two poster boards: "WANTED: MORE MEN LIKE HIM" (good) and "NOT WANTED" (bad), with search. Each poster links to a profile.
- `profile.html?id=<id>` – Facebook-style profile: cover, avatar, status line, intro, dated timeline posts with source links, About and Photos tabs, reactions (saved only in the viewer's browser).
- `data/people.js` – public profiles: `list` (good/bad), role, reason, legal/status line, about facts, dated posts with sources.
- `data/shadow.js` – the shadow points system: `RULES` (weights), points for each man, and new men under review (`list: "review"`, hidden from public boards). Raw points are summed and scaled 0–100 across real men; composites aren't scaled. Each rule also belongs to a dimension (`DIMS`: body, service, community, family, trust, conduct) and every man gets a 0–100 score per dimension, or "no record" if he has no facts in it.
- `shadow.html` – full shadow ranking with point breakdowns and the rules table. Shows nothing unless shadow mode is on.
- `plan.html` – "The Game Plan": pick an area (pressure, low mood, anger, alcohol, dating, relationship, friendships, purpose, sleep), then a situation, and get a strategy: moves, a quick win today, when to call in backup and who. Red BACKUP NOW button opens crisis lines by country. Deep links: `plan.html#alcohol/cut-back`.
- `data/plans.js` – all Game Plan strategies (`AREAS`) and crisis lines (`BACKUP`).
- `images/` – profile photos, 600×600 JPG around 50 KB. Set `photo`, `photoCredit` (author, licence, "via Wikimedia Commons") and `photoSource` (the Commons file page) in people.js; credits show on the profile and in the home footer. Never use mugshots or arrest photos of anyone not convicted.
- `CNAME` – custom domain. Never delete or change it.

## Style
- All pages share one blue 80s disco look (bold, macho, welcoming); keep new pages in the same style.
  - Colors: navy night sky `#050b1a`, electric blue `#1e90ff`, sky blue `#7cc4ff`, neon cyan `#3ef2ff`; gold `#ffe66d` for the good board, red `#ff3b3b` for the bad board. Fonts: Bungee (bold headings), Monoton (neon titles), Righteous (body).
- Tone: fun, silly, energetic. Short punchy text.
- Must work on phones (touch, small screens). Respect `prefers-reduced-motion` for heavy animation.

## Game Plan wording (important)
- Strategy, not sympathy: "your moves", "quick win", "call in backup". Never imply he's weak, broken or a victim.
- Short sentences a 15-year-old understands first read.
- Getting help is framed as a tactic (pros have coaches), never as failure.
- Anything touching self-harm or suicide must point straight to BACKUP NOW. Urgent situations (`urgent: true`) open the backup panel automatically.
- Alcohol: always keep the warning not to stop suddenly if he gets shakes, sweats or sickness without a drink, and to see a doctor.
- Dating advice must be respectful: she's a person, not a target; a no is a no.
- Check any crisis number against an official source before changing it. These are general strategies, not medical advice.

## Rules for Claude
- Keep pages self-contained single HTML files unless asked otherwise. No build tools or frameworks without asking.
- New pages: link to them from `home.html` so they can be found.
- Keep images compressed; keep the site fast.
- Only public figures or clearly labelled composites on the site, never private individuals.
- Every factual claim about a real person needs a source link. Charges are allegations: say "charged with" and note if he denies them. Check legal status is current before editing a profile.
- Shadow scores are never shown to normal visitors. Adding `?shadow` to a page address turns on shadow mode for that browser tab (`?shadow=off` turns it off). The scores are still readable in the public code, so don't treat them as secret.
- Scoring uses the Ten Commandments about how people are treated (murder, theft/fraud, adultery, lying, greed, parents), never religious belief or practice. Only count infidelity he admitted or a court established; unproven allegations are worth little and must say he denies them.
- New men go in as `review` until the owner decides good or bad.
- Score a politician only on his personal record, never his politics or policies.
- Posters for people charged but not convicted must show their current legal status and that the board is opinion, not a finding of guilt.
- Only use photos we have the right to use (e.g. Wikimedia Commons) and fill in `photoCredit`.
- After changes, open the page in a browser and check it on a narrow (phone) width before saying it's done.
