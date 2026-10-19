// Sélecteur de rapport : un bouton qui fait avancer le site chapitre par chapitre. Dans une section animée (voiture, accélération,
// salles, espace, valeurs), il la parcourt tout seul à vitesse cinéma : les animations liées au défilement se jouent sans effort.
(() => {
  const D = window.DN, L = document.documentElement.lang;
  if (document.body.dataset.svc) return;
  const T = { he: { next: "להילוך הבא", top: "להתחלה" }, en: { next: "Next gear", top: "Back to start" }, fr: { next: "Rapport suivant", top: "Retour au départ" } }[L];
  const SEL = [".hero", ".drive", ".chap--accel", "#work", ".manifesto", ".rooms", "#refer", "#index", "#offers", "#devis", ".chap--space", "#lab", ".chap--values", ".founder", "#contact"];
  const mob = () => innerWidth < 768;
  const el = document.createElement("div"); el.className = "gear";
  el.innerHTML = `<button type="button" class="gear__knob" aria-label="${T.next}"><span class="gear__ring" aria-hidden="true"></span><b>1</b><i aria-hidden="true">▲</i></button><small class="gear__lab">${T.next}</small>`;
  document.body.appendChild(el);
  const knob = el.querySelector(".gear__knob"), num = el.querySelector("b"), lab = el.querySelector(".gear__lab");
  const secs = () => SEL.map(s => document.querySelector(s)).filter(e => e && !e.hidden && e.offsetHeight > 0);
  const top = e => e.getBoundingClientRect().top + scrollY;
  const span = e => { const h = e.offsetHeight; return h > innerHeight * 1.6 ? h - innerHeight : 0; }; // section plus haute que l'écran = épinglée : on la parcourt
  let raf = 0;
  const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } document.body.classList.remove("cruising"); };
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach(ev => addEventListener(ev, e => { if (!el.contains(e.target)) stop(); }, { passive: true }));
  function go(y1, pace) {
    stop(); const y0 = scrollY, dist = y1 - y0; if (Math.abs(dist) < 6) return;
    const dur = Math.min(11000, Math.max(900, Math.abs(dist) / pace * 1000)); document.body.classList.add("cruising");
    const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    if (window.__lenis) { window.__lenis.scrollTo(y1, { duration: dur / 1000, easing: ease, lock: false, onComplete: () => document.body.classList.remove("cruising") }); return; }
    const t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / dur); window.scrollTo(0, y0 + dist * ease(k)); if (k < 1) raf = requestAnimationFrame(step); else stop(); };
    raf = requestAnimationFrame(step);
  }
  function current() { const list = secs(), y = scrollY + 4; let i = 0; list.forEach((e, k) => { if (top(e) <= y) i = k; }); return { list, i }; }
  function next() {
    const { list, i } = current(); const e = list[i], t = top(e), s = span(e), y = scrollY;
    const PACE = mob() ? 620 : 1000, JUMP = mob() ? 1900 : 2600;
    window.DNAudio?.sfx("gear", 0, .6);
    if (s && y < t + s - 12) return go(t + s, PACE);                      // dans une section animée : on la joue jusqu'au bout
    const n = list[i + 1]; if (!n) return go(0, JUMP);                      // fin du site : retour au départ
    const nt = top(n), ns = span(n);
    if (ns) { if (Math.abs(nt - y) > 40) go(nt, JUMP); setTimeout(() => go(nt + ns, PACE), Math.abs(nt - y) > 40 ? Math.min(2200, Math.abs(nt - y) / JUMP * 1000 + 80) : 0); }
    else go(nt, JUMP);
  }
  knob.addEventListener("click", next);
  let tk = 0; addEventListener("scroll", () => { if (tk) return; tk = setTimeout(() => { tk = 0; const { list, i } = current(); num.textContent = i + 1; lab.textContent = i >= list.length - 1 ? T.top : T.next; el.classList.toggle("is-end", i >= list.length - 1); }, 120); }, { passive: true });
})();
