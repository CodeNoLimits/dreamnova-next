// Son : coupé par défaut ; musique par section (fondus), voix narratrice + sous-titres, effets. Bus séparés, musique baissée sous la voix.
(() => {
  const D = window.DN, L = document.documentElement.lang, BASE = new URL("./", document.currentScript.src).href, A = BASE + "assets/audio/";
  if (!(D.ON || {}).audio) return;
  const btn = document.createElement("button"); btn.className = "snd"; btn.type = "button";
  const lab = { he: ["הפעלת סאונד", "השתקה"], en: ["Sound on", "Mute"], fr: ["Activer le son", "Couper le son"] }[L];
  btn.innerHTML = `<span class="snd__bars"><i></i><i></i><i></i><i></i></span><span class="snd__t">${lab[0]}</span>`;
  btn.setAttribute("aria-pressed", "false"); document.querySelector(".nav").insertBefore(btn, document.querySelector(".nav__burger"));
  const sub = document.createElement("div"); sub.className = "subs"; sub.setAttribute("aria-live", "polite"); document.body.appendChild(sub);
  let ctx, bus, on = false, man = null, voices = {}, cur = null, played = new Set(), current = null;
  const SECTIONS = [["hero", ".hero"], ["drive", ".drive"], ["accel", ".chap--accel"], ["work", "#work"], ["rooms", ".rooms"], ["services", "#services"], ["refer", "#refer"], ["offers", "#offers"], ["devis", "#devis"], ["rocket", ".chap--space"], ["sky", ".chap--values"], ["lab", "#lab"], ["contact", "#contact"]];
  const has = f => man && man.files && man.files.includes(f);
  async function init() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    bus = {}; for (const k of ["music", "voice", "sfx"]) { bus[k] = ctx.createGain(); bus[k].connect(ctx.destination); }
    bus.music.gain.value = .55; bus.voice.gain.value = 1; bus.sfx.gain.value = .7;
    try { man = await (await fetch(A + "manifest.json")).json(); man.files = (man.files || man.items || man).map?.(x => x.file || x) || []; } catch (_) { man = { files: [] }; }
    try { voices = await (await fetch(A + "voices.json")).json(); } catch (_) {}
    watch();
  }
  const el = (f, loop) => { const a = new Audio(A + f); a.loop = !!loop; a.crossOrigin = "anonymous"; a.preload = "auto"; return a; };
  const node = (a, b) => { const s = ctx.createMediaElementSource(a), g = ctx.createGain(); s.connect(g); g.connect(b); return g; };
  function music(name) {
    const f = has(`loop_${name}.mp3`) ? `loop_${name}.mp3` : "theme.mp3"; if (current && current.f === f) return;
    const a = el(f, true), g = node(a, bus.music); g.gain.value = 0; a.play().catch(() => {});
    g.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
    if (current) { const o = current; o.g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5); setTimeout(() => o.a.pause(), 1700); }
    current = { f, a, g };
  }
  function voice(name) {
    const f = `voice_${name}_${L}.mp3`; if (played.has(name) || !has(f)) return; played.add(name);
    if (cur) cur.pause(); const a = el(f); node(a, bus.voice); cur = a;
    bus.music.gain.linearRampToValueAtTime(.18, ctx.currentTime + .4);
    const txt = voices[name] && voices[name][L]; if (txt) { sub.textContent = txt; sub.classList.add("is-on"); }
    a.onended = () => { bus.music.gain.linearRampToValueAtTime(.55, ctx.currentTime + 1); sub.classList.remove("is-on"); };
    a.play().catch(() => {});
  }
  const SFX = { engine: "sfx_engine_start.mp3", rev: "sfx_engine_rev.mp3", accel: "sfx_accel_whoosh.mp3", rocket: "sfx_rocket_launch.mp3", wind: "sfx_wind_freefall.mp3", chute: "sfx_parachute_open.mp3", portal: "sfx_portal_whoosh.mp3", click: "sfx_click_gold.mp3" };
  function sfx(k) { if (!on || !SFX[k] || !has(SFX[k])) return; const a = el(SFX[k]); node(a, bus.sfx); a.play().catch(() => {}); }
  function watch() {
    if (!window.ScrollTrigger) return;
    SECTIONS.forEach(([n, s]) => { const e = document.querySelector(s); if (!e || e.hidden) return;
      ScrollTrigger.create({ trigger: e, start: "top 55%", end: "bottom 45%", onToggle: st => { if (st.isActive && on) { music(n); voice(n); } } }); });
    document.querySelector(".drive")?.addEventListener("transitionstart", () => {});
    new MutationObserver(() => { if (document.querySelector(".drive")?.classList.contains("is-in")) sfx("engine"); }).observe(document.querySelector(".drive") || document.body, { attributes: true, attributeFilter: ["class"] });
    document.querySelector(".chap--space")?.addEventListener("chap", e => e.detail === 0 && sfx("rocket"));
    document.querySelector(".chap--values")?.addEventListener("chap", e => sfx(["wind", "wind", "portal", "wind", "chute"][e.detail] || "portal"));
    document.querySelectorAll(".hot,.drive__chips a,.btn--gold").forEach(b => b.addEventListener("pointerenter", () => sfx("click")));
  }
  btn.addEventListener("click", async () => {
    if (!ctx) await init(); await ctx.resume(); on = !on;
    btn.classList.toggle("is-on", on); btn.setAttribute("aria-pressed", on); btn.querySelector(".snd__t").textContent = lab[on ? 1 : 0];
    if (on) { const active = SECTIONS.find(([n, s]) => { const e = document.querySelector(s); if (!e) return; const r = e.getBoundingClientRect(); return r.top < innerHeight * .55 && r.bottom > innerHeight * .45; }); music(active ? active[0] : "hero"); if (active) voice(active[0]); }
    else { if (current) { current.a.pause(); current = null; } if (cur) cur.pause(); sub.classList.remove("is-on"); }
  });
  window.DNAudio = { sfx };
})();
