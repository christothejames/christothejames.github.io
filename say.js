// Have your say (owner, 15 Nov 2026): Reddit-style up/down votes, Follow, and the viewer's own board order.
// Shared by home.html (every poster), web.html (the bubble card) and profile.html. Saved only in this
// browser (localStorage `say`); nothing is sent anywhere, so there are no vote totals yet.
//   SAY.strip(id)        -> HTML for the vote + follow strip under a card
//   SAY.vote(id)         -> 'up' | 'down' | undefined
//   SAY.follows(id), SAY.following() -> ids followed
//   SAY.order(board, oursIds) -> the viewer's order for a board (new men slot in at our place)
//   SAY.setOrder(board, ids), SAY.resetOrders(), SAY.custom()
//   SAY.onChange(fn)     -> fn(kind, id) after a vote, follow or order change
(() => {
  const KEY = 'say';
  let s = {};
  try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch {}
  s = { votes: s.votes || {}, follow: s.follow || [], order: s.order || {} };
  const fns = [];
  const save = (kind, id) => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
    fns.forEach(f => f(kind, id));
  };
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
  .say-n { min-width: 34px; text-align: center; font-family: 'Bungee', sans-serif; font-size: 12px; color: #a9bfdc; }
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
  }`;
  document.head.appendChild(css);

  const label = { up: '+1', down: '−1' };
  function paint(el) {
    const id = el.dataset.id, v = s.votes[id], f = s.follow.includes(id);
    el.querySelector('.up').setAttribute('aria-pressed', v === 'up');
    el.querySelector('.down').setAttribute('aria-pressed', v === 'down');
    const n = el.querySelector('.say-n');
    n.className = 'say-n' + (v ? ' ' + v : '');
    n.textContent = label[v] || 'Vote';
    const fb = el.querySelector('.say-follow');
    fb.setAttribute('aria-pressed', f);
    fb.querySelector('.ico').textContent = f ? '★' : '☆';
    fb.querySelector('.lbl').textContent = f ? 'Following' : 'Follow';
  }

  function strip(id, name, solo) {
    const who = esc(name || 'him');
    return `<div class="say-strip${solo ? ' solo' : ''}" data-id="${esc(id)}">
      <div class="say-vote">
        <button type="button" class="up" data-say="up" aria-pressed="false" aria-label="Upvote ${who}: agree with his place" title="Agree with his place">${UP}</button>
        <span class="say-n" aria-hidden="true">Vote</span>
        <button type="button" class="down" data-say="down" aria-pressed="false" aria-label="Downvote ${who}: disagree with his place" title="Disagree with his place">${DOWN}</button>
      </div>
      <button type="button" class="say-follow" data-say="follow" aria-pressed="false" aria-label="Follow ${who}"><span class="ico">☆</span><span class="lbl">Follow</span></button>
    </div>`;
  }

  // Strips are painted from saved state as they appear (pages render cards at different times).
  const paintAll = root => root.querySelectorAll?.('.say-strip').forEach(paint);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
    if (n.nodeType !== 1) return;
    if (n.matches('.say-strip')) paint(n); else paintAll(n);
  }))).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => paintAll(document));

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-say]');
    if (!b) return;
    e.preventDefault();
    const id = b.closest('.say-strip').dataset.id, act = b.dataset.say;
    if (act === 'follow') {
      const i = s.follow.indexOf(id);
      i < 0 ? s.follow.push(id) : s.follow.splice(i, 1);
    } else {
      s.votes[id] === act ? delete s.votes[id] : (s.votes[id] = act);
    }
    document.querySelectorAll('.say-strip').forEach(el => { if (el.dataset.id === id) paint(el); });
    save(act === 'follow' ? 'follow' : 'vote', id);
  });

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
    setOrder(board, ids) { s.order[board] = ids; save('order'); },
    resetOrders() { s.order = {}; save('order'); },
    custom: () => Object.keys(s.order).length > 0,
    onChange: fn => fns.push(fn),
  };
})();
