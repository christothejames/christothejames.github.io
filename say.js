// Have your say (owner, 15 Nov 2026): Reddit-style up/down votes, Follow, and the viewer's own board order.
// Shared by home.html (every poster), web.html (the bubble card), profile.html and opinion.html.
//
// Votes count only when signed in with Google (owner, 15 Nov 2026: like Reddit, to stop spam votes): one vote per
// account per man, sent to the private admin site (POST /public/vote; it keeps a scrambled account code, never a
// name or email). Totals for the scores and the Public Opinion page come from GET /public/opinion.
// Follow and My order need no account and stay only in this browser (localStorage `say`).
// This file also runs Google sign-in for any page that loads it (home.html's request card uses SAY.auth).
//
//   SAY.strip(id, name, solo)  -> HTML for the vote + follow strip under a card
//   SAY.vote(id), SAY.follows(id), SAY.following()
//   SAY.order(board, oursIds), SAY.setOrder(board, ids), SAY.resetOrders(), SAY.custom()
//   SAY.opinion()              -> Promise of {updated, voters, men: {id: [up, down, upWeek, downWeek]}} (or null)
//   SAY.onChange(fn)           -> fn(kind, id) after a vote, follow, order or sign-in change
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
  s = { votes: s.votes || {}, follow: s.follow || [], order: s.order || {} };
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
  .say-sheet .close:focus-visible, .say-account button:focus-visible { outline: 3px solid #ffe66d; outline-offset: 2px; }
  .say-toast { position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 50; max-width: calc(100% - 32px);
    padding: 10px 16px; border-radius: 12px; background: #2a0f14; border: 1px solid #ff3b3b; color: #ffd2d2; font-family: 'Righteous', system-ui, sans-serif; font-size: 14px; }
  .say-account { font-size: 13px; color: #a9bfdc; }
  .say-account b { color: #34e07a; font-weight: 400; }
  .say-account button { font: inherit; background: none; border: 0; padding: 0; margin-left: 8px; color: #3ef2ff; text-decoration: underline; cursor: pointer; }
  .say-account button.go { margin: 0; padding: 7px 14px; border-radius: 999px; background: #3ef2ff; color: #050b1a; text-decoration: none; font-family: 'Bungee', sans-serif; font-size: 12px; }`;
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
  const renderButton = el => load().then(() => google.accounts.id.renderButton(el,
    { theme: 'filled_black', size: 'large', shape: 'pill', text: 'signin_with', locale: 'en' }));

  async function signedIn(t) {
    token = t;
    flag(true);
    const p = pending; // closing the sheet clears it, so keep the vote they were casting
    pending = null;
    sheet?.close();
    authChanged();
    try { setVotes((await call({})).votes); } catch {}
    if (p) castVote(p.id, p.act);
  }
  function signOut() {
    token = null;
    flag(false);
    window.google?.accounts?.id?.disableAutoSelect();
    setVotes({});
    authChanged();
  }
  async function erase() {
    if (!token) return ask();
    if (!confirm('Delete all your votes from our server? This can’t be undone.')) return;
    try { setVotes((await call({ erase: true })).votes); toast('Your votes are deleted.'); } catch (e) { toast(e.message); }
  }

  async function call(body) {
    const r = await fetch(API + '/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential: token, ...body }) });
    const d = await r.json().catch(() => ({}));
    if (d.signin) { token = null; authChanged(); throw Object.assign(new Error('signin'), { signin: true }); }
    if (!r.ok) throw new Error(d.error || 'Couldn’t reach the vote server. Try again in a bit.');
    return d;
  }

  // ---------- the "Sign in to vote" sheet ----------
  let sheet, pending = null;
  function ask(p) {
    pending = p || null;
    if (!GOOGLE_CLIENT_ID) return;
    if (!sheet) {
      sheet = document.createElement('dialog');
      sheet.className = 'say-sheet';
      sheet.setAttribute('aria-labelledby', 'say-sheet-h');
      sheet.innerHTML = `<h2 id="say-sheet-h">SIGN IN TO VOTE</h2>
        <p>One vote per Google account keeps the counts honest. Following and your own order work without signing in.</p>
        <div class="gbtn"></div>
        <small>We keep a scrambled code, never your name or email. <a href="privacy.html">Privacy</a></small>
        <button type="button" class="close">Not now</button>`;
      sheet.querySelector('.close').onclick = () => sheet.close();
      sheet.addEventListener('close', () => { pending = null; });
      sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
      document.body.appendChild(sheet);
    }
    const g = sheet.querySelector('.gbtn');
    g.innerHTML = '';
    renderButton(g).catch(() => { g.innerHTML = '<p class="msg">Couldn’t load Google sign-in. Try again in a bit.</p>'; });
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

  // A "signed in / sign in" line for pages that want one: <span data-say-account></span>
  function paintAccounts() {
    document.querySelectorAll('[data-say-account]').forEach(el => {
      el.classList.add('say-account');
      if (!GOOGLE_CLIENT_ID) { el.hidden = true; return; }
      el.innerHTML = token
        ? '<b>✓ Signed in to vote.</b><button type="button" data-say-do="out">Sign out</button><button type="button" data-say-do="erase">Delete my votes</button>'
        : '<button type="button" class="go" data-say-do="in">Sign in to vote</button>';
    });
  }

  function strip(id, name, solo) {
    const who = esc(name || 'him');
    return `<div class="say-strip${solo ? ' solo' : ''}" data-id="${esc(id)}">
      <div class="say-vote">
        <button type="button" class="up" data-say="up" aria-pressed="false" aria-label="Upvote ${who}: agree with his place" title="Agree with his place">${UP}</button>
        <span class="say-n none">Vote</span>
        <button type="button" class="down" data-say="down" aria-pressed="false" aria-label="Downvote ${who}: disagree with his place" title="Disagree with his place">${DOWN}</button>
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
  document.addEventListener('DOMContentLoaded', () => seen(document.body));

  document.addEventListener('click', e => {
    const acc = e.target.closest('[data-say-do]');
    if (acc) {
      const d = acc.dataset.sayDo;
      if (d === 'in') ask(); else if (d === 'out') signOut(); else erase();
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
    order(board, ours) {
      const on = new Set(ours);
      const out = (s.order[board] || []).filter(id => on.has(id));
      const have = new Set(out);
      ours.forEach((id, i) => { if (!have.has(id)) out.splice(Math.min(i, out.length), 0, id); });
      return out;
    },
    setOrder(board, ids) { s.order[board] = ids; store(); changed('order'); },
    resetOrders() { s.order = {}; store(); changed('order'); },
    custom: () => Object.keys(s.order).length > 0,
    opinion,
    onChange: fn => fns.push(fn),
    auth: { token: () => token, load, signOut, erase, ask: () => ask(), renderButton, onChange: fn => authFns.push(fn), enabled: !!GOOGLE_CLIENT_ID },
  };
})();
