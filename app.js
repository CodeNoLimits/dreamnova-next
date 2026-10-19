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
if (L === "fr") for (const k in T) T[k] = String(T[k]).replace(/ ([?!:;»])/g, "\u202F$1").replace(/« /g, "«\u202F");
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
$$("[data-q]").forEach(el => el.textContent = { he: "הצעת מחיר", en: "Quote", fr: "Devis" }[L]);
$$(".nav__langs a,.menu__langs a").forEach(a => { const l = a.dataset.l || a.getAttribute("href").replace(/\W/g, ""); a.href = BASE + l + "/"; a.classList.toggle("is-on", l === L); });
$$("[data-wa]").forEach(a => { const k = a.dataset.wa; a.href = wa(k === "audit" ? T["off.a_title"] : "", k === "partner"); a.target = "_blank"; a.rel = "noopener"; });

$("[data-stats]").innerHTML = D.STATS[L].map(([b, s]) => `<div class="stat"><b class="gold-text" dir="ltr">${b}</b><span>${esc(s)}</span></div>`).join("");
const stack = D.STACK.map(s => `<span>${s}</span>`).join("");
$("[data-marquee]").innerHTML = stack + stack;

/* ---------- reel ---------- */
const HE_FIRST = ["consult", "pinkas", "mehadrin", "editions", "diagnostic", "voiceava", "site3d"];
const works = D.WORKS.filter(w => !w.only || w.only === L).sort((a, b) => L !== "he" ? 0 : (HE_FIRST.indexOf(b.id) > -1) - (HE_FIRST.indexOf(a.id) > -1));
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
  const w = byId[r.p]; if (!w || (L === "he" && r.p === "lumen")) return ""; n++; // visuel en français : pas sur la page hébreu
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
  return `<a class="tile reveal" href="${BASE}${L}/s/${D.SVC[i].id}/"><div class="tile__core"><span class="tile__go">${esc(T["work.view"])} ${ARROW}</span>
    ${s.v ? `<video class="tile__video" muted loop playsinline preload="none" data-src="${BASE}assets/reel/${s.v}.mp4"></video>` : ""}
    <span class="tile__ico"><svg viewBox="0 0 24 24">${ICONS[s.ic]}</svg></span><span class="tile__n">${String(i + 1).padStart(2, "0")}</span>
    <h3>${esc(t)}</h3><p>${esc(p)}</p><div class="chips">${chips.map(c => `<span>${esc(c)}</span>`).join("")}</div>
  </div></a>`;
}).join("");

/* ---------- recommandations ---------- */
$("[data-refer]").innerHTML = D.REFER[L].map(([t, s, g], i) =>
  `<article class="who reveal"><span class="who__k">0${i + 1}</span><h3>${esc(t)}</h3><p class="who__sig">${esc(s)}</p><p class="who__give">${g}</p></article>`).join("");
$("[data-psteps]").innerHTML = D.PSTEPS[L].map(s => `<li>${esc(s)}</li>`).join("");

/* ---------- index + filtres ---------- */
const flo = document.createElement("div"); flo.className = "pj__float"; flo.innerHTML = "<img alt=''>"; document.body.appendChild(flo);
addEventListener("pointermove", e => { flo.style.left = e.clientX + "px"; flo.style.top = e.clientY + "px"; }, { passive: true });
$("[data-index]").innerHTML = works.map(w => {
  const u = url(w);
  return `<${u ? "a" : "div"} class="pj ${u ? "" : "pj--private"}" data-c="${w.c}" ${u ? `href="${u}" target="_blank" rel="noopener"` : ""}>
    <img class="pj__img" src="${BASE}assets/work/gal_${w.id}.webp" alt="${esc(w.t[L])}" loading="lazy" decoding="async">
    <div class="pj__b"><div><div class="pj__s">${esc(w.s[L])}</div><div class="pj__t">${esc(w.t[L])}</div></div><span class="pj__a">${esc(u ? T["work.visit"].replace("↗", ARROW) : T["work.private"])}</span></div></${u ? "a" : "div"}>`;
}).join("");
$("[data-index]").addEventListener("pointerover", e => { const p = e.target.closest(".pj"); if (!p) return flo.classList.remove("is-on"); flo.querySelector("img").src = p.querySelector(".pj__img").src; flo.classList.add("is-on"); });
$("[data-index]").addEventListener("pointerleave", () => flo.classList.remove("is-on"));
{ const rows = $$(".pj"); if (rows.length > 8) { rows.forEach((r, i) => i > 7 && r.classList.add("is-more"));
    const b = document.createElement("button"); b.type = "button"; b.className = "btn btn--glass index__more"; b.innerHTML = `<span>${esc({ he: "לכל העבודות", en: "See all work", fr: "Tout voir" }[L])} (${rows.length})</span><span class="btn__ico">+</span>`;
    b.onclick = () => { $("[data-index]").classList.add("is-open"); b.remove(); window.ScrollTrigger && ScrollTrigger.refresh(); }; $("[data-index]").after(b); } }
