// =====================================================================
//  SHADOW SCORES — the points system behind The Real Man Report
//
//  How it works:
//  1. Every documented fact about a man is tagged with a RULE below.
//  2. Each rule adds or takes away a fixed number of points.
//  3. His raw total is the sum. Raw totals are then scaled 0–100 across
//     everyone (lowest real man = 0, highest = 100). Composites are not
//     included in the scaling.
//
//  To change how much something counts, change the number in RULES.
//  Every man's score updates automatically.
//
//  Ten Commandments: we score the ones about how you treat people
//  (murder, theft/fraud, adultery, lying, coveting/greed, honouring parents).
//  We do not score religious belief or practice.
//
//  "review" men are hidden from the public boards. Move one to "good" or
//  "bad" (set list: in SHADOW_PEOPLE) to put him on a board.
//
//  NOTE: this file is public. Anyone reading the site's code can see it.
// =====================================================================

// Each rule belongs to a dimension. Every man gets a 0–100 score in each
// dimension (scaled across all real men), plus his overall score.
window.DIMS = [
  { key: "body",      label: "Body & survival" },
  { key: "service",   label: "Courage & service" },
  { key: "community", label: "Community" },
  { key: "family",    label: "Family & faithfulness" },
  { key: "trust",     label: "Trustworthiness" },
  { key: "conduct",   label: "Conduct" },
];

window.RULES = {
  // ---- positives ----
  gallantry:      { pts:  30, label: "Gallantry award (VC, Silver Star)", dim: "service" },
  military:       { pts:  15, label: "Military service", dim: "service" },
  selfless:       { pts:  15, label: "Gave up money or status to serve", dim: "service" },
  charity_major:  { pts:  15, label: "Founded a charity or raised millions", dim: "community" },
  honour:         { pts:  10, label: "National honour (knighthood, OBE, MBE, medal)", dim: "community" },
  physique:       { pts:  20, label: "Elite physical discipline (world titles)", dim: "body" },
  survival:       { pts:  10, label: "Survival, endurance or toughness feat", dim: "body" },
  farming:        { pts:  10, label: "Farming", dim: "community" },
  teaching:       { pts:  10, label: "Teaching or training others", dim: "community" },
  feeding:        { pts:  10, label: "Cooking or feeding people", dim: "community" },
  rescue:         { pts:  10, label: "Rescue or helping in an emergency", dim: "service" },
  charity:        { pts:  10, label: "Supporting a charity", dim: "community" },
  family:         { pts:  10, label: "Long, committed marriage / family man", dim: "family" },
  // ---- negatives ----
  murder:              { pts: -100, label: "Convicted of murder (You shall not murder)", dim: "conduct" },
  sexual_conviction:   { pts:  -60, label: "Convicted of a sexual offence", dim: "conduct" },
  domestic_violence:   { pts:  -40, label: "Convicted of violence against a partner", dim: "family" },
  fraud_conviction:    { pts:  -40, label: "Convicted of fraud (You shall not steal)", dim: "trust" },
  mass_harm:           { pts:  -40, label: "Harmed thousands of people", dim: "conduct" },
  civil_sexual:        { pts:  -40, label: "Found liable for sexual assault in a civil court", dim: "conduct" },
  violence_conviction: { pts:  -30, label: "Convicted of violent assault", dim: "conduct" },
  lying:               { pts:  -25, label: "Years of public lying (no false witness)", dim: "trust" },
  exploitation:        { pts:  -25, label: "Exploited people for money (coveting / greed)", dim: "trust" },
  infidelity:          { pts:  -20, label: "Admitted cheating on his partner (no adultery)", dim: "family" },
  charges_pending:     { pts:  -20, label: "Facing serious criminal charges (not convicted)", dim: "conduct" },
  sport_cheating:      { pts:  -20, label: "Admitted cheating in sport", dim: "trust" },
  many_allegations:    { pts:  -20, label: "Accused by many people", dim: "conduct" },
  violence:            { pts:  -15, label: "Violence (admitted or settled, not convicted)", dim: "conduct" },
  harassment:          { pts:  -15, label: "Harassment or threats", dim: "conduct" },
  unpaid:              { pts:  -15, label: "Banned or penalised over unpaid money owed", dim: "trust" },
  misogyny:            { pts:  -10, label: "Public controversy over treatment of women", dim: "conduct" },
  hid_truth:           { pts:  -20, label: "Hid the truth for years from those closest to him", dim: "trust" },
  steroids:            { pts:  -15, label: "Admitted steroid / performance-drug use", dim: "trust" },
  deception:           { pts:  -10, label: "Deceived the public, then apologised", dim: "trust" },
  endangered_child:    { pts:  -10, label: "Put a child at risk", dim: "family" },
  drugs_driving:       { pts:  -10, label: "Drug or drink-driving offence or charge", dim: "conduct" },
  staff:               { pts:  -10, label: "Mistreated staff", dim: "conduct" },
  controversy:         { pts:  -10, label: "Other public controversy", dim: "conduct" },
  allegation:          { pts:   -5, label: "Single unproven allegation (he denies it)", dim: "conduct" },
};

const W = name => "https://en.wikipedia.org/wiki/" + name;

// Points for men already on the public boards (matched by id)
window.SHADOW_POINTS = {
  "bear-grylls": [
    { rule: "military",         date: "1994–97", text: "Served with 21 SAS (reserve).", source: W("Bear_Grylls") },
    { rule: "survival",         date: "1996",    text: "Survived a parachute failure that broke three vertebrae.", source: W("Bear_Grylls") },
    { rule: "survival",         date: "1998",    text: "Summited Everest at 23.", source: W("Bear_Grylls") },
    { rule: "teaching",         date: "2009–24", text: "UK Chief Scout for 15 years.", source: W("Bear_Grylls") },
    { rule: "charity_major",    date: "2000s",   text: "Fundraising expeditions for the RNLI, SSAFA and others.", source: W("Bear_Grylls") },
    { rule: "family",           date: "2000–",   text: "Married to Shara since 2000; three sons.", source: W("Bear_Grylls") },
    { rule: "deception",        date: "2008",    text: "Apologised after Man vs. Wild scenes were found to be staged.", source: W("Bear_Grylls") },
    { rule: "endangered_child", date: "2015",    text: "Left his 11-year-old on a tidal island for a stunt; criticised by the RNLI.", source: W("Bear_Grylls") },
  ],
  "marcus-rashford": [
    { rule: "charity_major", date: "2020–21", text: "Raised about £20m for his child food poverty campaign.", source: "https://www.skysports.com/football/news/11095/12464652/marcus-rashford-man-utd-forward-awarded-mbe-for-campaign-to-end-child-food-poverty" },
    { rule: "feeding",       date: "2020",    text: "Forced government U-turns so hungry children got free meals.", source: "https://www.itv.com/news/2020-06-16/marcus-rashford-im-grateful-boris-johnson-changed-policy-on-free-school-meals" },
    { rule: "honour",        date: "2021",    text: "MBE.", source: "https://www.skysports.com/football/news/11095/12464652/marcus-rashford-man-utd-forward-awarded-mbe-for-campaign-to-end-child-food-poverty" },
  ],
  "andrew-tate": [
    { rule: "survival",        date: "Earlier",  text: "Former world kickboxing champion.", source: W("Andrew_Tate") },
    { rule: "misogyny",        date: "2022",     text: "Banned from Facebook, Instagram and TikTok over content about women.", source: "https://www.thenationalnews.com/lifestyle/2022/08/20/andrew-tate-says-im-not-anti-women-as-campaigners-cheer-tiktok-and-instagram-bans/" },
    { rule: "charges_pending", date: "2025–26",  text: "Charged in the UK with rape and human trafficking. Denies wrongdoing.", source: "https://www.cps.gov.uk/national-news/news/cps-decides-prosecute-tate-brothers-additional-sexual-offences" },
    { rule: "charges_pending", date: "2026",     text: "Indicted in Romania for trafficking minors and money laundering. Denies wrongdoing.", source: "https://www.aljazeera.com/news/2026/9/4/andrew-tate-indicted-in-romania-for-trafficking-minors-money-laundering" },
  ],
  "conor-mcgregor": [
    { rule: "physique",            date: "2015–16", text: "UFC featherweight and lightweight champion; first to hold both at once.", source: W("Conor_McGregor") },
    { rule: "family",              date: "2008–",   text: "With Dee Devlin since 2008, married 2025; four children.", source: W("Conor_McGregor") },
    { rule: "civil_sexual",        date: "2024–25", text: "Civil jury found he raped Nikita Hand; upheld on appeal. He denies it; never criminally charged.", source: "https://www.irishtimes.com/crime-law/courts/2025/07/31/conor-mcgregor-has-lost-appeal-over-civil-rape-case/" },
    { rule: "violence_conviction", date: "2019",    text: "Pleaded guilty to assaulting a man in a Dublin pub.", source: "https://www.itv.com/news/utv/2019-11-01/conor-mcgregor-fined-after-dublin-assault" },
    { rule: "violence",            date: "2018",    text: "Pleaded guilty to disorderly conduct after attacking a bus of fighters in New York.", source: "https://www.cbsnews.com/colorado/news/mma-conor-mcgregor-guilty-disorderly-conduct/" },
    { rule: "controversy",         date: "2024",    text: "Two-year driving ban and suspended sentence for dangerous driving.", source: "https://www.expressandstar.com/uk-news/conor-mcgregor-receives-suspended-sentence-for-dangerous-driving-5779321" },
    { rule: "controversy",         date: "2025",    text: "18-month ban for three missed drug-test whereabouts in 2024.", source: "https://africa.espn.com/mma/ufc/story/_/id/46522617/conor-mcgregor-suspended-18-months-ufc-missed-tests" },
    { rule: "controversy",         date: "2023",    text: "Posted \"Ireland is at war\" on the day of the Dublin riots; examined by police, not charged.", source: W("Conor_McGregor") },
    { rule: "allegation",          date: "2023",    text: "Accused of sexual assault in Miami. He denies it; no charges, civil suit dropped.", source: W("Conor_McGregor") },
  ],
  // Composites: illustrative only, not included in scaling
  "everyday-dad": [
    { rule: "family",   text: "Shares the load at home." },
    { rule: "feeding",  text: "Cooks for his family every night." },
    { rule: "teaching", text: "Teaches his kids right from wrong." },
  ],
  "volunteer-coach": [
    { rule: "teaching", text: "Coaches youth sport for free." },
    { rule: "charity",  text: "Volunteers at the food bank." },
    { rule: "family",   text: "Committed family man." },
  ],
};

