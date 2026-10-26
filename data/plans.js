// =====================================================================
//  MENTAL HEALTH — strategies for what men are dealing with
//
//  Wording rules (keep these when editing):
//  - Strategy, not sympathy. "Your moves", not "things you should do".
//  - Never call him weak, broken or a victim. He's the one making the play.
//  - Short sentences. A 15-year-old should get it first read.
//  - Getting help is a tactic: "call in backup", "bring in a specialist".
//  - Anything about hurting himself always points to BACKUP right away.
//
//  Each area has situations. Each situation has:
//    read     – what's going on, in one or two lines
//    moves    – 3–5 numbered steps
//    quickWin – one thing he can do today
//    backup   – signs it's time to bring in someone else
//    who      – who that someone is
// =====================================================================

window.AREAS = [
  {
    id: "pressure", icon: "⚡", name: "Pressure & stress",
    tag: "Too much on, can't switch off",
    situations: [
      {
        id: "overloaded", name: "Too much on at once",
        read: "Your brain is juggling more than it can hold. The fix isn't trying harder. It's getting it out of your head and into a plan.",
        moves: [
          "Brain dump: write down every single thing on your mind. All of it. Takes 5 minutes.",
          "Circle the 3 that actually matter this week. The rest can wait or get dropped.",
          "Break the first one into a step so small you can't fail it. Do that step now.",
          "Block your day: one job at a time. Phone face-down while you do it.",
          "Say no to one new thing this week. Protecting your time is a skill.",
        ],
        quickWin: "Do the brain dump right now, before you close this page.",
        backup: ["You've felt like this for weeks with no let-up", "You can't sleep or eat properly", "Your chest gets tight or you get panic attacks"],
        who: "Your doctor/GP, or a counsellor. Lots of workplaces and colleges have free ones.",
      },
      {
        id: "cant-switch-off", name: "Can't switch off",
        read: "Your body is stuck in fight mode even when there's nothing to fight. You need a way to tell it the job's done.",
        moves: [
          "Box breathing: in for 4, hold 4, out for 4, hold 4. Four rounds. Soldiers and first responders use it under pressure.",
          "Move every day. A 20-minute walk, run or gym session burns off stress chemicals.",
          "Set a shutdown time. After it: no work chats, no emails.",
          "Write tomorrow's top 3 jobs down before bed so your brain can stop holding them.",
        ],
        quickWin: "Four rounds of box breathing. Right now. Takes one minute.",
        backup: ["Your heart races or you feel on edge most days", "You're using drink or anything else to come down", "It's affecting your work, sleep or relationships"],
        who: "Your doctor/GP. Stress like this is treatable. Talking therapy works.",
      },
      {
        id: "exams-work", name: "Exams or work pressure",
        read: "Big stakes, limited time. Treat it like training camp: a schedule, recovery, and showing up every day.",
        moves: [
          "Make a countdown plan: what needs doing each day until the deadline.",
          "Work in 25-minute sprints, then a 5-minute break. Repeat 4 times, then a longer break.",
          "Sleep is part of the plan. Your brain locks in what you learned while you sleep.",
          "Tell your teacher, tutor or manager early if you're behind. It's easier to fix early.",
        ],
        quickWin: "Do one 25-minute sprint on the thing you've been avoiding.",
        backup: ["You're panicking, not sleeping, or can't eat", "You've stopped going in", "You feel like there's no way out"],
        who: "Your school or college wellbeing team, your manager or HR, or your doctor/GP.",
      },
    ],
  },
  {
    id: "mood", icon: "🌧️", name: "Low mood",
    tag: "Running on empty, nothing feels worth it",
    situations: [
      {
        id: "empty", name: "Running on empty",
        read: "Your tank is low. You don't need motivation to start. Action comes first, the energy follows.",
        moves: [
          "Get daylight in the first hour after you wake up. Even 10 minutes outside.",
          "Do one physical thing a day. Walk, gym, kick a ball about. It counts.",
          "Set one small mission a day: shower, tidy one thing, reply to one person. Tick it off.",
          "Cut back on the stuff that drains you: late-night scrolling, drinking, junk sleep.",
          "Tell one person you trust that you're running low. You don't need a speech.",
        ],
        quickWin: "Get outside for 10 minutes today. No phone if you can.",
        backup: ["It's lasted more than two weeks", "You've lost interest in things you used to enjoy", "You're sleeping way more or way less than usual"],
        who: "Your doctor/GP. Low mood that sticks around is a health issue, like an injury. It can be treated.",
      },
      {
        id: "pointless", name: "Nothing feels worth it",
        read: "When everything feels pointless, your brain is lying to you about what's possible. This is the time to bring in backup, not go it alone.",
        moves: [
          "If you've had thoughts of ending your life or hurting yourself, tap BACKUP NOW at the top. Do it today.",
          "Tell one person today: a mate, family member, teacher, coach. Say \"I'm not in a good place.\"",
          "Book a doctor/GP appointment. Tell them exactly how it's been.",
          "Keep yourself safe: stay away from drink and drugs while you're in this, and keep away from anything you could use to hurt yourself.",
        ],
        quickWin: "Send one message to someone you trust: \"Can we talk? I'm not doing great.\"",
        backup: ["Any thoughts of not wanting to be here: that's the moment. Call now"],
        who: "A crisis line (tap BACKUP NOW), your doctor/GP, or emergency services if you're in danger.",
        urgent: true,
      },
      {
        id: "faking", name: "Feel like I'm faking it",
        read: "Plenty of men feel like they're acting a part. The way out is small, honest moves, not a big reveal.",
        moves: [
          "Write down three things you actually want, not what you think you should want.",
          "Pick one person you can be straight with. Test it with something small.",
          "Drop one thing you only do to look good to others.",
          "Find something you're getting better at. Skill builds real confidence.",
        ],
        quickWin: "Write your three real wants down. Nobody else needs to see it.",
        backup: ["You feel numb or cut off from everyone", "It's dragging your mood down most days"],
        who: "A counsellor or your doctor/GP. Talking it through with a pro is like having a coach.",
      },
    ],
  },
  {
    id: "anger", icon: "🔥", name: "Anger",
    tag: "Snapping, losing it, regretting it",
    situations: [
      {
        id: "snapping", name: "Snapping at people",
        read: "Anger is fuel. The goal is to control when it fires, not to never feel it.",
        moves: [
          "Learn your warning signs: jaw, fists, heat in your face. That's your cue.",
          "Take a tactical exit: \"I need 10 minutes.\" Walk away. Come back.",
          "Burn it off physically: run, gym, punch bag. Not people, not walls.",
          "Once you've cooled down, name what actually set you off. It's often not the thing you blew up about.",
        ],
        quickWin: "Pick your exit line now, so it's ready when you need it.",
        backup: ["You've hurt someone or broken things", "People around you are scared of you", "You can't stop once you've started"],
        who: "Your doctor/GP or an anger management course. It's a trainable skill.",
      },
      {
        id: "regret", name: "Things I regret after",
        read: "Owning it is the strong move. Repair the damage, then change the pattern.",
        moves: [
          "Own it straight: \"I was out of line. I'm sorry.\" No \"but\".",
          "Ask what would help put it right, and do it.",
          "Work out the pattern: drink, tiredness, certain people? Plan around it.",
          "Practise the exit line until it's automatic.",
        ],
        quickWin: "Make the apology you've been putting off.",
        backup: ["It keeps happening", "Drink or drugs are involved", "Someone's been hurt"],
        who: "Your doctor/GP or an anger management programme.",
      },
    ],
  },
  {
    id: "alcohol", icon: "🍺", name: "Alcohol",
    tag: "Drinking more than I want to",
    situations: [
      {
        id: "cut-back", name: "Drinking more than I want",
        read: "You're in charge here, not the drink. The strategy is to cut back gradually, with a plan you can stick to.",
        moves: [
          "Safety first: if you get the shakes, sweats or feel sick after a few hours without a drink, don't stop suddenly. That can be dangerous. See a doctor first. They'll help you come down safely.",
          "Track it for a week. Write down every drink. Most men are surprised.",
          "Pick drink-free days and lock them in, like training days.",
          "Swap and slow: alternate with water or soft drinks, go for lower-strength, use smaller glasses.",
          "Plan before you go out: decide your limit and tell a mate. Have your exit time.",
        ],
        quickWin: "Choose your first drink-free day this week and put it in your calendar.",
        backup: ["Shakes, sweats or sickness when you don't drink", "You've tried to cut back and couldn't", "Drinking is causing problems with work, money or people"],
        who: "Your doctor/GP. They can help you cut down safely and point you to free support services.",
      },
      {
        id: "goal", name: "Cutting back for a goal",
        read: "Fitness, money, a clear head: having a target makes this easier. Treat it like a training block.",
        moves: [
          "Set the mission: e.g. no drinking on weeknights for 30 days.",
          "Find your replacement: alcohol-free beer, a gym session, a new Friday routine.",
          "Tell your mates the goal up front. Most will back you.",
          "Track the wins: money saved, sleep, how you feel on a Saturday morning.",
        ],
        quickWin: "Write down your mission and your reason in one line.",
        backup: ["You can't hit even a few drink-free days", "You feel unwell when you don't drink"],
        who: "Your doctor/GP.",
      },
      {
        id: "habit", name: "Every evening is a drink evening",
        read: "It's become automatic. Break the routine around it, not just the drink.",
        moves: [
          "Spot the trigger: getting home, a certain time, being bored, stress.",
          "Replace the first drink with something else at that exact moment: a shower, a walk, food, a call.",
          "Don't keep a stash at home. Make it harder to start.",
          "Eat a proper meal before any drink. Hunger makes the first one go down faster.",
        ],
        quickWin: "Tonight, do your swap at the trigger moment instead of opening a drink.",
        backup: ["You need a drink to feel normal", "You feel unwell without one"],
        who: "Your doctor/GP. Don't cut off suddenly if you're drinking every day; get help to do it safely.",
      },
    ],
  },
  {
    id: "dating", icon: "💬", name: "Dating & women",
    tag: "Talking to women, rejection, confidence",
    situations: [
      {
        id: "nervous", name: "Nervous to talk to her",
        read: "Confidence isn't something you're born with. It's a skill you build by doing the reps, while treating her as a person, not a target.",
        moves: [
          "Start with low-stakes chats everywhere: shop staff, classmates, the gym. Get used to talking.",
          "Be curious. Ask about her and actually listen. That beats any line.",
          "Look after yourself: decent clothes, clean, sleep. You'll feel sharper.",
          "Respect her answer. A no, or no reply, is information. Thank her and move on.",
        ],
        quickWin: "Start one friendly conversation with someone today. Anyone.",
        backup: ["Anxiety stops you going out at all", "You feel angry at women in general"],
        who: "A counsellor or your doctor/GP can help with social anxiety.",
      },
      {
        id: "rejected", name: "Got rejected",
        read: "Rejection is part of the game for every man. It stings, and it's information, not a verdict on you.",
        moves: [
          "Take it like a pro: \"No worries\" and walk off. That's the strong move.",
          "Give yourself a day to feel it. Then move.",
          "Ask yourself honestly if there's anything to learn. If not, it just wasn't a match.",
          "Stay away from online spaces that turn rejection into hating women. They keep you stuck.",
        ],
        quickWin: "Do something today that makes you feel good about yourself: training, a skill, time with mates.",
        backup: ["You can't stop thinking about it weeks later", "It's turning into anger at women"],
        who: "A counsellor or a mate you trust.",
      },
    ],
  },
  {
    id: "relationship", icon: "❤️", name: "Relationship",
    tag: "Arguing, distance, breakups",
    situations: [
      {
        id: "arguing", name: "Arguing a lot",
        read: "You're on the same team. The goal is to win the problem, not the argument.",
        moves: [
          "Call a time-out when it heats up: \"Let's pause and come back in 20 minutes.\" Then actually come back.",
          "Listen to understand, not to reply. Repeat back what your partner said before you answer.",
          "Use \"I\" not \"you\": \"I feel ignored when…\" beats \"You always…\"",
          "Pick a calm time each week to sort out anything that's bugging either of you.",
        ],
        quickWin: "Next time it starts, try the time-out line.",
        backup: ["Arguments get physical, or either of you feels scared", "Same fight every week for months"],
        who: "Couples counselling. If anyone is at risk of being hurt, call emergency services.",
      },
      {
        id: "breakup", name: "Going through a breakup",
        read: "A breakup hits hard. The plan is to get through the first few weeks with your routine and your people.",
        moves: [
          "Go no-contact for a while. No checking their socials. Mute or unfollow.",
          "Keep the basics: sleep, eat, train, work. A routine is your anchor.",
          "Lean on your mates. Make plans, even if you don't feel like it.",
          "Don't numb it with drink. It makes it last longer.",
          "Use the energy: a new goal, a fitness target, a project.",
        ],
        quickWin: "Make one plan with a mate for this week.",
        backup: ["You can't function weeks later", "You're drinking heavily to cope", "You have any thoughts of hurting yourself (tap BACKUP NOW)"],
        who: "Your doctor/GP or a counsellor.",
      },
      {
        id: "distant", name: "We feel distant",
        read: "Distance builds up quietly. Small, regular moves close the gap.",
        moves: [
          "Put both phones away for one meal a day.",
          "Plan something new together, even small. A walk somewhere you haven't been.",
          "Ask your partner a real question: \"How are you actually doing?\" Then listen.",
          "Do one thing for your partner this week without being asked.",
        ],
        quickWin: "Ask the real question tonight.",
        backup: ["Neither of you can talk about it without it blowing up"],
        who: "Couples counselling.",
      },
    ],
  },
  {
    id: "friends", icon: "🤝", name: "Friendships",
    tag: "No crew, drifted apart, need to talk",
    situations: [
      {
        id: "no-crew", name: "Don't really have a crew",
        read: "Most men's friendships come from doing things together. So go do things, regularly, in the same place.",
        moves: [
          "Join something weekly: five-a-side, a gym class, martial arts, a running club, volunteering.",
          "Keep turning up. It usually takes a few weeks before people know you.",
          "Be the one who suggests it: \"Fancy a pint/game/session after?\"",
          "Follow up. One text after a good chat turns someone you know into a mate.",
        ],
        quickWin: "Find one weekly group near you and put the date in your phone.",
        backup: ["Loneliness is dragging your mood down most days"],
        who: "Your doctor/GP, or a men's peer group like Andy's Man Club (UK).",
      },
      {
        id: "drifted", name: "Drifted from my mates",
        read: "Life gets busy. Someone has to make the first move. Be that guy.",
        moves: [
          "Message one old mate today. Keep it simple: \"Been ages. Pint/game soon?\"",
          "Set something regular: a monthly meet-up, a game night, a group chat that actually plans stuff.",
          "Don't keep score of who texted last.",
        ],
        quickWin: "Send that message now.",
        backup: ["You feel completely cut off from everyone"],
        who: "Your doctor/GP or a men's peer group.",
      },
      {
        id: "serious-talk", name: "Need to talk to a mate about something serious",
        read: "It's hard to start. Side-by-side works better than face-to-face for most men.",
        moves: [
          "Pick the setting: a walk, a drive, the gym. Side by side, not staring across a table.",
          "Open simply: \"Can I tell you something? It's been weighing on me.\"",
          "You don't need it all worked out. Just say what's going on.",
          "If he's the one struggling: ask twice. \"You alright?\" then \"No, really, you alright?\"",
        ],
        quickWin: "Text your mate and arrange the walk.",
        backup: ["If you're worried a mate might hurt himself, call a crisis line together (tap BACKUP NOW)"],
        who: "A crisis line, his doctor/GP, or emergency services if he's in danger.",
      },
    ],
  },
  {
    id: "purpose", icon: "🎯", name: "Purpose & motivation",
    tag: "No direction, can't get started",
    situations: [
      {
        id: "no-direction", name: "No direction",
        read: "Nobody finds purpose by sitting and thinking. You find it by trying things and noticing what grabs you.",
        moves: [
          "List 5 things you've ever been into, even as a kid.",
          "Try one of them this month. Properly, not just on YouTube.",
          "Talk to someone doing a job that interests you. Ask how they got there.",
          "Help someone. Volunteering or teaching a skill gives a sense of purpose fast.",
        ],
        quickWin: "Write your list of 5.",
        backup: ["Feeling directionless is turning into low mood most days"],
        who: "A careers adviser, a mentor, or your doctor/GP if your mood is low.",
      },
      {
        id: "cant-start", name: "Can't get started",
        read: "Motivation comes after you start, not before. Make the first step so small it's almost a joke.",
        moves: [
          "Two-minute rule: just do two minutes of it. You'll often keep going.",
          "Same time, same place each day. Let routine do the heavy lifting.",
          "Track your streak. Don't break the chain.",
          "Remove the easy distraction: phone in another room.",
        ],
        quickWin: "Two minutes. Start now.",
        backup: ["Nothing feels worth starting for weeks (see Low mood)"],
        who: "Your doctor/GP if it's linked to low mood.",
      },
    ],
  },
  {
    id: "sleep", icon: "🔋", name: "Sleep & energy",
    tag: "Can't sleep, always tired",
    situations: [
      {
        id: "cant-sleep", name: "Can't sleep",
        read: "Sleep is recovery. Pro athletes treat it as training. Set yourself up for it.",
        moves: [
          "Same wake-up time every day, weekends too. This sets your body clock.",
          "Phone out of the bedroom, or across the room, 30 minutes before bed.",
          "No caffeine after early afternoon.",
          "If you're awake for 20 minutes, get up, do something boring in low light, then try again.",
          "Daylight and exercise in the day make sleep easier at night.",
        ],
        quickWin: "Tonight: phone charges outside the bedroom.",
        backup: ["Poor sleep for more than a few weeks", "You snore heavily or wake up gasping", "Your mood is going down with it"],
        who: "Your doctor/GP.",
      },
    ],
  },
  {
    id: "modern", icon: "📱", name: "Modern day problems",
    tag: "Doom scrolling, fake people online",
    situations: [
      {
        id: "doom-scrolling", name: "Doom scrolling",
        read: "The feed is built to never end. Every swipe is a slot machine pull. Hours vanish and you feel worse, not better. That's the design working, not you failing.",
        moves: [
          "Check your screen time. Look at the real number. That's your starting score.",
          "Kill the triggers: turn off every notification that isn't a real person messaging you.",
          "Move the worst apps off your home screen, or log out after each use. Make it a bit of effort to open them.",
          "Set a hard stop: no feeds in bed, and none for the first 30 minutes after you wake up.",
          "Before you open an app, ask: what am I here for? No answer = don't open it.",
        ],
        quickWin: "Turn off notifications for your most-used app. Right now. Takes 30 seconds.",
        backup: ["You can't cut down even when you really try", "Scrolling is how you avoid feeling bad, every time", "It's costing you sleep, work, school or people"],
        who: "Your doctor/GP or a counsellor. Getting stuck on screens is common and they've seen it plenty.",
      },
      {
        id: "fake-online", name: "Is anyone online even real?",
        read: "A lot of what you see online isn't people. Bot farms run thousands of fake accounts that post, like and argue to make you angry, scared or sure that \"everyone\" thinks something. And AI is making the fakes harder to spot every year. The internet isn't a safe town square anymore. Play it smart.",
        moves: [
          "Assume a stranger's account could be fake. Real name and face prove nothing now. Fakes copy both.",
          "If a post makes you furious fast, that's the trap. Rage is what bot farms are built to farm. Pause before you reply or share.",
          "Red flags: brand new account, no real friends, posts all day, only talks about one topic, same lines as other accounts.",
          "Don't let comment sections tell you what \"everyone\" thinks. Ask the real people in your life instead.",
          "Never send money, photos or personal details to someone you've only met online. Scammers use fake profiles too.",
        ],
        quickWin: "Next time a post gets you heated, close the app and walk away for 10 minutes before doing anything.",
        backup: ["Someone online is threatening you or asking for money or photos", "You've been scammed or blackmailed (tell the police; it's a crime against you)", "Online arguments are eating your mood every day"],
        who: "The police for threats, scams or blackmail. A trusted mate, family member or your doctor/GP for the rest.",
      },
      {
        id: "touch-grass", name: "Too online, need something real",
        read: "Your brain was built for real air, real hands and real people. Sometimes the best move is simple: log off and go touch grass.",
        moves: [
          "Go outside today. Walk, run, sit in a park. No phone in your hand. Daylight resets your head.",
          "Start a hobby you do with your hands: gym, cooking, fixing things, an instrument, a sport. Something you can get better at.",
          "Swap one hour of scrolling a week for something that helps others: volunteer, coach a kids' team, help a neighbour, give blood.",
          "Build something that lasts: a skill, a project, a garden. Likes vanish in a day. This stays.",
          "See people in person. One real coffee with a mate beats a thousand comments.",
        ],
        quickWin: "Put your phone in another room and go outside for 20 minutes.",
        backup: ["Nothing offline feels worth doing for weeks (see Low mood)", "You've pulled away from everyone in real life"],
        who: "Your doctor/GP if it's linked to low mood. Check out The Skills page for hobby ideas.",
      },
    ],
  },
];

