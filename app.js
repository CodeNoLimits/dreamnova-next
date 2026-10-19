(() => {
const D = window.DN;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LANGS = ["he", "en", "fr"];
const BASE = new URL("./", document.currentScript.src).href;
const seg = location.pathname.split("/").filter(Boolean).find(p => LANGS.includes(p));
const q = new URLSearchParams(location.search).get("lang");
const nav = (navigator.language || "en").slice(0, 2);
const L = LANGS.includes(seg) ? seg : LANGS.includes(q) ? q : (LANGS.includes(nav) ? nav : "en");
const T = D.I[L], RTL = L === "he";
document.documentElement.lang = L; document.documentElement.dir = RTL ? "rtl" : "ltr";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;
const mobile = () => innerWidth < 768;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wa = (extra, partner) => `https://wa.me/${D.WA}?text=${encodeURIComponent((partner ? T["wa.partner"] : T["wa.msg"]) + (extra ? " — " + extra : ""))}`;
const ARROW = RTL ? "↖" : "↗";

/* ---------- texte ---------- */
document.title = { he: "DreamNova — אנחנו בונים את הבלתי אפשרי", en: "DreamNova — We build the impossible", fr: "DreamNova — Nous construisons l'impossible" }[L];
$$("[data-i]").forEach(el => { const v = T[el.dataset.i]; if (v != null) el.textContent = v; });
$$(".nav__langs a,.menu__langs a").forEach(a => { const l = a.dataset.l || a.getAttribute("href").replace(/\W/g, ""); a.href = BASE + l + "/"; a.classList.toggle("is-on", l === L); });
$$("[data-wa]").forEach(a => { const k = a.dataset.wa; a.href = wa(k === "audit" ? T["off.a_title"] : "", k === "partner"); a.target = "_blank"; a.rel = "noopener"; });

$("[data-stats]").innerHTML = D.STATS[L].map(([b, s]) => `<div class="stat"><b class="gold-text" dir="ltr">${b}</b><span>${esc(s)}</span></div>`).join("");
const stack = D.STACK.map(s => `<span>${s}</span>`).join("");
$("[data-marquee]").innerHTML = stack + stack;

/* ---------- reel ---------- */
const works = D.WORKS.filter(w => !w.only || w.only === L);
const byId = Object.fromEntries(works.map(w => [w.id, w]));
const url = w => w.u && w.u.replace("{l}", L);
let n = 0;
const reelCards = D.REEL.map(r => {
  if (r.v) {
    n++;
    return `<article class="card ${r.w ? "card--wide" : ""}" data-cursor="${esc(T["work.view"])}">
      <video class="card__media" muted loop playsinline preload="none" poster="${BASE}assets/reel/poster_0${r.v.slice(-1)}.webp" data-src="${BASE}assets/reel/${r.v}.mp4"></video>
      <span class="card__num">${String(n).padStart(2, "0")}</span>
      <div class="card__meta"><div><span class="card__tag">${esc(r.tag[L])}</span><h3 class="card__title">${esc(r.t[L])}</h3></div></div></article>`;
  }
  const w = byId[r.p]; if (!w) return ""; n++;
  const u = url(w);
  return `<a class="card" ${u ? `href="${u}" target="_blank" rel="noopener"` : ""} data-cursor="${esc(T["work.view"])}">
    <img class="card__media" src="${BASE}assets/work/gal_${w.id}.webp" alt="${esc(w.t[L])}" loading="lazy" decoding="async">
    <span class="card__num">${String(n).padStart(2, "0")}</span>
    <div class="card__meta"><div><span class="card__tag">${esc(w.s[L])}</span><h3 class="card__title">${esc(w.t[L])}</h3></div><span class="card__go">${ARROW}</span></div></a>`;
}).join("");
$("[data-reel]").innerHTML = `<div class="card card--intro"><span class="eyebrow eyebrow--gold">DreamNova Studio</span><p>${esc(T["work.intro"])}</p><span class="card__go">${RTL ? "←" : "→"}</span></div>` + reelCards;

/* ---------- manifeste ---------- */
$("[data-manifesto]").innerHTML = T.manifesto.split(" ").map(w => {
  const g = w.includes("*"); return `<span class="w${g ? " g" : ""}">${esc(w.replace(/\*/g, ""))}</span>`;
}).join(" ");

/* ---------- services ---------- */
const ICONS = {
  film: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4-2.5z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
  wave: '<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><path d="M17 13.5v7M13.5 17h7"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>'
};
$("[data-bento]").innerHTML = D.SERVICES.map((s, i) => {
  const [t, p, chips] = s[L];
  return `<article class="tile reveal"><div class="tile__core">
    ${s.v ? `<video class="tile__video" muted loop playsinline preload="none" data-src="${BASE}assets/reel/${s.v}.mp4"></video>` : ""}
    <span class="tile__ico"><svg viewBox="0 0 24 24">${ICONS[s.ic]}</svg></span><span class="tile__n">${String(i + 1).padStart(2, "0")}</span>
    <h3>${esc(t)}</h3><p>${esc(p)}</p><div class="chips">${chips.map(c => `<span>${esc(c)}</span>`).join("")}</div>
  </div></article>`;
}).join("");

/* ---------- recommandations ---------- */
$("[data-refer]").innerHTML = D.REFER[L].map(([t, s, g], i) =>
  `<article class="who reveal"><span class="who__k">0${i + 1}</span><h3>${esc(t)}</h3><p class="who__sig">${esc(s)}</p><p class="who__give">${g}</p></article>`).join("");
$("[data-psteps]").innerHTML = D.PSTEPS[L].map(s => `<li>${esc(s)}</li>`).join("");

/* ---------- index + filtres ---------- */
$("[data-index]").innerHTML = works.map(w => {
  const u = url(w);
  return `<${u ? "a" : "div"} class="pj reveal ${u ? "" : "pj--private"}" data-c="${w.c}" ${u ? `href="${u}" target="_blank" rel="noopener"` : ""}>
    <img class="pj__img" src="${BASE}assets/work/gal_${w.id}.webp" alt="${esc(w.t[L])}" loading="lazy" decoding="async">
    <div class="pj__b"><div><div class="pj__s">${esc(w.s[L])}</div><div class="pj__t">${esc(w.t[L])}</div></div><span class="pj__a">${esc(u ? T["work.visit"].replace("↗", ARROW) : T["work.private"])}</span></div></${u ? "a" : "div"}>`;
}).join("");
const fb = $("[data-filters]");
fb.innerHTML = D.FILTERS[L].map(([k, v], i) => `<button role="tab" data-f="${k}" class="${i ? "" : "is-on"}" aria-selected="${!i}">${esc(v)}</button>`).join("");
fb.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  $$("button", fb).forEach(x => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-selected", x === b); });
  $$(".pj").forEach(p => p.classList.toggle("is-out", b.dataset.f !== "all" && p.dataset.c !== b.dataset.f));
  window.ScrollTrigger && ScrollTrigger.refresh();
});

/* ---------- offres ---------- */
$("[data-offers]").innerHTML = D.OFFERS[L].map(([t, d, [lab, p]], i) =>
  `<a class="off reveal" href="${wa(t)}" target="_blank" rel="noopener"><span class="off__n">${String(i + 1).padStart(2, "0")}</span><span class="off__t">${esc(t)}</span><span class="off__d">${esc(d)}</span><span class="off__p">${lab ? `<small>${esc(lab)}</small>` : ""}${esc(p)}</span><span class="off__c">${ARROW}</span></a>`).join("");

/* ---------- process + labo ---------- */
$("[data-process]").innerHTML = D.PROCESS[L].map(([t, p], i) => `<article class="step reveal"><span class="step__bar"></span><div class="step__n">0${i + 1}</div><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`).join("");
$("[data-lab]").innerHTML = D.LAB.map(x => `<article class="lc reveal"><svg class="lc__sig" viewBox="0 0 46 46"><circle cx="23" cy="23" r="21"/><circle cx="23" cy="23" r="14"/></svg><span class="lc__k">${x.k}</span><h3>${x.n}</h3><p>${esc(x[L])}</p></article>`).join("");

/* ---------- vidéos : lecture seulement à l'écran ---------- */
const vio = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target;
  if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause();
}), { rootMargin: "200px" });
$$("video[data-src]").forEach(v => vio.observe(v));

