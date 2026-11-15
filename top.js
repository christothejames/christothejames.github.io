// Back to top (owner, 15 Nov 2026: "on long pages there needs to be a 'back to top' button").
// One shared button, bottom right: it shows only on long pages (at least 2.5 screens tall), once the visitor has
// scrolled down more than one screen. It scrolls smoothly to the top (instantly with reduced motion) and puts the
// keyboard focus back at the top of the page. Anything fixed to the bottom of the screen that it must not cover
// (e.g. the Home Game Plan dock) gets `data-top-avoid`; the button then sits just above it.
(() => {
  const css = document.createElement('style');
  css.textContent = `
  .to-top { position: fixed; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom, 0px)); z-index: 40;
    width: 52px; height: 52px; border-radius: 50%; border: 2px solid #3ef2ff; background: #050b1aee; color: #3ef2ff;
    display: grid; place-items: center; cursor: pointer; box-shadow: 0 0 16px #3ef2ff66, 0 8px 22px #000a;
    opacity: 0; transform: translateY(12px); pointer-events: none; transition: opacity .2s, transform .2s, bottom .2s; }
  .to-top.on { opacity: 1; transform: none; pointer-events: auto; }
  .to-top svg { width: 24px; height: 24px; }
  .to-top span { position: absolute; top: 100%; margin-top: 3px; font-family: 'Bungee', sans-serif; font-size: 10px; letter-spacing: .5px;
    color: #3ef2ff; text-shadow: 0 0 6px #050b1a, 0 0 2px #050b1a; }
  .to-top:hover { background: #3ef2ff; color: #050b1a; box-shadow: 0 0 24px #3ef2ffaa; }
  .to-top:focus-visible { outline: 3px solid #ffe66d; outline-offset: 3px; }
  @media (max-width: 520px) { .to-top { width: 46px; height: 46px; right: 12px; } .to-top span { display: none; } }
  @media (prefers-reduced-motion: reduce) { .to-top { transition: none; } }`;
  document.head.appendChild(css);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.title = 'Back to top';
  btn.tabIndex = -1;
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg><span aria-hidden="true">TOP</span>';

  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    // Keyboard users land at the top too, not stranded on a button that just vanished.
    const first = document.querySelector('main, h1, header') || document.body;
    if (!first.hasAttribute('tabindex')) first.setAttribute('tabindex', '-1');
    first.focus({ preventScroll: true });
  });

  let ticking = false;
  function update() {
    ticking = false;
    const h = innerHeight;
    const long = document.documentElement.scrollHeight > h * 2.5;
    const on = long && scrollY > h;
    btn.classList.toggle('on', on);
    btn.tabIndex = on ? 0 : -1;
    // Sit above anything fixed to the bottom of the screen that's showing.
    let lift = 0;
    document.querySelectorAll('[data-top-avoid]').forEach(el => {
      if (el.hidden || !el.getClientRects().length) return;
      const r = el.getBoundingClientRect();
      if (r.top < h) lift = Math.max(lift, h - r.top + 10);
    });
    btn.style.bottom = lift ? `${lift}px` : '';
  }
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

  const mount = () => { document.body.appendChild(btn); update(); };
  document.body ? mount() : document.addEventListener('DOMContentLoaded', mount);
})();
