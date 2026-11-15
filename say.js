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
// This file also runs Google sign-in for any page that loads it (home.html's request card uses SAY.auth).
//
//   SAY.strip(id, name, solo)  -> HTML for the vote + follow strip under a card
//   SAY.vote(id), SAY.votes(), SAY.follows(id), SAY.following()
//   SAY.account: get(), ask('create' | 'rename'), remove()
//   SAY.opinion()              -> Promise of {updated, voters, men: {id: [up, down, upWeek, downWeek]}} (or null)
//   SAY.onChange(fn)           -> fn(kind, id) after a vote, follow, account or sign-in change
//   SAY.auth: token(), load(), signOut(), erase(), ask(), renderButton(el), onChange(fn)
(() => {
  // Public, not a secret; the same value as GOOGLE_CLIENT_ID in skills.html and the admin repo. Empty = no voting.
  const GOOGLE_CLIENT_ID = '958568316588-du1d98s3ghbpiudet67kvr5s0140stna.apps.googleusercontent.com';
  const API = 'https://humbored-admin.pages.dev/public';
  const KEY = 'say';
  const SIGNED = 'say-signin'; // "1" = signed in here before, so Google can sign them back in quietly

  let s = {};
  try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch {}
  // votes: this browser's copy of the signed-in account's votes (the server has the real ones)
  // (My order was dropped on 15 Nov 2026; any saved `order` from before is simply ignored and dropped on the next save.)
  s = { votes: s.votes || {}, follow: s.follow || [] };
  const store = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
  const flag = on => { try { on ? localStorage.setItem(SIGNED, '1') : localStorage.removeItem(SIGNED); } catch {} };
  const flagged = () => { try { return !!localStorage.getItem(SIGNED); } catch { return false; } };
  if (!flagged() && Object.keys(s.votes).length) { s.votes = {}; store(); }

  const fns = [];
  const changed = (kind, id) => fns.forEach(f => f(kind, id));
  const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const UP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3.5 12.5H8.5V21h7v-8.5h5Z"/></svg>';
  const DOWN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21 3.5 11.5H8.5V3h7v8.5h5Z"/></svg>';

  const css = document.createElement('style');
  css.textContent = `
  .say-strip { display: flex; align-items: stretch; background: #0c1a36; border: 2px solid #ffffff1f; border-top: 0;
    border-radius: 0 0 10px 10px; overflow: hidden; font-family: 'Righteous', system-ui, sans-serif; }
  .say-strip button { min-height: 44px; border: 0; background: none; color: #a9bfdc; font: inherit; font-size: 13px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 5px; padding: 4px 2px; }
  .say-strip button:focus-visible { outline: 3px solid #ffe66d; outline-offset: -3px; }
  .say-vote { flex: 1.4; display: flex; align-items: center; justify-content: center; gap: 2px; }
  .say-vote button { flex: 0 0 40px; border-radius: 8px; }
  .say-vote svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linejoin: round; }
  .say-vote .up:hover { color: #34e07a; background: #34e07a1a; }
  .say-vote .down:hover { color: #ff3b3b; background: #ff3b3b1a; }
  .say-vote .up[aria-pressed="true"] { color: #34e07a; }
  .say-vote .down[aria-pressed="true"] { color: #ff3b3b; }
  .say-vote [aria-pressed="true"] svg { fill: currentColor; }
  .say-n { min-width: 34px; text-align: center; font-family: 'Bungee', sans-serif; font-size: 12px; color: #eef4ff; }
  .say-n.none { color: #a9bfdc; }
  .say-n.up { color: #34e07a; } .say-n.down { color: #ff3b3b; }
  .say-strip .say-follow { flex: 1; border-left: 1px solid #ffffff1f; color: #7cc4ff; }
  .say-strip .say-follow:hover { background: #ffffff0d; }
  .say-strip .say-follow[aria-pressed="true"] { background: #ffe66d; color: #050b1a; }
  .say-follow .ico { font-size: 17px; line-height: 1; }
  .say-strip.solo { border-top: 2px solid #ffffff1f; border-radius: 10px; }
  @media (max-width: 520px) {
    .say-me .me-txt { display: none; }
    .say-vote button { flex-basis: 34px; }
    .say-n { min-width: 26px; }
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
  @media (max-width: 420px) { .say-corner .cbtn { padding: 0 10px; font-size: 11px; } .say-corner { gap: 6px; } }
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

  async function signedIn(t) {
    token = t;
    flag(true);
    const p = pending; // closing the sheet clears it, so keep the vote they were casting
    const signup = wantsName; // pressed "Sign up": offer the username even if they said "Maybe later" before
    pending = null;
    wantsName = false;
    sheet?.close();
    authChanged();
    try {
      const d = await call({ action: 'get' }, 'account');
      setVotes(d.votes);
      setAccount(d.account, true, signup);
      if (signup && d.account) toast(`Welcome back, ${d.account.username}. You already have a profile.`);
    } catch {}
    if (p?.id) castVote(p.id, p.act);
  }
  function signOut() {
    token = null;
    account = null;
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
        .then(d => { account = d.account; }, e => { if (!e.signin) toast(e.message); });
    }, 800);
  }

  async function deleteAccount() {
    if (!token || !account) return;
    if (!confirm('Delete your account? Your username, the men you follow (on our server) and all your votes go, and it can’t be undone.')) return;
    try {
      const d = await call({ action: 'delete' }, 'account');
      setVotes(d.votes);
      account = null;
      try { localStorage.setItem(SKIP, '1'); } catch {}
      paintAccounts();
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
  async function erase() {
    if (!token) return ask();
    if (!confirm('Delete all your votes from our server? This can’t be undone.')) return;
    try { setVotes((await call({ erase: true })).votes); toast('Your votes are deleted.'); } catch (e) { toast(e.message); }
  }

  async function call(body, path = 'vote') {
    const r = await fetch(API + '/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential: token, ...body }) });
    const d = await r.json().catch(() => ({}));
    if (d.signin) { token = null; authChanged(); throw Object.assign(new Error('signin'), { signin: true }); }
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
  // username and a menu: Your profile (or Create your profile), Delete my votes, Log out.
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
        + `<div>${profile}<button type="button" data-say-do="erase">Delete my votes</button><button type="button" data-say-do="out">Log out</button></div></details>`;
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
      else erase();
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

  // Signed in here before: let Google sign them back in quietly.
  if (GOOGLE_CLIENT_ID && flagged()) load().then(() => google.accounts.id.prompt(), () => {});

  window.SAY = {
    strip,
    vote: id => s.votes[id],
    follows: id => s.follow.includes(id),
    following: () => s.follow.slice(),
    votes: () => ({ ...s.votes }),
    opinion,
    onChange: fn => fns.push(fn),
    account: { get: () => account, ask: mode => askName(mode), remove: deleteAccount },
    auth: { token: () => token, load, signOut, erase, ask: () => ask(), renderButton, onChange: fn => authFns.push(fn), enabled: !!GOOGLE_CLIENT_ID },
  };
})();
