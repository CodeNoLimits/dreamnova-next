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
/* recommandation : ?ref=laura ajoute la mention dans le message WhatsApp (attribution des 20 %) */
const REFS = { laura: "Laura" }, REFK = (new URLSearchParams(location.search).get("ref") || "").toLowerCase(), REFWHO = REFS[REFK] || "";
const REFTX = { fr: "de la part de", en: "recommended by", he: "בהמלצת" }[L];
const wa = (extra, partner) => `https://wa.me/${D.WA}?text=${encodeURIComponent((partner ? T["wa.partner"] : T["wa.msg"]) + (extra ? " — " + extra : "") + (REFWHO ? ` (${REFTX} ${REFWHO})` : ""))}`;
const ARROW = RTL ? "↖" : "↗";

/* ---------- texte ---------- */
document.title = { he: "DreamNova — אנחנו בונים את הבלתי אפשרי", en: "DreamNova — We build the impossible", fr: "DreamNova — Nous construisons l'impossible" }[L];
$$("[data-i]").forEach(el => { const v = T[el.dataset.i]; if (v != null) el.textContent = v; });
$$("[data-q]").forEach(el => el.textContent = { he: "הצעת מחיר", en: "Quote", fr: "Devis" }[L]);
$$("[data-a]").forEach(el => el.textContent = { he: "אבחון AI חינם", en: "Free AI audit", fr: "Audit IA gratuit" }[L]);
$$(".nav__langs a,.menu__langs a").forEach(a => { const l = a.dataset.l || a.getAttribute("href").replace(/\W/g, ""); a.href = BASE + l + "/"; a.classList.toggle("is-on", l === L); });
$$("[data-wa]").forEach(a => { const k = a.dataset.wa; a.href = wa(k === "audit" ? T["off.a_title"] : "", k === "partner"); a.target = "_blank"; a.rel = "noopener"; });

$("[data-stats]").innerHTML = D.STATS[L].map(([b, s]) => `<div class="stat"><b class="gold-text" dir="ltr">${b}</b><span>${esc(s)}</span></div>`).join("");
const stack = D.STACK.map(s => `<span>${s}</span>`).join("");
$("[data-marquee]").innerHTML = stack + stack;