const fb = $("[data-filters]");
fb.innerHTML = D.FILTERS[L].map(([k, v], i) => `<button type="button" data-f="${k}" class="${i ? "" : "is-on"}" aria-pressed="${!i}">${esc(v)}</button>`).join("");
fb.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  $$("button", fb).forEach(x => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", x === b); });
  $$(".pj").forEach(p => p.classList.toggle("is-out", b.dataset.f !== "all" && p.dataset.c !== b.dataset.f));
  window.ScrollTrigger && ScrollTrigger.refresh();
});

/* ---------- offres ---------- */
$("[data-offers]").innerHTML = D.OFFERS[L].map(([t, d, [lab, p]], i) =>
  `<a class="off reveal${i > 5 ? " is-extra" : ""}" href="${wa(t)}" target="_blank" rel="noopener"><span class="off__n">${String(i + 1).padStart(2, "0")}</span><span class="off__t">${esc(t)}</span><span class="off__d">${esc(d)}</span><span class="off__p">${lab ? `<small>${esc(lab)}</small>` : ""}${esc(p)}</span><span class="off__c">${ARROW}</span></a>`).join("");

{ const ol = $("[data-offers]"), more = document.createElement("button");
  more.className = "btn btn--glass offers__more"; more.innerHTML = `<span>${esc({ he: "לכל ההצעות", en: "All offers", fr: "Toutes les offres" }[L])} (${D.OFFERS[L].length})</span><span class="btn__ico">+</span>`;
  more.onclick = () => { ol.classList.add("is-open"); more.remove(); window.ScrollTrigger && ScrollTrigger.refresh(); };
  ol.after(more); }

/* ---------- process + labo ---------- */
$("[data-process]").innerHTML = D.PROCESS[L].map(([t, p], i) => `<article class="step reveal"><span class="step__bar"></span><div class="step__n">0${i + 1}</div><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`).join("");
$("[data-lab]").innerHTML = D.LAB.map(x => `<article class="lc reveal"><svg class="lc__sig" viewBox="0 0 46 46"><circle cx="23" cy="23" r="21"/><circle cx="23" cy="23" r="14"/></svg><span class="lc__k">${x.k}</span><h3>${x.n}</h3><p>${esc(x[L])}</p></article>`).join("");

/* ---------- vidéos : lecture seulement à l'écran ---------- */
const vio = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target;
  if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause();
}), { rootMargin: "200px" });
$$("video[data-src]").filter(v => !v.closest(".room-card")).forEach(v => vio.observe(v)); // les cartes des salles ont leur propre lecteur (une seule à la fois)
/* ---------- fond du final (cockpit) : image adaptée à l'écran, chargée à l'approche ---------- */
{ const dash = $(".contact__dash"); if (dash) { const io = new IntersectionObserver(es => { if (!es.some(e => e.isIntersecting)) return;
    dash.style.backgroundImage = `url(${BASE}assets/${mobile() ? "car2/cockpit_m.webp" : "car/cockpit.webp"})`; io.disconnect(); }, { rootMargin: "1500px 0px" }); io.observe(dash); } }

document.querySelector(".startbtn")?.addEventListener("click", () => window.DNAudio?.sfx("engine", 0, 1));
/* ---------- bouton flottant : masqué là où il gênerait ---------- */
{ const vis = new Set(); const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)); document.body.classList.toggle("no-fab", vis.size > 0); });
  ["#devis", "#contact", ".foot"].forEach(s => { const e = $(s); if (e) io.observe(e); }); }
