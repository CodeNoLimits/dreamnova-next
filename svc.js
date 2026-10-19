// Page de service (style écurie) générée depuis content.js.
(() => {
  const D = window.DN, $ = s => document.querySelector(s);
  const L = document.documentElement.lang, RTL = L === "he", T = D.I[L], U = D.SVC_I[L];
  const BASE = new URL("./", document.currentScript.src).href;
  const id = document.body.dataset.svc, i = D.SVC.findIndex(s => s.id === id), s = D.SVC[i], sv = D.SERVICES[i][L];
  const esc = x => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const wa = t => `https://wa.me/${D.WA}?text=${encodeURIComponent(T["wa.msg"] + " — " + t)}`;
  const ARROW = RTL ? "↖" : "↗";
  document.title = `${sv[0]} — DreamNova`;
  const EMBED = new URLSearchParams(location.search).get("embed") === "1"; if (EMBED) document.body.classList.add("is-embed");
  const works = s.w.map(w => D.WORKS.find(x => x.id === w)).filter(w => w && (!w.only || w.only === L));
  const offers = s.o.map(k => D.OFFERS[L][k]).filter(Boolean);
  const nxt = D.SVC[(i + 1) % D.SVC.length], nsv = D.SERVICES[(i + 1) % D.SVC.length][L];
  const vid = s.v ? `${BASE}assets/${s.v}` : "";
  $("#app").innerHTML = `
  <header class="nav nav--svc"><a href="${BASE}${L}/#drive" class="nav__brand"><img class="nav__crest" src="${BASE}assets/brand/crest.svg" alt="" width="26" height="32"><span class="nav__name">DreamNova</span></a>
    <a class="svc__back" href="${BASE}${L}/#drive">${RTL ? "→" : "←"} ${esc(U.back)}</a>
    <div class="nav__langs">${["he", "en", "fr"].map(l => `<a href="${BASE}${l}/s/${id}/" class="${l === L ? "is-on" : ""}">${l.toUpperCase()}</a>`).join("")}</div>
    <a class="btn btn--gold btn--sm nav__cta" href="${wa(sv[0])}" target="_blank" rel="noopener"><span>${esc(T["nav.cta"])}</span><span class="btn__ico">${ARROW}</span></a></header>
  <section class="svc-hero">
    ${vid ? `<video class="svc-hero__v" src="${vid}" muted loop playsinline autoplay></video>` : `<div class="svc-hero__v svc-hero__v--gl"></div>`}
    <div class="svc-hero__shade"></div>
    <span class="svc-hero__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
    <div class="svc-hero__in">
      <p class="eyebrow eyebrow--gold">${esc(s.part[L])}</p>
      <h1 class="svc-hero__t">${esc(sv[0])}</h1>
      <p class="svc-hero__p">${esc(sv[1])}</p>
      <a class="btn btn--gold" href="${wa(sv[0])}" target="_blank" rel="noopener"><span>${esc(U.cta)}</span><span class="btn__ico">${ARROW}</span></a>
    </div>
  </section>
  <section class="svc-spec"><p class="eyebrow">${esc(U.spec)}</p>
    <ol class="spec">${sv[2].map((c, k) => `<li class="r"><span>${String(k + 1).padStart(2, "0")}</span><b>${esc(c)}</b></li>`).join("")}</ol></section>
  ${(() => { const B = D.BUILD && D.BUILD[id] && D.BUILD[id][L]; if (!B) return "";
    const H = { he: ["איך אנחנו בונים", "הטכנולוגיה", "מה תקבלו", "שאלות נפוצות"], en: ["How we build it", "The stack", "What you get", "FAQ"], fr: ["Comment on le construit", "Les technologies", "Ce que vous recevez", "Questions fréquentes"] }[L];
    return `<section class="svc-build"><p class="eyebrow eyebrow--gold">${esc(H[0])}</p><h2 class="h2 svc-build__t">${esc(B.intro)}</h2>
      <ol class="build-steps">${B.steps.map(([t, d], k) => `<li class="r"><span class="build-steps__n">${String(k + 1).padStart(2, "0")}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("")}</ol>
      <div class="build-cols"><div class="r"><p class="eyebrow">${esc(H[1])}</p><div class="chips">${B.stack.map(x => `<span>${esc(x)}</span>`).join("")}</div></div>
      <div class="r"><p class="eyebrow">${esc(H[2])}</p><ul class="build-deliver">${B.deliver.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
      <div class="faq"><p class="eyebrow">${esc(H[3])}</p>${B.faq.map(([q, a]) => `<details class="r"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>
      <a class="btn btn--gold svc-build__cta" href="${BASE}${L}/?s=${id}#devis"><span>${esc({ he: "קבלו הצעה חכמה תוך 30 שניות", en: "Get a smart quote in 30 seconds", fr: "Votre devis intelligent en 30 secondes" }[L])}</span><span class="btn__ico">${ARROW}</span></a></section>`; })()}
  ${s.films ? `<section class="svc-films"><div class="svc-films__grid">${s.films.map(f => `<video class="r" src="${BASE}assets/reel/${f}.mp4" poster="${BASE}assets/reel/poster_0${f.slice(-1)}.webp" muted loop playsinline autoplay preload="none"></video>`).join("")}</div></section>` : ""}
  ${works.length ? `<section class="svc-works"><p class="eyebrow">${esc(U.works)}</p><div class="index__grid">${works.map(w => {
    const u = w.u && w.u.replace("{l}", L);
    return `<${u ? "a" : "div"} class="pj r" ${u ? `href="${u}" target="_blank" rel="noopener"` : ""}><img class="pj__img" src="${BASE}assets/work/gal_${w.id}${w.id === "site3d" ? "_" + L : ""}.webp" alt="${esc(w.t[L])}" loading="lazy"><div class="pj__b"><div><div class="pj__s">${esc(w.s[L])}</div><div class="pj__t">${esc(w.t[L])}</div></div><span class="pj__a">${esc(u ? T["work.visit"].replace("↗", ARROW) : T["work.private"])}</span></div></${u ? "a" : "div"}>`;
  }).join("")}</div></section>` : ""}
  ${offers.length ? `<section class="svc-offers"><p class="eyebrow">${esc(U.offers)}</p><div class="offers__list">${offers.map(([t, d, [lab, p]], k) =>
    `<a class="off r" href="${wa(t)}" target="_blank" rel="noopener"><span class="off__n">${String(k + 1).padStart(2, "0")}</span><span class="off__t">${esc(t)}</span><span class="off__d">${esc(d)}</span><span class="off__p">${lab ? `<small>${esc(lab)}</small>` : ""}${esc(p)}</span><span class="off__c">${ARROW}</span></a>`).join("")}</div></section>` : ""}
  <a class="svc-next" href="${BASE}${L}/s/${nxt.id}/"><span class="eyebrow">${esc(U.next)} · ${esc(nxt.part[L])}</span><span class="svc-next__t">${esc(nsv[0])} <i>${ARROW}</i></span></a>
  <footer class="foot"><div class="foot__row"><span>© 2026 DreamNova · David Amor · <a href="https://wa.me/${D.WA}" dir="ltr">+972 58-492-1492</a></span><span>${esc(T["foot.where"])}</span></div></footer>`;
  if (EMBED) { document.querySelectorAll(".svc__back, .nav__brand").forEach(a => a.addEventListener("click", e => { e.preventDefault(); parent.postMessage({ dn: "close" }, "*"); }));
    document.querySelectorAll('a[href*="#devis"]').forEach(a => a.addEventListener("click", e => { e.preventDefault(); parent.postMessage({ dn: "devis", s: i }, "*"); })); }
  if (window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && innerWidth > 767) { const l = new Lenis({ lerp: .09 }); l.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => l.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    gsap.from(".svc-hero__in > *", { y: 60, opacity: 0, duration: 1.4, stagger: .1, ease: "expo.out", delay: .1 });
    gsap.from(".svc-hero__num", { yPercent: 30, opacity: 0, duration: 2, ease: "expo.out" });
    gsap.utils.toArray(".r").forEach(e => gsap.from(e, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: e, start: "top 90%" } }));
  }
})();
