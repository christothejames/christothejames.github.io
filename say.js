// Have your say (owner, 15 Nov 2026): Reddit-style up/down votes and Follow.
// Shared by home.html (every poster), web.html (the bubble card), profile.html and opinion.html.
//
// Votes count only when signed in with Google (owner, 15 Nov 2026: like Reddit, to stop spam votes): one vote per
// account per man, sent to the private admin site (POST /public/vote; it keeps a scrambled account code, never a
// name or email). Totals for the scores and the Public Opinion page come from GET /public/opinion.
// Follow needs no account and stays in this browser (localStorage `say`), and on the account once there is one.
// Accounts (owner, 15 Nov 2026, light and private for now): after the first Google sign-in a "Pick a username" sheet
// offers a free profile (POST /public/account); it keeps the username and followed men, so they follow the person
// to any device. "Maybe later" stops the sheet coming back (localStorage `say-skip-name`). Profile page: me.html.
// Staying logged in: the Google token is swapped for a 30-day session code (localStorage `say-session`), sent as
// `session` on every call, so a new page doesn't need Google again. Log out deletes it on the server too.
// This file also runs Google sign-in for any page that loads it (home.html's request card uses SAY.auth).
//
//   SAY.strip(id, name, solo)  -> HTML for the vote + follow strip under a card
//   SAY.vote(id), SAY.votes(), SAY.score(id), SAY.follows(id), SAY.following()
//   SAY.account: get(), ask('create' | 'rename'), remove()
//   SAY.opinion()              -> Promise of {updated, voters, men: {id: [up, down, upWeek, downWeek]}} (or null)
//   SAY.onChange(fn)           -> fn(kind, id) after a vote, follow, account or sign-in change
//   SAY.auth: token(), load(), signOut(), ask(), renderButton(el), onChange(fn)
(() => {
  // Public, not a secret; the same value as GOOGLE_CLIENT_ID in skills.html and the admin repo. Empty = no voting.
  const GOOGLE_CLIENT_ID = '958568316588-du1d98s3ghbpiudet67kvr5s0140stna.apps.googleusercontent.com';
  const API = 'https://humbored-admin.pages.dev/public';
  const KEY = 'say';
  const SIGNED = 'say-signin'; // "1" = signed in here before, so Google can sign them back in quietly
  // The login session code (owner, 15 Nov 2026: "it keeps logging me out"): after a Google sign-in the server gives
  // this browser a random code that keeps it logged in on every page for 30 days. Log out deletes it here and there.
  const SESSION = 'say-session';

  let s = {};
  try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch {}
  // votes / account: this browser's copy of the logged-in account's votes and profile (the server has the real ones),
  // so the page shows them straight away while it checks in.
  // (My order was dropped on 15 Nov 2026; any saved `order` from before is simply ignored and dropped on the next save.)
  s = { votes: s.votes || {}, follow: s.follow || [], account: s.account || null };
  const store = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
  const flag = on => { try { on ? localStorage.setItem(SIGNED, '1') : localStorage.removeItem(SIGNED); } catch {} };
  const flagged = () => { try { return !!localStorage.getItem(SIGNED); } catch { return false; } };
  const savedSession = () => { try { return localStorage.getItem(SESSION); } catch { return null; } };
  const keepSession = id => { try { id ? localStorage.setItem(SESSION, id) : localStorage.removeItem(SESSION); } catch {} };
  if (!savedSession() && (Object.keys(s.votes).length || s.account)) { s.votes = {}; s.account = null; store(); }

  const fns = [];
  const changed = (kind, id) => fns.forEach(f => f(kind, id));
  const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const UP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3.5 12.5H8.5V21h7v-8.5h5Z"/></svg>';
  const DOWN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21 3.5 11.5H8.5V3h7v8.5h5Z"/></svg>';

  const css = document.createElement('style');
  css.textContent = `
  /* The strip is a lit control tray under the card (owner, 17 Nov 2026: the old navy strip melted into the page, so
     people didn't see they could vote): brighter blue, a cyan outline and a soft glow, and the arrows as round buttons */
  .say-strip { display: flex; align-items: stretch; background: linear-gradient(to bottom, #1a3f78, #11295a);
    border: 2px solid #3ef2ff73; border-top: 0; border-radius: 0 0 10px 10px; overflow: hidden;
    box-shadow: inset 0 1px 0 #3ef2ff4d, 0 0 14px #3ef2ff26; font-family: 'Righteous', system-ui, sans-serif; }
  .say-strip button { min-height: 44px; border: 0; background: none; color: #a9bfdc; font: inherit; font-size: 13px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 5px; padding: 4px 2px; }
  .say-strip button:focus-visible { outline: 3px solid #ffe66d; outline-offset: -3px; }
  .say-vote { flex: 1.4; display: flex; align-items: center; justify-content: center; gap: 4px; }
  /* Arrows and "Vote" in the site's neon cyan (owner, 16 Nov 2026: same blue as the buttons), each arrow in a round
     tinted chip so it reads as a button; green / red still show on hover and once he has voted */
  /* The chip is painted (a 36px disc and ring), so the button keeps its full 40 x 44 tap area */
  .say-vote button { --fill: #3ef2ff1f; --ring: #3ef2ff80; --r: 18px; flex: 0 0 40px; padding: 0; border-radius: 10px; color: #3ef2ff;
    background: radial-gradient(circle, var(--fill) 0 calc(var(--r) - 1.5px), var(--ring) calc(var(--r) - 1.5px) var(--r), transparent calc(var(--r) + .5px)); }
  .say-vote svg { width: 21px; height: 21px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linejoin: round; }
  .say-vote .up:hover, .say-vote .up[aria-pressed="true"] { color: #34e07a; --fill: #34e07a2e; --ring: #34e07a; }
  .say-vote .down:hover, .say-vote .down[aria-pressed="true"] { color: #ff5252; --fill: #ff3b3b2e; --ring: #ff5252; }
  .say-vote [aria-pressed="true"] svg { fill: currentColor; }
  .say-n { min-width: 34px; text-align: center; font-family: 'Bungee', sans-serif; font-size: 13px; color: #fff; }
  .say-n.none { color: #3ef2ff; }
  .say-n.up { color: #34e07a; } .say-n.down { color: #ff3b3b; }
  .say-strip .say-follow { flex: 1; border-left: 1px solid #3ef2ff40; color: #9fd6ff; }
  .say-strip .say-follow:hover { background: #ffffff14; }
  .say-strip .say-follow[aria-pressed="true"] { background: #ffe66d; color: #050b1a; }
  .say-follow .ico { font-size: 17px; line-height: 1; }
  .say-strip.solo { border-top: 2px solid #3ef2ff73; border-radius: 10px; }
  @media (max-width: 520px) {
    .say-me .me-txt { display: none; }
    /* Phones (owner, 17 Nov 2026: the left circle was cut off and the Follow divider ran through the down arrow, as
       the arrows filled their whole half of a narrow card): under a card Follow is a fixed star button, so the vote
       half gets the rest, with smaller circles and a little room at each edge */
    .say-vote { gap: 3px; padding: 0 4px; min-width: 0; }
    .say-vote button { flex-basis: 34px; --r: 15px; }
    .say-vote svg { width: 18px; height: 18px; }
    .say-n { min-width: 26px; }
    .say-strip:not(.solo) .say-follow { flex: 0 0 44px; }
    .say-strip:not(.solo) .say-follow .lbl { display: none; }
  }
  .say-sheet { max-width: 420px; width: calc(100% - 32px); padding: 22px 20px 18px; border: 2px solid #3ef2ff; border-radius: 16px;
    background: #0c1a36; color: #eef4ff; font-family: 'Righteous', system-ui, sans-serif; box-shadow: 0 0 30px #3ef2ff44; }
  .say-sheet::backdrop { background: #050b1acc; }
  .say-sheet h2 { margin: 0 0 8px; font-family: 'Bungee', sans-serif; font-weight: 400; font-size: 20px; color: #3ef2ff; }
  .say-sheet p { margin: 0 0 14px; font-size: 15px; line-height: 1.45; color: #cfe0f7; }
  .say-sheet small { display: block; margin-top: 14px; font-size: 13px; color: #a9bfdc; line-height: 1.4; }
  .say-sheet a { color: #7cc4ff; }
  .say-sheet .gbtn { min-height: 44px; }
  .say-sheet .close { margin-top: 12px; font: inherit; font-size: 14px; background: none; border: 0; padding: 4px 0; color: #7cc4ff; text-decoration: underline; cursor: pointer; }
  .say-sheet .msg { color: #ffb3b3; }
  .say-sheet .close:focus-visible { outline: 3px solid #ffe66d; outline-offset: 2px; }
  .say-toast { position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 50; max-width: calc(100% - 32px);
    padding: 10px 16px; border-radius: 12px; background: #2a0f14; border: 1px solid #ff3b3b; color: #ffd2d2; font-family: 'Righteous', system-ui, sans-serif; font-size: 14px; }
  /* account corner (top right): Log in / Sign up, or the avatar menu */
  .say-corner { margin-left: auto; display: flex; align-items: center; gap: 8px; flex: none; font-family: 'Righteous', system-ui, sans-serif; }
  .say-corner .cbtn { min-height: 36px; padding: 0 14px; border-radius: 999px; font-family: 'Bungee', sans-serif; font-size: 12px; cursor: pointer; white-space: nowrap; }
  .say-corner .login { border: 0; background: none; color: #3ef2ff; box-shadow: inset 0 0 0 1.5px #3ef2ff; }
  .say-corner .signup { border: 0; background: #3ef2ff; color: #050b1a; box-shadow: 0 0 12px #3ef2ff55; }
  .say-corner .cbtn:hover { filter: brightness(1.12); }
  .say-corner .cbtn:focus-visible { outline: 3px solid #ffe66d; outline-offset: 2px; }
  /* Phones: just Log in, like Reddit's mobile site (Sign up is the same Google sign-in, and a first sign-in is offered a
     username anyway). Both didn't fit next to wide top-bar buttons such as Mental Health's Urgent Help. */
  @media (max-width: 480px) { .say-corner .signup { display: none; } .say-corner .cbtn { padding: 0 12px; font-size: 11px; } }
  .say-me { position: relative; }
  .say-me summary { list-style: none; cursor: pointer; white-space: nowrap; min-height: 40px; display: flex; align-items: center; gap: 8px; padding: 0 8px 0 4px;
    border-radius: 999px; color: #eef4ff; font-family: 'Bungee', sans-serif; font-size: 12px; }
  .say-me summary:hover { background: #ffffff10; }
  .say-me summary::-webkit-details-marker { display: none; }
  .say-me summary::after { content: '▾'; color: #7cc4ff; }
  .say-me .av { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; background: #ffe66d; color: #050b1a;
    font-size: 15px; box-shadow: 0 0 10px #ffe66d55; }
  .say-me .me-txt { max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
  .say-me summary:focus-visible { outline: 3px solid #ffe66d; outline-offset: 2px; }
  .say-me > div { position: absolute; right: 0; top: calc(100% + 6px); z-index: 30; display: grid; gap: 4px; padding: 8px; min-width: 170px;
    background: #0c1a36; border: 1.5px solid #3ef2ff66; border-radius: 12px; box-shadow: 0 10px 30px #000a; }
  .say-me > div button, .say-me > div a { margin: 0; padding: 8px 10px; text-align: left; border: 0; border-radius: 8px; background: none;
    text-decoration: none; color: #eef4ff; font-family: 'Righteous', system-ui, sans-serif; font-size: 13px; cursor: pointer; }
  .say-me > div button:focus-visible, .say-me > div a:focus-visible { outline: 3px solid #ffe66d; outline-offset: -3px; }
  .say-me > div button:hover, .say-me > div a:hover { background: #ffffff12; }
  .say-me > div a { color: #3ef2ff; }
  .say-sheet label { display: block; margin-bottom: 6px; font-family: 'Bungee', sans-serif; font-size: 13px; color: #7cc4ff; }
  .say-sheet input { width: 100%; min-height: 46px; padding: 0 14px; border-radius: 12px; border: 2px solid #3ef2ff66; background: #050b1a;
    color: #fff; font: inherit; font-size: 17px; }
  .say-sheet input:focus { outline: none; border-color: #3ef2ff; box-shadow: 0 0 12px #3ef2ff55; }
  .say-sheet .rule { margin-top: 6px; }
  .say-sheet .msg:empty { display: none; }
  .say-sheet .msg { margin: 10px 0 0; }
  .say-sheet .go { margin-top: 14px; min-height: 44px; padding: 0 20px; border: 0; border-radius: 999px; background: #3ef2ff; color: #050b1a;
    font-family: 'Bungee', sans-serif; font-size: 14px; cursor: pointer; }
  .say-sheet .go:disabled { opacity: .6; }
  .say-sheet .go:focus-visible { outline: 3px solid #ffe66d; outline-offset: 2px; }
  .say-sheet form + .close { display: block; }`;
  document.head.appendChild(css);

  // ---------- Google sign-in (token kept in memory only; it lasts about an hour) ----------
  let token = null, gis;
  const authFns = [];
  const authChanged = () => { authFns.forEach(f => f()); paintAccounts(); changed('auth'); };
  function load() {
    if (!GOOGLE_CLIENT_ID) return Promise.reject(new Error('off'));
    gis ??= new Promise((ok, fail) => {
      const el = document.createElement('script');
      el.src = 'https://accounts.google.com/gsi/client?hl=en'; // English for now (owner, 27 Oct 2026)
      el.async = true; el.onload = ok; el.onerror = fail;
      document.head.appendChild(el);
    }).then(() => google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, auto_select: true, callback: r => signedIn(r.credential) }));
    return gis;
  }
  const renderButton = (el, text = 'signin_with') => load().then(() => google.accounts.id.renderButton(el,
    { theme: 'filled_black', size: 'large', shape: 'pill', text, locale: 'en' }));

  // Google said yes: swap its one-hour token for our 30-day session code, then load the account.
  async function signedIn(googleToken) {
    flag(true);
    const p = pending; // closing the sheet clears it, so keep the vote they were casting
    const signup = wantsName; // pressed "Sign up": offer the username even if they said "Maybe later" before
    pending = null;
    wantsName = false;
    sheet?.close();
    try {
      token = null;
      const d = await call({ action: 'get', credential: googleToken }, 'account');
      token = d.session;
      keepSession(token);
      authChanged();
      setVotes(d.votes);
      setAccount(d.account, true, signup);
      if (signup && d.account) toast(`Welcome back, ${d.account.username}. You already have a profile.`);
    } catch (e) {
      toast(e.signin ? 'Google sign-in didn’t go through. Try again.' : e.message);
      return;
    }
    if (p?.id) castVote(p.id, p.act);
  }
  // A page opened while logged in: show the saved login at once, then check the code is still good.
  async function resume() {
    token = savedSession();
    if (!token) return;
    account = s.account;
    authChanged();
    try {
      const d = await call({ action: 'get' }, 'account');
      setVotes(d.votes);
      setAccount(d.account);
    } catch (e) {
      if (!e.signin) return; // offline or server trouble: stay logged in, try again next page
      keepSession(null);
      account = null;
      s.account = null;
      setVotes({});
    }
  }
  function signOut() {
    if (token) fetch(API + '/account', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout', session: token }) }).catch(() => {});
    token = null;
    account = null;
    s.account = null;
    keepSession(null);
    flag(false);
    window.google?.accounts?.id?.disableAutoSelect();
    setVotes({});
    authChanged();
  }

  // ---------- light accounts (owner, 15 Nov 2026): a username + the men you follow, on top of Google sign-in ----------
  // Private for now: only the owner sees their profile (me.html). Voting doesn't need one.
  let account = null;
  const SKIP = 'say-skip-name'; // "Maybe later" on the username sheet: don't ask again on every sign-in
  const skipped = () => { try { return !!localStorage.getItem(SKIP); } catch { return false; } };

  function setAccount(a, fromSignIn, signup) {
    account = a || null;
    s.account = account;
    store();
    if (account) {
      // Follows from this device and the account come together; the account then keeps the full list.
      const merged = [...new Set([...s.follow, ...(account.follows || [])])];
      const changedHere = merged.length !== s.follow.length;
      s.follow = merged;
      store();
      if (changedHere) { document.querySelectorAll('.say-strip').forEach(paint); changed('follow'); }
      if (merged.length !== (account.follows || []).length) syncFollows();
    } else if (fromSignIn && (signup || !skipped())) {
      askName('create');
    }
    paintAccounts();
    changed('account');
  }

  let followTimer;
  function syncFollows() {
    if (!token || !account) return;
    clearTimeout(followTimer);
    followTimer = setTimeout(() => {
      call({ action: 'follows', follows: s.follow }, 'account')
        .then(d => { account = d.account; s.account = account; store(); }, e => { if (!e.signin) toast(e.message); });
    }, 800);
  }

  async function deleteAccount() {
    if (!token || !account) return;
    if (!confirm('Delete your account? Your username, the men you follow (on our server) and all your votes go, and it can’t be undone.')) return;
    try {
      await call({ action: 'delete' }, 'account');
      try { localStorage.setItem(SKIP, '1'); } catch {}
      // The server ended this login too, so the browser logs out.
      token = null;
      keepSession(null);
      account = null;
      s.account = null;
      flag(false);
      window.google?.accounts?.id?.disableAutoSelect();
      setVotes({});
      authChanged();
      changed('account');
      toast('Your account is deleted.');
    } catch (e) { if (!e.signin) toast(e.message); }
  }

  // The "Pick a username" sheet: create (after first sign-in) or rename (from the profile page).
  let nameSheet;
  function askName(mode = 'create') {
    if (!token) return ask();
    if (!nameSheet) {
      nameSheet = document.createElement('dialog');
      nameSheet.className = 'say-sheet';
      nameSheet.setAttribute('aria-labelledby', 'say-name-h');
      nameSheet.innerHTML = `<h2 id="say-name-h"></h2>
        <p class="lead"></p>
        <form novalidate>
          <label for="say-uname">Username</label>
          <input id="say-uname" name="username" maxlength="20" autocomplete="username" autocapitalize="off" spellcheck="false">
          <small class="rule">3 to 20 letters, numbers or _. Only you can see it for now.</small>
          <p class="msg" role="alert"></p>
          <button type="submit" class="go"></button>
        </form>
        <button type="button" class="close">Maybe later</button>`;
      nameSheet.querySelector('.close').onclick = () => {
        if (nameSheet.dataset.mode === 'create') { try { localStorage.setItem(SKIP, '1'); } catch {} }
        nameSheet.close();
      };
      nameSheet.addEventListener('click', e => { if (e.target === nameSheet) nameSheet.close(); });
      nameSheet.querySelector('form').addEventListener('submit', async e => {
        e.preventDefault();
        const input = nameSheet.querySelector('input'), msg = nameSheet.querySelector('.msg'), btn = nameSheet.querySelector('.go');
        const username = input.value.trim();
        if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) { msg.textContent = 'Use 3 to 20 letters, numbers or _.'; input.focus(); return; }
        btn.disabled = true;
        msg.textContent = '';
        try {
          const d = await call({ action: nameSheet.dataset.mode, username }, 'account');
          nameSheet.close();
          setAccount(d.account);
          toast(nameSheet.dataset.mode === 'create' ? `Welcome, ${d.account.username}. Your profile is ready.` : `You're now ${d.account.username}.`);
        } catch (err) {
          msg.textContent = err.signin ? 'Your sign-in ran out. Sign in again.' : err.message;
          input.focus();
        }
        btn.disabled = false;
      });
      document.body.appendChild(nameSheet);
    }
    const create = mode === 'create';
    nameSheet.dataset.mode = create ? 'create' : 'rename';
    nameSheet.querySelector('h2').textContent = create ? 'PICK A USERNAME' : 'CHANGE YOUR USERNAME';
    nameSheet.querySelector('.lead').textContent = create
      ? 'Make a free profile: the men you follow and your votes, on any phone or computer. Voting works without one.'
      : 'Pick a new username.';
    nameSheet.querySelector('.go').textContent = create ? 'Create my profile' : 'Save username';
    nameSheet.querySelector('.close').textContent = create ? 'Maybe later' : 'Cancel';
    nameSheet.querySelector('.msg').textContent = '';
    const input = nameSheet.querySelector('input');
    input.value = create ? '' : account?.username || '';
    nameSheet.showModal();
    input.focus();
  }

  async function call(body, path = 'vote') {
    const r = await fetch(API + '/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...(token && { session: token }), ...body }) });
    const d = await r.json().catch(() => ({}));
    if (d.signin) {
      // The login code ran out (30 days) or was logged out elsewhere.
      if (token) { token = null; keepSession(null); account = null; s.account = null; store(); authChanged(); }
      throw Object.assign(new Error('signin'), { signin: true });
    }
    if (!r.ok) throw new Error(d.error || 'Couldn’t reach our server. Try again in a bit.');
    return d;
  }

  // ---------- the sign-in sheet: "Sign in to vote" (an arrow), "Log in" or "Sign up" (the corner buttons) ----------
  // Log in and Sign up are both Google sign-in; Sign up then always offers the username (a free profile).
  let sheet, pending = null, wantsName = false;
  const SHEET = {
    vote: ['SIGN IN TO VOTE', 'One vote per Google account keeps the counts honest. Following works without signing in.'],
    login: ['LOG IN', 'Log in with your Google account to vote, and to see your profile on any phone or computer.'],
    signup: ['SIGN UP', 'It’s free: sign in with Google, then pick a username for your profile. Vote on any man, and keep the men you follow on any device.'],
  };
  function ask(p, kind = 'vote') {
    pending = p || null;
    if (!GOOGLE_CLIENT_ID) return;
    if (!sheet) {
      sheet = document.createElement('dialog');
      sheet.className = 'say-sheet';
      sheet.setAttribute('aria-labelledby', 'say-sheet-h');
      sheet.innerHTML = `<h2 id="say-sheet-h"></h2>
        <p class="lead"></p>
        <div class="gbtn"></div>
        <small>We keep a scrambled code, never your name or email. <a href="privacy.html">Privacy</a></small>
        <button type="button" class="close">Not now</button>`;
      sheet.querySelector('.close').onclick = () => sheet.close();
      sheet.addEventListener('close', () => { pending = null; wantsName = false; });
      sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
      document.body.appendChild(sheet);
    }
    wantsName = kind === 'signup';
    const [title, lead] = SHEET[kind] || SHEET.vote;
    sheet.querySelector('h2').textContent = title;
    sheet.querySelector('.lead').textContent = lead;
    const g = sheet.querySelector('.gbtn');
    g.innerHTML = '';
    renderButton(g, kind === 'signup' ? 'signup_with' : 'signin_with').catch(() => { g.innerHTML = '<p class="msg">Couldn’t load Google sign-in. Try again in a bit.</p>'; });
    sheet.showModal();
  }

  let toastTimer;
  function toast(msg) {
    let t = document.querySelector('.say-toast');
    if (!t) { t = document.createElement('div'); t.className = 'say-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 4000);
  }

  // ---------- totals ----------
  // Scores = (up − down) from /public/opinion, moved by any vote changed since the account's votes were last loaded
  // (the totals are rebuilt every couple of minutes, so they already include earlier votes).
  let base = {};
  let counted = { ...s.votes };
  let opinionP;
  const opinion = () => (opinionP ??= fetch(API + '/opinion').then(r => (r.ok ? r.json() : null)).catch(() => null)
    .then(d => { base = d?.men || {}; document.querySelectorAll('.say-strip').forEach(paint); return d; }));
  const val = v => (v === 'up' ? 1 : v === 'down' ? -1 : 0);
  const score = id => {
    const b = base[id];
    if (!b && !s.votes[id]) return null;
    return (b ? b[0] - b[1] : 0) - val(counted[id]) + val(s.votes[id]);
  };
  // Up and down votes (all time), with this visitor's latest vote. /public/opinion gives [up, down, weekUp, weekDown].
  const counts = id => {
    const b = base[id] || [0, 0], was = counted[id], now = s.votes[id];
    return {
      up: b[0] - (was === 'up') + (now === 'up'),
      down: b[1] - (was === 'down') + (now === 'down'),
    };
  };

  // ---------- public opinion boards (owner, 16 Nov 2026) ----------
  // With the boards' Public opinion switch on, voters decide which board a man sits on; Our ranking never changes.
  // A man needs MIN_VOTES votes before voters can move him (so a handful of votes can't); until then he stays on our
  // board. Then the share who like him picks the board, in the same bands as the HP bar on opinion.html:
  // UP_AT% or more = Real Men, DOWN_AT% or less = Out of Service, in between = Coin Toss.
  const OPINION_BOARDS = { MIN_VOTES: 10, UP_AT: 66, DOWN_AT: 33 };
  const board = (id, ours) => {
    const c = counts(id), n = c.up + c.down;
    if (n < OPINION_BOARDS.MIN_VOTES) return ours;
    const pct = (c.up / n) * 100;
    return pct >= OPINION_BOARDS.UP_AT ? 'good' : pct <= OPINION_BOARDS.DOWN_AT ? 'bad' : 'mid';
  };
  const fmt = n => (Math.abs(n) >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n));

  function setVotes(v) {
    s.votes = v || {};
    counted = { ...s.votes };
    store();
    document.querySelectorAll('.say-strip').forEach(paint);
    changed('vote');
  }

  async function castVote(id, act) {
    const before = s.votes[id];
    const next = before === act ? null : act;
    next ? (s.votes[id] = next) : delete s.votes[id];
    store();
    repaint(id);
    try {
      const d = await call({ id, vote: next });
      s.votes = d.votes || {};
      store();
      repaint(id);
      changed('vote', id);
    } catch (e) {
      before ? (s.votes[id] = before) : delete s.votes[id];
      store();
      repaint(id);
      if (e.signin) ask({ id, act }); else toast(e.message);
    }
  }

  // ---------- painting ----------
  function paint(el) {
    const id = el.dataset.id, v = s.votes[id], f = s.follow.includes(id), n = score(id);
    el.querySelector('.up').setAttribute('aria-pressed', v === 'up');
    el.querySelector('.down').setAttribute('aria-pressed', v === 'down');
    const out = el.querySelector('.say-n');
    out.className = 'say-n' + (v ? ' ' + v : n === null ? ' none' : '');
    out.textContent = n === null ? 'Vote' : fmt(n);
    out.setAttribute('aria-label', n === null ? 'No votes yet' : `Score ${n}`);
    const fb = el.querySelector('.say-follow');
    fb.setAttribute('aria-pressed', f);
    fb.querySelector('.ico').textContent = f ? '★' : '☆';
    fb.querySelector('.lbl').textContent = f ? 'Following' : 'Follow';
  }
  const repaint = id => document.querySelectorAll('.say-strip').forEach(el => { if (el.dataset.id === id) paint(el); });

  // The account corner, top right of every page (owner, 15 Nov 2026: "like reddit"): <span data-say-account></span>.
  // Signed out: Log in and Sign up (both Google sign-in; Sign up then offers a username). Signed in: an avatar with the
  // username and a menu: Your profile (or Create your profile), Log out. (Owner, 15 Nov 2026: "Delete my votes" was
  // removed from the menu; a vote is taken back by pressing its arrow again, and Delete my account removes them all.)
  // Pages with the shared top bar (.topnav .wrap) get it added automatically (mountCorner); others place the span.
  function paintAccounts() {
    document.querySelectorAll('[data-say-account]').forEach(el => {
      el.classList.add('say-corner');
      if (!GOOGLE_CLIENT_ID) { el.hidden = true; return; }
      if (!token) {
        el.innerHTML = '<button type="button" class="cbtn login" data-say-do="login">Log in</button>'
          + '<button type="button" class="cbtn signup" data-say-do="signup">Sign up</button>';
        return;
      }
      const who = account ? esc(account.username) : 'Signed in';
      const initial = account ? esc(account.username[0].toUpperCase()) : '✓';
      const profile = account
        ? '<a href="me.html">Your profile</a>'
        : '<button type="button" data-say-do="name">Create your profile</button>';
      el.innerHTML = `<details class="say-me"><summary aria-label="Account menu: ${who}"><span class="av" aria-hidden="true">${initial}</span><span class="me-txt">${who}</span></summary>`
        + `<div>${profile}<button type="button" data-say-do="out">Log out</button></div></details>`;
    });
  }
  function mountCorner() {
    if (document.querySelector('[data-say-account]')) return;
    const bar = document.querySelector('.topnav .wrap');
    if (!bar) return;
    const el = document.createElement('span');
    el.dataset.sayAccount = '';
    bar.appendChild(el);
  }
  // A click anywhere else closes the account menu.
  document.addEventListener('click', e => {
    document.querySelectorAll('.say-me[open]').forEach(d => { if (!d.contains(e.target)) d.open = false; });
  });

  function strip(id, name, solo) {
    const who = esc(name || 'him');
    return `<div class="say-strip${solo ? ' solo' : ''}" data-id="${esc(id)}">
      <div class="say-vote">
        <button type="button" class="up" data-say="up" aria-pressed="false" aria-label="Upvote ${who}: I like him" title="I like him">${UP}</button>
        <span class="say-n none">Vote</span>
        <button type="button" class="down" data-say="down" aria-pressed="false" aria-label="Downvote ${who}: I don't like him" title="I don't like him">${DOWN}</button>
      </div>
      <button type="button" class="say-follow" data-say="follow" aria-pressed="false" aria-label="Follow ${who}"><span class="ico">☆</span><span class="lbl">Follow</span></button>
    </div>`;
  }

  // Strips are painted as they appear (pages render cards at different times); the first one fetches the totals.
  const seen = n => {
    if (n.nodeType !== 1) return;
    const strips = n.matches('.say-strip') ? [n] : [...n.querySelectorAll('.say-strip')];
    if (strips.length) { strips.forEach(paint); opinion(); }
    if (n.matches('[data-say-account]') || n.querySelector('[data-say-account]')) paintAccounts();
  };
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(seen))).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => { mountCorner(); seen(document.body); paintAccounts(); });

  document.addEventListener('click', e => {
    const acc = e.target.closest('[data-say-do]');
    if (acc) {
      const d = acc.dataset.sayDo;
      if (d === 'in' || d === 'login') ask(null, 'login');
      else if (d === 'signup') ask(null, 'signup');
      else if (d === 'out') signOut();
      else if (d === 'name') askName('create');
      acc.closest('.say-me')?.removeAttribute('open');
      return;
    }
    const b = e.target.closest('[data-say]');
    if (!b) return;
    e.preventDefault();
    const id = b.closest('.say-strip').dataset.id, act = b.dataset.say;
    if (act === 'follow') {
      const i = s.follow.indexOf(id);
      i < 0 ? s.follow.push(id) : s.follow.splice(i, 1);
      store();
      repaint(id);
      changed('follow', id);
      syncFollows();
    } else if (!token) {
      ask({ id, act });
    } else {
      castVote(id, act);
    }
  });

  // Logged in here before: pick the login back up from the saved session code. Without one (an older login, from
  // before session codes), let Google sign them back in quietly.
  if (GOOGLE_CLIENT_ID && savedSession()) resume();
  else if (GOOGLE_CLIENT_ID && flagged()) load().then(() => google.accounts.id.prompt(), () => {});

  window.SAY = {
    strip,
    vote: id => s.votes[id],
    follows: id => s.follow.includes(id),
    following: () => s.follow.slice(),
    votes: () => ({ ...s.votes }),
    score: id => score(id), // likes minus dislikes (with this visitor's latest vote), or null if nobody has voted
    counts: id => counts(id), // { up, down }, all time, with this visitor's latest vote
    board: (id, ours) => board(id, ours), // 'good' | 'mid' | 'bad' by public opinion; `ours` until he has enough votes
    OPINION_BOARDS,
    opinion,
    onChange: fn => fns.push(fn),
    account: { get: () => account, ask: mode => askName(mode), remove: deleteAccount },
    auth: { token: () => token, load, signOut, ask: () => ask(), renderButton, onChange: fn => authFns.push(fn), enabled: !!GOOGLE_CLIENT_ID },
  };
})();
