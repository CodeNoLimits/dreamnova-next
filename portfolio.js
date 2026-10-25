// Portfolio : toutes les réalisations réelles (démos en ligne + projets clients décrits sans les nommer + reels), généré depuis content.js.
(() => {
  const D = window.DN, $ = s => document.querySelector(s);
  const L = document.documentElement.lang, RTL = L === "he", T = D.I[L];
  const BASE = new URL("./", document.currentScript.src).href;
  const esc = x => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const wa = t => `https://wa.me/${D.WA}?text=${encodeURIComponent(T["wa.msg"] + (t ? " — " + t : ""))}`;
  const ARROW = RTL ? "↖" : "↗";
  const P = {
    he: { title: "העבודות שלנו. הכול אמיתי.", lead: "אתרים, סרטי AI, סוכנים קוליים, AI פרטי וקמפיינים — דמואים חיים שאפשר לנסות, ופרויקטים של לקוחות שמתוארים בלי לחשוף את שמם.", back: "חזרה לאתר", eye: "פורטפוליו · DreamNova",
          live: "לנסות בעצמכם", liveP: "כל אחד מהם פועל עכשיו — לחצו ובדקו.", clients: "פרויקטים של לקוחות", clientsP: "פרויקטים אמיתיים. לא מציגים שמות או קישורים בלי אישור הלקוח.", reels: "וידאו ורילס", reelsP: "מיוצרים בסטודיו שלנו.",
          n: ["דמואים חיים", "פרויקטים של לקוחות", "רילס"], end: "הפרויקט הבא יכול להיות שלכם.", endP: "15 דקות בוואטסאפ, בלי התחייבות — ויוצאים עם כיוון ברור.", cta: "לדבר עם דוד", devis: "הצעת מחיר חכמה" },
    en: { title: "Our work. All of it real.", lead: "Websites, AI films, voice agents, private AI and campaigns — live demos you can try yourself, and client projects described without naming them.", back: "Back to the site", eye: "Portfolio · DreamNova",
          live: "Try it yourself", liveP: "Every one of these is running right now — click and test.", clients: "Client projects", clientsP: "Real projects. No names or links without the client's permission.", reels: "Video & reels", reelsP: "Produced in our studio.",
          n: ["live demos", "client projects", "reels"], end: "Your project could be next.", endP: "15 minutes on WhatsApp, no commitment — you leave with a clear direction.", cta: "Talk to David", devis: "Get a smart quote" },
    fr: { title: "Nos réalisations. Toutes réelles.", lead: "Sites, films IA, agents vocaux, IA privée et campagnes — des démos en ligne que vous pouvez tester, et des projets clients décrits sans les nommer.", back: "Retour au site", eye: "Portfolio · DreamNova",
          live: "À tester vous-même", liveP: "Chacune tourne en ce moment — cliquez et essayez.", clients: "Projets clients", clientsP: "De vrais projets. Ni nom ni lien sans l'accord du client.", reels: "Vidéos & reels", reelsP: "Produits dans notre studio.",
          n: ["démos en ligne", "projets clients", "reels"], end: "Votre projet peut être le prochain.", endP: "15 minutes sur WhatsApp, sans engagement — et vous repartez avec une direction claire.", cta: "Parler à David", devis: "Devis intelligent" }
  }[L];
  // Projets clients : faits vérifiés dans le registre clients (25/10/2026) ; sans nom, sans lien, sans contenu sacré.
  const CASES = [
    { v: "marketing", s: { he: "בית קפה · תל אביב", en: "Café · Tel Aviv", fr: "Café · Tel-Aviv" }, t: { he: "אתר בשלוש שפות וקמפיין Meta", en: "Trilingual website & Meta campaign", fr: "Site trilingue & campagne Meta" }, r: { he: "עברית, צרפתית ואנגלית · ניהול פרסום חודשי", en: "Hebrew, French and English · monthly ad management", fr: "Hébreu, français et anglais · gestion publicitaire mensuelle" } },
    { v: "web", s: { he: "זמר · ישראל", en: "Singer · Israel", fr: "Chanteur · Israël" }, t: { he: "אתר רשמי, גלריה ורילס", en: "Official website, gallery & reels", fr: "Site officiel, galerie & reels" }, r: { he: "דומיין co.il · ניהול פרסום ב־Meta", en: ".co.il domain · Meta ads management", fr: "Domaine .co.il · gestion des publicités Meta" } },
    { v: "film", s: { he: "בעל מקצוע · ארה״ב", en: "Professional · USA", fr: "Professionnel · États-Unis" }, t: { he: "ניהול ערוץ YouTube", en: "YouTube channel management", fr: "Gestion de chaîne YouTube" }, r: { he: "חודש ראשון: 16 סרטוני Shorts ו־5 סרטונים ארוכים", en: "First month: 16 Shorts and 5 long-form videos", fr: "1er mois : 16 Shorts et 5 vidéos longues" } },
    { v: "film", s: { he: "משפחה · צרפת", en: "Family · France", fr: "Famille · France" }, t: { he: "סרט מחווה ביוגרפי", en: "Biographical tribute film", fr: "Film hommage biographique" }, r: { he: "מתמונות וזיכרונות משפחתיים · צרפתית, ואז אנגלית ועברית", en: "From family photos and memories · French, then English and Hebrew", fr: "À partir de photos et souvenirs de famille · en français, puis en anglais et en hébreu" } },
    { v: "web", s: { he: "חנות ספרים מקוונת", en: "Online bookshop", fr: "Librairie en ligne" }, t: { he: "שתי חנויות Shopify", en: "Two Shopify stores", fr: "Deux boutiques Shopify" }, r: { he: "חנות בשקלים וחנות ביורו · בורר שפה · הנהלת חשבונות חודשית אוטומטית", en: "One store in shekels, one in euros · language switcher · automated monthly bookkeeping", fr: "Une boutique en shekels, une en euros · sélecteur de langue · comptabilité mensuelle automatisée" } },
    { v: "consult", s: { he: "הוצאה לאור", en: "Publisher", fr: "Éditeur" }, t: { he: "השוואת גרסאות ספר, מילה במילה", en: "Word-by-word book version comparison", fr: "Comparaison de versions de livre, mot à mot" }, r: { he: "דוח מאושר · כל ההבדלים מסומנים", en: "Certified report · every difference highlighted", fr: "Rapport certifié · chaque différence surlignée" } }
  ];
  const own = D.WORKS.filter(w => (!w.only || w.only === L) && w.u);
  const priv = D.WORKS.filter(w => (!w.only || w.only === L) && !w.u);
  const card = w => { const u = w.u && w.u.replace("{l}", L);
    return `<${u ? "a" : "div"} class="pj r" ${u ? `href="${u}" target="_blank" rel="noopener"` : ""}><img class="pj__img" src="${BASE}assets/work/gal_${w.id}${w.id === "site3d" ? "_" + L : ""}_s.webp" width="600" height="375" alt="${esc(w.t[L])}" loading="lazy"><div class="pj__b"><div><div class="pj__s">${esc(w.s[L])}${w.demo && w.demo !== L ? ` <span class="pj__lang">${w.demo.toUpperCase()}</span>` : ""}</div><div class="pj__t">${esc(w.t[L])}</div>${w.r ? `<div class="pj__r">${esc(w.r[L])}</div>` : ""}</div><span class="pj__a">${esc(u ? T["work.visit"].replace("↗", ARROW) : T["work.private"])}</span></div></${u ? "a" : "div"}>`; };
  const ccard = c => `<div class="pj r"><img class="pj__img" src="${BASE}assets/svcclip/poster_${c.v}.webp" width="600" height="375" alt="" loading="lazy"><div class="pj__b"><div><div class="pj__s">${esc(c.s[L])}</div><div class="pj__t">${esc(c.t[L])}</div><div class="pj__r">${esc(c.r[L])}</div></div><span class="pj__a">${esc(T["work.private"])}</span></div></div>`;
  const nClients = CASES.length + priv.length;
  document.title = `${P.title} — DreamNova`;
  $("#app").innerHTML = `
  <header class="nav nav--svc"><a href="${BASE}${L}/" class="nav__brand"><img class="nav__crest" src="${BASE}assets/brand/crest.svg" alt="" width="26" height="32"><span class="nav__name">DreamNova</span></a>
    <a class="svc__back" href="${BASE}${L}/">${RTL ? "→" : "←"} ${esc(P.back)}</a>
    <div class="nav__langs">${["he", "en", "fr"].map(l => `<a href="${BASE}${l}/portfolio/" class="${l === L ? "is-on" : ""}">${l.toUpperCase()}</a>`).join("")}</div>
    <a class="btn btn--gold btn--sm nav__cta" href="${wa("Portfolio")}" target="_blank" rel="noopener"><span>${esc(T["nav.cta"])}</span><span class="btn__ico">${ARROW}</span></a></header>
  <section class="svc-hero">
    <video class="svc-hero__v" data-src="${BASE}assets/rooms_v2/room_07_gallery.mp4" poster="${BASE}assets/rooms_v2/poster_room_07.webp" muted loop playsinline preload="none"></video>
    <div class="svc-hero__shade"></div>
    <div class="svc-hero__in">
      <p class="eyebrow eyebrow--gold">${esc(P.eye)}</p>
      <h1 class="svc-hero__t">${esc(P.title)}</h1>
      <p class="svc-hero__p">${esc(P.lead)}</p>
      <ol class="pf-n">${[own.length, nClients, D.REELS.length].map((n, k) => `<li><b>${n}</b><span>${esc(P.n[k])}</span></li>`).join("")}</ol>
    </div>
  </section>
  <section class="svc-works" id="live"><p class="eyebrow eyebrow--gold">${esc(P.live)}</p><p class="pf-sub">${esc(P.liveP)}</p><div class="index__grid">${own.map(card).join("")}</div></section>
  <section class="svc-works" id="clients"><p class="eyebrow eyebrow--gold">${esc(P.clients)}</p><p class="pf-sub">${esc(P.clientsP)}</p><div class="index__grid">${CASES.map(ccard).join("")}${priv.map(card).join("")}</div></section>
  <section class="svc-films" id="reels"><p class="eyebrow eyebrow--gold">${esc(P.reels)}</p><p class="pf-sub">${esc(P.reelsP)}</p><div class="svc-films__grid pf-reels">${D.REELS.map(r => `<figure class="r"><video data-src="${BASE}assets/reels/${r.id}.mp4" poster="${BASE}assets/reels/${r.id}.webp" muted loop playsinline preload="none" aria-label="${esc(r.t[L])}"></video><figcaption>${esc(r.t[L])}</figcaption></figure>`).join("")}</div></section>
  <section class="pf-end r"><h2 class="h2">${esc(P.end)}</h2><p class="lead">${esc(P.endP)}</p><div class="pf-end__cta"><a class="btn btn--gold" href="${wa("Portfolio")}" target="_blank" rel="noopener"><span>${esc(P.cta)}</span><span class="btn__ico">${ARROW}</span></a><a class="btn btn--glass" href="${BASE}${L}/#devis"><span>${esc(P.devis)}</span><span class="btn__ico">${RTL ? "←" : "→"}</span></a></div></section>
  <footer class="foot"><div class="foot__row"><span>© 2026 DreamNova · David Amor · <a href="https://wa.me/${D.WA}" dir="ltr">+972 58-492-1492</a></span><span>${esc(T["foot.where"])}</span></div></footer>`;
  // une seule vidéo lue à la fois (la plus visible) ; sur téléphone rien n'est téléchargé avant le premier geste
  { const vids = [...document.querySelectorAll("video[data-src]")], vr = new Map(); let armed = innerWidth > 767;
    const pick = () => { let best = null; vr.forEach((r, v) => { if (!best || r > vr.get(best)) best = v; });
      vids.forEach(v => { if (v !== best) v.pause(); }); if (!best || !armed) return; if (!best.src) best.src = best.dataset.src; best.play().catch(() => {}); };
    const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? vr.set(e.target, e.intersectionRatio) : vr.delete(e.target)); pick(); }, { threshold: [0, .25, .5, .75, 1] });
    vids.forEach(v => io.observe(v));
    if (!armed) { const go = () => { armed = true; pick(); ["touchstart", "scroll", "pointerdown"].forEach(t => removeEventListener(t, go)); }; ["touchstart", "scroll", "pointerdown"].forEach(t => addEventListener(t, go, { passive: true })); } }
  if (window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && innerWidth > 767) { const l = new Lenis({ lerp: .09 }); l.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => l.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    gsap.from(".svc-hero__in > *", { y: 60, opacity: 0, duration: 1.4, stagger: .1, ease: "expo.out", delay: .1 });
    gsap.utils.toArray(".r:not(.pj)").forEach(e => gsap.from(e, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: e, start: "top 96%" } }));
  }
})();