/* ---------- menu ---------- */
const burger = $(".nav__burger");
burger.addEventListener("click", () => { const o = document.body.classList.toggle("menu-open"); burger.setAttribute("aria-expanded", o); $(".menu").setAttribute("aria-hidden", !o); });
$$(".menu a").forEach(a => a.addEventListener("click", () => { document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", false); }));

/* ---------- hero WebGL : or liquide ---------- */
const mouse = { x: .5, y: .5, tx: .5, ty: .5 };
addEventListener("pointermove", e => { mouse.tx = e.clientX / innerWidth; mouse.ty = 1 - e.clientY / innerHeight; }, { passive: true });
(function gl() {
  const c = $(".hero__gl"), g = c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!g) { c.remove(); return; }
  const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  const fs = `precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.02;a*=.5;}return v;}
  void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=(gl_FragCoord.xy-.5*r)/r.y;
   vec2 mm=(m-.5)*vec2(r.x/r.y,1.);float T=t*.06;
   vec2 q=vec2(fbm(p*1.4+T),fbm(p*1.4+vec2(5.2,1.3)-T));
   vec2 s=vec2(fbm(p*1.4+3.5*q+vec2(1.7,9.2)+T*1.6+mm*.35),fbm(p*1.4+3.5*q+vec2(8.3,2.8)-T*1.2));
   float f=fbm(p*1.4+3.8*s);
   float ridge=pow(1.-abs(f*2.-1.),6.);
   vec3 col=vec3(.012,.009,.006);
   col=mix(col,vec3(.24,.16,.05),smoothstep(.25,.85,f));
   col=mix(col,vec3(.83,.66,.24),ridge*.85*smoothstep(.2,.9,length(s)));
   col+=vec3(1.,.9,.62)*pow(ridge,3.)*.55;
   col+=vec3(.07,.09,.13)*smoothstep(.6,1.,length(q))*.6;
   float d=length(p-mm);col+=vec3(.95,.75,.35)*.16*exp(-d*d*5.);
   col*=.55+.45*smoothstep(1.25,.15,length(p*vec2(.8,1.)));
   col=pow(col,vec3(.95));gl_FragColor=vec4(col,1.);}`;
  const sh = (t, s) => { const o = g.createShader(t); g.shaderSource(o, s); g.compileShader(o); return o; };
  const pr = g.createProgram(); g.attachShader(pr, sh(g.VERTEX_SHADER, vs)); g.attachShader(pr, sh(g.FRAGMENT_SHADER, fs)); g.linkProgram(pr);
  if (!g.getProgramParameter(pr, g.LINK_STATUS)) { c.remove(); return; }
  g.useProgram(pr);
  g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
  const loc = g.getAttribLocation(pr, "p"); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
  const uR = g.getUniformLocation(pr, "r"), uT = g.getUniformLocation(pr, "t"), uM = g.getUniformLocation(pr, "m");
  const scale = Math.min(devicePixelRatio, 1.5) * (mobile() ? .55 : .7);
  const size = () => { c.width = c.clientWidth * scale; c.height = c.clientHeight * scale; g.viewport(0, 0, c.width, c.height); };
  size(); addEventListener("resize", size);
  let vis = true; new IntersectionObserver(([e]) => vis = e.isIntersecting).observe(c);
  const t0 = performance.now();
  const loop = now => {
    requestAnimationFrame(loop); if (!vis) return;
    mouse.x += (mouse.tx - mouse.x) * .04; mouse.y += (mouse.ty - mouse.y) * .04;
    g.uniform2f(uR, c.width, c.height); g.uniform1f(uT, reduced ? 20 : (now - t0) / 1000); g.uniform2f(uM, mouse.x, mouse.y);
    g.drawArrays(g.TRIANGLES, 0, 3);
  };
  requestAnimationFrame(loop);
  window.__DNGL = true;
})();

/* ---------- curseur + aimant + spotlight ---------- */
if (finePointer && !reduced) {
  const cur = $(".cursor"), lab = $(".cursor__label"); let cx = innerWidth / 2, cy = innerHeight / 2, x = cx, y = cy;
  addEventListener("pointermove", e => { cx = e.clientX; cy = e.clientY; }, { passive: true });
  (function f() { x += (cx - x) * .2; y += (cy - y) * .2; cur.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(f); })();
  document.addEventListener("pointerover", e => {
    const v = e.target.closest("[data-cursor]"), a = e.target.closest("a,button");
    cur.classList.toggle("is-view", !!v); cur.classList.toggle("is-hover", !v && !!a); lab.textContent = v ? v.dataset.cursor : "";
  });
  $$(".magnetic").forEach(b => {
    b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`; });
    b.addEventListener("pointerleave", () => b.style.transform = "");
  });
  $$(".card:not(.card--intro)").forEach(cd => {
    cd.addEventListener("pointermove", e => { const r = cd.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; cd.style.transform = `perspective(1200px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`; });
    cd.addEventListener("pointerleave", () => cd.style.transform = "");
  });
}
$$(".tile").forEach(t => t.addEventListener("pointermove", e => { const r = t.getBoundingClientRect(); t.style.setProperty("--mx", e.clientX - r.left + "px"); t.style.setProperty("--my", e.clientY - r.top + "px"); }));

/* ---------- chargement ---------- */
let done = false;
const finish = () => { if (done) return; done = true; document.body.classList.remove("is-loading"); intro(); };
const cnt = $(".loader__count span"); let k = 0;
const tick = setInterval(() => { k = Math.min(100, k + 7 + Math.random() * 9); cnt.textContent = Math.floor(k); if (k >= 100) { clearInterval(tick); setTimeout(finish, 150); } }, 60);
setTimeout(finish, 2600); // filet de sécurité : la page ne reste jamais bloquée

/* ---------- animations ---------- */
function intro() {
  if (!window.gsap || reduced) { document.documentElement.classList.add("reduced"); window.__DN = { lang: L, reduced: true }; window.dispatchEvent(new Event("dn:ready")); return; }
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (window.Lenis && !mobile()) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => { const el = $(a.getAttribute("href")); if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -20 }); } }));
  }
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(".hero__title .line>*", { yPercent: 110, duration: 1.6, stagger: .12 })
    .from(".hero__eyebrow", { y: 20, opacity: 0, duration: 1 }, .2)
    .from(".hero__sub,.hero__ctas", { y: 30, opacity: 0, duration: 1.2, stagger: .1 }, .5)
    .from(".stat", { y: 30, opacity: 0, duration: 1.2, stagger: .08 }, .8)
    .from(".nav", { opacity: 0, duration: 1.2, clearProps: "opacity" }, .3)
    .from(".hero__gl", { opacity: 0, scale: 1.08, duration: 2.4, ease: "power2.out" }, 0);
  gsap.to(".hero__inner", { yPercent: -18, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  // cache la nav en descendant
  let last = 0; ScrollTrigger.create({ onUpdate: s => { const y = s.scroll(); $(".nav").classList.toggle("is-hidden", y > 400 && y > last && !document.body.classList.contains("menu-open")); last = y; } });

  // apparitions
  ScrollTrigger.batch(".reveal", { start: "top 88%", once: true,
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "expo.out", stagger: .07, overwrite: true }) });
  // titres : mot par mot derrière un masque
  $$(".sec-head .h2,.rooms__title").forEach(h => { h.innerHTML = h.textContent.split(" ").map(w => `<span class="wm"><span>${esc(w)}</span></span>`).join(" "); });
  gsap.utils.toArray(".sec-head").forEach(h => {
    gsap.from(h.querySelectorAll(".wm>span"), { yPercent: 110, duration: 1.3, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 85%" } });
    gsap.from([...h.children].filter(c => !c.classList.contains("h2")), { y: 40, opacity: 0, duration: 1.2, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 85%" } });
  });
  // inclinaison selon la vitesse de défilement
  const skewTo = gsap.quickTo(".pj,.who,.step", "skewY", { duration: .6, ease: "power3" });
  ScrollTrigger.create({ onUpdate: s => skewTo(gsap.utils.clamp(-5, 5, s.getVelocity() / -400)) });

  // carrousel épinglé (bureau)
  const mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    const track = $(".work__track");
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const st = gsap.to(track, { x: () => (RTL ? 1 : -1) * dist(), ease: "none",
      scrollTrigger: { trigger: ".work", start: "top top", end: () => "+=" + dist(), pin: ".work__pin", scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
    gsap.to(".work__progress span", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".work", start: "top top", end: () => "+=" + dist(), scrub: true } });
    return () => st.scrollTrigger && st.scrollTrigger.kill();
  });

  // manifeste mot à mot
  gsap.to(".manifesto__text .w", { opacity: 1, stagger: .05, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top 75%", end: "bottom 60%", scrub: true } });
  // barres du process
  gsap.to(".step__bar", { scaleX: 1, duration: 1.4, stagger: .2, ease: "expo.out", scrollTrigger: { trigger: ".process__steps", start: "top 80%" } });
  // titre contact
  gsap.from(".contact__title > *", { yPercent: 60, opacity: 0, duration: 1.4, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 70%" } });
  gsap.from(".foot__big", { yPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".foot", start: "top 95%" } });

  addEventListener("load", () => ScrollTrigger.refresh());
  window.__DN = { lang: L, lenis: !!lenis };
  window.dispatchEvent(new Event("dn:ready"));
}
})();