/* ---------- menu ---------- */
const burger = $(".nav__burger");
burger.addEventListener("click", () => { const o = document.body.classList.toggle("menu-open"); burger.setAttribute("aria-expanded", o); $(".menu").setAttribute("aria-hidden", !o); });
$$(".menu a").forEach(a => a.addEventListener("click", () => { document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", false); $(".menu").setAttribute("aria-hidden", true); }));

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
    g.uniform2f(uR, c.width, c.height); g.uniform1f(uT, reduced ? 20 : (now - t0) / 1000);
    if (reduced) { g.drawArrays(g.TRIANGLES, 0, 3); vis = false; return; } g.uniform2f(uM, mouse.x, mouse.y);
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
// le rideau tombe dès que les polices sont prêtes (et le tracé de l'écusson fini)
Promise.all([document.fonts ? document.fonts.ready : 0, new Promise(r => setTimeout(r, mobile() ? 350 : 900))]).then(finish);
setTimeout(finish, 2400); // filet de sécurité : la page ne reste jamais bloquée

/* ---------- animations ---------- */
function intro() {
  if (!window.gsap || reduced) { document.documentElement.classList.add("reduced"); window.__DN = { lang: L, reduced: true }; window.dispatchEvent(new Event("dn:ready")); return; }
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (window.Lenis && !mobile()) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true }); window.__lenis = lenis; if (document.body.classList.contains("gated")) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => { const el = $(a.getAttribute("href")); if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -20 }); } }));
  }
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.from(".hero__title .line>*", { yPercent: 110, duration: mobile() ? .9 : 1.4, stagger: .1 })
    .from(".hero__eyebrow", { y: 20, opacity: 0, duration: 1 }, .2)
    .from(".hero__sub,.hero__ctas", { y: 30, opacity: 0, duration: 1.2, stagger: .1 }, .5)
    .from(".stat", { y: 30, opacity: 0, duration: 1.2, stagger: .08 }, .8)
    .from(".nav", { opacity: 0, duration: 1.2, clearProps: "opacity" }, .3)
    .from(".hero__gl", { opacity: 0, scale: 1.08, duration: 2.4, ease: "power2.out" }, 0);
  gsap.to(".hero__inner", { yPercent: -18, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  ScrollTrigger.create({ trigger: ".hero", start: "bottom 60%", onEnter: () => document.body.classList.add("past-hero"), onLeaveBack: () => document.body.classList.remove("past-hero") });
  ScrollTrigger.create({ trigger: ".manifesto", start: "top 60px", end: "bottom 60px", toggleClass: { targets: ".nav", className: "on-light" } });
  // cache la nav en descendant
  let last = 0; ScrollTrigger.create({ onUpdate: s => { const y = s.scroll(); $(".nav").classList.toggle("is-hidden", y > 400 && y > last && !document.body.classList.contains("menu-open")); last = y; } });

  // apparitions
  ScrollTrigger.batch(".reveal:not(.who):not(.step):not(.lc):not(.off)", { start: mobile() ? "top 100%" : "top 88%", once: true,
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, filter: "blur(0px)", duration: mobile() ? .45 : 1.2, ease: "expo.out", stagger: mobile() ? .03 : .07, overwrite: true, clearProps: "transform" }) });
  // titres : mot par mot derrière un masque
  $$(".sec-head .h2,.rooms__title").forEach(h => { h.innerHTML = h.textContent.split(" ").map(w => `<span class="wm"><span>${esc(w)}</span></span>`).join(" "); });
  gsap.utils.toArray(".sec-head").forEach(h => {
    gsap.from(h.querySelectorAll(".wm>span"), { yPercent: 110, duration: 1.3, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 85%" } });
    gsap.from([...h.children].filter(c => !c.classList.contains("h2")), { y: 40, opacity: 0, duration: 1.2, stagger: .08, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 85%" } });
  });
  // index : un seul lot propre, sans décalage résiduel
  { const rows = $$(".index__grid .pj"); gsap.set(rows, { opacity: 0, y: 24 });
    ScrollTrigger.create({ trigger: ".index__grid", start: "top 90%", once: true, onEnter: () => gsap.to(rows, { opacity: 1, y: 0, stagger: .04, duration: .5, ease: "power2.out", clearProps: "transform,opacity" }) }); }
  // cartes : entrée en vrille 3D, puis vrille complète au survol
  const SPIN = ".who,.step,.lc,.off", TOUCH = matchMedia("(hover: none)").matches || mobile();
  gsap.set(SPIN, { transformPerspective: 1100 });
  ScrollTrigger.batch(SPIN, { start: TOUCH ? "top 100%" : "top 92%", once: true, onEnter: b => gsap.fromTo(b,
    TOUCH ? { y: 24, opacity: 0 } : { rotationY: (RTL ? -1 : 1) * 115, rotationX: 22, z: -320, opacity: 0, transformOrigin: "50% 50% -140px" },
    TOUCH ? { y: 0, opacity: 1, duration: .4, ease: "power2.out", stagger: .03, overwrite: true, clearProps: "transform" } : { rotationY: 0, rotationX: 0, z: 0, opacity: 1, duration: 1.7, ease: "expo.out", stagger: .07, overwrite: true, clearProps: "transform" }) });
  $$(".who").forEach(el => el.addEventListener("pointerenter", () => {
    if (el._spin || matchMedia("(hover: none)").matches) return; el._spin = 1;
    gsap.fromTo(el, { rotationY: 0 }, { rotationY: (RTL ? -360 : 360), duration: 1.25, ease: "power3.inOut", onComplete: () => { gsap.set(el, { rotationY: 0 }); el._spin = 0; } });
  }));

  // carrousel épinglé (bureau)
  const mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    const track = $(".work__track");
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const st = gsap.to(track, { x: () => (RTL ? 1 : -1) * dist(), ease: "none",
      scrollTrigger: { trigger: ".work", start: "top top", end: () => "+=" + dist(), pin: ".work__pin", scrub: 1, invalidateOnRefresh: true, anticipatePin: 1, refreshPriority: 8 } });
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
