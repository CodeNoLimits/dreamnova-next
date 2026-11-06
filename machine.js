// Offre « Machine à clients » (W77, 05/11/2026) : page d'offre au style des pages de service, une devise par langue.
(() => {
  const D = window.DN, L = document.documentElement.lang, RTL = L === "he", T = D.I[L], U = D.SVC_I[L];
  const BASE = new URL("./", document.currentScript.src).href, ARROW = RTL ? "↖" : "↗";
  const esc = x => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Liens de paiement Stripe DreamAI (live), un par devise : jamais de lien d'une autre devise sur une page.
  const PAY = { he: "https://buy.stripe.com/7sY8wO43yeRTg5z2ymds61m", en: "https://buy.stripe.com/3cI7sK9nSfVXcTnfl8ds61l", fr: "https://buy.stripe.com/14A28qfMg4df7z3c8Wds61j" };
  const M = {
    he: { eye: "הצעת השקה", name: "מכונת לקוחות", lead: "אתר שמביא פניות, באוויר תוך 48 שעות, פרסום ממומן שמוביל אליו לקוחות, וכל פנייה במעקב: אף פנייה לא נשארת בלי מענה.",
      from: "מחיר השקה", price: "₪4,900", note: "בתשלום אחד. תקציב הפרסום נשאר אצלכם ובשליטתכם.",
      pay: "להזמין עכשיו", call: "שיחה של 20 דקות · וואטסאפ", wa: "שלום דוד, הגעתי מהעמוד ״מכונת לקוחות״ ואשמח לשיחה של 20 דקות.",
      get: "מה תקבלו", items: [["האתר שלכם תוך 48 שעות", "עמוד מכירה מותאם קודם כל לנייד, שמסביר את ההצעה שלכם ומניע את הגולשים לפנות אליכם. הפיקסלים של מטא ושל טיקטוק מותקנים, והפניות מהטופס ומהוואטסאפ נכנסות ישירות למערכת מעקב הפניות."],
        ["30 יום של ניהול קמפיינים", "קודם בודקים את המסרים בפרסום אורגני, ואז משקיעים את התקציב במסר שעובד. בלי לשלם שכר לימוד."],
        ["כל פנייה במעקב", "כל פנייה נרשמת, אתם מקבלים תזכורת לחזור ללקוח בזמן, והכול מופיע בלוח בקרה ברור בנייד."],
        ["נציג AI שקובע פגישות", "בוואטסאפ ובטלפון, בעברית, בצרפתית או באנגלית: עונה מיד, שואל את השאלות הנכונות וקובע את הפגישה ביומן שלכם."],
        ["כתובת אחת לאורך כל הדרך", "דוד מלווה את הפרויקט מההתחלה ועד הסוף ושולח לכם עדכונים שוטפים, בשפה פשוטה."]],
      how: "איך זה עובד", how_h: "מהשיחה ועד הפגישה הראשונה עם לקוח.", steps: ["שיחה של 20 דקות: העסק שלכם, הלקוח האידיאלי ומה שגורם לו לקנות.", "האתר באוויר תוך 48 שעות, כשמערכת המעקב כבר מחוברת.", "המסרים נבדקים בפרסום אורגני, ואז התקציב עובר למסר המנצח, עם כוונון שבועי.", "כל פנייה מקבלת מענה מיד, נכנסת למעקב ומתקדמת לפגישה."],
      inc: "כלול במחיר", inc_l: ["אתר או עמוד מכירה, מותאם לנייד", "פיקסלים של מטא ושל טיקטוק", "30 יום של ניהול קמפיינים", "מערכת מעקב פניות עם לוח בקרה בנייד", "נציג AI לקביעת פגישות בוואטסאפ ובטלפון", "עדכונים שוטפים"],
      know: "חשוב לדעת", know_l: ["את תקציב הפרסום במטא ובטיקטוק אתם משלמים ישירות לפלטפורמות, והוא אינו כלול במחיר.", "מחיר החבילה סגור מראש, בלי הפתעות באמצע. יתווסף אליו רק מה שתבחרו להוסיף."],
      more: "תוספות", more_h: "צריכים יותר? אפשר להוסיף שירותים לחבילה.",
      faq: [["כמה עולה הפרסום עצמו?", "אתם בוחרים את התקציב, משלמים אותו ישירות למטא או לטיקטוק ויכולים לעצור בכל שלב. בשיחה נמליץ לכם על סכום התחלתי."],
        ["מה אם כבר יש לנו אתר?", "אם האתר הקיים טוב, אפשר לבנות עליו, או לבנות עמוד מכירה ייעודי שמתחבר אליו. מחליטים יחד בשיחה."],
        ["מה קורה אחרי 30 הימים?", "האתר ומערכת מעקב הפניות נשארים שלכם. לגבי הקמפיינים והנציג, בדוח הסיכום נציע לכם אפשרויות להמשך, בלי שום התחייבות."],
        ["איך משלמים?", "בכרטיס אשראי, בתשלום מקוון ומאובטח דרך Stripe. תקבלו אישור, ודוד יכתוב לכם כדי לקבוע את שיחת הפתיחה."]],
      end: "מוכנים להפסיק לפספס לקוחות?", paid: "תודה, ההזמנה שלכם אושרה. דוד יכתוב לכם בקרוב כדי לקבוע את שיחת הפתיחה.", faq_t: "שאלות נפוצות", back: "כל השירותים", pr_e: "כבר באוויר", pr_h: "כך זה נראה בפועל.", pr: [["עמודי מכירה כמו אלה", "20 אתרים שבנינו לבעלי מקצוע, שתוכננו קודם כל לנייד."], ["לוחות בקרה בהתאמה אישית", "כמו רשת התוכן הזאת, שכבר עלתה לאוויר בעברית."], ["הנציגה שעונה", "אווה (Ava), פקידת הקבלה הווירטואלית שלנו, בהדגמה חיה באנגלית."]], opt: { "3d": "אתר תלת־ממדי סוחף", web: "חנות אינטרנט רב־לשונית", private: "עוזר AI פרטי" } },
    en: { eye: "Launch offer", name: "Client Machine", lead: "Your site live in 48 hours, your Meta and TikTok ads tuned behind it, every enquiry tracked: no client is left waiting.",
      from: "Launch price", price: "$1,490", note: "Paid once. Your ad budget stays yours, and under your control.",
      pay: "Book now", call: "20-minute call · WhatsApp", wa: "Hi David, I found the Client Machine page and would like a 20-minute call.",
      get: "What you get", items: [["Your website in 48 hours", "A sales page built for phones first, that explains your offer and makes people want to reach out. Meta and TikTok pixels are installed, and the form and WhatsApp feed straight into your enquiry tracking."],
        ["30 days of managed ads", "We test your messages organically first, then put the budget behind the one that works. You don't pay to learn."],
        ["Every enquiry followed up", "Each prospect is logged and followed up at the right moment, and you see it all on a clear dashboard on your phone."],
        ["An agent that books meetings", "On WhatsApp and on the phone, in Hebrew, French or English: it answers right away, asks the right questions and books the meeting in your calendar."],
        ["One point of contact", "David runs your project end to end and sends you regular reports, in plain words."]],
      how: "How it works", how_h: "From the first call to your first meeting.", steps: ["A 20-minute call: your business, your ideal client and what makes them buy.", "Your site goes live in 48 hours, with tracking already connected.", "Messages are tested organically, then the budget moves to the winner, tuned every week.", "Every enquiry is answered right away, tracked and moved towards a meeting."],
      inc: "Included", inc_l: ["Website or sales page, mobile first", "Meta and TikTok pixels", "30 days of ad management", "Enquiry tracking with a phone dashboard", "Booking agent on WhatsApp and phone", "Regular reports"],
      know: "Good to know", know_l: ["Your Meta and TikTok ad budget is paid by you directly to the platforms and is not included in the price.", "Fixed price, paid once: nothing is added without your approval, apart from the options you choose."],
      more: "Go further", more_h: "Need more? Options plug straight in.",
      faq: [["How much does advertising cost on top?", "You choose the budget, pay it directly to Meta or TikTok and can stop at any time. We suggest a starting amount during the call."],
        ["What if I already have a website?", "We can build on your current site if its foundation is sound, or create a dedicated sales page that links to it. We decide together on the call."],
        ["What happens after the 30 days?", "The website and enquiry tracking stay yours. For the ads and the agent, we propose a next step in the final report, with no obligation."],
        ["How do I pay?", "Online by card, securely through Stripe. You get a confirmation, and David writes to you to set up the kickoff call."]],
      end: "Ready to stop losing clients?", paid: "Thank you, your booking is confirmed. David will write to you shortly to set up the kickoff call.", faq_t: "FAQ", back: "All services", pr_e: "Already live", pr_h: "What it looks like, for real.", pr: [["Sales pages like these", "20 trade websites generated by our site factory, built for phones first."], ["Custom dashboards", "Like this content network, live in Hebrew."], ["The agent that answers", "Ava, our voice receptionist, in an open demo."]] },
    fr: { eye: "Offre de lancement", name: "Machine à clients", lead: "Votre site en ligne en 48 h, vos pubs Meta et TikTok réglées derrière lui, chaque demande suivie : aucun client n'attend.",
      from: "Prix de lancement", price: "1 290 €", note: "Payé en une fois. Le budget publicitaire reste le vôtre, et sous votre contrôle.",
      pay: "Réserver maintenant", call: "Appel de 20 min · WhatsApp", wa: "Bonjour David, je viens de la page Machine à clients et j'aimerais un appel de 20 minutes.",
      get: "Ce que vous recevez", items: [["Votre site en 48 heures", "Une page de vente pensée pour le téléphone, qui explique votre offre et donne envie d'écrire. Les pixels Meta et TikTok sont posés, le formulaire et WhatsApp arrivent directement dans votre suivi."],
        ["30 jours de pubs pilotées", "On teste d'abord vos messages en publication organique, puis on met le budget derrière celui qui fonctionne. Vous ne payez pas pour apprendre."],
        ["Chaque demande suivie", "Chaque prospect est noté, relancé au bon moment, et vous voyez tout sur un tableau clair, depuis votre téléphone."],
        ["Un agent qui prend les rendez-vous", "Sur WhatsApp et au téléphone, en hébreu, en français ou en anglais : il répond tout de suite, pose les bonnes questions et fixe le rendez-vous dans votre agenda."],
        ["Un seul interlocuteur", "David suit votre projet de bout en bout et vous envoie des comptes rendus réguliers, en mots simples."]],
      how: "Comment ça se passe", how_h: "De l'appel au premier rendez-vous.", steps: ["Un appel de 20 minutes : votre activité, votre client idéal et ce qui le fait acheter.", "Votre site en ligne en 48 h, avec le suivi déjà branché.", "Les messages sont testés en organique, puis le budget passe sur le gagnant, ajusté chaque semaine.", "Chaque demande reçoit une réponse tout de suite, est suivie et avance vers un rendez-vous."],
      inc: "Inclus", inc_l: ["Site ou page de vente, mobile d'abord", "Pixels Meta et TikTok", "30 jours de pilotage des pubs", "Suivi des demandes avec tableau sur téléphone", "Agent de prise de rendez-vous WhatsApp et téléphone", "Comptes rendus réguliers"],
      know: "À savoir", know_l: ["Le budget publicitaire Meta et TikTok est payé directement par vous aux plateformes et n'est pas compris dans le prix.", "Prix fixe, payé une fois : rien ne s'ajoute sans votre accord, en dehors des options que vous choisissez."],
      more: "Pour aller plus loin", more_h: "Besoin de plus ? Les options se branchent dessus.",
      faq: [["Combien coûte la publicité en plus ?", "Vous choisissez le budget, vous le payez directement à Meta ou TikTok et vous pouvez l'arrêter à tout moment. On vous conseille un montant de départ pendant l'appel."],
        ["Et si j'ai déjà un site ?", "On peut partir de votre site si sa base est saine, ou créer une page de vente dédiée qui s'y relie. On le décide ensemble pendant l'appel."],
        ["Que se passe-t-il après les 30 jours ?", "Le site et le suivi des demandes restent à vous. Pour les pubs et l'agent, on vous propose la suite dans le dernier compte rendu, sans obligation."],
        ["Comment se passe le paiement ?", "En ligne par carte, de façon sécurisée avec Stripe. Vous recevez une confirmation, et David vous écrit pour fixer l'appel de lancement."]],
      end: "Prêt à ne plus laisser filer un client ?", paid: "Merci, votre réservation est confirmée. David vous écrit très vite pour fixer l'appel de lancement.", faq_t: "Questions fréquentes", back: "Toutes nos offres", pr_e: "Déjà en ligne", pr_h: "Ce que ça donne, en vrai.", pr: [["Des pages de vente comme celles-ci", "20 sites de métiers générés par notre usine à sites, pensés pour le téléphone."], ["Des tableaux de bord sur mesure", "Comme ce réseau de contenu, en ligne en hébreu."], ["L'agent qui répond", "Ava, notre réceptionniste vocale, en démo libre (en anglais)."]] }
  }[L];
  const PROOF_U = ["https://demos-artisans.vercel.app", "https://reseau-contenu-demo.vercel.app", "https://dreamnova-voice-demo.vercel.app"], PROOF_I = ["gal_artisans", "gal_reseau", "gal_voiceava"];
  const wa = `https://wa.me/${D.WA}?text=${encodeURIComponent(M.wa)}`;
  const ctas = `<div class="mc-ctas"><a class="btn btn--gold" href="${PAY[L]}" rel="noopener"><span>${esc(M.pay)}</span><span class="btn__ico">${ARROW}</span></a><a class="btn btn--glass" href="${wa}" target="_blank" rel="noopener"><span>${esc(M.call)}</span><span class="btn__ico">${ARROW}</span></a></div>`;
  // options : offres déjà affichées sur le site (3D, e-commerce, assistant IA privé), même devise que la page
  const opts = [[2, "3d"], [3, "web"], [4, "private"]].map(([k, id]) => [D.OFFERS[L][k], id]).filter(([o]) => o);
  const paid = new URLSearchParams(location.search).get("paid") === "1";
  document.getElementById("app").innerHTML = `
  <header class="nav nav--svc"><a href="${BASE}${L}/" class="nav__brand" aria-label="DreamNova"><img class="nav__crest" src="${BASE}assets/brand/crest.svg" alt="" width="26" height="32"><span class="nav__name">DreamNova</span></a>
    <a class="svc__back" href="${BASE}${L}/#offers">${RTL ? "→" : "←"} ${esc(M.back)}</a>
    <div class="nav__langs">${["he", "en", "fr"].map(l => `<a href="${BASE}${l}/client-machine/" hreflang="${l}" class="${l === L ? "is-on" : ""}">${l.toUpperCase()}</a>`).join("")}</div>
    <a class="btn btn--gold btn--sm nav__cta" href="${PAY[L]}" rel="noopener"><span>${esc(M.pay)}</span><span class="btn__ico">${ARROW}</span></a></header>
  <main>
  ${paid ? `<p class="mc-paid" role="status">${esc(M.paid)}</p>` : ""}
  <section class="svc-hero">
    <video class="svc-hero__v" data-src="${BASE}assets/rooms_v2/room_06_marketing.mp4" poster="${BASE}assets/rooms_v2/poster_room_06.webp" muted loop playsinline preload="none"></video>
    <div class="svc-hero__shade"></div>
    <div class="svc-hero__in">
      <p class="eyebrow eyebrow--gold">${esc(M.eye)}</p>
      <h1 class="svc-hero__t">${esc(M.name)}</h1>
      <p class="svc-hero__p">${esc(M.lead)}</p>
      <p class="mc-price"><small>${esc(M.from)}</small><b>${esc(M.price)}</b></p>
      <p class="mc-note">${esc(M.note)}</p>
      ${ctas}
    </div>
  </section>
  <section class="svc-build"><h2 class="eyebrow eyebrow--gold">${esc(M.get)}</h2>
    <ol class="build-steps">${M.items.map(([t, d], k) => `<li class="r"><span class="build-steps__n">${String(k + 1).padStart(2, "0")}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("")}</ol></section>
  <section class="svc-build mc-proof"><p class="eyebrow eyebrow--gold">${esc(M.pr_e)}</p><h2 class="h2 svc-build__t">${esc(M.pr_h)}</h2>
    <div class="mc-proof__g">${M.pr.map(([t, d], k) => `<a class="mc-fig r" href="${PROOF_U[k]}" target="_blank" rel="noopener"><span class="mc-fig__i"><img src="${BASE}assets/work/${PROOF_I[k]}.webp" alt="${esc(t)}" width="1200" height="750" loading="lazy" decoding="async"></span><span class="mc-fig__b"><b>${esc(t)}</b><span>${esc(d)}</span><span class="mc-fig__c" aria-hidden="true">${ARROW}</span></span></a>`).join("")}</div></section>
  <section class="svc-spec"><p class="eyebrow">${esc(M.how)}</p><h2 class="h2 svc-build__t">${esc(M.how_h)}</h2>
    <ol class="spec">${M.steps.map((c, k) => `<li class="r"><span>${String(k + 1).padStart(2, "0")}</span><b>${esc(c)}</b></li>`).join("")}</ol></section>
  <section class="svc-build"><div>
    <div class="r mc-know"><p class="eyebrow">${esc(M.know)}</p><ul class="build-deliver">${M.know_l.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
    <div class="faq"><p class="eyebrow">${esc(M.faq_t)}</p>${M.faq.map(([q, a]) => `<details class="r"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></section>
  <section class="svc-offers"><p class="eyebrow">${esc(M.more)}</p><h2 class="h2 svc-build__t">${esc(M.more_h)}</h2><div class="offers__list">${opts.map(([[t, d, [lab, p]], id], k) =>
    `<a class="off r" href="${BASE}${L}/s/${id}/"><span class="off__n">${String(k + 1).padStart(2, "0")}</span><span class="off__t">${esc((M.opt && M.opt[id]) || t)}</span><span class="off__d">${esc(d)}</span><span class="off__p">${lab ? `<small>${esc(lab)}</small>` : ""}${esc(p)}</span><span class="off__c">${ARROW}</span></a>`).join("")}</div></section>
  <section class="svc-build mc-end"><div class="mc-end__g"><div><h2 class="h2 svc-build__t">${esc(M.end)}</h2><p class="mc-price"><small>${esc(M.from)}</small><b>${esc(M.price)}</b></p><p class="mc-note">${esc(M.note)}</p>${ctas}</div><div class="mc-end__r r"><p class="eyebrow eyebrow--gold">${esc(M.inc)}</p><ul class="build-deliver">${M.inc_l.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></div></section>
  </main>
  <footer class="foot"><div class="foot__row"><span>© 2026 DreamNova · David Amor · <a href="https://wa.me/${D.WA}" dir="ltr">+972 58-492-1492</a></span><span>${esc(T["foot.where"])}</span></div></footer>`;
  // vidéo du hero : sur téléphone rien n'est téléchargé avant le premier geste (même règle que svc.js)
  { const v = document.querySelector(".svc-hero__v"), go = () => { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); };
    if (innerWidth > 767) go(); else { const once = () => { go(); ["touchstart", "scroll", "pointerdown"].forEach(t => removeEventListener(t, once)); }; ["touchstart", "scroll", "pointerdown"].forEach(t => addEventListener(t, once, { passive: true })); } }
  if (window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && innerWidth > 767) { const l = new Lenis({ lerp: .09 }); l.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => l.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    if (innerWidth > 767) gsap.from(".svc-hero__in > *", { y: 60, opacity: 0, duration: 1.4, stagger: .1, ease: "expo.out", delay: .1 });
    gsap.utils.toArray(".r").forEach(e => gsap.from(e, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: e, start: "top 96%" } }));
  }
})();
