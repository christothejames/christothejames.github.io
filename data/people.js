// =====================================================================
//  THE REAL MAN REPORT — people, profiles and shadow scores
//  Edit this file to add or change people. The site updates itself.
//
//  list:  "good" → poster on the WANTED: MORE MEN LIKE HIM board
//         "bad"  → poster on the NOT WANTED board
//
//  Rules for this list:
//  - Public figures or clearly labelled composites only. No private people.
//  - Every post must be true and have a source link.
//  - Charges are allegations: say "charged with" / "accused of", and say
//    he denies them if he does. Keep `status` up to date.
//
//  SHADOW SCORES live in data/shadow.js (points system). They are never
//  shown to normal visitors. Add ?shadow to a page address to see them.
//
//  Photo: put an image in /images and set photo: "images/name.jpg".
//  Only use photos you have the right to use (e.g. Wikimedia Commons) and
//  put the credit in photoCredit. With no photo, the site shows initials.
// =====================================================================

window.PEOPLE = [
  {
    id: "bear-grylls",
    name: "Bear Grylls",
    list: "good",
    type: "public",
    role: "Adventurer, former SAS reservist, TV host",
    photo: "images/bear-grylls.jpg",
    photoCredit: "Jamie Gray, CC BY 2.0, via Wikimedia Commons (cropped)",
    photoSource: "https://commons.wikimedia.org/wiki/File:Coventry_Scouts_groups_have_a_visit_from_Bear_Grylls.jpg",
    reason: "Broke his back, climbed Everest anyway, then spent 15 years leading the Scouts.",
    status: "Active · Married since 2000 · Father of three",
    about: {
      "Known for": "Man vs. Wild, Running Wild, UK Chief Scout 2009–2024",
      "Served": "21 SAS (reserve), 1994–1997",
      "Family": "Married to Shara since 2000; three sons",
      "Causes": "Scouts, RNLI, SSAFA, children's charities",
    },
    posts: [
      { date: "Sep 2024", text: "Stepped down as UK Chief Scout after 15 years in the role.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { date: "Nov 2018", text: "Named World Scouting's first Chief Ambassador.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { date: "Jul 2009", text: "Appointed UK Chief Scout at 35, the youngest ever.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { date: "Mar 2008", text: "Apologised after it emerged some Man vs. Wild scenes were staged and he sometimes stayed in hotels.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { date: "2000", text: "Married Shara. Led a jet-ski trip around Britain to raise money for the RNLI lifeboat charity.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { date: "May 1998", text: "Reached the summit of Mount Everest, aged 23, about 18 months after breaking his back.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
      { date: "1996", text: "Broke three vertebrae when his parachute failed to open during SAS reserve training in Zambia.", source: "https://en.wikipedia.org/wiki/Bear_Grylls" },
    ],
  },
  {
    id: "marcus-rashford",
    name: "Marcus Rashford",
    list: "good",
    type: "public",
    role: "Footballer, child food poverty campaigner",
    photo: "images/marcus-rashford.jpg",
    photoCredit: "UK Prime Minister's Office, CC BY 2.0, via Wikimedia Commons (cropped)",
    photoSource: "https://commons.wikimedia.org/wiki/File:Marcus_Rashford_in_2023.jpg",
    reason: "Remembered being a hungry kid, and made the government feed millions of others.",
    status: "Active · MBE (2021)",
    about: {
      "Known for": "Manchester United and England forward",
      "Campaign": "Free school meals and child food poverty",
      "Honour": "MBE, November 2021",
      "Raised": "About £20m for his campaigning",
    },
    posts: [
      { date: "Nov 2021", text: "Received his MBE at Windsor Castle, with his mother there.", source: "https://www.skysports.com/football/news/11095/12464652/marcus-rashford-man-utd-forward-awarded-mbe-for-campaign-to-end-child-food-poverty" },
      { date: "2021", text: "Became the youngest person to top the Sunday Times Giving List, after raising about £20m.", source: "https://www.skysports.com/football/news/11095/12464652/marcus-rashford-man-utd-forward-awarded-mbe-for-campaign-to-end-child-food-poverty" },
      { date: "Nov 2020", text: "His campaign forced a second government U-turn: support for hungry children through the school holidays.", source: "https://www.washingtontimes.com/news/2020/nov/8/uk-does-a-u-turn-backs-soccer-stars-child-hunger-c/" },
      { date: "Jun 2020", text: "The government reversed course and extended free school meal vouchers over the summer after his campaign.", source: "https://www.itv.com/news/2020-06-16/marcus-rashford-im-grateful-boris-johnson-changed-policy-on-free-school-meals" },
    ],
  },
  {
    id: "steve-irwin",
    name: "Steve Irwin",
    list: "good",
    type: "public",
    role: "Wildlife conservationist, the Crocodile Hunter (1962–2006)",
    photo: "images/steve-irwin.jpg",
    photoCredit: "Richard Giles, CC BY 2.0, via Wikimedia Commons (cropped)",
    photoSource: "https://commons.wikimedia.org/wiki/File:Steve_Irwin,_December_2005.jpg",
    reason: "Wrestled crocs for a living, and spent every cent protecting them.",
    status: "Died 2006 · Married to Terri 1992–2006 · Father of two",
    about: {
      "Known for": "The Crocodile Hunter, Australia Zoo",
      "Founded": "Wildlife Warriors Worldwide",
      "Family": "Married to Terri from 1992; children Bindi and Robert",
      "Honour": "Centenary Medal, 2001",
    },
    posts: [
      { date: "4 Sep 2006", text: "Died after a stingray barb pierced his chest while filming on the Great Barrier Reef. He was 44.", source: "https://en.wikipedia.org/wiki/Steve_Irwin" },
      { date: "Jan 2004", text: "Fed a crocodile while holding his month-old son. Got roasted worldwide and apologised.", source: "https://en.wikipedia.org/wiki/Steve_Irwin" },
      { date: "Nov 2003", text: "Stopped filming in Mexico to help search for two missing divers.", source: "https://en.wikipedia.org/wiki/Steve_Irwin" },
      { date: "Lifetime", text: "Set up his conservation foundation, now the charity Wildlife Warriors Worldwide.", source: "https://en.wikipedia.org/wiki/Steve_Irwin" },
      { date: "2001", text: "Awarded the Centenary Medal for service to conservation.", source: "https://en.wikipedia.org/wiki/Steve_Irwin" },
      { date: "1996", text: "The Crocodile Hunter hit TV. Hundreds of millions of people learned to love the animals they feared.", source: "https://en.wikipedia.org/wiki/Steve_Irwin" },
      { date: "Jun 1992", text: "Married Terri. They ran Australia Zoo together.", source: "https://en.wikipedia.org/wiki/Steve_Irwin" },
    ],
  },
  {
    id: "everyday-dad",
    name: "The Everyday Dad",
    list: "good",
    type: "composite",
    role: "Composite of ordinary men",
    photo: "",
    photoCredit: "",
    reason: "Shows up. Every day. Nobody films it.",
    status: "Not a real person · Stands for millions of ordinary men",
    about: {
      "Known for": "School runs, packed lunches, being there",
      "Followers": "None. Doesn't need them",
    },
    posts: [
      { date: "Every day", text: "A composite, not a real person: the ordinary men who share the load at home and treat their partners as equals.", source: "" },
    ],
  },
  {
    id: "volunteer-coach",
    name: "The Volunteer Coach",
    list: "good",
    type: "composite",
    role: "Composite of ordinary men",
    photo: "",
    photoCredit: "",
    reason: "Gives up his Saturdays so other people's kids can play.",
    status: "Not a real person · Stands for millions of volunteers",
    about: {
      "Known for": "Youth football, food banks, unpaid hours",
    },
    posts: [
      { date: "Every weekend", text: "A composite, not a real person: the men who coach, mentor and volunteer for nothing.", source: "" },
    ],
  },
  {
    id: "andrew-tate",
    name: "Andrew Tate",
    list: "bad",
    type: "public",
    role: "Influencer, former kickboxer",
    photo: "images/andrew-tate.jpg",
    photoCredit: "James English, CC BY 3.0, via Wikimedia Commons (cropped)",
    photoSource: "https://commons.wikimedia.org/wiki/File:Andrew_Tate_2023.png",
    reason: "Sells 'masculinity' to teenage boys built on dominance over women.",
    status: "Charged in UK and Romania · Denies wrongdoing · Not convicted · In US custody",
    about: {
      "Known for": "Online influencer, self-styled \"Top G\"",
      "Before fame": "World kickboxing champion",
      "Banned from": "Facebook, Instagram, TikTok (2022)",
      "Legal status": "Charged, not convicted. Denies wrongdoing. Extradition hearing 19 Nov 2026",
    },
    posts: [
      { date: "19 Nov 2026", text: "Scheduled: his final US extradition hearing, in Miami.", source: "https://www.forbes.com/sites/conormurray/2026/10/09/court-sets-november-extradition-hearings-for-andrew-and-tristan-tate/" },
      { date: "Sep 2026", text: "Romanian prosecutors indicted him for trafficking minors, sex with a minor and money laundering. He denies all wrongdoing. A US judge also denied him bail.", source: "https://www.aljazeera.com/news/2026/9/4/andrew-tate-indicted-in-romania-for-trafficking-minors-money-laundering" },
      { date: "Jul 2026", text: "Arrested in the US. UK prosecutors added further charges, including seven counts of rape. He is fighting extradition.", source: "https://www.cps.gov.uk/national-news/news/cps-decides-prosecute-tate-brothers-additional-sexual-offences" },
      { date: "May 2025", text: "UK prosecutors confirmed charges including rape, actual bodily harm and human trafficking.", source: "https://www.khaleejtimes.com/world/europe/andrew-tate-tristan-uk-criminal-charges" },
      { date: "Aug 2022", text: "Banned from Facebook, Instagram and TikTok for content about women that broke their rules. He said he is not anti-women.", source: "https://www.thenationalnews.com/lifestyle/2022/08/20/andrew-tate-says-im-not-anti-women-as-campaigners-cheer-tiktok-and-instagram-bans/" },
      { date: "Earlier", text: "Credit where due: a former world kickboxing champion.", source: "https://en.wikipedia.org/wiki/Andrew_Tate" },
    ],
  },
  {
    id: "conor-mcgregor",
    name: "Conor McGregor",
    list: "bad",
    type: "public",
    role: "MMA fighter, former two-division UFC champion",
    photo: "images/conor-mcgregor.jpg",
    photoCredit: "MC1 Alexander Kubitza, U.S. Navy (DoD), public domain, via Wikimedia Commons (cropped)",
    photoSource: "https://commons.wikimedia.org/wiki/File:Conor_McGregor_2025.jpeg",
    reason: "A civil jury found he raped a woman. Courts upheld it twice. He also has an assault conviction.",
    status: "Civil jury found he raped Nikita Hand (upheld on appeal) · He denies it · Never criminally charged over it · Convicted of assault (2019)",
    about: {
      "Known for": "UFC featherweight and lightweight champion, 2015–2018",
      "Family": "Partner Dee Devlin since 2008, married 2025; four children",
      "Banned from": "Driving in Ireland, 2024–2026 · Fighting, 2024–2026 (missed drug tests)",
      "Legal status": "Lost civil rape case and both appeals. Denies it. Never criminally charged over it",
    },
    posts: [
      { date: "Sep 2026", text: "Two witnesses whose sworn statements he tried to use in his appeal were charged with perjury. They have not been tried.", source: "https://www.irishtimes.com/crime-law/courts/2026/09/29/dublin-couple-accused-of-perjury-over-affidavits-in-conor-mcgregor-appeal-to-stand-trial/" },
      { date: "Jul 2026", text: "Back in the UFC after his ban. Lost to Max Holloway in the first round at UFC 329.", source: "https://en.wikipedia.org/wiki/UFC_329" },
      { date: "Dec 2025", text: "Ireland's Supreme Court refused to hear a further appeal, saying he'd had a fair hearing.", source: "https://www.the42.ie/nikita-hand-mcgregor-2-6893918-Dec2025/" },
      { date: "Oct 2025", text: "Banned from fighting for 18 months after failing to tell drug testers where he was three times in 2024.", source: "https://africa.espn.com/mma/ufc/story/_/id/46522617/conor-mcgregor-suspended-18-months-ufc-missed-tests" },
      { date: "Jul 2025", text: "Lost his appeal. Three judges unanimously upheld the jury's finding.", source: "https://www.irishtimes.com/crime-law/courts/2025/07/31/conor-mcgregor-has-lost-appeal-over-civil-rape-case/" },
      { date: "Nov 2024", text: "A High Court civil jury in Dublin found he raped Nikita Hand in a hotel in 2018. Ordered to pay her about €250,000 damages. He denies it; prosecutors had decided not to charge him.", source: "https://news.stv.tv/world/jury-in-civil-court-finds-conor-mcgregor-raped-woman-in-hotel" },
      { date: "Jul 2024", text: "Banned from driving for two years and given a five-month suspended sentence for dangerous driving.", source: "https://www.expressandstar.com/uk-news/conor-mcgregor-receives-suspended-sentence-for-dangerous-driving-5779321" },
      { date: "Nov 2023", text: "After a stabbing in Dublin, posted \"Ireland is at war\" on the day riots broke out. Police examined his posts; he was not charged.", source: "https://en.wikipedia.org/wiki/Conor_McGregor" },
      { date: "Jun 2023", text: "A woman accused him of sexual assault at a Miami NBA Finals game. He denied it. No charges were brought, and her civil suit was dropped.", source: "https://en.wikipedia.org/wiki/Conor_McGregor" },
      { date: "Nov 2019", text: "Pleaded guilty to punching an older man in a Dublin pub. Fined €1,000.", source: "https://www.itv.com/news/utv/2019-11-01/conor-mcgregor-fined-after-dublin-assault" },
      { date: "Jul 2018", text: "Pleaded guilty to disorderly conduct after throwing a hand truck at a bus full of fighters in New York. Community service and anger management.", source: "https://www.cbsnews.com/colorado/news/mma-conor-mcgregor-guilty-disorderly-conduct/" },
      { date: "Nov 2016", text: "Credit where due: became the first fighter to hold two UFC titles at the same time.", source: "https://en.wikipedia.org/wiki/Conor_McGregor" },
    ],
  },
];
