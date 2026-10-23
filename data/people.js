// =====================================================================
//  THE REAL MAN REPORT — people and scores
//  Edit this file to add or change people. The site updates itself.
//
//  Rules for this list:
//  - Public figures or clearly labelled composites only. No private people.
//  - Every "record" line must be true and have a source link.
//  - Charges are allegations: say "charged with" / "accused of", and
//    include that he denies them if he does.
//  - Scores are our opinion (0–100) and say so on the site.
//
//  Photo: put an image in the /images folder and set photo: "images/name.jpg".
//  Use a photo you have the right to use (e.g. Wikimedia Commons) and put
//  the credit in photoCredit. With no photo, the site shows initials.
// =====================================================================

window.CATEGORIES = [
  { key: "women",      label: "Respect for women",   short: "Women" },
  { key: "family",     label: "Family & commitment", short: "Family" },
  { key: "humility",   label: "Humility (no vanity)", short: "Humility" },
  { key: "generosity", label: "Generosity (no greed)", short: "Generosity" },
  { key: "service",    label: "Courage & service",    short: "Service" },
  { key: "integrity",  label: "Integrity & honesty",  short: "Integrity" },
];

window.TIERS = [
  { min: 0,  max: 19,  name: "Fake Alpha",    color: "#9c8cc0" },
  { min: 20, max: 39,  name: "All Talk",      color: "#7fa8c9" },
  { min: 40, max: 59,  name: "Getting There", color: "#3ef2ff" },
  { min: 60, max: 79,  name: "Solid Guy",     color: "#8ff0c4" },
  { min: 80, max: 94,  name: "Real Man",      color: "#ff8fd8" },
  { min: 95, max: 100, name: "Legend",        color: "#ffe66d" },
];

window.PEOPLE = [
  {
    id: "everyday-dad",
    name: "The Everyday Dad",
    type: "composite",          // "public" or "composite"
    role: "Composite of ordinary men",
    photo: "",
    photoCredit: "",
    headline: "Shows up. Every day. Nobody films it.",
    scores: { women: 95, family: 98, humility: 92, generosity: 90, service: 88, integrity: 94 },
    record: [
      { text: "Not a real person: a composite of the millions of ordinary men who do the school run, pay the bills and treat their partners as equals.", source: "" },
    ],
    verdict: "No followers, no Bugatti, no podcast. Outscores every 'alpha' influencer on this site.",
  },
  {
    id: "volunteer-coach",
    name: "The Volunteer Coach",
    type: "composite",
    role: "Composite of ordinary men",
    photo: "",
    photoCredit: "",
    headline: "Gives up his Saturdays so other people's kids can play.",
    scores: { women: 90, family: 88, humility: 94, generosity: 96, service: 92, integrity: 90 },
    record: [
      { text: "Not a real person: a composite of the men who coach youth teams, run food banks and volunteer for free.", source: "" },
    ],
    verdict: "Masculinity as service, not status.",
  },
  {
    id: "bear-grylls",
    name: "Bear Grylls",
    type: "public",
    role: "Adventurer, former SAS reservist, TV host",
    photo: "",
    photoCredit: "",
    headline: "Broke his back, climbed Everest anyway, then spent 15 years leading the Scouts.",
    scores: { women: 90, family: 88, humility: 82, generosity: 92, service: 98, integrity: 80 },
    record: [
      { text: "Served with 21 SAS (reserve) 1994–97; broke three vertebrae in a 1996 parachuting accident.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { text: "Summited Mount Everest in May 1998, about 18 months after the accident, aged 23.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { text: "UK Chief Scout from 2009 to 2024, the youngest ever; World Scouting's first Chief Ambassador.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { text: "Married to Shara since 2000; three sons.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { text: "Raised money for the RNLI, the Duke of Edinburgh's Award, SSAFA and children's charities.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { text: "Against him: Man vs. Wild was found to have staged some scenes, and he sometimes stayed in hotels. He apologised.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
    ],
    verdict: "Tough as anyone alive, and spends it on other people. Docked a few points for the staged TV scenes.",
  },
  {
    id: "marcus-rashford",
    name: "Marcus Rashford",
    type: "public",
    role: "Footballer, child food poverty campaigner",
    photo: "",
    photoCredit: "",
    headline: "Used his fame to get hungry kids fed, and made the government change course.",
    scores: { women: 75, family: 88, humility: 82, generosity: 98, service: 92, integrity: 78 },
    record: [
      { text: "His free school meals campaign led the UK government to change policy during lockdown, including a U-turn on holiday meals.", source: "https://www.skysports.com/football/news/11095/12464652/marcus-rashford-man-utd-forward-awarded-mbe-for-campaign-to-end-child-food-poverty" },
      { text: "Raised about £20m in donations and became the youngest person to top the Sunday Times Giving List.", source: "https://www.skysports.com/football/news/11095/12464652/marcus-rashford-man-utd-forward-awarded-mbe-for-campaign-to-end-child-food-poverty" },
      { text: "Awarded an MBE in November 2021, with his mother at the ceremony.", source: "https://www.skysports.com/football/news/11095/12464652/marcus-rashford-man-utd-forward-awarded-mbe-for-campaign-to-end-child-food-poverty" },
    ],
    verdict: "Remembered what being a hungry kid felt like, and did something about it. 'Respect for women' sits at our neutral score: no public record either way.",
  },
  {
    id: "andrew-tate",
    name: "Andrew Tate",
    type: "public",
    role: "Influencer, former kickboxer",
    photo: "",
    photoCredit: "",
    headline: "Sells 'masculinity' online. Faces rape and trafficking charges in two countries, which he denies.",
    scores: { women: 0, family: 5, humility: 0, generosity: 0, service: 10, integrity: 0 },
    record: [
      { text: "Banned from Facebook, Instagram and TikTok in August 2022 for content about women that broke their rules. He said he is not anti-women.", source: "https://www.thenationalnews.com/lifestyle/2022/08/20/andrew-tate-says-im-not-anti-women-as-campaigners-cheer-tiktok-and-instagram-bans/" },
      { text: "UK prosecutors have charged him with offences including rape and human trafficking; the UK is seeking his extradition.", source: "https://www.cps.gov.uk/national-news/news/cps-decides-prosecute-tate-brothers-additional-sexual-offences" },
      { text: "In September 2026, Romanian prosecutors indicted him for trafficking minors, sex with a minor and money laundering. He denies all wrongdoing.", source: "https://www.aljazeera.com/news/2026/9/4/andrew-tate-indicted-in-romania-for-trafficking-minors-money-laundering" },
      { text: "Held in US custody in Miami since July 2026 and denied bail; his final extradition hearing is set for 19 November 2026.", source: "https://www.forbes.com/sites/conormurray/2026/10/09/court-sets-november-extradition-hearings-for-andrew-and-tristan-tate/" },
      { text: "Credit where due: a former world kickboxing champion.", source: "https://en.wikipedia.org/wiki/Andrew_Tate" },
    ],
    verdict: "He has not been convicted, and he denies the charges. But on what he says about women and how he sells it, he scores at the bottom.",
  },
];

// Short lines for the scrolling news ticker
window.TICKER = [
  "TATE: final US extradition hearing set for 19 Nov. He denies all charges",
  "GRYLLS: 15 years as Chief Scout, the youngest ever appointed",
  "RASHFORD: £20m raised for child food poverty campaign",
  "EVERYDAY DADS: still outscoring every 'alpha' influencer on our board",
];
