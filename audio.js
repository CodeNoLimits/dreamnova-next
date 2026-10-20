// Son immersif : écran d'entrée (le 1er geste lance le son, langue de la page), musique en fondus à puissance constante,
// voix narratrice sous-titrée (musique abaissée), effets spatialisés (HRTF) + réverbération, moteur synthétisé qui suit le régime.
(() => {
  const D = window.DN, L = document.documentElement.lang, BASE = new URL("./", document.currentScript.src).href, A = BASE + "assets/audio/";
  if (!(D.ON || {}).audio) return;
  if (new URLSearchParams(location.search).get("embed") === "1") return; // surcouche : la musique vient de la page principale
  // manifestes chargés dès l'arrivée : au 1er geste, plus aucune attente réseau (iPhone refuse play() hors du geste)
  const getJ = f => fetch(A + f).then(r => r.json()).catch(() => null), MAN = getJ("manifest.json"), VOI = getJ("voices.json");
  const TX = {
    he: { on: "הפעלת סאונד", off: "השתקה", go: "התנעת המנוע", mute: "כניסה בלי סאונד", tag: "חוויה סוחפת · מומלץ עם אוזניות" },
    en: { on: "Sound on", off: "Mute", go: "Start the engine", mute: "Enter without sound", tag: "Immersive experience · headphones recommended" },
    fr: { on: "Activer le son", off: "Couper le son", go: "Démarrer le moteur", mute: "Entrer sans le son", tag: "Expérience immersive · casque recommandé" }
  }[L];
  // bouton du menu
  const btn = document.createElement("button"); btn.className = "snd"; btn.type = "button";
  btn.innerHTML = `<svg class="snd__ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path class="snd__w1" d="M15.5 9.2a4 4 0 0 1 0 5.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path class="snd__w2" d="M18 6.8a7.4 7.4 0 0 1 0 10.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span class="snd__bars"><i></i><i></i><i></i><i></i></span><span class="snd__t">${TX.on}</span>`;
  btn.setAttribute("aria-pressed", "false"); btn.setAttribute("aria-label", TX.on); document.querySelector(".nav").insertBefore(btn, document.querySelector(".nav__burger"));
  const SVC = document.body.dataset.svc || null; // page de service : pas de porte, même ambiance que le cockpit
  const ss = (k, v) => { try { return v === undefined ? sessionStorage.getItem(k) : sessionStorage.setItem(k, v); } catch (_) { return null; } };
  const sub = document.createElement("div"); sub.className = "subs"; sub.setAttribute("aria-live", "polite"); document.body.appendChild(sub);
  const subT = document.createElement("span"); subT.className = "subs__t"; sub.appendChild(subT);
  const subX = document.createElement("button"); subX.type = "button"; subX.className = "subs__x"; subX.setAttribute("aria-label", { he: "סגירת הכתוביות", en: "Hide captions", fr: "Masquer les sous-titres" }[L]); subX.textContent = "×"; sub.appendChild(subX);
  let subsOff = ss("dn-subs") === "0";
  subX.addEventListener("click", () => { subsOff = true; ss("dn-subs", "0"); sub.classList.remove("is-on"); });

  let queued = null, ctx, bus, rev, on = false, man = { files: [] }, voices = {}, curVoice = null, played = new Set(), music = null, eng = null;
  const has = f => man.files.includes(f);
  const pick = (...c) => c.find(has);

  function impulse(sec = 2.4, decay = 3) { const r = ctx.sampleRate, n = r * sec, b = ctx.createBuffer(2, n, r);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay); } return b; }
  async function init() {
    ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: "interactive" });
    const master = ctx.createDynamicsCompressor(); master.threshold.value = -14; master.ratio.value = 3; master.connect(ctx.destination);
    rev = ctx.createConvolver(); rev.buffer = impulse(); const revG = ctx.createGain(); revG.gain.value = .22; rev.connect(revG); revG.connect(master);
    bus = {}; for (const k of ["music", "voice", "sfx", "engine"]) { bus[k] = ctx.createGain(); bus[k].connect(master); }
    bus.music.gain.value = .5; bus.voice.gain.value = 1; bus.sfx.gain.value = .8; bus.engine.gain.value = .9;
    bus.mpan = ctx.createStereoPanner(); bus.mpan.connect(bus.music);
    ctx.listener.positionZ && (ctx.listener.positionZ.value = 0);
    man = (await MAN) || man; voices = (await VOI) || voices;
    addEventListener("pointermove", e => { if (bus) bus.mpan.pan.setTargetAtTime(((e.clientX / innerWidth) - .5) * .5, ctx.currentTime, .3); }, { passive: true });
    watch();
  }
  const media = (f, loop) => { const a = new Audio(A + f); a.loop = !!loop; a.crossOrigin = "anonymous"; a.preload = "auto"; return a; };
  // fondu enchaîné à puissance constante
  const curve = (up, n = 64) => Float32Array.from({ length: n }, (_, i) => up ? Math.sin(i / (n - 1) * Math.PI / 2) : Math.cos(i / (n - 1) * Math.PI / 2));
  function playMusic(name) {
    const f = pick(`loop_${name}.mp3`, "theme.mp3", "loop_hero.mp3"); if (!f || (music && music.f === f)) return;
    const a = media(f, true), s = ctx.createMediaElementSource(a), g = ctx.createGain(); s.connect(g); g.connect(bus.mpan);
    // changement de page : le morceau reprend là où il était (temps écoulé compris), pas depuis le début
    let p = null; try { p = JSON.parse(ss("dn-mpos") || "null"); } catch (_) {} ss("dn-mpos", "");
    if (p && p.f === f) a.addEventListener("loadedmetadata", () => { if (a.duration) a.currentTime = (p.t + (Date.now() - p.at) / 1000) % a.duration; }, { once: true });
    g.gain.value = 0; a.play().catch(() => {}); const t = ctx.currentTime, dur = 2.4;
    g.gain.setValueCurveAtTime(curve(true), t, dur);
    if (music) { const o = music; o.g.gain.cancelScheduledValues(t); o.g.gain.setValueCurveAtTime(curve(false), t, dur); setTimeout(() => o.a.pause(), dur * 1000 + 100); }
    music = { f, a, g };
  }
  function duck(down) { const t = ctx.currentTime; bus.music.gain.cancelScheduledValues(t); bus.music.gain.setTargetAtTime(down ? .14 : .5, t, down ? .25 : .9); }
  function voiceKey(key, force) {
    if (!on) return; const f = `voice_${key}_${L}.mp3`; if (!has(f) || (!force && played.has(key) && !key.startsWith("cp_"))) return;
    // une voix en cours n'est jamais coupée par la section suivante : on met en file (la plus récente seulement) ; les éléments du cockpit, eux, interrompent
    if (curVoice && !curVoice.ended && !curVoice.paused && !key.startsWith("cp_")) { queued = key; return; }
    played.add(key); if (curVoice) curVoice.pause();
    const a = media(f), s = ctx.createMediaElementSource(a), g = ctx.createGain(), send = ctx.createGain(); send.gain.value = .12;
    s.connect(g); g.connect(bus.voice); s.connect(send); send.connect(rev); curVoice = a; duck(true);
    const txt = voices[key] && voices[key][L] && voices[key][L].replace(/[֑-ׇ]/g, ""); if (txt && !subsOff) { subT.textContent = txt; sub.classList.add("is-on"); }
    a.onended = () => { duck(false); sub.classList.remove("is-on"); if (queued) { const q = queued; queued = null; setTimeout(() => { const a = activeSection(); if (a && a[0] === q) voiceKey(q); }, 500); } };
    a.play().catch(() => {});
  }
  const SFX = { engine: ["sfx_engine_start.mp3"], rev: ["sfx_engine_rev.mp3"], accel: ["sfx_accel_whoosh.mp3"], rocket: ["sfx_rocket_launch.mp3"], wind: ["sfx_wind_freefall.mp3"],
    chute: ["sfx_parachute_open.mp3"], portal: ["sfx_portal_whoosh.mp3", "sfx_whoosh_soft.mp3"], click: ["sfx_click_gold.mp3"], gear: ["sfx_gear_shift.mp3", "sfx_engine_rev.mp3"],
    selector: ["sfx_selector_click.mp3", "sfx_click_gold.mp3"], steer: ["sfx_steer_tires.mp3", "sfx_whoosh_soft.mp3", "sfx_accel_whoosh.mp3"], power: ["sfx_dash_power_on.mp3", "sfx_portal_whoosh.mp3"] };
  // effet spatialisé : x de -1 (gauche) à 1 (droite), légèrement devant l'auditeur
  const pool = {}; // un petit lot de lecteurs réutilisés par fichier, branchés une seule fois
  function voiceOf(f) {
    const list = pool[f] || (pool[f] = []); let v = list.find(o => o.a.paused || o.a.ended);
    if (!v) { if (list.length >= 4) v = list[0]; else {
      const a = media(f), s = ctx.createMediaElementSource(a), g = ctx.createGain(), p = ctx.createPanner(), send = ctx.createGain();
      p.panningModel = /click|selector/.test(f) ? "equalpower" : "HRTF"; p.distanceModel = "inverse"; p.refDistance = 1; send.gain.value = .25;
      s.connect(g); g.connect(p); p.connect(bus.sfx); g.connect(send); send.connect(rev); v = { a, g, p }; list.push(v); } }
    return v;
  }
  function sfx(k, x = 0, vol = 1) {
    if (!on || !SFX[k]) return; const f = pick(...SFX[k]); if (!f) return;
    const v = voiceOf(f), xx = Math.max(-1, Math.min(1, x)) * 2.2;
    v.p.positionX ? (v.p.positionX.value = xx, v.p.positionY.value = 0, v.p.positionZ.value = -1.2) : v.p.setPosition(xx, 0, -1.2);
    v.g.gain.value = vol; try { v.a.currentTime = 0; } catch (_) {} v.a.play().catch(() => {});
  }
  // moteur synthétisé : son continu dont la hauteur et le grain suivent le régime
  function engine(start) {
    if (!ctx) return;
    if (start && !eng) {
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), o3 = ctx.createOscillator(), mix = ctx.createGain(), sh = ctx.createWaveShaper(), lp = ctx.createBiquadFilter(), g = ctx.createGain(), p = ctx.createPanner();
      o1.type = "sawtooth"; o2.type = "sawtooth"; o3.type = "square"; o2.detune.value = 9;
      const k = 18, c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; c[i] = (1 + k) * x / (1 + k * Math.abs(x)); } sh.curve = c;
      lp.type = "lowpass"; lp.Q.value = 3; g.gain.value = 0; p.panningModel = "HRTF"; p.positionZ ? (p.positionZ.value = -2) : p.setPosition(0, 0, -2);
      [o1, o2, o3].forEach(o => { o.connect(mix); o.start(); }); mix.gain.value = .35; mix.connect(sh); sh.connect(lp); lp.connect(g); g.connect(p); p.connect(bus.engine);
      g.gain.setTargetAtTime(.085, ctx.currentTime, .4); eng = { o1, o2, o3, lp, g }; // ronronnement discret : jamais une vibration dans la musique
    } else if (!start && eng) { const e = eng; eng = null; e.g.gain.setTargetAtTime(0, ctx.currentTime, .35); setTimeout(() => [e.o1, e.o2, e.o3].forEach(o => o.stop()), 1600); }
  }
  let lastR = -1, lastT = 0;
  function engineRpm(r) { if (!eng) return; const now = performance.now(); if (Math.abs(r - lastR) < .05 || now - lastT < 50) return; lastR = r; lastT = now;
    const t = ctx.currentTime, f = 32 + r * 24; [eng.o1.frequency, eng.o2.frequency, eng.o3.frequency, eng.lp.frequency, eng.g.gain].forEach(p => p.cancelScheduledValues(t));
    eng.o1.frequency.setTargetAtTime(f, t, .08); eng.o2.frequency.setTargetAtTime(f * 1.5, t, .08); eng.o3.frequency.setTargetAtTime(f / 2, t, .08);
    eng.lp.frequency.setTargetAtTime(180 + r * 380, t, .1); eng.g.gain.setTargetAtTime(.06 + r * .016, t, .12); }

  const NO_VOICE = new Set(["accel", "rocket"]); // ces voix ne disent pas le texte affiché : musique et effets seulement
  const SECTIONS = [["hero", ".hero"], ["drive", ".drive"], ["accel", ".chap--accel"], ["work", "#work"], ["rooms", ".rooms"], ["reels", "#reels"], ["services", "#services"], ["refer", "#refer"], ["offers", "#offers"],
    ["audit", "#audit"], ["devis", "#devis"], ["rocket", ".chap--space"], ["lab", "#lab"], ["values", ".chap--values"], ["contact", "#contact"]];
  const MUSIC_OF = { hero: "hero", drive: "drive", accel: "accel", work: "work", rooms: "rooms", reels: "work", services: "work", refer: "work", offers: "work", audit: "work", devis: "work", rocket: "rocket", lab: "rocket", values: "sky", contact: "contact" };
  function watch() {
    if (SVC) { document.querySelectorAll(".btn--gold,.off,.pj,.build-steps li").forEach(b => b.addEventListener("pointerenter", e => sfx("click", (e.clientX / innerWidth - .5) * 2, .3))); return; }
    if (!window.ScrollTrigger) return;
    SECTIONS.forEach(([n, s]) => { const e = document.querySelector(s); if (!e || e.hidden) return;
      ScrollTrigger.create({ trigger: e, start: "top 55%", end: "bottom 45%", onToggle: st => { if (st.isActive && on) { playMusic(MUSIC_OF[n] || n); if (!NO_VOICE.has(n)) voiceKey(n); } } }); });
    document.querySelector(".chap--space")?.addEventListener("chap", e => e.detail === 0 ? sfx("rocket", 0) : sfx("portal", e.detail % 2 ? .7 : -.7, .6));
    document.querySelector(".chap--values")?.addEventListener("chap", e => sfx(["wind", "wind", "portal", "wind", "chute"][e.detail] || "portal", e.detail % 2 ? .6 : -.6));
    addEventListener("dn:room", e => sfx("portal", e.detail % 2 ? .8 : -.8, .7));
    document.querySelectorAll(".btn--gold,.off,.tile,.pj").forEach(b => b.addEventListener("pointerenter", e => sfx("click", (e.clientX / innerWidth - .5) * 2, .3)));
  }
  function activeSection() { return SECTIONS.find(([n, s]) => { const e = document.querySelector(s); if (!e || e.hidden) return; const r = e.getBoundingClientRect(); return r.top < innerHeight * .55 && r.bottom > innerHeight * .45; }); }
  async function setOn(v) {
    if (!ctx) await init(); await ctx.resume(); on = v;
    btn.classList.toggle("is-on", on); btn.setAttribute("aria-pressed", on); btn.querySelector(".snd__t").textContent = on ? TX.off : TX.on; btn.setAttribute("aria-label", on ? TX.off : TX.on);
    try { sessionStorage.setItem("dn-sound", on ? "1" : "0"); } catch (_) {}
    if (on && SVC) { playMusic("drive"); const s = (D.SVC || []).find(x => x.id === SVC); if (s) voiceKey("cp_" + s.hot); } // la musique du cockpit continue, la voix présente le service
    else if (on) { const a = activeSection(); playMusic(MUSIC_OF[a ? a[0] : "hero"] || "hero"); if (a) voiceKey(a[0]); }
    else { if (music) { music.a.pause(); music = null; } if (curVoice) curVoice.pause(); sub.classList.remove("is-on"); engine(false); }
  }
  btn.addEventListener("click", () => setOn(!on));
  addEventListener("pagehide", () => { if (on && music && !music.a.paused) ss("dn-mpos", JSON.stringify({ f: music.f, t: music.a.currentTime, at: Date.now() })); });

  // choix déjà fait dans cette session (ou page de service) : pas de porte ; si le son était actif, il reprend au premier geste
  const prev = ss("dn-sound");
  if (SVC || prev !== null) {
    if (SVC ? prev !== "0" : prev === "1") {
      const EV = ["pointerdown", "keydown", "touchend", "scroll"], detach = () => EV.forEach(e => removeEventListener(e, arm));
      const arm = async () => { if (!ctx || ctx.state !== "running" || (music && music.a.paused)) { await setOn(true); if (music && music.a.paused) music.a.play().catch(() => {}); } if (ctx && ctx.state === "running" && !(music && music.a.paused)) detach(); };
      EV.forEach(e => addEventListener(e, arm, { passive: true }));
      if (prev === "1") setTimeout(arm, 300); // le navigateur autorise souvent la reprise après une navigation sur le même site (langue, service)
      if (SVC && prev === null) btn.classList.add("is-hint"); // première page de service sans choix : le bouton son clignote
    }
    window.DNAudio = { sfx, voiceKey, engine, engineRpm, get on() { return on; } };
    return;
  }
  // écran d'entrée : le premier geste démarre l'expérience sonore
  const gate = document.createElement("div"); gate.className = "gate"; gate.setAttribute("role", "dialog");
  gate.innerHTML = `<div class="gate__in"><img src="${BASE}assets/brand/crest.svg" alt="" width="86" height="108"><p class="gate__tag">${TX.tag}</p>
    <button type="button" class="btn btn--gold btn--xl gate__go"><span>${TX.go}</span><span class="btn__ico">◉</span></button><button type="button" class="gate__mute">${TX.mute}</button></div>`;
  document.body.appendChild(gate);
  let gated = true;
  const close = async withSound => { if (!gated) return; gated = false; ss("dn-sound", withSound ? "1" : "0"); gate.classList.add("is-out"); document.body.classList.remove("gated"); window.__lenis?.start?.();
    if (withSound) { await setOn(true); sfx("engine", 0, .9); } setTimeout(() => gate.remove(), 1200); };
  gate.querySelector(".gate__go").addEventListener("click", () => close(true));
  gate.querySelector(".gate__mute").addEventListener("click", () => close(false));
  const show = () => { document.body.classList.add("gated"); window.__lenis?.stop?.(); gate.classList.add("is-in"); gate.querySelector(".gate__go").focus({ preventScroll: true }); };
  show(); addEventListener("dn:ready", () => { if (gated) window.__lenis?.stop?.(); }, { once: true }); // porte affichée tout de suite (élément LCP), sans attendre le JavaScript lourd

  window.DNAudio = { sfx, voiceKey, engine, engineRpm, get on() { return on; } };
})();