// New men found on Wikipedia — hidden from the public boards until you
// move them to "good" or "bad".
window.SHADOW_PEOPLE = [
  {
    id: "arnold-schwarzenegger", name: "Arnold Schwarzenegger", list: "review", type: "public",
    role: "Bodybuilder, actor, former Governor of California", reason: "A legend of discipline who wasn't as trustworthy as his image.",
    status: "Active · Controversial: legend with flaws",
    // Scored on his personal record only, not his political career.
    points: [
      { rule: "physique",      date: "1970–80",  text: "Won Mr. Olympia seven times.", source: W("Arnold_Schwarzenegger") },
      { rule: "survival",      date: "1997–2024", text: "Came through heart valve surgeries in 1997, 2018 and after, and a pacemaker in 2024.", source: "https://ctvnews.ca/health/arnold-schwarzenegger-says-he-got-a-pacemaker-fitted-last-week-1.6822650" },
      { rule: "military",      date: "1965",     text: "Did his year of Austrian army service.", source: W("Arnold_Schwarzenegger") },
      { rule: "charity_major", date: "1991–",    text: "Founded what became After-School All-Stars, serving over 118,000 low-income kids.", source: W("After-School_All-Stars") },
      { rule: "charity",       date: "",         text: "Long-time supporter of the Special Olympics.", source: W("Arnold_Schwarzenegger") },
      { rule: "steroids",      date: "1977",     text: "Admitted using steroids during his bodybuilding career (legal at the time).", source: W("Arnold_Schwarzenegger") },
      { rule: "infidelity",    date: "2011",     text: "Admitted an affair with a member of his household staff and fathering a son with her.", source: "https://www.nbcnews.com/id/wbna43073154" },
      { rule: "hid_truth",     date: "1997–2011", text: "Kept the child secret from his wife for about 14 years.", source: "https://www.nbcnews.com/id/wbna43073154" },
      { rule: "misogyny",      date: "2003",     text: "Six women made misconduct allegations; he admitted he had \"behaved badly\" and apologised, while saying many claims were untrue.", source: W("Arnold_Schwarzenegger") },
    ],
  },
  {
    id: "johnson-beharry", name: "Johnson Beharry", list: "review", type: "public",
    role: "British Army soldier, Victoria Cross", reason: "Drove wounded comrades out of two ambushes in Iraq.",
    status: "Serving soldier · VC (2005)",
    points: [
      { rule: "gallantry",     date: "2005",    text: "Awarded the Victoria Cross for saving his crew under fire in Iraq in 2004.", source: W("Johnson_Beharry") },
      { rule: "military",      date: "2001–",   text: "Served in Kosovo, Northern Ireland and Iraq; now Warrant Officer.", source: W("Johnson_Beharry") },
      { rule: "survival",      date: "2004",    text: "Survived an RPG strike and brain surgery.", source: W("Johnson_Beharry") },
      { rule: "charity_major", date: "2014",    text: "Founded the JBVC Foundation, helping young people leave gangs.", source: W("Johnson_Beharry") },
    ],
  },
  {
    id: "pat-tillman", name: "Pat Tillman", list: "review", type: "public",
    role: "NFL player turned Army Ranger (died 2004)", reason: "Turned down millions in the NFL to serve.",
    status: "Died 2004 in Afghanistan",
    points: [
      { rule: "selfless",  date: "2002",    text: "Turned down a $3.6m NFL contract to enlist after 9/11.", source: W("Pat_Tillman") },
      { rule: "military",  date: "2002–04", text: "Army Ranger; served in Iraq and Afghanistan.", source: W("Pat_Tillman") },
      { rule: "gallantry", date: "2004",    text: "Posthumous Silver Star (the Army later admitted he was killed by friendly fire).", source: W("Pat_Tillman") },
      { rule: "family",    date: "2002",    text: "Married his high-school sweetheart.", source: W("Pat_Tillman") },
    ],
  },
  {
    id: "steve-irwin", name: "Steve Irwin", list: "good", type: "public",
    role: "Wildlife conservationist (died 2006)", reason: "Spent his life protecting animals and teaching the world to love them.",
    status: "Died 2006",
    points: [
      { rule: "charity_major",    date: "2000s",  text: "Founded Wildlife Warriors; bought land to protect habitats.", source: W("Steve_Irwin") },
      { rule: "rescue",           date: "1990s",  text: "Volunteered to capture and relocate more than 100 crocodiles.", source: W("Steve_Irwin") },
      { rule: "rescue",           date: "2003",   text: "Stopped filming to help search for two missing divers.", source: W("Steve_Irwin") },
      { rule: "teaching",         date: "1996–",  text: "Taught conservation to an estimated 500 million viewers.", source: W("Steve_Irwin") },
      { rule: "honour",           date: "2001",   text: "Centenary Medal for service to conservation.", source: W("Steve_Irwin") },
      { rule: "family",           date: "1992",   text: "Married to Terri until his death; two children.", source: W("Steve_Irwin") },
      { rule: "endangered_child", date: "2004",   text: "Fed a crocodile while holding his baby son; apologised.", source: W("Steve_Irwin") },
    ],
  },
  {
    id: "captain-tom-moore", name: "Captain Sir Tom Moore", list: "review", type: "public",
    role: "WWII veteran, NHS fundraiser (died 2021)", reason: "At 99, walked his garden and raised £32m for the NHS.",
    status: "Died 2021",
    points: [
      { rule: "military",      date: "1941–46", text: "Served in Burma in the Second World War.", source: W("Captain_Sir_Tom_Moore") },
      { rule: "charity_major", date: "2020",    text: "Raised over £32m for NHS charities with 100 garden laps.", source: W("Captain_Sir_Tom_Moore") },
      { rule: "survival",      date: "2020",    text: "Did it at 99 years old.", source: W("Captain_Sir_Tom_Moore") },
      { rule: "honour",        date: "2020",    text: "Knighted by the Queen.", source: W("Captain_Sir_Tom_Moore") },
    ],
  },
  {
    id: "ray-mears", name: "Ray Mears", list: "review", type: "public",
    role: "Bushcraft and survival expert", reason: "Teaches people how to survive in the wild.",
    status: "Active",
    points: [
      { rule: "survival", date: "1983–", text: "Leading bushcraft and survival expert.", source: W("Ray_Mears") },
      { rule: "teaching", date: "1983–", text: "Runs Woodlore, teaching survival courses.", source: W("Ray_Mears") },
      { rule: "rescue",   date: "2010",  text: "Helped police track Raoul Moat.", source: W("Ray_Mears") },
      { rule: "rescue",   date: "2005",  text: "Gave first aid to an injured crew member after a helicopter crash.", source: W("Ray_Mears") },
      { rule: "family",   date: "2005",  text: "Married his partner after her cancer diagnosis and stayed by her until she died.", source: W("Ray_Mears") },
    ],
  },
  {
    id: "jamie-oliver", name: "Jamie Oliver", list: "review", type: "public",
    role: "Chef, food campaigner", reason: "Fought to get junk food out of school dinners.",
    status: "Active · MBE (2003)",
    points: [
      { rule: "feeding",       date: "1999–", text: "Chef who got a generation cooking.", source: W("Jamie_Oliver") },
      { rule: "charity_major", date: "2005",  text: "School dinners campaign; government pledged £280m.", source: W("Jamie_Oliver") },
      { rule: "teaching",      date: "2002",  text: "Fifteen restaurant trained disadvantaged young people.", source: W("Jamie_Oliver") },
      { rule: "honour",        date: "2003",  text: "MBE.", source: W("Jamie_Oliver") },
      { rule: "family",        date: "2000–", text: "Married to Jools since 2000; five children.", source: W("Jamie_Oliver") },
      { rule: "staff",         date: "2019",  text: "Restaurant chain collapsed (about 1,000 jobs); a tribunal found staff weren't properly consulted.", source: W("Jamie_Oliver") },
    ],
  },
  {
    id: "gordon-ramsay", name: "Gordon Ramsay", list: "review", type: "public",
    role: "Chef, TV host", reason: "Trained a generation of top chefs.",
    status: "Active · OBE (2006)",
    points: [
      { rule: "feeding",       date: "1993–", text: "Three-Michelin-star chef.", source: W("Gordon_Ramsay") },
      { rule: "teaching",      date: "1998–", text: "Mentored chefs including Clare Smyth, the first woman with three Michelin stars.", source: W("Gordon_Ramsay") },
      { rule: "honour",        date: "2006",  text: "OBE.", source: W("Gordon_Ramsay") },
      { rule: "charity_major", date: "2004–", text: "Spina bifida charity patron; ran 10 London Marathons for it; Women's Aid ambassador.", source: W("Gordon_Ramsay") },
      { rule: "family",        date: "1996–", text: "Married to Tana since 1996; six children.", source: W("Gordon_Ramsay") },
      { rule: "staff",         date: "2000s", text: "Widely criticised for verbal abuse in kitchens.", source: W("Gordon_Ramsay") },
    ],
  },
  {
    id: "keanu-reeves", name: "Keanu Reeves", list: "review", type: "public",
    role: "Actor", reason: "Quietly funds children's cancer care.",
    status: "Active",
    points: [
      { rule: "charity_major", date: "2000s", text: "Founded a private cancer foundation supporting children's hospitals.", source: W("Keanu_Reeves") },
      { rule: "charity",       date: "2003",  text: "Bought motorbikes for his stunt team and helped a crew member in financial trouble.", source: W("Keanu_Reeves") },
    ],
  },
  {
    id: "tiger-woods", name: "Tiger Woods", list: "review", type: "public",
    role: "Golfer", reason: "Built learning centres for underserved kids.",
    status: "Charged with DUI in 2026 (not convicted)",
    points: [
      { rule: "charity_major",   date: "1996", text: "Founded the Tiger Woods Foundation.", source: W("Tiger_Woods") },
      { rule: "teaching",        date: "2006", text: "Opened learning centres for underserved young people.", source: W("Tiger_Woods") },
      { rule: "honour",          date: "2019", text: "Presidential Medal of Freedom.", source: W("Tiger_Woods") },
      { rule: "survival",        date: "2019", text: "Won the Masters after career-threatening back surgery.", source: W("Tiger_Woods") },
      { rule: "infidelity",      date: "2010", text: "Publicly apologised for being unfaithful to his wife; they divorced.", source: W("Tiger_Woods") },
      { rule: "drugs_driving",   date: "2026", text: "Charged with driving under the influence after a crash.", source: W("Tiger_Woods") },
    ],
  },
  {
    id: "mrbeast", name: "MrBeast (Jimmy Donaldson)", list: "review", type: "public",
    role: "YouTuber, philanthropist", reason: "Raised nearly $100m for trees, oceans and clean water.",
    status: "Active · Faces lawsuits he denies",
    points: [
      { rule: "charity_major", date: "2019–25", text: "Team Trees, Team Seas and Team Water raised nearly $100m combined.", source: W("MrBeast") },
      { rule: "charity_major", date: "2020–",   text: "Beast Philanthropy funds wells, surgeries and food.", source: W("MrBeast") },
      { rule: "feeding",       date: "2020s",   text: "Gave away food to families in need.", source: W("MrBeast") },
      { rule: "allegation",    date: "2021",    text: "Former employees described a harsh workplace. He denies it.", source: W("MrBeast") },
      { rule: "allegation",    date: "2024",    text: "Beast Games contestants sued over conditions. He denies it.", source: W("MrBeast") },
      { rule: "allegation",    date: "2026",    text: "Former employee sued alleging harassment. He denies it.", source: W("MrBeast") },
      { rule: "controversy",   date: "2018",    text: "Reported to have used homophobic slurs online as a teen.", source: W("MrBeast") },
    ],
  },
  {
    id: "jeremy-clarkson", name: "Jeremy Clarkson", list: "review", type: "public",
    role: "Broadcaster, farmer", reason: "Took up farming on camera.",
    status: "Active",
    points: [
      { rule: "farming",  date: "2019–", text: "Farms Diddly Squat Farm.", source: W("Jeremy_Clarkson") },
      { rule: "charity",  date: "2007",  text: "Patron of Help for Heroes.", source: W("Jeremy_Clarkson") },
      { rule: "violence", date: "2015",  text: "Punched a producer; dropped by the BBC; settled for £100,000.", source: W("Jeremy_Clarkson") },
      { rule: "violence", date: "2004",  text: "Punched Piers Morgan at an awards event.", source: W("Jeremy_Clarkson") },
      { rule: "misogyny", date: "2022",  text: "Column about Meghan drew a record 25,000+ complaints.", source: W("Jeremy_Clarkson") },
    ],
  },
  {
    id: "ant-middleton", name: "Ant Middleton", list: "review", type: "public",
    role: "Former special forces soldier, TV presenter", reason: "Served in the SBS, climbed Everest.",
    status: "Active",
    points: [
      { rule: "military",            date: "1998–2013", text: "Served in the Royal Engineers, Royal Marines and SBS.", source: W("Ant_Middleton") },
      { rule: "survival",            date: "2018",      text: "Summited Everest (and K2 in 2023).", source: W("Ant_Middleton") },
      { rule: "family",              date: "",          text: "Married; five children.", source: W("Ant_Middleton") },
      { rule: "violence_conviction", date: "2013",      text: "Jailed for assaulting two police officers.", source: W("Ant_Middleton") },
      { rule: "controversy",         date: "2021",      text: "Dropped by Channel 4 over his personal conduct.", source: W("Ant_Middleton") },
      { rule: "unpaid",              date: "2025",      text: "Banned as a company director over about £1.2m in unpaid taxes.", source: W("Ant_Middleton") },
    ],
  },
  {
    id: "lance-armstrong", name: "Lance Armstrong", list: "review", type: "public",
    role: "Former cyclist", reason: "Beat cancer, then lied for years about doping.",
    status: "Stripped of seven Tour de France titles",
    points: [
      { rule: "survival",       date: "1996",       text: "Survived stage three cancer.", source: W("Lance_Armstrong") },
      { rule: "charity_major",  date: "1997",       text: "Founded Livestrong, which raised hundreds of millions for cancer survivors.", source: W("Lance_Armstrong") },
      { rule: "sport_cheating", date: "2013",       text: "Admitted doping; stripped of seven Tour titles.", source: W("Lance_Armstrong") },
      { rule: "lying",          date: "1999–2012",  text: "Denied doping for over a decade and sued people who told the truth.", source: W("Lance_Armstrong") },
      { rule: "controversy",    date: "2018",       text: "Paid $5m to settle a US government fraud claim.", source: W("Lance_Armstrong") },
    ],
  },
  {
    id: "chris-brown", name: "Chris Brown", list: "review", type: "public",
    role: "Singer", reason: "Pleaded guilty to assaulting his girlfriend.",
    status: "Active",
    points: [
      { rule: "domestic_violence", date: "2009", text: "Pleaded guilty to felony assault of his then-girlfriend Rihanna.", source: W("Chris_Brown") },
      { rule: "controversy",       date: "2014", text: "Jailed for violating probation.", source: W("Chris_Brown") },
      { rule: "charity",           date: "2006", text: "Donated tour proceeds to St. Jude Children's Research Hospital.", source: W("Chris_Brown") },
    ],
  },
  {
    id: "bernie-madoff", name: "Bernie Madoff", list: "review", type: "public",
    role: "Fraudster (died 2021)", reason: "Ran the largest Ponzi scheme in history.",
    status: "Died in prison 2021",
    points: [
      { rule: "fraud_conviction", date: "2009", text: "Pleaded guilty to 11 felonies; sentenced to 150 years.", source: W("Bernie_Madoff") },
      { rule: "mass_harm",        date: "2008", text: "Thousands of investors and several charities lost billions.", source: W("Bernie_Madoff") },
    ],
  },
  {
    id: "sam-bankman-fried", name: "Sam Bankman-Fried", list: "review", type: "public",
    role: "Former FTX founder", reason: "Took customers' money; convicted of fraud.",
    status: "In prison · Appeal denied 2026",
    points: [
      { rule: "fraud_conviction", date: "2023", text: "Convicted on all seven counts of fraud and conspiracy; 25 years.", source: W("Sam_Bankman-Fried") },
      { rule: "mass_harm",        date: "2022", text: "FTX collapse cost customers billions.", source: W("Sam_Bankman-Fried") },
    ],
  },
  {
    id: "oscar-pistorius", name: "Oscar Pistorius", list: "review", type: "public",
    role: "Former Paralympic sprinter", reason: "Killed his girlfriend Reeva Steenkamp.",
    status: "Convicted of murder · On parole since 2024",
    points: [
      { rule: "survival", date: "2012", text: "First amputee to run at the Olympics.", source: W("Oscar_Pistorius") },
      { rule: "murder",   date: "2015", text: "Convicted of murdering Reeva Steenkamp; sentence raised to 13 years 5 months.", source: W("Oscar_Pistorius") },
    ],
  },
  {
    id: "martin-shkreli", name: "Martin Shkreli", list: "review", type: "public",
    role: "Former pharma executive", reason: "Raised a life-saving drug's price by 5,000%.",
    status: "Banned from the drug industry for life",
    points: [
      { rule: "charity",          date: "2015", text: "Gave $1m to his old high school.", source: W("Martin_Shkreli") },
      { rule: "exploitation",     date: "2015", text: "Raised Daraprim from $13.50 to $750 a pill.", source: W("Martin_Shkreli") },
      { rule: "fraud_conviction", date: "2017", text: "Convicted of securities fraud; seven years in prison.", source: W("Martin_Shkreli") },
      { rule: "exploitation",     date: "2022", text: "Court ordered him to repay $64.6m and banned him from pharma for life.", source: W("Martin_Shkreli") },
      { rule: "harassment",       date: "2017", text: "Bail revoked after offering $5,000 for a strand of Hillary Clinton's hair.", source: W("Martin_Shkreli") },
    ],
  },
  {
    id: "mike-tyson", name: "Mike Tyson", list: "review", type: "public",
    role: "Former boxer", reason: "Heavyweight champion with a long criminal record.",
    status: "Registered sex offender · Maintains his innocence of the 1992 conviction",
    points: [
      { rule: "survival",            date: "1980s", text: "Youngest heavyweight champion.", source: W("Mike_Tyson") },
      { rule: "charity_major",       date: "2012",  text: "Founded Mike Tyson Cares for kids from broken homes.", source: W("Mike_Tyson") },
      { rule: "sexual_conviction",   date: "1992",  text: "Convicted of rape; served under three years. Maintains his innocence.", source: W("Mike_Tyson") },
      { rule: "violence_conviction", date: "1999",  text: "Jailed for assaulting two motorists.", source: W("Mike_Tyson") },
      { rule: "controversy",         date: "1997",  text: "Bit Evander Holyfield's ears in a title fight.", source: W("Mike_Tyson") },
      { rule: "drugs_driving",       date: "2007",  text: "Pleaded guilty to cocaine possession and DUI.", source: W("Mike_Tyson") },
      { rule: "sport_cheating",      date: "2013",  text: "Admitted using others' urine to pass drug tests.", source: W("Mike_Tyson") },
      { rule: "deception",           date: "2013",  text: "Admitted lying about being sober.", source: W("Mike_Tyson") },
    ],
  },
  {
    id: "harvey-weinstein", name: "Harvey Weinstein", list: "review", type: "public",
    role: "Former film producer", reason: "Convicted of sex crimes after dozens of women spoke out.",
    status: "In prison · Convicted in Los Angeles and New York",
    points: [
      { rule: "sexual_conviction", date: "2022", text: "Convicted in Los Angeles of rape and sexual assault.", source: W("Harvey_Weinstein") },
      { rule: "sexual_conviction", date: "2025", text: "Convicted in New York of a criminal sexual act at retrial.", source: W("Harvey_Weinstein") },
      { rule: "many_allegations",  date: "2017", text: "More than a dozen women accused him of harassment, assault or rape.", source: W("Harvey_Weinstein") },
    ],
  },
  // ---- Scouted 2026-10 (scout-real-men run) ----
  {
    id: "chris-hadfield", name: "Chris Hadfield", list: "good", type: "public", scouted: "2026-10",
    role: "Astronaut, former fighter pilot",
    reason: "Flew jets for Canada, commanded the space station, then went back to teach.",
    status: "Active · Order of Canada (2014)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "military", date: "1978–", text: "Joined the Canadian Armed Forces; top graduate of jet training in 1983.", source: "https://en.wikipedia.org/wiki/Chris_Hadfield" },
      { rule: "survival", date: "2001", text: "First Canadian to float free in space, on two spacewalks.", source: "https://en.wikipedia.org/wiki/Chris_Hadfield" },
      { rule: "survival", date: "2013", text: "Commanded the International Space Station (Expedition 35).", source: "https://en.wikipedia.org/wiki/Chris_Hadfield" },
      { rule: "honour", date: "2014", text: "Appointed Officer of the Order of Canada.", source: "https://en.wikipedia.org/wiki/Chris_Hadfield" },
      { rule: "teaching", date: "2014", text: "Became a professor at the University of Waterloo.", source: "https://en.wikipedia.org/wiki/Chris_Hadfield" },
    ],
  },
  {
    id: "tim-peake", name: "Tim Peake", list: "good", type: "public", scouted: "2026-10",
    role: "Astronaut, former Army helicopter pilot",
    reason: "17 years in the Army, then the first British spacewalk.",
    status: "Active · CMG (2016)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "military", date: "1992–2009", text: "Served 17 years in the Army Air Corps, reaching major.", source: "https://en.wikipedia.org/wiki/Tim_Peake" },
      { rule: "survival", date: "2016", text: "Made the first spacewalk by a British astronaut.", source: "https://en.wikipedia.org/wiki/Tim_Peake" },
      { rule: "survival", date: "2016", text: "Ran the London Marathon on a treadmill aboard the ISS.", source: "https://en.wikipedia.org/wiki/Tim_Peake" },
      { rule: "honour", date: "2016", text: "Appointed CMG for space research and science education.", source: "https://en.wikipedia.org/wiki/Tim_Peake" },
    ],
  },
  {
    id: "ranulph-fiennes", name: "Ranulph Fiennes", list: "review", type: "public", scouted: "2026-10",
    role: "Explorer, former soldier",
    reason: "Cut off his own frostbitten fingertips and still climbed Everest at 65.",
    status: "Active · OBE (1993)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "military", date: "1963–", text: "Commissioned into the Royal Scots Greys; later served with the Omani Army.", source: "https://en.wikipedia.org/wiki/Ranulph_Fiennes" },
      { rule: "gallantry", date: "1970", text: "Received the Sultan's Bravery Medal in Oman.", source: "https://en.wikipedia.org/wiki/Ranulph_Fiennes" },
      { rule: "survival", date: "2000", text: "Removed his own frostbitten fingertips after a North Pole attempt.", source: "https://en.wikipedia.org/wiki/Ranulph_Fiennes" },
      { rule: "survival", date: "2009", text: "Reached the summit of Everest aged 65.", source: "https://en.wikipedia.org/wiki/Ranulph_Fiennes" },
      { rule: "honour", date: "1993", text: "Appointed OBE for human endeavour and charitable service.", source: "https://en.wikipedia.org/wiki/Ranulph_Fiennes" },
      { rule: "charity_major", date: "2010", text: "Named the UK's top celebrity fundraiser by JustGiving.", source: "https://en.wikipedia.org/wiki/Ranulph_Fiennes" },
      { rule: "controversy", date: "1966", text: "Fined over a plot to blow up a film-set dam, and dismissed from the SAS.", source: "https://en.wikipedia.org/wiki/Ranulph_Fiennes" },
    ],
  },
  {
    id: "alex-honnold", name: "Alex Honnold", list: "good", type: "public", scouted: "2026-10",
    role: "Rock climber",
    reason: "Climbs without a rope, and gives a third of his income to solar power for poor communities.",
    status: "Active · Married, father of two",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "survival", date: "2017", text: "First free solo of El Capitan, with no rope.", source: "https://en.wikipedia.org/wiki/Alex_Honnold" },
      { rule: "survival", date: "2026", text: "Free soloed the Taipei 101 skyscraper.", source: "https://en.wikipedia.org/wiki/Alex_Honnold" },
      { rule: "charity_major", date: "2012–", text: "Gives a third of his income to solar projects through the Honnold Foundation.", source: "https://en.wikipedia.org/wiki/Alex_Honnold" },
      { rule: "honour", date: "2015", text: "Won the Piolet d'Or, climbing's top award.", source: "https://en.wikipedia.org/wiki/Alex_Honnold" },
      { rule: "family", date: "2020–", text: "Married Sanni McCandless; two daughters.", source: "https://en.wikipedia.org/wiki/Alex_Honnold" },
    ],
  },
  {
    id: "rick-stanton", name: "Rick Stanton", list: "good", type: "public", scouted: "2026-10",
    role: "Cave diver, rescuer",
    reason: "Swam into a flooded cave to find 13 trapped boys.",
    status: "Active · George Medal (2019)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "rescue", date: "2018", text: "Helped find and rescue the trapped football team at Tham Luang, Thailand.", source: "https://en.wikipedia.org/wiki/Rick_Stanton" },
      { rule: "rescue", date: "2004", text: "Helped rescue six British cavers trapped for eight days in Mexico.", source: "https://en.wikipedia.org/wiki/Rick_Stanton" },
      { rule: "gallantry", date: "2019", text: "Awarded the George Medal for the Tham Luang rescue.", source: "https://en.wikipedia.org/wiki/Rick_Stanton" },
      { rule: "honour", date: "2013", text: "Appointed MBE.", source: "https://en.wikipedia.org/wiki/Rick_Stanton" },
      { rule: "survival", date: "2010", text: "Part of a world-record 8.8 km cave dive.", source: "https://en.wikipedia.org/wiki/Rick_Stanton" },
    ],
  },
  {
    id: "john-volanthen", name: "John Volanthen", list: "good", type: "public", scouted: "2026-10",
    role: "Cave diver, rescuer",
    reason: "First to reach the trapped boys in Thailand: \"How many of you?\"",
    status: "Active · George Medal (2019)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "rescue", date: "2018", text: "With Rick Stanton, first reached the trapped team at Tham Luang.", source: "https://en.wikipedia.org/wiki/John_Volanthen" },
      { rule: "gallantry", date: "2019", text: "Awarded the George Medal for the Tham Luang rescue.", source: "https://en.wikipedia.org/wiki/John_Volanthen" },
      { rule: "honour", date: "2018", text: "Received the Scouting Bronze Cross.", source: "https://en.wikipedia.org/wiki/John_Volanthen" },
      { rule: "survival", date: "2010", text: "Part of a world-record 8.8 km cave dive.", source: "https://en.wikipedia.org/wiki/John_Volanthen" },
    ],
  },
  {
    id: "levison-wood", name: "Levison Wood", list: "good", type: "public", scouted: "2026-10",
    role: "Explorer, Army officer",
    reason: "Paratrooper who walked the length of the Nile.",
    status: "Active · Army reservist",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "military", date: "2006–", text: "Commissioned into the Parachute Regiment; later a reservist major.", source: "https://en.wikipedia.org/wiki/Levison_Wood" },
      { rule: "survival", date: "2013–14", text: "Walked the Nile from Rwanda.", source: "https://en.wikipedia.org/wiki/Levison_Wood" },
      { rule: "survival", date: "2015", text: "Walked the Himalayas from Afghanistan to Bhutan.", source: "https://en.wikipedia.org/wiki/Levison_Wood" },
      { rule: "honour", date: "2024", text: "Appointed Chancellor of Staffordshire University.", source: "https://en.wikipedia.org/wiki/Levison_Wood" },
    ],
  },
  {
    id: "ross-edgley", name: "Ross Edgley", list: "good", type: "public", scouted: "2026-10",
    role: "Endurance swimmer, coach",
    reason: "Swam all the way around Great Britain. 157 days.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "survival", date: "2018", text: "Finished a 157-day swim around Great Britain.", source: "https://en.wikipedia.org/wiki/Ross_Edgley" },
      { rule: "survival", date: "2016", text: "Climbed a rope the height of Everest in under 20 hours.", source: "https://en.wikipedia.org/wiki/Ross_Edgley" },
      { rule: "charity", date: "2016", text: "Pulled a 1.4-tonne car a marathon distance for charity.", source: "https://en.wikipedia.org/wiki/Ross_Edgley" },
      { rule: "teaching", date: "2019–22", text: "Coached celebrities and athletes for endurance challenges.", source: "https://en.wikipedia.org/wiki/Ross_Edgley" },
      { rule: "honour", date: "2019", text: "Received an honorary doctorate.", source: "https://en.wikipedia.org/wiki/Ross_Edgley" },
    ],
  },
  {
    id: "ben-parkinson", name: "Ben Parkinson", list: "good", type: "public", scouted: "2026-10",
    role: "Paratrooper, veterans' campaigner",
    reason: "Lost both legs in Afghanistan, then carried the Olympic torch.",
    status: "Active · MBE (2013)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "military", date: "2000–19", text: "Served in the Army, including Iraq and Afghanistan.", source: "https://en.wikipedia.org/wiki/Ben_Parkinson_(British_Army_soldier)" },
      { rule: "survival", date: "2006", text: "Survived a mine blast in Helmand that cost him both legs; learned to walk and talk again.", source: "https://en.wikipedia.org/wiki/Ben_Parkinson_(British_Army_soldier)" },
      { rule: "survival", date: "2012", text: "Carried the Olympic flame on prosthetic legs.", source: "https://en.wikipedia.org/wiki/Ben_Parkinson_(British_Army_soldier)" },
      { rule: "honour", date: "2013", text: "Appointed MBE for charity work.", source: "https://en.wikipedia.org/wiki/Ben_Parkinson_(British_Army_soldier)" },
      { rule: "charity", date: "2010s", text: "Campaigns and fundraises for wounded veterans.", source: "https://en.wikipedia.org/wiki/Ben_Parkinson_(British_Army_soldier)" },
    ],
  },
  {
    id: "kevin-sinfield", name: "Kevin Sinfield", list: "good", type: "public", scouted: "2026-10",
    role: "Rugby league legend, MND fundraiser",
    reason: "Ran until his legs gave out for his dying best mate.",
    status: "Active · Knighted (2026)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity_major", date: "2020", text: "Ran seven marathons in seven days for MND, raising over £2m.", source: "https://en.wikipedia.org/wiki/Kevin_Sinfield" },
      { rule: "survival", date: "2021", text: "Ran 101 miles in 24 hours for MND research.", source: "https://en.wikipedia.org/wiki/Kevin_Sinfield" },
      { rule: "honour", date: "2024", text: "Appointed CBE for MND awareness.", source: "https://en.wikipedia.org/wiki/Kevin_Sinfield" },
      { rule: "honour", date: "2026", text: "Knighted in the Birthday Honours.", source: "https://en.wikipedia.org/wiki/Kevin_Sinfield" },
    ],
  },
  {
    id: "juan-mata", name: "Juan Mata", list: "review", type: "public", scouted: "2026-10",
    role: "Footballer",
    reason: "Gives 1% of his wages to football charities.",
    status: "Active · MBE (2025)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity_major", date: "2017", text: "Co-founded Common Goal, pledging 1% of his salary.", source: "https://en.wikipedia.org/wiki/Juan_Mata" },
      { rule: "honour", date: "2025", text: "Appointed MBE for services to sport and charity.", source: "https://en.wikipedia.org/wiki/Juan_Mata" },
    ],
  },
  {
    id: "sadio-mane", name: "Sadio Mané", list: "review", type: "public", scouted: "2026-10",
    role: "Footballer",
    reason: "Built a school and a hospital in his home village.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity_major", date: "2019", text: "Gave £250,000 to build a school in Bambali, Senegal.", source: "https://en.wikipedia.org/wiki/Sadio_Man%C3%A9" },
      { rule: "charity_major", date: "2021", text: "Gave £500,000 toward a hospital in Bambali.", source: "https://en.wikipedia.org/wiki/Sadio_Man%C3%A9" },
      { rule: "violence", date: "2023", text: "Suspended and fined by Bayern Munich after reportedly punching a teammate.", source: "https://en.wikipedia.org/wiki/Sadio_Man%C3%A9" },
    ],
  },
  {
    id: "roger-federer", name: "Roger Federer", list: "review", type: "public", scouted: "2026-10",
    role: "Tennis player",
    reason: "Funds schooling for children in southern Africa.",
    status: "Retired",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity_major", date: "", text: "Founded the Roger Federer Foundation for children in southern Africa.", source: "https://en.wikipedia.org/wiki/Roger_Federer" },
    ],
  },
  {
    id: "lebron-james", name: "LeBron James", list: "review", type: "public", scouted: "2026-10",
    role: "Basketball player",
    reason: "Raised millions for Boys & Girls Clubs.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity", date: "2010", text: "His TV special raised $2.5m for Boys & Girls Clubs.", source: "https://en.wikipedia.org/wiki/LeBron_James" },
      { rule: "family", date: "2024", text: "Played an NBA game alongside his son Bronny.", source: "https://en.wikipedia.org/wiki/LeBron_James" },
    ],
  },
  {
    id: "mo-farah", name: "Mo Farah", list: "review", type: "public", scouted: "2026-10",
    role: "Distance runner",
    reason: "Trafficked as a child, became a four-time Olympic champion.",
    status: "Retired · CBE (2013)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "survival", date: "2022", text: "Revealed he was trafficked to the UK as a child and forced into domestic servitude.", source: "https://en.wikipedia.org/wiki/Mo_Farah" },
      { rule: "honour", date: "2013", text: "Appointed CBE.", source: "https://en.wikipedia.org/wiki/Mo_Farah" },
      { rule: "deception", date: "2020", text: "Acknowledged he had lied about knowing coach Jama Aden.", source: "https://en.wikipedia.org/wiki/Mo_Farah" },
    ],
  },
  {
    id: "jose-andres", name: "José Andrés", list: "good", type: "public", scouted: "2026-10",
    role: "Chef, World Central Kitchen founder",
    reason: "Turns up at every disaster with hot food.",
    status: "Active · Presidential Medal of Freedom (2025)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "feeding", date: "2010–", text: "Cooks meals for disaster zones, starting with the Haiti earthquake.", source: "https://en.wikipedia.org/wiki/Jos%C3%A9_Andr%C3%A9s" },
      { rule: "charity_major", date: "2010–", text: "Founded World Central Kitchen.", source: "https://en.wikipedia.org/wiki/Jos%C3%A9_Andr%C3%A9s" },
      { rule: "military", date: "1987", text: "Did Spanish military service, cooking for an admiral.", source: "https://en.wikipedia.org/wiki/Jos%C3%A9_Andr%C3%A9s" },
      { rule: "honour", date: "2015", text: "Received the National Humanities Medal.", source: "https://en.wikipedia.org/wiki/Jos%C3%A9_Andr%C3%A9s" },
      { rule: "honour", date: "2025", text: "Received the Presidential Medal of Freedom.", source: "https://en.wikipedia.org/wiki/Jos%C3%A9_Andr%C3%A9s" },
    ],
  },
  {
    id: "hugh-fearnley-whittingstall", name: "Hugh Fearnley-Whittingstall", list: "review", type: "public", scouted: "2026-10",
    role: "Chef, smallholder",
    reason: "Grows his own food and campaigns for better farming.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "farming", date: "1997–", text: "Runs the River Cottage smallholding in Dorset.", source: "https://en.wikipedia.org/wiki/Hugh_Fearnley-Whittingstall" },
      { rule: "farming", date: "2008", text: "Set up chicken farms in Axminster for Hugh's Chicken Run.", source: "https://en.wikipedia.org/wiki/Hugh_Fearnley-Whittingstall" },
      { rule: "charity", date: "2012", text: "Fish Fight campaign gathered over 700,000 signatures.", source: "https://en.wikipedia.org/wiki/Hugh_Fearnley-Whittingstall" },
      { rule: "family", date: "2001–", text: "Married Marie Derome.", source: "https://en.wikipedia.org/wiki/Hugh_Fearnley-Whittingstall" },
      { rule: "controversy", date: "1998", text: "Reprimanded by broadcast regulators over a TV episode.", source: "https://en.wikipedia.org/wiki/Hugh_Fearnley-Whittingstall" },
    ],
  },
  {
    id: "tim-berners-lee", name: "Tim Berners-Lee", list: "review", type: "public", scouted: "2026-10",
    role: "Inventor of the World Wide Web",
    reason: "Invented the web.",
    status: "Active · Knighted (2004)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "honour", date: "2004", text: "Knighted for services to the internet.", source: "https://en.wikipedia.org/wiki/Tim_Berners-Lee" },
      { rule: "honour", date: "2007", text: "Appointed to the Order of Merit.", source: "https://en.wikipedia.org/wiki/Tim_Berners-Lee" },
    ],
  },
  {
    id: "jonathan-van-tam", name: "Jonathan Van-Tam", list: "review", type: "public", scouted: "2026-10",
    role: "Doctor, former Deputy Chief Medical Officer",
    reason: "Explained the pandemic in football metaphors.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "military", date: "1998–", text: "Officer in the Army Cadet Force; Honorary Colonel since 2022.", source: "https://en.wikipedia.org/wiki/Jonathan_Van-Tam" },
      { rule: "honour", date: "1998", text: "Appointed MBE.", source: "https://en.wikipedia.org/wiki/Jonathan_Van-Tam" },
      { rule: "teaching", date: "2021", text: "Gave the Royal Institution Christmas Lectures.", source: "https://en.wikipedia.org/wiki/Jonathan_Van-Tam" },
    ],
  },
  {
    id: "andrew-pollard", name: "Andrew Pollard", list: "good", type: "public", scouted: "2026-10",
    role: "Vaccine scientist",
    reason: "Led the Oxford vaccine that protected millions.",
    status: "Active · Knighted (2021)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "honour", date: "2021", text: "Knighted for public health services during COVID-19.", source: "https://en.wikipedia.org/wiki/Andrew_Pollard_(immunologist)" },
      { rule: "honour", date: "2024", text: "Elected Fellow of the Royal Society.", source: "https://en.wikipedia.org/wiki/Andrew_Pollard_(immunologist)" },
      { rule: "teaching", date: "2012–20", text: "Director of Graduate Studies in Oxford's paediatrics department.", source: "https://en.wikipedia.org/wiki/Andrew_Pollard_(immunologist)" },
      { rule: "charity", date: "2002–06", text: "Chaired the science panel of a meningitis charity.", source: "https://en.wikipedia.org/wiki/Andrew_Pollard_(immunologist)" },
    ],
  },
  {
    id: "gareth-southgate", name: "Gareth Southgate", list: "good", type: "public", scouted: "2026-10",
    role: "Former England manager",
    reason: "Made England believe again, with class.",
    status: "Active · Knighted (2025)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "honour", date: "2019", text: "Appointed OBE for services to football.", source: "https://en.wikipedia.org/wiki/Gareth_Southgate" },
      { rule: "honour", date: "2025", text: "Knighted in the New Year Honours.", source: "https://en.wikipedia.org/wiki/Gareth_Southgate" },
      { rule: "charity", date: "", text: "Ambassador for The Prince's Trust and patron of Help for Heroes.", source: "https://en.wikipedia.org/wiki/Gareth_Southgate" },
      { rule: "family", date: "1997–", text: "Married to Alison since 1997; two children.", source: "https://en.wikipedia.org/wiki/Gareth_Southgate" },
      { rule: "teaching", date: "2024–", text: "Visiting lecturer at Harvard Business School.", source: "https://en.wikipedia.org/wiki/Gareth_Southgate" },
    ],
  },
  {
    id: "joe-wicks", name: "Joe Wicks", list: "good", type: "public", scouted: "2026-10",
    role: "Fitness coach",
    reason: "Got the whole country exercising in lockdown.",
    status: "Active · MBE (2020)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "teaching", date: "2020", text: "PE with Joe livestreams drew nearly a million viewers a day.", source: "https://en.wikipedia.org/wiki/Joe_Wicks_(coach)" },
      { rule: "charity_major", date: "2020", text: "A 24-hour workout raised over £2m for Children in Need.", source: "https://en.wikipedia.org/wiki/Joe_Wicks_(coach)" },
      { rule: "honour", date: "2020", text: "Appointed MBE.", source: "https://en.wikipedia.org/wiki/Joe_Wicks_(coach)" },
      { rule: "charity", date: "2021", text: "Patron of a youth homelessness charity.", source: "https://en.wikipedia.org/wiki/Joe_Wicks_(coach)" },
      { rule: "family", date: "2019–", text: "Married Rosie Jones.", source: "https://en.wikipedia.org/wiki/Joe_Wicks_(coach)" },
      { rule: "controversy", date: "2024", text: "Criticised for claiming ADHD is caused by diet.", source: "https://en.wikipedia.org/wiki/Joe_Wicks_(coach)" },
    ],
  },
  {
    id: "patrick-stewart", name: "Patrick Stewart", list: "review", type: "public", scouted: "2026-10",
    role: "Actor",
    reason: "Speaks out against domestic violence.",
    status: "Active · Knighted (2010)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity", date: "2006", text: "Patron of Refuge, the domestic violence charity.", source: "https://en.wikipedia.org/wiki/Patrick_Stewart" },
      { rule: "teaching", date: "2008", text: "Professor of performing arts at Huddersfield.", source: "https://en.wikipedia.org/wiki/Patrick_Stewart" },
      { rule: "honour", date: "2010", text: "Knighted for services to drama.", source: "https://en.wikipedia.org/wiki/Patrick_Stewart" },
    ],
  },
  {
    id: "denzel-washington", name: "Denzel Washington", list: "good", type: "public", scouted: "2026-10",
    role: "Actor",
    reason: "Married over 40 years, and quietly gives millions.",
    status: "Active · Presidential Medal of Freedom (2025)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "family", date: "1983–", text: "Married to Pauletta since 1983.", source: "https://en.wikipedia.org/wiki/Denzel_Washington" },
      { rule: "charity_major", date: "1995", text: "Gave $2.5m to build a church facility in Los Angeles.", source: "https://en.wikipedia.org/wiki/Denzel_Washington" },
      { rule: "charity", date: "1995", text: "Gave $1m to Nelson Mandela's Children's Fund.", source: "https://en.wikipedia.org/wiki/Denzel_Washington" },
      { rule: "teaching", date: "2006", text: "Helped produce a mentoring book for Boys & Girls Clubs.", source: "https://en.wikipedia.org/wiki/Denzel_Washington" },
      { rule: "honour", date: "2021", text: "Named Honorary Sergeant Major of the Army.", source: "https://en.wikipedia.org/wiki/Denzel_Washington" },
      { rule: "honour", date: "2025", text: "Received the Presidential Medal of Freedom.", source: "https://en.wikipedia.org/wiki/Denzel_Washington" },
    ],
  },
  {
    id: "terry-crews", name: "Terry Crews", list: "review", type: "public", scouted: "2026-10",
    role: "Actor, former NFL player",
    reason: "Spoke up about being assaulted, so others would too.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "family", date: "1989–", text: "Married to Rebecca since 1989.", source: "https://en.wikipedia.org/wiki/Terry_Crews" },
      { rule: "honour", date: "2017", text: "Named one of Time's Silence Breakers, Person of the Year.", source: "https://en.wikipedia.org/wiki/Terry_Crews" },
    ],
  },
  {
    id: "tom-hanks", name: "Tom Hanks", list: "good", type: "public", scouted: "2026-10",
    role: "Actor",
    reason: "Backs veterans and military families.",
    status: "Active · Presidential Medal of Freedom (2016)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "honour", date: "2016", text: "Received the Presidential Medal of Freedom.", source: "https://en.wikipedia.org/wiki/Tom_Hanks" },
      { rule: "honour", date: "2006", text: "Honorary member of the US Army Rangers Hall of Fame.", source: "https://en.wikipedia.org/wiki/Tom_Hanks" },
      { rule: "charity", date: "2023", text: "Founded Hanx for the Troops to support veterans and military families.", source: "https://en.wikipedia.org/wiki/Tom_Hanks" },
      { rule: "charity", date: "2019", text: "Appealed for aid after Greece's 2018 wildfire; made an honorary citizen.", source: "https://en.wikipedia.org/wiki/Tom_Hanks" },
    ],
  },
  {
    id: "ed-sheeran", name: "Ed Sheeran", list: "review", type: "public", scouted: "2026-10",
    role: "Musician",
    reason: "Funds music for kids who can't afford lessons.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity_major", date: "2019", text: "Launched a music foundation for young artists in Suffolk.", source: "https://en.wikipedia.org/wiki/Ed_Sheeran" },
      { rule: "charity", date: "2020", text: "Gave £170,000 to his old school.", source: "https://en.wikipedia.org/wiki/Ed_Sheeran" },
      { rule: "family", date: "2020–", text: "Married to Cherry Seaborn; father.", source: "https://en.wikipedia.org/wiki/Ed_Sheeran" },
    ],
  },
  {
    id: "usain-bolt", name: "Usain Bolt", list: "review", type: "public", scouted: "2026-10",
    role: "Sprinter",
    reason: "Fastest man ever.",
    status: "Retired",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity", date: "2008", text: "Gave $50,000 to children hit by the Sichuan earthquake.", source: "https://en.wikipedia.org/wiki/Usain_Bolt" },
      { rule: "honour", date: "2008", text: "Received Jamaica's Order of Distinction.", source: "https://en.wikipedia.org/wiki/Usain_Bolt" },
    ],
  },
  {
    id: "eddie-hall", name: "Eddie Hall", list: "good", type: "public", scouted: "2026-10",
    role: "Strongman",
    reason: "Deadlifted half a tonne and nearly passed out doing it.",
    status: "Active · Married, father",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "physique", date: "2017", text: "Won World's Strongest Man.", source: "https://en.wikipedia.org/wiki/Eddie_Hall" },
      { rule: "survival", date: "2016", text: "Set a 500 kg deadlift world record.", source: "https://en.wikipedia.org/wiki/Eddie_Hall" },
      { rule: "teaching", date: "2019", text: "Coached eight men through training and diet on Beasted!", source: "https://en.wikipedia.org/wiki/Eddie_Hall" },
      { rule: "family", date: "", text: "Married to Alexandra; father of four.", source: "https://en.wikipedia.org/wiki/Eddie_Hall" },
      { rule: "allegation", date: "2022", text: "A leaked recording suggested an organiser fixed his 2017 win; not proven.", source: "https://en.wikipedia.org/wiki/Eddie_Hall" },
    ],
  },
  {
    id: "idris-elba", name: "Idris Elba", list: "review", type: "public", scouted: "2026-10",
    role: "Actor",
    reason: "Campaigns to get young people away from knife crime.",
    status: "Active · OBE (2016)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity", date: "2009", text: "Prince's Trust anti-crime ambassador.", source: "https://en.wikipedia.org/wiki/Idris_Elba" },
      { rule: "charity", date: "2024", text: "Campaigns against knife crime.", source: "https://en.wikipedia.org/wiki/Idris_Elba" },
      { rule: "honour", date: "2016", text: "Appointed OBE.", source: "https://en.wikipedia.org/wiki/Idris_Elba" },
      { rule: "survival", date: "2015", text: "Broke a British land speed record.", source: "https://en.wikipedia.org/wiki/Idris_Elba" },
      { rule: "allegation", date: "2019", text: "Two writers said they were pushed off a play; he published a rebuttal.", source: "https://en.wikipedia.org/wiki/Idris_Elba" },
    ],
  },
  {
    id: "dwayne-johnson", name: "Dwayne Johnson", list: "review", type: "public", scouted: "2026-10",
    role: "Actor, former wrestler",
    reason: "Went from teenage arrests to telling kids to stay in school.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "teaching", date: "1995", text: "Spoke at schools urging students to stay in school and off drugs.", source: "https://en.wikipedia.org/wiki/Dwayne_Johnson" },
      { rule: "controversy", date: "1980s", text: "Arrested several times as a teenager.", source: "https://en.wikipedia.org/wiki/Dwayne_Johnson" },
    ],
  },
  {
    id: "ryan-reynolds", name: "Ryan Reynolds", list: "review", type: "public", scouted: "2026-10",
    role: "Actor",
    reason: "Gives big to charity and keeps it funny.",
    status: "Active · Order of Canada (2024)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "honour", date: "2024", text: "Appointed Officer of the Order of Canada.", source: "https://en.wikipedia.org/wiki/Ryan_Reynolds" },
      { rule: "honour", date: "2023", text: "Appointed to the Order of British Columbia.", source: "https://en.wikipedia.org/wiki/Ryan_Reynolds" },
      { rule: "charity", date: "2008", text: "Ran the New York Marathon for Parkinson's research.", source: "https://en.wikipedia.org/wiki/Ryan_Reynolds" },
      { rule: "charity", date: "2023", text: "Gave $1m to the Red Cross for children in the Israel–Gaza conflict.", source: "https://en.wikipedia.org/wiki/Ryan_Reynolds" },
      { rule: "allegation", date: "2025", text: "Named in a $400m countersuit that was dismissed.", source: "https://en.wikipedia.org/wiki/Ryan_Reynolds" },
    ],
  },
  {
    id: "hugh-jackman", name: "Hugh Jackman", list: "good", type: "public", scouted: "2026-10",
    role: "Actor, former PE teacher",
    reason: "Was a PE teacher before he was Wolverine.",
    status: "Active · Companion of the Order of Australia (2019)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "teaching", date: "1987", text: "Worked as a PE teacher in England.", source: "https://en.wikipedia.org/wiki/Hugh_Jackman" },
      { rule: "family", date: "1996–2023", text: "Married 27 years; adopted two children.", source: "https://en.wikipedia.org/wiki/Hugh_Jackman" },
      { rule: "charity", date: "2009", text: "Gave $100,000 to clean water and community charities.", source: "https://en.wikipedia.org/wiki/Hugh_Jackman" },
      { rule: "honour", date: "2019", text: "Appointed Companion of the Order of Australia.", source: "https://en.wikipedia.org/wiki/Hugh_Jackman" },
    ],
  },
  {
    id: "cristiano-ronaldo", name: "Cristiano Ronaldo", list: "review", type: "public", scouted: "2026-10",
    role: "Footballer",
    reason: "Elite athlete with a tax fraud conviction.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "survival", date: "teen", text: "Came back to training days after heart surgery as a teenager.", source: "https://en.wikipedia.org/wiki/Cristiano_Ronaldo" },
      { rule: "fraud_conviction", date: "2019", text: "Accepted a suspended sentence and a €18.8m fine for tax fraud in Spain.", source: "https://www.irishtimes.com/sport/soccer/cristiano-ronaldo-agrees-to-pay-19m-fine-to-settle-tax-fraud-case-1.3766489" },
      { rule: "allegation", date: "2018–22", text: "A US rape lawsuit was dismissed in 2022; he denies it and was never charged.", source: "https://www.graphic.com.gh/sports/sports-news/us-judge-dismisses-rape-lawsuit-against-cristiano-ronaldo.html" },
    ],
  },
  {
    id: "lionel-messi", name: "Lionel Messi", list: "review", type: "public", scouted: "2026-10",
    role: "Footballer",
    reason: "World Cup winner with a tax fraud conviction.",
    status: "Active · Presidential Medal of Freedom (2025)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "survival", date: "childhood", text: "Overcame a growth hormone deficiency to play.", source: "https://en.wikipedia.org/wiki/Lionel_Messi" },
      { rule: "honour", date: "2025", text: "Received the Presidential Medal of Freedom.", source: "https://en.wikipedia.org/wiki/Lionel_Messi" },
      { rule: "fraud_conviction", date: "2016–17", text: "Convicted of tax fraud in Spain; 21-month suspended sentence upheld.", source: "https://indaily.com.au/sport/soccer/2017/05/25/messi-handed-suspended-prison-term-losing-appeal" },
    ],
  },
  {
    id: "floyd-mayweather", name: "Floyd Mayweather Jr.", list: "review", type: "public", scouted: "2026-10",
    role: "Boxer",
    reason: "Undefeated boxer jailed for domestic violence.",
    status: "Retired",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "domestic_violence", date: "2011–12", text: "Pleaded guilty to battery on his ex-partner; served jail time in 2012.", source: "https://www.aljazeera.com/sports/2011/12/22/floyd-mayweather-jailed-for-domestic-violence" },
      { rule: "deception", date: "2016", text: "Admitted starting fake rumours of a McGregor fight.", source: "https://en.wikipedia.org/wiki/Floyd_Mayweather_Jr." },
    ],
  },
  {
    id: "will-smith", name: "Will Smith", list: "review", type: "public", scouted: "2026-10",
    role: "Actor",
    reason: "Slapped Chris Rock on stage at the Oscars.",
    status: "Active · Banned from the Oscars until 2032",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "violence", date: "2022", text: "Slapped Chris Rock at the Oscars; resigned from the Academy, banned 10 years.", source: "https://en.wikipedia.org/wiki/Will_Smith" },
      { rule: "unpaid", date: "1989", text: "Assessed a $2.8m IRS tax debt.", source: "https://en.wikipedia.org/wiki/Will_Smith" },
      { rule: "charity", date: "2018", text: "Bungee jumped over the Grand Canyon for Global Citizen.", source: "https://en.wikipedia.org/wiki/Will_Smith" },
      { rule: "allegation", date: "2025", text: "Sued for harassment by a former tour violinist; he denies it.", source: "https://en.wikipedia.org/wiki/Will_Smith" },
    ],
  },
  {
    id: "kanye-west", name: "Kanye West (Ye)", list: "review", type: "public", scouted: "2026-10",
    role: "Rapper, designer",
    reason: "Lost Adidas over antisemitic remarks.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity", date: "2020", text: "Gave $2m to George Floyd's family and victims of police brutality.", source: "https://en.wikipedia.org/wiki/Kanye_West" },
      { rule: "controversy", date: "2022", text: "Adidas ended its partnership after his antisemitic remarks.", source: "https://en.wikipedia.org/wiki/Kanye_West" },
      { rule: "controversy", date: "2009", text: "Grabbed the mic from Taylor Swift at the VMAs; later apologised.", source: "https://en.wikipedia.org/wiki/Kanye_West" },
    ],
  },
  {
    id: "russell-brand", name: "Russell Brand", list: "review", type: "public", scouted: "2026-10",
    role: "Comedian, podcaster",
    reason: "On trial for rape and sexual assault, which he denies.",
    status: "On trial (Oct 2026) · Denies all charges · Not convicted",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charges_pending", date: "2025–26", text: "Charged with rape and sexual assault; pleaded not guilty; trial began October 2026.", source: "https://variety.com/2026/tv/global/russell-brand-rape-trial-starts-london-1236900009/" },
      { rule: "many_allegations", date: "2023", text: "Five women accused him of sexual assault and abuse; he denies it.", source: "https://en.wikipedia.org/wiki/Russell_Brand" },
      { rule: "controversy", date: "2008", text: "Resigned from the BBC over prank calls to Andrew Sachs.", source: "https://en.wikipedia.org/wiki/Russell_Brand" },
      { rule: "family", date: "2017–", text: "Married Laura Gallacher; three children.", source: "https://en.wikipedia.org/wiki/Russell_Brand" },
    ],
  },
  {
    id: "sean-combs", name: "Sean Combs (Diddy)", list: "review", type: "public", scouted: "2026-10",
    role: "Music mogul",
    reason: "Convicted in 2025; filmed assaulting his ex.",
    status: "In prison · Convicted 2025",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "sexual_conviction", date: "2025", text: "Convicted on two counts of transportation for prostitution; 50 months in prison.", source: "https://en.wikipedia.org/wiki/Sean_Combs" },
      { rule: "violence", date: "2016", text: "Hotel footage showed him assaulting Cassie Ventura; he apologised in 2024.", source: "https://en.wikipedia.org/wiki/Sean_Combs" },
      { rule: "harassment", date: "1999", text: "Pleaded guilty to harassment after an office attack.", source: "https://en.wikipedia.org/wiki/Sean_Combs" },
    ],
  },
  {
    id: "kevin-spacey", name: "Kevin Spacey", list: "review", type: "public", scouted: "2026-10",
    role: "Actor",
    reason: "Many accusers; acquitted in court.",
    status: "Acquitted (2023) · Denies all allegations",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "many_allegations", date: "2017", text: "Faced many sexual misconduct allegations; he denies them, was acquitted in London in 2023 and found not liable in New York in 2022.", source: "https://en.wikipedia.org/wiki/Kevin_Spacey" },
      { rule: "honour", date: "2010", text: "Honorary CBE for services to drama.", source: "https://en.wikipedia.org/wiki/Kevin_Spacey" },
      { rule: "charity", date: "2008", text: "Founded an arts education charity.", source: "https://en.wikipedia.org/wiki/Kevin_Spacey" },
    ],
  },
  {
    id: "ben-stokes", name: "Ben Stokes", list: "review", type: "public", scouted: "2026-10",
    role: "Cricketer, England captain",
    reason: "World Cup hero with a nightclub brawl behind him.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "charity", date: "2022", text: "Gave his Pakistan Test fees to the flood appeal.", source: "https://en.wikipedia.org/wiki/Ben_Stokes" },
      { rule: "controversy", date: "2017–18", text: "Acquitted of affray after a nightclub brawl, but fined and banned by the ECB.", source: "https://en.wikipedia.org/wiki/Ben_Stokes" },
    ],
  },
  {
    id: "marco-pierre-white", name: "Marco Pierre White", list: "review", type: "public", scouted: "2026-10",
    role: "Chef",
    reason: "Trained Gordon Ramsay, with a famous temper.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "teaching", date: "1987–", text: "Trained chefs including Gordon Ramsay.", source: "https://en.wikipedia.org/wiki/Marco_Pierre_White" },
      { rule: "feeding", date: "1995", text: "Youngest chef to win three Michelin stars.", source: "https://en.wikipedia.org/wiki/Marco_Pierre_White" },
      { rule: "staff", date: "1980s–90s", text: "Admits he \"used to go insane\" at staff in his kitchens.", source: "https://en.wikipedia.org/wiki/Marco_Pierre_White" },
      { rule: "controversy", date: "2007", text: "Criticised by the Commission for Racial Equality over a TV remark.", source: "https://en.wikipedia.org/wiki/Marco_Pierre_White" },
      { rule: "allegation", date: "2005", text: "Held by police after a row with his wife; not charged.", source: "https://en.wikipedia.org/wiki/Marco_Pierre_White" },
    ],
  },
  {
    id: "tom-brady", name: "Tom Brady", list: "review", type: "public", scouted: "2026-10",
    role: "Former quarterback",
    reason: "Seven-time champion with a Deflategate ban.",
    status: "Retired",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "controversy", date: "2015–16", text: "Served a four-game Deflategate ban; the NFL cited the destruction of his phone.", source: "https://en.wikipedia.org/wiki/Tom_Brady" },
    ],
  },
  {
    id: "logan-paul", name: "Logan Paul", list: "review", type: "public", scouted: "2026-10",
    role: "YouTuber, wrestler",
    reason: "Filmed a body in Japan's suicide forest.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "controversy", date: "2017", text: "Filmed a dead body in Aokigahara forest; apologised.", source: "https://en.wikipedia.org/wiki/Logan_Paul" },
      { rule: "charity_major", date: "2018", text: "Pledged $1m to suicide-prevention groups.", source: "https://en.wikipedia.org/wiki/Logan_Paul" },
      { rule: "deception", date: "2023", text: "Apologised over the collapsed CryptoZoo game and promised refunds; investors sued.", source: "https://en.wikipedia.org/wiki/Logan_Paul" },
      { rule: "family", date: "2025", text: "Married Nina Agdal; father of a daughter.", source: "https://en.wikipedia.org/wiki/Logan_Paul" },
    ],
  },
  {
    id: "prince-harry", name: "Prince Harry", list: "good", type: "public", scouted: "2026-10",
    role: "Former Army officer, Invictus Games founder",
    reason: "Served two tours in Afghanistan, then built the Invictus Games.",
    status: "Active · Married, father of two",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "military", date: "2007–13", text: "Served two tours in Afghanistan, including as an Apache pilot.", source: "https://en.wikipedia.org/wiki/Prince_Harry,_Duke_of_Sussex" },
      { rule: "honour", date: "2008", text: "Received the Operational Service Medal for Afghanistan.", source: "https://en.wikipedia.org/wiki/Prince_Harry,_Duke_of_Sussex" },
      { rule: "charity_major", date: "2014", text: "Founded the Invictus Games for wounded service members.", source: "https://en.wikipedia.org/wiki/Prince_Harry,_Duke_of_Sussex" },
      { rule: "family", date: "2018–", text: "Married Meghan Markle; two children.", source: "https://en.wikipedia.org/wiki/Prince_Harry,_Duke_of_Sussex" },
    ],
  },
  {
    id: "mark-wahlberg", name: "Mark Wahlberg", list: "review", type: "public", scouted: "2026-10",
    role: "Actor",
    reason: "Jailed as a teen for assault, then set up a youth foundation.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "violence_conviction", date: "1988", text: "Pleaded guilty to felony assault; served 45 days.", source: "https://en.wikipedia.org/wiki/Mark_Wahlberg" },
      { rule: "charity_major", date: "2001", text: "Founded the Mark Wahlberg Youth Foundation.", source: "https://en.wikipedia.org/wiki/Mark_Wahlberg" },
      { rule: "family", date: "2009–", text: "Married to Rhea Durham.", source: "https://en.wikipedia.org/wiki/Mark_Wahlberg" },
    ],
  },
  {
    id: "mel-gibson", name: "Mel Gibson", list: "review", type: "public", scouted: "2026-10",
    role: "Actor, director",
    reason: "Antisemitic rant, DUI, and a battery plea.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "domestic_violence", date: "2011", text: "Pleaded no contest to battery against his ex-partner.", source: "https://en.wikipedia.org/wiki/Mel_Gibson" },
      { rule: "drugs_driving", date: "2006", text: "Pleaded no contest to drink-driving.", source: "https://en.wikipedia.org/wiki/Mel_Gibson" },
      { rule: "controversy", date: "2006", text: "Made antisemitic remarks during his arrest; apologised.", source: "https://en.wikipedia.org/wiki/Mel_Gibson" },
    ],
  },
  {
    id: "charlie-sheen", name: "Charlie Sheen", list: "review", type: "public", scouted: "2026-10",
    role: "Actor",
    reason: "Pleaded guilty to assaulting his wife.",
    status: "Active",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "domestic_violence", date: "2010", text: "Pleaded guilty to misdemeanour assault on his wife.", source: "https://en.wikipedia.org/wiki/Charlie_Sheen" },
      { rule: "allegation", date: "2015–22", text: "Ex-partners said he hid his HIV status; settled in 2022.", source: "https://en.wikipedia.org/wiki/Charlie_Sheen" },
    ],
  },
  {
    id: "tom-daley", name: "Tom Daley", list: "review", type: "public", scouted: "2026-10",
    role: "Olympic diver",
    reason: "Beat school bullies and became Olympic champion.",
    status: "Retired · OBE (2022)",
    photo: "", photoCredit: "", photoSource: "",
    points: [
      { rule: "honour", date: "2022", text: "Appointed OBE for diving, LGBTQ+ rights and charity.", source: "https://en.wikipedia.org/wiki/Tom_Daley" },
      { rule: "charity", date: "2015", text: "Patron of the LGBT+ charity Switchboard.", source: "https://en.wikipedia.org/wiki/Tom_Daley" },
    ],
  },
];

