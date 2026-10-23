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
    id: "steve-irwin", name: "Steve Irwin", list: "review", type: "public",
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
];

// ---- scoring (no need to edit below) ----
(function () {
  const all = window.PEOPLE;
  window.SHADOW_PEOPLE.forEach(p => { if (!all.find(x => x.id === p.id)) all.push(p); });
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
