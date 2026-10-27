// Life skills shown on skills.html.
//
// To add a skill, copy any block below and change it.
//   video: paste any YouTube link (watch?v=, youtu.be/, /shorts/ or /embed/ all work)
//   start / end: optional, in seconds. Use them to clip in just the useful part of a long video.
//   cat: must match one of the SKILL_CATS ids.

window.SKILL_CATS = [
  { id: "grooming", name: "Grooming", ic: "🪒" },
  { id: "outdoors", name: "Outdoors", ic: "🏕️" },
  { id: "home", name: "Home", ic: "🔧" },
  { id: "kitchen", name: "Kitchen", ic: "🍳" },
  { id: "cleaning", name: "Cleaning & laundry", ic: "🧽" },
  { id: "car", name: "Car", ic: "🚗" },
  { id: "life", name: "Life & safety", ic: "❤️" }
];

window.SKILLS = [
  {
    id: "shave",
    cat: "grooming",
    name: "Get a clean shave",
    why: "Fewer cuts, no rash, and you look like you meant it.",
    tips: ["Shave after a hot shower, not before", "Go with the grain first", "Rinse with cold water to finish"],
    video: "https://www.youtube.com/watch?v=DzdT84upVNQ",
    by: "Real Men Real Style"
  },
  {
    id: "tie",
    cat: "grooming",
    name: "Tie a tie",
    why: "Weddings, funerals, interviews. You'll need it on the day you're nervous.",
    tips: ["Wide end hangs lower to start", "The tip should just touch your belt", "Practise once before the day"],
    video: "https://www.youtube.com/watch?v=0_FY3v_ie08",
    by: "Reef Knots"
  },
  {
    id: "iron",
    cat: "grooming",
    name: "Iron a shirt",
    why: "Two minutes that change how people read you.",
    tips: ["Collar, cuffs, sleeves, then body", "Slightly damp irons easier", "Hang it straight away"],
    video: "https://www.youtube.com/watch?v=z91MtZpcsKY",
    by: "GQ"
  },
  {
    id: "button",
    cat: "grooming",
    name: "Sew on a button",
    why: "Five minutes with a needle saves a good shirt from the bin.",
    tips: ["Double the thread and knot the end", "Put a pin under the button for a bit of slack", "Wind the thread round the stem, then knot at the back"],
    video: "https://www.youtube.com/watch?v=xNy9hLCl0NM",
    by: "Real Men Real Style"
  },
  {
    id: "tent",
    cat: "outdoors",
    name: "Put up a tent",
    why: "Do it once in the garden so you're not learning in the dark and the rain.",
    tips: ["Pick flat ground, clear the stones", "Back of the tent into the wind", "Pegs at 45°, leaning away"],
    video: "https://www.youtube.com/watch?v=Jtm51h9jGDo",
    by: "GO Outdoors TV"
  },
  {
    id: "fire",
    cat: "outdoors",
    name: "Build a fire",
    why: "Warmth, food and the best conversations happen round one.",
    tips: ["Tinder, then kindling, then fuel", "Leave gaps: fire needs air", "Only where it's allowed, and put it out fully"],
    video: "https://www.youtube.com/watch?v=0O3Bj8JFcTc",
    by: "REI"
  },
  {
    id: "knots",
    cat: "outdoors",
    name: "Tie the knots that matter",
    why: "Tie down a load, hang a tarp, secure a boat. A handful of knots covers most of it.",
    tips: ["Learn the bowline first", "Then the clove hitch and taut-line", "Practise with a bootlace on the sofa"],
    video: "https://www.youtube.com/watch?v=3X8drKsdf5E",
    by: "InnerBark Outdoors"
  },
  {
    id: "shelf",
    cat: "home",
    name: "Put up a shelf",
    why: "Drill, plug, screw, level. Once you've done it, you'll do it everywhere.",
    tips: ["Check for pipes and cables first", "Match the drill bit to the wall plug", "Use a spirit level, not your eye"],
    video: "https://www.youtube.com/watch?v=PaRXakZ5lCY",
    by: "The Home Depot"
  },
  {
    id: "sink",
    cat: "home",
    name: "Unblock a sink",
    why: "Save yourself a call-out fee and an evening of stress.",
    tips: ["Try a plunger before chemicals", "A bucket under the U-bend before you open it", "Keep fat out of the drain"],
    video: "https://www.youtube.com/watch?v=jToMYnTvmmY",
    by: "The Handyman's Home"
  },
  {
    id: "steak",
    cat: "kitchen",
    name: "Cook a proper steak",
    why: "One meal you can cook well, for yourself or for someone else.",
    tips: ["Take it out of the fridge 30 min before", "Hot pan, don't keep poking it", "Rest it as long as you cooked it"],
    video: "https://www.youtube.com/watch?v=AmC9SmCBUj4",
    by: "Gordon Ramsay (Hodder Books)"
  },
  {
    id: "knife",
    cat: "kitchen",
    name: "Sharpen a knife",
    why: "A sharp knife is safer than a blunt one. It goes where you point it.",
    tips: ["Soak the stone if it needs it", "Hold a steady, shallow angle", "Same number of strokes each side"],
    video: "https://www.youtube.com/watch?v=bODQ4KGeFvQ",
    by: "knivesandtools"
  },
  {
    id: "onion",
    cat: "kitchen",
    name: "Chop an onion",
    why: "Half the recipes you'll ever cook start here. Do it fast and keep your fingers.",
    tips: ["Leave the root on: it holds it together", "Curl your fingertips under, knuckles guide the knife", "Let the knife do the work, don't press"],
    video: "https://www.youtube.com/watch?v=dCGS067s0zo",
    by: "Gordon Ramsay"
  },
  {
    id: "rice",
    cat: "kitchen",
    name: "Cook rice properly",
    why: "Cheap, filling, goes with everything. No more gluey or crunchy rice.",
    tips: ["Rinse it until the water runs clear", "Measure the water, don't guess", "Lid on, low heat, and don't keep stirring"],
    video: "https://www.youtube.com/watch?v=Jf75I9LKhvg",
    by: "Gordon Ramsay"
  },
  {
    id: "eggs",
    cat: "kitchen",
    name: "Make scrambled eggs",
    why: "Breakfast, lunch or a 2am dinner. The first thing most people learn to cook well.",
    tips: ["Low heat, keep them moving", "Take them off while they still look a bit wet", "Season at the end"],
    video: "https://www.youtube.com/watch?v=9-ODDKHRVkA",
    by: "Epicurious"
  },
  {
    id: "bolognese",
    cat: "kitchen",
    name: "Cook a spaghetti bolognese",
    why: "One pot feeds the whole house, and leftovers freeze for the week.",
    tips: ["Brown the mince properly, in batches", "Let the sauce simmer, at least 30 minutes", "Save a splash of pasta water for the sauce"],
    video: "https://www.youtube.com/watch?v=-gF8d-fitkU",
    by: "Jamie Oliver"
  },
  {
    id: "roast",
    cat: "kitchen",
    name: "Roast a chicken",
    why: "Sunday dinner for everyone, plus sandwiches and soup for days after.",
    tips: ["Pat the skin dry for a crisp finish", "Juices run clear at the thickest part: then it's done", "Rest it 15 minutes before carving"],
    video: "https://www.youtube.com/watch?v=bJeUb8ToRIw",
    by: "Jamie Oliver"
  },
  {
    id: "hygiene",
    cat: "kitchen",
    name: "Keep food safe",
    why: "Food poisoning wrecks a week. Four habits stop most of it.",
    tips: ["Wash your hands, and again after raw meat", "Raw meat on its own board, bottom shelf of the fridge", "Cook it through, cool leftovers fast and eat within 2 days"],
    video: "https://www.youtube.com/watch?v=RUeVNCEDbCo",
    by: "NSW Food Authority"
  },
  {
    id: "dishwasher",
    cat: "cleaning",
    name: "Load a dishwasher",
    why: "Load it right once and the dishes come out clean, not washed twice.",
    tips: ["Scrape plates, don't rinse them", "Plates bottom, glasses and bowls top, all facing the middle", "Knives, wooden boards and good pans by hand"],
    video: "https://www.youtube.com/watch?v=BbijOt6Iozw",
    by: "Consumer Reports"
  },
  {
    id: "dishfilter",
    cat: "cleaning",
    name: "Clean the dishwasher filter",
    why: "Smelly dishwasher, gritty glasses? It's almost always the filter.",
    tips: ["Twist it out from the bottom of the machine", "Rinse it and scrub with an old toothbrush", "Do it once a month"],
    video: "https://www.youtube.com/watch?v=ck3RtAhtuZk",
    by: "Reviewed"
  },
  {
    id: "laundry",
    cat: "cleaning",
    name: "Use a washing machine",
    why: "Nobody should be handing their washing to someone else. Learn it once.",
    tips: ["Sort darks, lights and towels", "30°C does most loads; hotter for towels and bedding", "Don't stuff the drum: leave a hand's width at the top"],
    video: "https://www.youtube.com/watch?v=Nh8Hv5RdGGM",
    by: "Darryl Arante"
  },
  {
    id: "labels",
    cat: "cleaning",
    name: "Read clothing care labels",
    why: "Those little symbols are why your jumper shrank. Thirty seconds of reading saves it.",
    tips: ["Tub = washing, triangle = bleach, square = drying", "Dots mean heat: more dots, hotter", "A cross through anything means don't"],
    video: "https://www.youtube.com/watch?v=Ux30YueXA08",
    by: "Jeeves NY"
  },
  {
    id: "washerclean",
    cat: "cleaning",
    name: "Clean the washing machine",
    why: "If your clean clothes smell, the machine needs washing too.",
    tips: ["Wipe inside the rubber door seal", "Pull out and scrub the detergent drawer", "Run an empty hot wash, then leave the door open"],
    video: "https://www.youtube.com/watch?v=WxxOtXTiDUY",
    by: "Pan The Organizer"
  },
  {
    id: "bed",
    cat: "cleaning",
    name: "Change the bed sheets",
    why: "Fresh sheets every week or two. The duvet cover fight is easier than it looks.",
    tips: ["Fitted sheet: opposite corners first", "Turn the duvet cover inside out to start", "Wash bedding at 60°C"],
    video: "https://www.youtube.com/watch?v=FzbpdAawx4Y",
    by: "Which?"
  },
  {
    id: "oven",
    cat: "cleaning",
    name: "Clean the oven",
    why: "Burnt-on grease smokes every time you cook. Clear it out a few times a year.",
    tips: ["Oven off and cold before you start", "Soak the racks in hot soapy water", "Let the cleaner sit, then scrape and wipe"],
    video: "https://www.youtube.com/watch?v=kEwvNgWIZAU",
    by: "Clean That Up"
  },
  {
    id: "microwave",
    cat: "cleaning",
    name: "Clean the microwave",
    why: "Two minutes of steam does all the scrubbing for you.",
    tips: ["Bowl of water with lemon or vinegar", "Heat 3 to 5 minutes, leave the door shut for 5 more", "Wipe it all out, turntable too"],
    video: "https://www.youtube.com/watch?v=t6LItH7DA7E",
    by: "wikiHow"
  },
  {
    id: "kettle",
    cat: "cleaning",
    name: "Descale a kettle",
    why: "No more white bits floating in your tea, and the kettle boils faster.",
    tips: ["Half water, half white vinegar (or lemon juice)", "Boil it, leave it an hour", "Rinse and boil fresh water twice before you use it"],
    video: "https://www.youtube.com/watch?v=FmJr8E8izAE",
    by: "DaveHax"
  },
  {
    id: "fridge",
    cat: "cleaning",
    name: "Clean the fridge",
    why: "Sticky shelves and a smell you can't place? Empty it and start fresh.",
    tips: ["Bin anything out of date first", "Warm soapy water on shelves and drawers", "Dry it before putting the food back"],
    video: "https://www.youtube.com/watch?v=Yj3VZVCrFkU",
    by: "Clean That Up"
  },
  {
    id: "bathroom",
    cat: "cleaning",
    name: "Clean the bathroom",
    why: "Toilet, sink, shower, mirror. Fifteen minutes a week keeps it from turning grim.",
    tips: ["Spray everything first, let it sit while you do the mirror", "Clean from top to bottom, cleanest to dirtiest", "Toilet last, with its own cloth"],
    video: "https://www.youtube.com/watch?v=3XT33A0jW4w",
    by: "Clean My Space"
  },
  {
    id: "mop",
    cat: "cleaning",
    name: "Mop a floor",
    why: "Done right, the floor dries clean, not streaky and sticky.",
    tips: ["Sweep or hoover first", "Wring the mop out well: damp, not wet", "Start in the far corner and work back to the door"],
    video: "https://www.youtube.com/watch?v=2fFaPDe5uI8",
    by: "Kendall Todd TheSilverGuy"
  },
  {
    id: "tyre",
    cat: "car",
    name: "Change a flat tyre",
    why: "Be the one who sorts it at the side of the road, not the one waiting.",
    tips: ["Hazards on, handbrake on, somewhere safe", "Loosen nuts before you jack it up", "Tighten in a star pattern"],
    video: "https://www.youtube.com/watch?v=3aQRO29ZzbE",
    by: "ChrisFix"
  },
  {
    id: "jump",
    cat: "car",
    name: "Jump-start a car",
    why: "Flat battery on a cold morning. Get yourself, or a stranger, going again.",
    tips: ["Red to dead, red to donor", "Black to donor, black to bare metal on the dead car", "Remove in reverse order"],
    video: "https://www.youtube.com/watch?v=iI1o2hNy2hE",
    by: "ChrisFix"
  },
  {
    id: "cpr",
    cat: "life",
    name: "Do CPR",
    why: "The one on this page that could save a life. Learn it today.",
    tips: ["Call 999 / 911 / 112 first, put it on speaker", "Centre of the chest, hard and fast", "Don't stop until help takes over"],
    video: "https://www.youtube.com/watch?v=RATOawN8lW8",
    by: "British Heart Foundation"
  },
  {
    id: "budget",
    cat: "life",
    name: "Make a budget",
    why: "Money stress is quieter when you know where it goes.",
    tips: ["Write down what comes in", "List every bill and subscription", "Give every pound a job before the month starts"],
    video: "https://www.youtube.com/watch?v=xfPbT7HPkKA",
    by: "George Kamel"
  }
];
