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