// ---- scoring (no need to edit below) ----
(function () {
  const all = window.PEOPLE;
  window.SHADOW_PEOPLE.forEach(p => {
    const pub = all.find(x => x.id === p.id);
    if (!pub) all.push(p);
    // moved to a public board: keep his points from here
    else if (!pub.points && !window.SHADOW_POINTS[p.id]) pub.points = p.points;
  });
  all.forEach(p => {
    if (!p.points) p.points = window.SHADOW_POINTS[p.id] || [];
    p.raw = p.points.reduce((a, it) => a + ((window.RULES[it.rule] || {}).pts || 0), 0);
    p.plus = p.points.reduce((a, it) => a + Math.max(0, (window.RULES[it.rule] || {}).pts || 0), 0);
    p.minus = p.points.reduce((a, it) => a + Math.min(0, (window.RULES[it.rule] || {}).pts || 0), 0);
    // Profiles for men without hand-written posts use their documented facts
    if (!p.posts) p.posts = p.points.filter(it => it.source).map(it => ({ date: it.date, text: it.text, source: it.source }));
    if (!p.about) p.about = {};
  });
  const real = all.filter(p => p.type !== 'composite');
  const lo = Math.min(...real.map(p => p.raw)), hi = Math.max(...real.map(p => p.raw));
  all.forEach(p => {
    p.shadow = hi === lo ? 50 : Math.max(0, Math.min(100, Math.round((p.raw - lo) / (hi - lo) * 100)));
  });
  // per-dimension scores, scaled across real men
  window.DIMS.forEach(d => {
    const sum = p => p.points.reduce((a, it) => { const r = window.RULES[it.rule]; return a + (r && r.dim === d.key ? r.pts : 0); }, 0);
    all.forEach(p => { p.dims = p.dims || {}; p.dims[d.key] = sum(p); });
    const vals = real.map(p => p.dims[d.key]);
    const dlo = Math.min(...vals), dhi = Math.max(...vals);
    all.forEach(p => {
      p.dimScore = p.dimScore || {};
      const has = p.points.some(it => (window.RULES[it.rule] || {}).dim === d.key);
      // null = no public record in this dimension
      p.dimScore[d.key] = !has ? null : dhi === dlo ? 100 : Math.round((p.dims[d.key] - dlo) / (dhi - dlo) * 100);
    });
  });
  window.shadowScore = p => p.shadow;
})();