/* ---------- reel ---------- */
const HE_FIRST = ["site3d", "voiceava", "editions", "mehadrin", "diagnostic", "pinkas", "reseau"];
const works = D.WORKS.filter(w => !w.only || w.only === L).sort((a, b) => L !== "he" ? 0 : (HE_FIRST.indexOf(b.id) > -1) - (HE_FIRST.indexOf(a.id) > -1));
const byId = Object.fromEntries(works.map(w => [w.id, w]));
const url = w => w.u && w.u.replace("{l}", L);
const gal = (w, sm) => `${BASE}assets/work/gal_${w.id}${w.id === "site3d" ? "_" + L : ""}${sm ? "_s" : ""}.webp`; // vignette dans la langue de la page (sm = 600 px)
const svcOf = w => D.SVC.filter(s => s.w.includes(w.id)).map(s => s.id).join(" ");
let n = 0;
const reelCards = D.REEL.map(r => {
  if (r.v) {
    n++;
    return `<article class="card ${r.w ? "card--wide" : ""}" data-cursor="${esc(T["work.view"])}">
      <video class="card__media" muted loop playsinline preload="none" poster="${BASE}assets/reel/poster_0${r.v.slice(-1)}.webp" data-src="${BASE}assets/reel/${r.v}.mp4"></video><img class="card__pre" src="${BASE}assets/reel/poster_0${r.v.slice(-1)}.webp" alt="" ${n < 2 ? 'fetchpriority="high"' : 'loading="lazy"'} aria-hidden="true">
      <span class="card__num">${String(n).padStart(2, "0")}</span>
      <div class="card__meta"><div><span class="card__tag">${esc(r.tag[L])}</span><h3 class="card__title">${esc(r.t[L])}</h3></div></div></article>`;
  }
  const w = byId[r.p]; if (!w || (L === "he" && r.p === "lumen")) return ""; n++; // visuel en français : pas sur la page hébreu
  const u = url(w);
  return `<a class="card" ${u ? `href="${u}" target="_blank" rel="noopener"` : ""} data-cursor="${esc(T["work.view"])}">
    <img class="card__media" src="${gal(w)}" alt="${esc(w.t[L])}" loading="lazy" decoding="async">
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
{ const SI = D.STUDIO_I[L], OF = D.OFFERS[L];
  const price = i => { const o = (D.SVC[i].o || []).map(k => OF[k]).filter(Boolean).find(x => x[2][0]); return o ? `<span class="tile__price"><small>${esc(o[2][0])}</small>${esc(o[2][1])}</span>` : `<span class="tile__price"><small>${esc(SI.quote)}</small></span>`; };
  $("[data-bento]").innerHTML = D.SERVICES.map((s, i) => {
    const [t, p, chips] = s[L], id = D.SVC[i].id, b = SI.badges[id];
    return `<a class="tile reveal" href="${BASE}${L}/s/${id}/"><div class="tile__core">
      <div class="tile__media"><img src="${BASE}assets/svcclip/poster_${id}.webp" alt="" loading="lazy" width="1280" height="720"><video muted loop playsinline preload="none" data-clip="${BASE}assets/svcclip/svc_${id}.mp4"></video>${b ? `<span class="tile__badge tile__badge--${b}">${esc(SI[b])}</span>` : ""}</div>
      <span class="tile__n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(t)}</h3><p>${esc(p)}</p><div class="chips">${chips.slice(0, 3).map(c => `<span>${esc(c)}</span>`).join("")}</div>
      <span class="tile__foot">${price(i)}<span class="tile__go">${esc(SI.open)} ${ARROW}</span></span>
    </div></a>`;
  }).join("");
  // clip joué seulement au survol (ordinateur) ou quand la carte est au centre (téléphone) ; une seule vidéo à la fois
  const tiles = $$(".tile"), play = v => { if (!v.src) v.src = v.dataset.clip; v.play().catch(() => {}); v.classList.add("is-on"); }, stop = v => { v.pause(); v.classList.remove("is-on"); };
  if (matchMedia("(hover:hover)").matches) tiles.forEach(t => { const v = t.querySelector("video"); t.addEventListener("pointerenter", () => play(v)); t.addEventListener("pointerleave", () => stop(v)); });
  else { const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target.querySelector("video"); e.intersectionRatio > .75 ? (tiles.forEach(o => o !== e.target && stop(o.querySelector("video"))), play(v)) : stop(v); }), { threshold: [0, .75] }); tiles.forEach(t => io.observe(t)); } }

/* ---------- Now (produit phare, avant-première) ---------- */
{ const NI = D.NOW_I[L]; $$("[data-n2]").forEach(e => e.textContent = NI[e.dataset.n2]);
  $("[data-now]").innerHTML = NI.pts.map(([t, d], i) => `<article class="who reveal"><span class="who__k">0${i + 1}</span><h3>${esc(t)}</h3><p class="who__sig">${esc(d)}</p></article>`).join("");
  const a = $("[data-now-wa]"); if (a) { a.href = wa("Now"); a.target = "_blank"; a.rel = "noopener"; } }

/* ---------- chiffres réels (calculés depuis content.js, jamais saisis à la main) ---------- */
{ const LB = { he: ["שירותים", "פרויקטים", "רילס", "טכנולוגיות"], en: ["services", "projects shown here", "reels", "technologies"], fr: ["services", "projets présentés ici", "reels", "technologies"] }[L];
  const N = [D.SVC.length, D.WORKS.filter(w => !w.only || w.only === L).length, D.REELS.length, D.STACK.length];
  $("[data-live]").innerHTML = N.map((n, i) => L === "he" && i === 1 ? "" : `<li class="live__it reveal"><b class="gold-text" dir="ltr">${n}</b><span>${esc(LB[i])}</span></li>`).join(""); }
/* ---------- bandeau d'avantages sous l'ouverture (fr/en ; hébreu à relire) ---------- */
{ const P = { fr: [["Appel découverte offert", "Audit IA gratuit en 1 minute", "Devis clair en 1 minute"], "Commencer"], en: [["Free discovery call", "Free AI audit in one minute", "Clear quote in one minute"], "Start"] }[L], el = $("[data-promo]");
  if (P && el) { el.hidden = false; el.innerHTML = `<ul class="promo__l">${P[0].map(t => `<li><span class="promo__dot" aria-hidden="true"></span>${esc(t)}</li>`).join("")}</ul><a class="btn btn--gold btn--sm promo__go" href="#conseil"><span>${esc(P[1])}</span><span class="btn__ico">↘</span></a>`; } }
/* ---------- conseil (fr/en ; l'hébreu attend un texte relu) : arrivée des liens de recommandation ---------- */
{ const CI = D.CONSEIL_I[L], sec = $("#conseil"); if (CI && sec) { sec.hidden = false;
  $$("[data-c3]").forEach(e => { if (e.dataset.c3 !== "ref") e.textContent = CI[e.dataset.c3]; });
  $("[data-conseil]").innerHTML = CI.c.map(([t, d, h, c], i) => { const w = h === "#contact"; return `<li class="cx__s reveal"><a class="cx__card${i ? "" : " cx__card--main"}" href="${w ? wa(t) : h}"${w ? ' target="_blank" rel="noopener"' : ""}><span class="cx__n" aria-hidden="true">0${i + 1}</span><span class="cx__body"><b>${esc(t)}</b><span>${esc(d)}</span></span><span class="cx__go">${esc(c)} <span aria-hidden="true">${w ? "↗" : "↘"}</span></span></a></li>`; }).join("");
  const r = $("[data-c3=ref]"); if (r && REFWHO) { r.textContent = CI.ref.replace("{who}", REFWHO); r.hidden = false; }
  const v = sec.querySelector(".cx__vid"); /* vidéo chargée seulement près de l'écran ; jamais avec « mouvement réduit » */
  if (v && !matchMedia("(prefers-reduced-motion: reduce)").matches) new IntersectionObserver(([en]) => { if (en.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause(); }, { rootMargin: "300px 0px" }).observe(sec); } }
/* ---------- gratuit, tout de suite ---------- */
{ const FI = D.FREE_I[L]; $$("[data-f2]").forEach(e => e.textContent = FI[e.dataset.f2]);
  $("[data-free]").innerHTML = FI.c.map(([t, d, h, c], i) => { const ext = h.startsWith("http"); return `<a class="who free__card reveal" href="${h}"${ext ? ' target="_blank" rel="noopener"' : ""}><span class="who__k">0${i + 1}${ext ? " · EN" : ""}</span><h3>${esc(t)}</h3><p class="who__sig">${esc(d)}</p><span class="btn btn--gold free__btn"><span>${esc(c)}</span><span class="btn__ico">${ext ? "↗" : "↘"}</span></span></a>`; }).join(""); }

/* ---------- recommandations ---------- */
$("[data-refer]").innerHTML = D.REFER[L].map(([t, s, g], i) =>
  `<article class="who reveal"><span class="who__k">0${i + 1}</span><h3>${esc(t)}</h3><p class="who__sig">${esc(s)}</p><p class="who__give">${g}</p></article>`).join("");
$("[data-psteps]").innerHTML = D.PSTEPS[L].map(s => `<li>${esc(s)}</li>`).join("");

/* ---------- index + filtres ---------- */
const flo = document.createElement("div"); flo.className = "pj__float"; flo.innerHTML = "<img alt=''>"; document.body.appendChild(flo);
addEventListener("pointermove", e => { flo.style.left = e.clientX + "px"; flo.style.top = e.clientY + "px"; }, { passive: true });
$("[data-index]").innerHTML = works.map(w => {
  const u = url(w);
  return `<${u ? "a" : "div"} class="pj ${u ? "" : "pj--private"}" data-sv="${svcOf(w)}" ${u ? `href="${u}" target="_blank" rel="noopener"` : ""}>
    <img class="pj__img" src="${gal(w)}" srcset="${gal(w, 1)} 600w, ${gal(w)} 1200w" sizes="(max-width: 767px) 120px, 340px" width="1200" height="750" alt="${esc(w.t[L])}" loading="lazy" decoding="async">
    <div class="pj__b"><div><div class="pj__s">${esc(w.s[L])}${w.demo && w.demo !== L ? ` <span class="pj__lang">${w.demo.toUpperCase()}</span>` : ""}</div><div class="pj__t">${esc(w.t[L])}</div>${w.r ? `<div class="pj__r">${esc(w.r[L])}</div>` : ""}</div><span class="pj__a">${esc(u ? T["work.visit"].replace("↗", ARROW) : T["work.private"])}</span></div></${u ? "a" : "div"}>`;
}).join("");
$("[data-index]").addEventListener("pointerover", e => { const p = e.target.closest(".pj"); if (!p) return flo.classList.remove("is-on"); flo.querySelector("img").src = p.querySelector(".pj__img").src; flo.classList.toggle("is-fr", !!p.querySelector(".pj__lang")); flo.classList.add("is-on"); });
$("[data-index]").addEventListener("pointerleave", () => flo.classList.remove("is-on"));
{ const rows = $$(".pj"); if (rows.length > 8) { rows.forEach((r, i) => i > 7 && r.classList.add("is-more"));
    const b = document.createElement("button"); b.type = "button"; b.className = "btn btn--glass index__more"; b.innerHTML = `<span>${esc({ he: "לכל העבודות", en: "See all work", fr: "Tout voir" }[L])} (${rows.length})</span><span class="btn__ico">+</span>`;
    b.onclick = () => { $("[data-index]").classList.add("is-open"); b.remove(); window.ScrollTrigger && ScrollTrigger.refresh(); }; $("[data-index]").after(b); } }
const fb = $("[data-filters]");
// filtre par service (mêmes intitulés que les services ; un service sans réalisation dans la langue n'apparaît pas)
fb.innerHTML = [["all", D.FILTERS[L][0][1]], ...D.SVC.map((s, i) => [s.id, D.SERVICES[i][L][0]])]
  .filter(([k]) => k === "all" || works.some(w => svcOf(w).split(" ").includes(k)))
  .map(([k, v], i) => `<button type="button" data-f="${k}" class="${i ? "" : "is-on"}" aria-pressed="${!i}">${esc(v)}</button>`).join("");
fb.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  $$("button", fb).forEach(x => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", x === b); });
  const f = b.dataset.f, grid = $("[data-index]");
  if (f !== "all") { grid.classList.add("is-open"); $(".index__more")?.remove(); } // un filtre montre toutes ses réalisations
  const shown = $$(".pj", grid).filter(p => { const on = f === "all" || p.dataset.sv.split(" ").includes(f); p.classList.toggle("is-out", !on); return on; });
  window.gsap && gsap.fromTo(shown, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, stagger: .035, ease: "power2.out", clearProps: "transform,opacity" });
  window.ScrollTrigger && ScrollTrigger.refresh();
});

/* ---------- reels ---------- */
{ const RI = D.REELS_I[L]; $$("[data-r2]").forEach(e => e.textContent = RI[e.dataset.r2]);
  const list = (D.REELS || []).filter(r => r.lang === L); // seulement les reels de la langue de la page
  const box = $("[data-reels]"); if (box) { if (!list.length) { $("#reels").hidden = true; $$('a[href="#reels"]').forEach(a => a.remove()); }
    const MOB = matchMedia("(max-width:767px)").matches; // téléphone : rien n'est téléchargé avant le toucher (4 Mo)
    box.insertAdjacentHTML("beforebegin", `<figure class="sigfilm"><video ${MOB ? "data-msrc" : "data-src"}="${BASE}assets/sig/signature_${L}_16x9.mp4" ${MOB ? "poster" : "data-poster"}="${BASE}assets/sig/signature_${L}_16x9.webp" muted loop playsinline preload="none"></video><button type="button" class="reel__snd" aria-label="${esc(RI.tap)}">🔊</button></figure>`);
    $(".sigfilm").addEventListener("click", () => { const b = $(".sigfilm .reel__snd"), v = $(".sigfilm video"); if (v.dataset.msrc && !v.src) { v.src = v.dataset.msrc; v.muted = true; } v.muted = !v.muted; b.classList.toggle("is-on", !v.muted); if (!v.muted) { v.currentTime = 0; v.play().catch(() => {}); $$(".reel video", box).forEach(o => { o.muted = true; }); $$(".reel__snd", box).forEach(o => o.classList.remove("is-on")); } });
    box.innerHTML = list.map(r => `<figure class="reel"><div class="reel__frame"><video data-src="${BASE}assets/reels/${r.id}.mp4" data-poster="${BASE}assets/reels/${r.id}.webp" muted loop playsinline preload="none"></video><button type="button" class="reel__snd" aria-label="${esc(RI.tap)}">🔊</button></div><figcaption>${esc(r.t[L])}</figcaption></figure>`).join("");
    box.addEventListener("click", e => { const b = e.target.closest(".reel__snd"); if (!b) return; const v = b.previousElementSibling; v.muted = !v.muted; b.classList.toggle("is-on", !v.muted); if (!v.muted) { v.currentTime = 0; v.play().catch(() => {}); $$(".reel video", box).forEach(o => { if (o !== v) o.muted = true; }); const sg = $(".sigfilm video"); if (sg) { sg.muted = true; $(".sigfilm .reel__snd").classList.remove("is-on"); } $$(".reel__snd", box).forEach(o => o !== b && o.classList.remove("is-on")); } }); } }

/* ---------- cours (exemple anonymisé) ---------- */
{ const CI = D.COURSE_I[L]; $$("[data-c2]").forEach(e => e.textContent = CI[e.dataset.c2]);
  $("[data-course]").innerHTML = CI.s.map(([t, d]) => `<article class="who reveal"><h3>${esc(t)}</h3><p class="who__sig">${esc(d)}</p></article>`).join("");
  const a = $("[data-course-wa]"); if (a) { a.href = wa(CI.eyebrow); a.target = "_blank"; a.rel = "noopener"; } }

/* ---------- offres ---------- */
const isQuote = o => !o[2][0] && /devis|quote|הצעת/i.test(o[2][1]);
const offRow = (o, i, extra) => { const [t, d, [lab, p]] = o; return `<a class="off reveal${extra ? " is-extra" : ""}" href="${wa(t)}" target="_blank" rel="noopener"><span class="off__n">${String(i + 1).padStart(2, "0")}</span><span class="off__t">${esc(t)}</span><span class="off__d">${esc(d)}</span><span class="off__p">${lab ? `<small>${esc(lab)}</small>` : ""}${esc(p)}</span><span class="off__c">${ARROW}</span></a>`; };
{ const all = D.OFFERS[L], fixed = all.filter(o => !isQuote(o)), prem = all.filter(isQuote), RI = D.REELS_I[L];
  const ol = $("[data-offers]");
  ol.innerHTML = `<h3 class="offers__group">${esc(RI.fixed)}</h3>` + fixed.map((o, i) => offRow(o, i, i > 5)).join("")
    + `<h3 class="offers__group offers__group--prem">${esc(RI.premium)}</h3>` + prem.map((o, i) => offRow(o, fixed.length + i, false)).join("");
  if (fixed.length > 6) { const more = document.createElement("button"); more.className = "btn btn--glass offers__more"; more.innerHTML = `<span>${esc({ he: "לכל החבילות", en: "All packages", fr: "Tous les packs" }[L])} (${fixed.length})</span><span class="btn__ico">+</span>`;
    more.onclick = () => { ol.classList.add("is-open"); more.remove(); window.ScrollTrigger && ScrollTrigger.refresh(); }; ol.querySelector(".offers__group--prem").before(more); } }

/* ---------- WhatsApp dans les sections (on ne descend pas jusqu'en bas pour écrire) ---------- */
{ const mk = () => { const a = document.createElement("a"); a.className = "btn btn--gold btn--sm sec-cta"; a.href = wa(""); a.target = "_blank"; a.rel = "noopener"; a.innerHTML = `<span>${esc(T["ct.wa"])}</span><span class="btn__ico">${ARROW}</span>`; return a; };
  ["#lab .fine", "#reels .sec-head", ".rooms__fallback"].forEach(sel => { const e = $(sel); if (e) e.after(mk()); }); $("#index")?.append(mk()); }

/* ---------- process + labo ---------- */
$("[data-process]").innerHTML = D.PROCESS[L].map(([t, p], i) => `<article class="step reveal"><span class="step__bar"></span><div class="step__n">0${i + 1}</div><h3>${esc(t)}</h3><p>${esc(p)}</p></article>`).join("");
$("[data-lab]").innerHTML = D.LAB.map(x => `<article class="lc reveal"><svg class="lc__sig" viewBox="0 0 46 46"><circle cx="23" cy="23" r="21"/><circle cx="23" cy="23" r="14"/></svg><span class="lc__k">${x.k}</span><h3>${x.n}</h3><p>${esc(x[L])}</p></article>`).join("");

/* ---------- vidéos : lecture seulement à l'écran ---------- */
// deux observateurs : on prépare à 600 px (source + affiche), on joue seulement à l'écran, pause dès la sortie
const vload = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (!e.isIntersecting) return; if (v.dataset.poster) { v.poster = v.dataset.poster; v.removeAttribute("data-poster"); } if (!v.src) v.src = v.dataset.src; }), { rootMargin: "600px" });
// une seule lue à la fois : la plus visible gagne, les autres sont en pause
const vr = new Map(), vio = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? vr.set(e.target, e.intersectionRatio) : (vr.delete(e.target), e.target.pause()));
  let best = null; const sc = v => vr.get(v) + (v.muted ? 0 : 2); vr.forEach((r, v) => { if (!best || sc(v) > sc(best)) best = v; }); // un reel dont on a mis le son reste prioritaire
  vr.forEach((r, v) => { if (v !== best) v.pause(); }); if (best) { if (!best.src) best.src = best.dataset.src; best.play().catch(() => {}); } }, { threshold: [0, .25, .5, .75, 1] });
$$("video[data-src]").filter(v => !v.closest(".room-card")).forEach(v => { vload.observe(v); vio.observe(v); }); // les cartes des salles ont leur propre lecteur (une seule à la fois)
/* ---------- fond du final (cockpit) : image adaptée à l'écran, chargée à l'approche ---------- */
{ const dash = $(".contact__dash"); if (dash) { const io = new IntersectionObserver(es => { if (!es.some(e => e.isIntersecting)) return;
    dash.style.backgroundImage = `url(${BASE}assets/${mobile() ? "car2/cockpit_m.webp" : "car/cockpit.webp"})`; io.disconnect(); }, { rootMargin: "1500px 0px" }); io.observe(dash); } }

document.querySelector(".startbtn")?.addEventListener("click", () => window.DNAudio?.sfx("engine", 0, 1));
{ const s = $(".startbtn small"); if (s) s.textContent = { he: "מנוע", en: "ENGINE", fr: "MOTEUR" }[L]; }
/* la page change de hauteur (listes dépliées, médias) : les déclencheurs se recalent */
{ let rt = 0; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 250); }).observe(document.querySelector("main")); }
/* ---------- bouton flottant : masqué là où il gênerait ---------- */
{ const vis = new Set(); const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)); document.body.classList.toggle("no-fab", vis.size > 0); });
  ["#audit", "#devis", "#contact", ".foot"].forEach(s => { const e = $(s); if (e) io.observe(e); }); }
/* ---------- pages de service en surcouche : la page (et sa musique) reste vivante ---------- */
{ let ov = null;
  const close = () => { if (!ov) return; ov.classList.remove("is-in"); const o = ov; ov = null; setTimeout(() => o.remove(), 450); document.body.classList.remove("svc-open"); window.__lenis?.start?.(); window.DNAudio?.sfx("portal", .4, .5); };
  const open = href => { if (ov) return; ov = document.createElement("div"); ov.className = "svc-overlay"; ov.innerHTML = `<button type="button" class="svc-overlay__x" aria-label="${esc({ he: "סגירה", en: "Close", fr: "Fermer" }[L])}">×</button><iframe title="DreamNova" src="${href}${href.includes("?") ? "&" : "?"}embed=1" loading="eager"></iframe>`;
    document.body.appendChild(ov); requestAnimationFrame(() => ov.classList.add("is-in")); document.body.classList.add("svc-open"); window.__lenis?.stop?.(); history.pushState({ dn: "svc" }, "", location.href); window.DNAudio?.sfx("portal", -.4, .6);
    ov.querySelector(".svc-overlay__x").onclick = () => history.back(); };
  addEventListener("popstate", () => close());
  addEventListener("keydown", e => e.key === "Escape" && ov && history.back());
  addEventListener("message", e => { const m = e.data || {}; if (m.dn === "close") history.back(); if (m.dn === "devis") { history.back(); const sel = document.querySelector('.quote__form select[name="service"]'); if (sel && m.s != null) sel.selectedIndex = m.s; setTimeout(() => (window.__lenis ? window.__lenis.scrollTo("#devis", { offset: -20 }) : $("#devis").scrollIntoView({ behavior: "smooth" })), 420); } });
  document.addEventListener("click", e => { const a = e.target.closest("a[href]"); if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey) return; const u = new URL(a.href, location.href); if (u.origin !== location.origin || !/\/(he|en|fr)\/s\/[a-z0-9]+\/?$/.test(u.pathname)) return; e.preventDefault(); open(u.pathname); }); }

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
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, paused: document.body.classList.contains("gated") }); // derrière la porte : le hero attend qu'elle s'ouvre (le premier grand élément reste la porte)
  addEventListener("dn:gate", () => tl.play(), { once: true });
  tl.from(".hero__title .line>*", { yPercent: 110, duration: mobile() ? .9 : 1.4, stagger: .1 })
    .from(".hero__eyebrow", { y: 20, opacity: 0, duration: 1 }, .2)
    .from(".hero__sub,.hero__ctas", { y: 30, opacity: 0, duration: 1.2, stagger: .1 }, .5)
    .from(".stat", { y: 30, opacity: 0, duration: mobile() ? .5 : 1.2, stagger: mobile() ? .03 : .08 }, mobile() ? .25 : .8)
    .from(".nav", { opacity: 0, duration: 1.2, clearProps: "opacity" }, .3)
    .from(".hero__gl", { opacity: 0, scale: 1.08, duration: 2.4, ease: "power2.out" }, 0);
  gsap.to(".hero__inner", { yPercent: -18, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  ScrollTrigger.create({ trigger: ".hero", start: "bottom 60%", onEnter: () => document.body.classList.add("past-hero"), onLeaveBack: () => document.body.classList.remove("past-hero") });
  ScrollTrigger.create({ trigger: ".manifesto", start: "top 60px", end: "bottom 60px", toggleClass: { targets: ".nav", className: "on-light" } });
  // cache la nav en descendant
  let last = 0; ScrollTrigger.create({ onUpdate: s => { const y = s.scroll(); const down = y > 400 && y > last && !document.body.classList.contains("menu-open"); $(".nav").classList.toggle("is-hidden", down); $(".fab").classList.toggle("is-away", down); last = y; } });

  // apparitions
  ScrollTrigger.batch(".reveal:not(.who):not(.step):not(.lc):not(.off)", { start: mobile() ? "top 100%" : "top 88%", once: true,
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, filter: "blur(0px)", duration: mobile() ? .45 : .6, ease: "expo.out", stagger: mobile() ? .03 : .05, overwrite: true, clearProps: "transform", onComplete: () => b.forEach(e => e.classList.add("is-in")) }) });
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
  ScrollTrigger.batch(SPIN, { start: TOUCH ? "top 100%" : "top 90%", once: true, onEnter: b => gsap.fromTo(b,
    TOUCH ? { rotationY: (RTL ? -1 : 1) * 55, rotationX: 10, y: 34, opacity: 0, transformOrigin: "50% 50% -80px" } : { y: 28, opacity: 0 },
    TOUCH ? { rotationY: 0, rotationX: 0, y: 0, opacity: 1, duration: .9, ease: "expo.out", stagger: .05, overwrite: true, clearProps: "transform", onComplete: () => b.forEach(e => e.classList.add("is-in")) } : { y: 0, opacity: 1, duration: .5, ease: "power2.out", stagger: .05, overwrite: true, clearProps: "transform", onComplete: () => b.forEach(e => e.classList.add("is-in")) }) });
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
  /* lien d'arrivée avec ancre (#conseil, #offers… — liens de recommandation) : le navigateur saute à l'ancre AVANT que les sections
     épinglées n'allongent la page (écart mesuré : 4 100 px). On revient sur l'ancre à chaque recalcul, pendant 8 s, tant que le visiteur n'a pas défilé lui-même. */
  { const tgt = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (tgt) { let user = false; const t0 = Date.now(), quit = () => { user = true; };
      ["wheel", "touchmove", "keydown"].forEach(e => addEventListener(e, quit, { once: true, passive: true }));
      const go = () => { if (user || Date.now() - t0 > 8000) return; const y = tgt.getBoundingClientRect().top + scrollY; lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y); };
      ScrollTrigger.addEventListener("refresh", () => requestAnimationFrame(go)); addEventListener("dn:gate", () => setTimeout(go, 60)); setTimeout(go, 1200); } }
  window.__DN = { lang: L, lenis: !!lenis };
  window.dispatchEvent(new Event("dn:ready"));
}
})();