// Backup: crisis lines by region. Check these numbers before changing them.
window.BACKUP = [
  {
    region: "UK",
    emergency: "999",
    lines: [
      { name: "Samaritans", how: "Call 116 123", note: "Free, 24/7", href: "tel:116123" },
      { name: "Shout", how: "Text SHOUT to 85258", note: "24/7 text support", href: "sms:85258?&body=SHOUT" },
      { name: "CALM", how: "Call 0800 58 58 58", note: "Free, 5pm–midnight every day", href: "tel:0800585858" },
      { name: "Andy's Man Club", how: "andysmanclub.co.uk", note: "Free men's talking groups, Mondays 7pm (18+)", href: "https://www.andysmanclub.co.uk" },
    ],
  },
  {
    region: "USA",
    emergency: "911",
    lines: [
      { name: "988 Suicide & Crisis Lifeline", how: "Call or text 988", note: "24/7. Veterans can choose the Veterans option", href: "tel:988" },
      { name: "988 chat", how: "988lifeline.org/chat", note: "24/7 online chat", href: "https://988lifeline.org/chat" },
    ],
  },
  {
    region: "Germany",
    emergency: "112",
    lines: [
      { name: "TelefonSeelsorge", how: "Call 0800 111 0 111 or 0800 111 0 222", note: "Around the clock, anonymous", href: "tel:08001110111" },
      { name: "Nummer gegen Kummer (under 18s)", how: "Call 116 111", note: "Free, Mon–Sat 2–8pm; chat and email too", href: "tel:116111" },
    ],
  },
  {
    region: "Anywhere else",
    emergency: "your local emergency number",
    lines: [
      { name: "Find A Helpline", how: "findahelpline.com", note: "Free, confidential lines in your country", href: "https://findahelpline.com" },
    ],
  },
];
