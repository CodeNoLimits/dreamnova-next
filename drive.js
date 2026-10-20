// Cockpit pilotable : séquence d'entrée au défilement, puis chaque élément réagit (moteur, régime, vitesses, volant, écran, ambiance)
// et ouvre un panneau qui explique le service lié. Mobile : vue verticale complète du tableau de bord.
(() => {
  const D = window.DN, L = document.documentElement.lang, RTL = L === "he", BASE = new URL("./", document.currentScript.src).href;
  const sec = document.querySelector(".drive"); if (!sec || !D.CAR) return;
  const MOB = innerWidth < 768 || (innerWidth <= 1024 && innerHeight > innerWidth), ON = D.ON || {};
  const TOUCH = matchMedia("(hover: none) and (pointer: coarse)").matches; // tactile : épinglage par position:sticky (zéro saut de mise en page)
  const T = D.DRIVE_I[L], S = D.SVC;
  const TX = {
    he: { start: "לחצו על START כדי להתניע", enter: "כניסה", gear: "הילוך", tap: "לחצו על כל אלמנט", close: "סגירה" },
    en: { start: "Press START to fire up the engine", enter: "Enter", gear: "Gear", tap: "Tap any part of the cockpit", close: "Close" },
    fr: { start: "Appuyez sur START pour démarrer", enter: "Entrer", gear: "Rapport", tap: "Touchez chaque élément du cockpit", close: "Fermer" }
  }[L];
  const esc = x => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const SEQ = MOB && ON.seqm ? { dir: "car2/seq_m/", n: ON.seqm } : { dir: "car2/seq/", n: 96 };
  const FINAL = MOB ? { img: "car2/cockpit_m.webp", hots: "car2/hotspots_m.json", ar: 9 / 16 } : { img: "car/cockpit.webp", hots: "car/hotspots.json", ar: 16 / 9 };
  sec.querySelectorAll("[data-d]").forEach(e => e.textContent = T[e.dataset.d]);
  const canvas = sec.querySelector(".drive__seq"), ctx = canvas.getContext("2d"), cockpit = sec.querySelector(".drive__cockpit"), loop = sec.querySelector(".drive__loop");
  const hotsEl = sec.querySelector(".drive__hots"), hintEl = sec.querySelector(".drive__hint"), pin = sec.querySelector(".drive__pin");
  const A = () => window.DNAudio;

  // calques ajoutés : lueurs du tableau de bord, ambiance, HUD, panneau
  pin.insertAdjacentHTML("beforeend", `
    <div class="cp-road" aria-hidden="true"></div><div class="cp-glow" aria-hidden="true"></div><div class="cp-amb" aria-hidden="true"></div>
    <div class="hud" aria-hidden="true"><svg viewBox="0 0 200 120"><path class="hud__track" d="M20 110 A80 80 0 0 1 180 110"/><path class="hud__rpm" d="M20 110 A80 80 0 0 1 180 110"/></svg>
      <div class="hud__num"><b class="hud__speed">0</b><span>km/h</span></div><div class="hud__gear"><small>${esc(TX.gear)}</small><b>P</b></div></div>
    <button type="button" class="cp-start-hint"><span></span>${esc(TX.start)}</button>
    <aside class="cp-panel" role="dialog" aria-live="polite" hidden><button class="cp-panel__x" aria-label="${esc(TX.close)}">×</button><p class="cp-panel__part"></p><h3 class="cp-panel__t"></h3><p class="cp-panel__d"></p><div class="cp-panel__x2"></div><a class="btn btn--gold btn--sm cp-panel__go"><span>${esc(TX.enter)}</span><span class="btn__ico">${RTL ? "↖" : "↗"}</span></a></aside>`);
  const hud = pin.querySelector(".hud"), rpmPath = hud.querySelector(".hud__rpm"), speedEl = hud.querySelector(".hud__speed"), gearEl = hud.querySelector(".hud__gear b");
  const road = pin.querySelector(".cp-road"), glow = pin.querySelector(".cp-glow"), amb = pin.querySelector(".cp-amb"), startHint = pin.querySelector(".cp-start-hint"), panel = pin.querySelector(".cp-panel");
  const RL = rpmPath.getTotalLength(); rpmPath.style.strokeDasharray = RL;

  fetch(BASE + "assets/" + FINAL.hots, { cache: "no-store" }).then(r => r.ok ? r.json() : Promise.reject()).then(init).catch(() => {});

  function init(hots) {
    sec.hidden = false;
    const byId = Object.fromEntries(hots.map(h => [h.id, h]));
    const N = SEQ.n, frames = new Array(N);
    let cur = 0;
    const load = i => { if (frames[i]) return; const im = new Image(); im.decoding = "async"; im.onload = () => { if (i === 0 || i === cur) draw(i); }; im.src = `${BASE}assets/${SEQ.dir}f_${String(i).padStart(3, "0")}.webp`; frames[i] = im; };
    load(0);
    const warm = () => { removeEventListener("scroll", warm); cockpit.style.backgroundImage = `url(${BASE}assets/${FINAL.img})`; for (let i = 0; i < N; i += 8) load(i); setTimeout(() => { for (let i = 0; i < N; i++) load(i); }, 600); };
    addEventListener("scroll", warm, { passive: true }); // rien de lourd avant le premier geste
    if (!MOB) loop.dataset.src = BASE + "assets/car/cockpit.mp4";
    // pièces mobiles : copies masquées de la même image (volant, palettes, levier, START) + écran central vivant
    const PARTS = { wheel: MOB ? .19 : .125, paddle_left: MOB ? .05 : .03, paddle_right: MOB ? .05 : .03, selector: MOB ? .065 : .042, start: MOB ? .048 : .03 };
    const part = {};
    for (const id in PARTS) { const el = document.createElement("div"); el.className = "cp-part cp-part--" + id; cockpit.appendChild(el); part[id] = el; }
    const screenEl = document.createElement("div"); screenEl.className = "cp-screen"; screenEl.innerHTML = `<small></small><b></b><i></i>`; cockpit.appendChild(screenEl);
    const imgBox = () => { const vw = sec.clientWidth, vh = pin.clientHeight || innerHeight, ar = FINAL.ar;
      if (MOB) { const w = vw, hh = vw / ar; return { ox: 0, oy: Math.max(0, (vh - hh) * .25), w, h: hh }; }
      const sc = Math.max(vw / ar, vh), w = sc * ar; return { ox: (vw - w) / 2, oy: (vh - sc) / 2, w, h: sc }; };
    const placeParts = () => { const B = imgBox();
      for (const id in PARTS) { const h = byId[id], el = part[id]; if (!h) { el.hidden = true; continue; }
        const cx = B.ox + h.x * B.w, cy = B.oy + h.y * B.h, r = PARTS[id] * B.w;
        const m = `radial-gradient(circle ${r}px at ${cx}px ${cy}px, #000 ${r - Math.max(12, r * (id === "wheel" ? .34 : .16))}px, transparent ${r}px)`; // volant : fondu large, pas de couture visible
        el.style.webkitMaskImage = el.style.maskImage = m; el.style.transformOrigin = `${cx}px ${cy}px`; }
      const s = byId.screen; if (s) { const w = (MOB ? .2 : .17) * B.w, hh = (MOB ? .075 : .15) * B.h; Object.assign(screenEl.style, { left: B.ox + s.x * B.w - w / 2 + "px", top: B.oy + s.y * B.h - hh / 2 + "px", width: w + "px", height: hh + "px" }); } };
    const hit = id => { const el = part[id]; if (!el) return; el.classList.remove("is-hit"); void el.offsetWidth; el.classList.add("is-hit"); };

    // points interactifs
    hotsEl.innerHTML = S.map((s, i) => { const h = byId[s.hot]; if (!h) return "";
      return `<button type="button" class="hot ${h.x > 0.55 ? "hot--left" : ""}" data-i="${i}" data-id="${s.hot}" data-x="${h.x}" data-y="${h.y}" aria-label="${esc(s.part[L])} — ${esc(D.SERVICES[i][L][0])}"><span class="hot__dot"></span><span class="hot__card"><span class="hot__part">${esc(s.part[L])}</span><span class="hot__name">${esc(D.SERVICES[i][L][0])}</span></span></button>`; }).join("");
    sec.querySelector(".drive__chips").innerHTML = S.map((s, i) => `<button type="button" data-i="${i}"><small>${esc(s.part[L])}</small>${esc(D.SERVICES[i][L][0])}</button>`).join("");
    const hotBtns = [...hotsEl.querySelectorAll(".hot")];
    const pos = (x, y) => { const vw = sec.clientWidth, vh = pin.clientHeight || innerHeight, ar = FINAL.ar;
      if (MOB) { const w = vw, hh = vw / ar, oy = Math.max(0, (vh - hh) * .25); return [x * w, oy + y * hh]; } // mobile : toute la largeur du tableau de bord
      const sc = Math.max(vw / ar, vh), w = sc * ar, hh = sc, ox = (vw - w) / 2, oy = (vh - hh) / 2; return [ox + x * w, oy + y * hh]; };
    const place = () => {
      hotBtns.forEach(a => { const [x, y] = pos(+a.dataset.x, +a.dataset.y); a.style.left = x + "px"; a.style.top = y + "px"; });
      const st = byId.start; if (st) { let [x, y] = pos(st.x, st.y); if (MOB) x = Math.min(Math.max(x, 125), sec.clientWidth - 125); startHint.style.left = x + "px"; startHint.style.top = y + "px"; }
      canvas.width = sec.clientWidth * Math.min(devicePixelRatio, 2); canvas.height = (pin.clientHeight || innerHeight) * Math.min(devicePixelRatio, 2); draw(cur);
      placeParts();
    };
    // deux sauts de caméra dans la séquence ordinateur (46→50 : siège, 58→65 : entrée dans l'habitacle) : fondu entre les deux bords
    const JUMPS = MOB ? [] : [[46, 50], [58, 65]];
    const ready = k => frames[k] && frames[k].complete && frames[k].naturalWidth;
    const paint = (im, alpha) => { const cw = canvas.width, ch = canvas.height, sc = Math.max(cw / im.naturalWidth, ch / im.naturalHeight), w = im.naturalWidth * sc, h = im.naturalHeight * sc; ctx.globalAlpha = alpha; ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h); ctx.globalAlpha = 1; };
    function draw(i) {
      const j = JUMPS.find(([a, b]) => i > a && i < b);
      if (j && ready(j[0]) && ready(j[1])) { paint(frames[j[0]], 1); paint(frames[j[1]], (i - j[0]) / (j[1] - j[0])); return; }
      let im = frames[i]; if (!im || !im.complete || !im.naturalWidth) { for (let k = i; k >= 0; k--) if (ready(k)) { im = frames[k]; break; } if (!im || !im.naturalWidth) return; }
      paint(im, 1);
    }
    addEventListener("resize", place); place();

    // ---- état de la voiture
    const car = { on: false, rpm: 0, target: 0, gear: "P", gi: 0, speed: 0, steer: 0, steerT: 0 };
    const GEARS = ["P", "R", "N", "D"];
    const setRpmTarget = v => car.target = v;
    const rev = (peak = 7.2, back) => { setRpmTarget(peak); setTimeout(() => setRpmTarget(back ?? (car.on ? 1.1 : 0)), 520); };
    const pan = id => { const h = byId[id]; return h ? (h.x - 0.5) * 2 : 0; };
    function engine(on) {
      car.on = on; sec.classList.toggle("is-running", on);
      if (on) { A()?.sfx("engine", 0); A()?.engine(true); setRpmTarget(3.4); setTimeout(() => setRpmTarget(1.1), 900); startHint.classList.add("is-done");
        if (loop.dataset.src) { if (!loop.src) loop.src = loop.dataset.src; loop.play().catch(() => {}); loop.classList.add("is-on"); } }
      else { A()?.engine(false); setRpmTarget(0); loop.pause(); loop.classList.remove("is-on"); car.gear = "P"; car.gi = 0; }
    }
    const EFFECT = {
      start: () => { engine(!car.on); hit("start"); },
      cluster: () => { if (!car.on) engine(true); rev(7.6); A()?.sfx("rev", pan("cluster")); },
      paddle_right: () => { if (!car.on) engine(true); car.gi = Math.min(7, (typeof car.gear === "number" ? car.gear : 0) + 1); car.gear = car.gi; rev(6, 2 + car.gi * .4); A()?.sfx("gear", pan("paddle_right")); hit("paddle_right"); },
      paddle_left: () => { if (!car.on) engine(true); car.gi = Math.max(1, (typeof car.gear === "number" ? car.gear : 2) - 1); car.gear = car.gi; rev(5.2, 1.6 + car.gi * .4); A()?.sfx("gear", pan("paddle_left")); hit("paddle_left"); },
      selector: () => { const k = (GEARS.indexOf(String(car.gear)) + 1) % GEARS.length; car.gear = GEARS[k < 0 ? 0 : k]; A()?.sfx("selector", pan("selector")); if (car.gear === "D" && !car.on) engine(true); hit("selector"); },
      wheel: () => { car.steerT = car.steerT > 0 ? -1 : 1; setTimeout(() => car.steerT = 0, 900); A()?.sfx("steer", pan("wheel")); },
      screen: () => { glow.classList.remove("is-flash"); void glow.offsetWidth; glow.classList.add("is-flash"); A()?.sfx("power", pan("screen")); },
      ambient: () => { const c = ["gold", "ice", "rose", "off"]; const k = (c.indexOf(amb.dataset.c || "gold") + 1) % c.length; amb.dataset.c = c[k]; A()?.sfx("click", pan("ambient")); }
    };
    function openPanel(i) {
      const s = S[i], sv = D.SERVICES[i][L];
      panel.querySelector(".cp-panel__part").textContent = s.part[L];
      panel.querySelector(".cp-panel__t").textContent = sv[0];
      panel.querySelector(".cp-panel__d").textContent = sv[1];
      panel.querySelector(".cp-panel__x2").innerHTML = sv[2].slice(0, 4).map(c => `<span>${esc(c)}</span>`).join("");
      panel.querySelector(".cp-panel__go").href = `${BASE}${L}/s/${s.id}/`;
      panel.hidden = false; requestAnimationFrame(() => panel.classList.add("is-open"));
      screenEl.querySelector("small").textContent = s.part[L]; screenEl.querySelector("b").textContent = sv[0]; screenEl.classList.remove("is-on"); void screenEl.offsetWidth; screenEl.classList.add("is-on");
      hotBtns.forEach(b => b.classList.toggle("is-active", +b.dataset.i === i));
      A()?.voiceKey("cp_" + s.hot);
    }
    const act = i => { const id = S[i].hot; (EFFECT[id] || (() => {}))(); openPanel(i); };
    hotBtns.forEach(b => b.addEventListener("click", () => act(+b.dataset.i)));
    startHint.addEventListener("click", () => { const k = S.findIndex(s => s.hot === "start"); if (k > -1) act(k); }); // la bulle elle-même démarre le moteur
    sec.querySelectorAll(".drive__chips button").forEach(b => b.addEventListener("click", () => act(+b.dataset.i)));
    sec.querySelectorAll(".drive__chips button").forEach((c, i) => { const hot = hotBtns.find(h => +h.dataset.i === i); if (!hot) return;
      c.addEventListener("pointerenter", () => hot.classList.add("is-near")); c.addEventListener("pointerleave", () => hot.classList.remove("is-near")); });
    panel.querySelector(".cp-panel__x").addEventListener("click", () => { panel.classList.remove("is-open"); setTimeout(() => panel.hidden = true, 400); hotBtns.forEach(b => b.classList.remove("is-active")); });
    hotBtns.forEach(b => b.addEventListener("pointerenter", () => A()?.sfx("click", (+b.dataset.x - .5) * 2, .35)));

    // volant à la souris (ordinateur) : on « braque » en déplaçant la souris dans le cockpit
    if (!MOB) pin.addEventListener("pointermove", e => { if (!sec.classList.contains("is-in")) return; car.steerT = ((e.clientX / innerWidth) - .5) * 2 * (RTL ? -1 : 1) * .6; });
    else { // téléphone : on braque en glissant le doigt à l'horizontale (le défilement vertical reste libre)
      let sx = null, tmr = 0;
      pin.addEventListener("touchstart", e => { if (sec.classList.contains("is-in") && e.touches.length === 1) sx = e.touches[0].clientX; }, { passive: true });
      pin.addEventListener("touchmove", e => { if (sx === null) return; const dx = e.touches[0].clientX - sx; if (Math.abs(dx) < 8) return;
        car.steerT = Math.max(-1, Math.min(1, dx / (innerWidth * .35))); clearTimeout(tmr); if (!car.on) engine(true); }, { passive: true });
      pin.addEventListener("touchend", () => { if (sx !== null && Math.abs(car.steerT) > .25) A()?.sfx("steer", car.steerT); sx = null; tmr = setTimeout(() => car.steerT = 0, 700); }, { passive: true }); }

    // boucle d'animation : régime lissé, compteur, braquage, lueurs
    let last = performance.now();
    (function tick(now) {
      requestAnimationFrame(tick); const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (!sec.classList.contains("is-in")) return;
      const jitter = car.on ? Math.sin(now / 90) * .05 + Math.sin(now / 37) * .03 : 0;
      car.rpm += (car.target - car.rpm) * Math.min(1, dt * 6); const r = Math.max(0, car.rpm + jitter);
      rpmPath.style.strokeDashoffset = RL * (1 - Math.min(1, r / 8));
      const g = typeof car.gear === "number" ? car.gear : 0;
      car.speed += ((g ? r * g * 9 : 0) - car.speed) * Math.min(1, dt * 1.5);
      speedEl.textContent = Math.round(car.speed); gearEl.textContent = car.gear;
      car.steer += (car.steerT - car.steer) * Math.min(1, dt * 5);
      const shake = car.on ? (Math.sin(now / 23) * .6 + Math.sin(now / 41) * .4) * (.3 + r / 10) : 0;
      const tr = `translate3d(${car.steer * -14 + shake}px,${shake * .6}px,0) rotate(${car.steer * .5}deg) scale(${MOB ? 1.02 : 1.08})`;
      canvas.style.transform = cockpit.style.transform = tr;
      if (part.wheel) part.wheel.style.transform = `rotate(${car.steer * 15 * (RTL ? -1 : 1)}deg)`; // amplitude contenue : le volant reste solidaire du tableau de bord
      glow.style.opacity = car.on ? .55 + r / 16 : 0;
      road.style.setProperty("--v", Math.min(1, car.speed / 160)); road.style.opacity = car.speed > 3 ? Math.min(.9, car.speed / 80) : 0;
      A()?.engineRpm(r);
    })(last);

    const hook = () => {
      const g = window.gsap, ST = window.ScrollTrigger;
      if (!g || !ST || window.__DN?.reduced) { cockpit.style.opacity = 1; sec.classList.add("is-in"); return; }
      const intro = sec.querySelector(".drive__intro");
      if (TOUCH) { pin.style.position = "sticky"; pin.style.top = "0"; pin.style.height = "100svh"; sec.style.height = "440svh"; }
      const leave = () => { sec.classList.remove("is-in"); document.body.classList.remove("in-cockpit"); panel.classList.remove("is-open"); panel.hidden = true; hintEl.textContent = T.hint; if (car.on) engine(false); };
      ST.create({ trigger: sec, start: "top top", end: TOUCH ? "bottom bottom" : () => "+=" + innerHeight * 3.4, pin: TOUCH ? false : pin, scrub: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 10,
        onLeave: () => { leave(); if (TOUCH) sec.classList.add("is-past"); }, onLeaveBack: leave, onEnterBack: () => sec.classList.remove("is-past"), // tactile : le tableau de bord reste affiché pendant que la section remonte (pas d'écran noir)
        onUpdate: st => {
          const p = st.progress, seqEnd = 0.7;
          const f = Math.min(N - 1, Math.floor((p / seqEnd) * (N - 1)));
          if (f !== cur) { cur = f; requestAnimationFrame(() => draw(f)); }
          const k = Math.min(1, Math.max(0, (p - seqEnd) / 0.08));
          cockpit.style.opacity = MOB ? k : Math.min(1, k * 1.0);
          intro.style.opacity = Math.max(0, 1 - p * 3.2); intro.style.transform = `translateY(${-p * 120}px)`;
          const inside = st.isActive && p > seqEnd + 0.06; // jamais « dedans » une fois la section quittée (le bouton WhatsApp revient)
          if (inside !== sec.classList.contains("is-in")) { hintEl.textContent = inside ? TX.tap : T.hint; if (!inside) { panel.classList.remove("is-open"); panel.hidden = true; } }
          sec.classList.toggle("is-in", inside); document.body.classList.toggle("in-cockpit", inside);
        } });
      ST.sort(); ST.refresh();
    };
    window.__DN ? hook() : addEventListener("dn:ready", hook, { once: true });
    window.__DNDRIVE = { frames: N, hots: hotBtns.length, mobile: MOB };
  }
})();
