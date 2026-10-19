// Audit IA du site du visiteur : adresse → /api/audit (lecture de la page + Gemini avec recherche) → rapport élégant → PDF ou WhatsApp.
(() => {
  const D = window.DN, L = document.documentElement.lang, BASE = new URL("./", document.currentScript.src).href, RTL = L === "he";
  const sec = document.querySelector(".audit-ia"); if (!sec) return;
  const Q = {
    he: { eyebrow: "אבחון AI חינם", title: "הדביקו את כתובת האתר שלכם. תוך דקה יש לכם אבחון אמיתי.", lead: "ה‑AI שלנו קורא את האתר שלכם, בודק את השוק בגוגל ומחזיר ציונים, 5 שיפורים מיידיים, תוכנית ל‑30 יום והשירותים שמתאימים לכם — להורדה כ‑PDF.", url: "כתובת האתר", ph: "www.your-business.co.il", go: "לאבחן את האתר שלי", loading: "קוראים את האתר, בודקים את השוק, כותבים את האבחון…", err: "לא הצלחנו לקרוא את האתר הזה. בדקו את הכתובת או כתבו לנו בוואטסאפ.", limit: "הגעתם למכסת האבחונים לשעה. נסו שוב מאוחר יותר.", pdf: "הורדת PDF", wa: "לדבר עם דוד על האבחון", again: "אבחון אחר", scores: "ציונים", wins: "5 שיפורים מיידיים", plan: "תוכנית ל‑30 יום", offers: "מה מתאים לכם מ‑DreamNova", next: "השלב הבא", forw: "אבחון עבור", date: "תאריך", disc: "אבחון ראשוני שנוצר על ידי AI מתוך העמוד הראשי של האתר ומידע ציבורי. ההמלצות הסופיות ניתנות בשיחה עם DreamNova.", ax: { clarity: "בהירות", trust: "אמון", conversion: "המרה", seo: "קידום", mobile: "מובייל", multilingual: "שפות", ai_readiness: "מוכנות ל‑AI" } },
    en: { eyebrow: "Free AI audit", title: "Paste your website. Get a real audit in one minute.", lead: "Our AI reads your site, checks your market on Google and returns scores, 5 quick wins, a 30-day plan and the services that fit — downloadable as a PDF.", url: "Website address", ph: "www.your-business.com", go: "Audit my website", loading: "Reading your site, checking the market, writing the audit…", err: "We couldn't read that website. Check the address or message us on WhatsApp.", limit: "Hourly audit limit reached. Please try again later.", pdf: "Download PDF", wa: "Discuss the audit with David", again: "Another audit", scores: "Scores", wins: "5 quick wins", plan: "30-day plan", offers: "What fits you at DreamNova", next: "Next step", forw: "Audit for", date: "Date", disc: "Preliminary AI audit based on the site's home page and public information. Final recommendations are given in a call with DreamNova.", ax: { clarity: "Clarity", trust: "Trust", conversion: "Conversion", seo: "SEO", mobile: "Mobile", multilingual: "Languages", ai_readiness: "AI readiness" } },
    fr: { eyebrow: "Audit IA gratuit", title: "Collez l'adresse de votre site. En une minute, un vrai audit.", lead: "Notre IA lit votre site, vérifie votre marché sur Google et vous rend des notes, 5 gains rapides, un plan sur 30 jours et les prestations adaptées — téléchargeable en PDF.", url: "Adresse du site", ph: "www.votre-entreprise.fr", go: "Auditer mon site", loading: "Lecture du site, vérification du marché, rédaction de l'audit…", err: "Impossible de lire ce site. Vérifiez l'adresse ou écrivez-nous sur WhatsApp.", limit: "Limite d'audits par heure atteinte. Réessayez un peu plus tard.", pdf: "Télécharger le PDF", wa: "Parler de l'audit avec David", again: "Autre audit", scores: "Notes", wins: "5 gains rapides", plan: "Plan sur 30 jours", offers: "Ce qui vous correspond chez DreamNova", next: "Prochaine étape", forw: "Audit pour", date: "Date", disc: "Audit préliminaire généré par IA à partir de la page d'accueil du site et d'informations publiques. Les recommandations finales sont données lors d'un échange avec DreamNova.", ax: { clarity: "Clarté", trust: "Confiance", conversion: "Conversion", seo: "Référencement", mobile: "Mobile", multilingual: "Langues", ai_readiness: "Prêt pour l'IA" } }
  }[L];
  const esc = x => String(x ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ARROW = RTL ? "↖" : "↗";
  sec.innerHTML = `
    <div class="sec-head"><p class="eyebrow eyebrow--gold">${esc(Q.eyebrow)}</p><h2 class="h2">${esc(Q.title)}</h2><p class="lead">${esc(Q.lead)}</p></div>
    <div class="shell audit-ia__shell reveal"><form class="core audit-ia__form" novalidate>
      <label><span>${esc(Q.url)}</span><input name="url" inputmode="url" autocomplete="url" dir="ltr" placeholder="${esc(Q.ph)}" maxlength="300" required></label>
      <input name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <button class="btn btn--gold btn--xl magnetic audit-ia__go" type="submit"><span>${esc(Q.go)}</span><span class="btn__ico">${ARROW}</span></button>
      <p class="quote__err" role="alert" hidden></p>
    </form></div>
    <div class="quote__load audit-ia__load" hidden><div class="quote__scan"><img src="${BASE}assets/brand/crest.svg" alt="" width="64" height="80"><span></span></div><p>${esc(Q.loading)}</p><div class="audit-ia__steps"><i></i><i></i><i></i></div></div>
    <div class="quote__out audit-ia__out" hidden></div>`;
  const form = sec.querySelector("form"), load = sec.querySelector(".audit-ia__load"), out = sec.querySelector(".audit-ia__out"), err = sec.querySelector(".quote__err");
  form.addEventListener("submit", async e => {
    e.preventDefault(); err.hidden = true;
    const fd = Object.fromEntries(new FormData(form)); fd.lang = L;
    if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test((fd.url || "").trim())) { form.url.focus(); return; }
    form.closest(".audit-ia__shell").hidden = true; load.hidden = false; load.scrollIntoView({ block: "center", behavior: "smooth" });
    window.DNAudio?.sfx("power", 0, .7);
    try {
      const r = await fetch(`${BASE}api/audit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fd) });
      const d = await r.json(); if (!d.ok || !d.audit) throw r.status;
      render(d.audit, d.url, d.facts || {});
    } catch (code) { load.hidden = true; form.closest(".audit-ia__shell").hidden = false; err.textContent = code === 429 ? Q.limit : Q.err; err.hidden = false; }
  });
  const ring = (k, v) => { const n = Math.max(0, Math.min(10, +v || 0)), c = 2 * Math.PI * 26; return `<div class="score"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26"/><circle class="score__v" cx="32" cy="32" r="26" style="stroke-dasharray:${c};stroke-dashoffset:${c * (1 - n / 10)}"/></svg><b>${n}</b><span>${esc(Q.ax[k] || k)}</span></div>`; };
  function render(a, url, facts) {
    load.hidden = true; out.hidden = false;
    const date = new Date().toLocaleDateString({ he: "he-IL", en: "en-GB", fr: "fr-FR" }[L], { day: "numeric", month: "long", year: "numeric" });
    const waTxt = `${D.I[L]["wa.msg"]}\n\n${a.company || url}\n${a.one_liner || ""}\n\n${(a.offers || []).map(o => `• ${o.name} — ${o.price}`).join("\n")}`;
    const sc = a.scores || {}; const avg = (Object.values(sc).reduce((s, v) => s + (+v || 0), 0) / Math.max(1, Object.keys(sc).length)).toFixed(1);
    out.innerHTML = `<article class="doc doc--audit" dir="${RTL ? "rtl" : "ltr"}">
      <header class="doc__h"><img src="${BASE}assets/brand/crest.svg" alt="" width="48" height="60"><div><b>DreamNova</b><span>${esc(D.I[L]["hero.eyebrow"])}</span></div><dl><dt>${esc(Q.forw)}</dt><dd dir="ltr">${esc((url || "").replace(/^https?:\/\//, "").replace(/\/$/, ""))}</dd><dt>${esc(Q.date)}</dt><dd>${esc(date)}</dd></dl></header>
      <h3 class="doc__t">${esc(a.company || "")}${a.sector ? ` <small>· ${esc(a.sector)}</small>` : ""}</h3>
      <p class="doc__one">${esc(a.one_liner)}</p>
      <section><h4>${esc(Q.scores)} · <b>${avg}/10</b></h4><div class="scores">${Object.keys(Q.ax).map(k => ring(k, sc[k])).join("")}</div><p>${esc(a.summary)}</p></section>
      <section><h4>${esc(Q.wins)}</h4><ol class="wins">${(a.quick_wins || []).map(w => `<li><b>${esc(w.title)}</b><p>${esc(w.why)}</p><p class="how">${esc(w.how)}</p></li>`).join("")}</ol></section>
      <div class="doc__cols"><section><h4>${esc(Q.plan)}</h4><ol>${(a.plan_30d || []).map(p => `<li><b>${esc(p.week)}</b> — ${esc(p.action)}</li>`).join("")}</ol></section>
      <section><h4>${esc(Q.offers)}</h4><div class="doc__opts">${(a.offers || []).map(o => `<div class="doc__opt"><b>${esc(o.name)}</b><p>${esc(o.why)}</p><span>${esc(o.price)}</span></div>`).join("")}</div></section></div>
      <section><h4>${esc(Q.next)}</h4><p>${esc(a.next_step)}</p></section>
      <footer class="doc__f"><p>${esc(Q.disc)}</p><p dir="ltr">DreamNova · David Amor · +972 58-492-1492 · dreamnova-next.vercel.app</p></footer>
    </article>
    <div class="quote__acts"><button class="btn btn--gold" data-a="pdf"><span>${esc(Q.pdf)}</span><span class="btn__ico">↓</span></button><a class="btn btn--glass" target="_blank" rel="noopener" href="https://wa.me/${D.WA}?text=${encodeURIComponent(waTxt)}"><span>${esc(Q.wa)}</span><span class="btn__ico">${ARROW}</span></a><button class="btn btn--glass" data-a="again"><span>${esc(Q.again)}</span><span class="btn__ico">↺</span></button></div>`;
    out.querySelector('[data-a="pdf"]').onclick = () => {
      const root = document.createElement("div"); root.id = "print-root"; root.innerHTML = out.querySelector(".doc").outerHTML;
      document.body.appendChild(root); document.body.classList.add("printing");
      const t0 = document.title; document.title = `DreamNova — ${Q.eyebrow} — ${a.company || url}`;
      const done = () => { root.remove(); document.body.classList.remove("printing"); document.title = t0; removeEventListener("afterprint", done); };
      addEventListener("afterprint", done); window.print(); setTimeout(() => document.body.classList.contains("printing") && done(), 60000);
    };
    out.querySelector('[data-a="again"]').onclick = () => { out.hidden = true; form.reset(); form.closest(".audit-ia__shell").hidden = false; };
    out.scrollIntoView({ behavior: "smooth", block: "start" });
    window.DNAudio?.sfx("selector", 0, .6);
    if (window.gsap) { gsap.from(out.querySelectorAll(".doc > *"), { y: 30, opacity: 0, duration: .9, stagger: .06, ease: "expo.out" }); gsap.from(out.querySelectorAll(".score__v"), { strokeDashoffset: 2 * Math.PI * 26, duration: 1.4, stagger: .08, ease: "expo.out", delay: .3 }); }
  }
})();
