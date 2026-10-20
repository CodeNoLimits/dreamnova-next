// Devis intelligent : formulaire → /api/devis (Gemini) → document élégant → PDF (impression) ou WhatsApp.
(() => {
  const D = window.DN, L = document.documentElement.lang, BASE = new URL("./", document.currentScript.src).href;
  const sec = document.querySelector(".quote"); if (!sec) return;
  const Q = {
    he: { eyebrow: "הצעת מחיר חכמה", title: "הצעה אישית תוך 30 שניות.", lead: "ספרו לנו מה אתם צריכים — ה־AI שלנו מכין לכם הצעה מסודרת לפי המחירון שלנו, להורדה כ־PDF. ההצעה הסופית נכתבת על ידי דוד.", name: "שם", company: "עסק / ארגון", sector: "תחום", service: "שירות", need: "מה אתם צריכים?", needPh: "תארו את הפרויקט במשפט או שניים…", timing: "מתי?", opts: ["כמה שיותר מהר", "החודש", "ברבעון הקרוב", "עדיין בודקים"], submit: "צרו לי הצעה", loading: "ה־AI כותב את ההצעה שלכם…", pdf: "הורדת PDF", wa: "לשלוח לדוד בוואטסאפ", again: "הצעה חדשה", err: "השרת עמוס כרגע. נסו שוב בעוד רגע, או כתבו לנו בוואטסאפ.", disc: "הערכה ראשונית שנוצרה על ידי AI לפי המחירון הציבורי. ההצעה הסופית נכתבת ונחתמת על ידי DreamNova.", summary: "מה הבנו", approach: "הדרך", deliverables: "מה תקבלו", options: "המסלולים המומלצים", timeline: "לוח זמנים משוער", next: "השלב הבא", forw: "עבור", date: "תאריך" },
    en: { eyebrow: "Smart quote", title: "Your tailored proposal in 30 seconds.", lead: "Tell us what you need — our AI drafts a structured proposal from our price grid, ready to download as a PDF. The final quote is written by David.", name: "Name", company: "Company / organization", sector: "Industry", service: "Service", need: "What do you need?", needPh: "Describe the project in a sentence or two…", timing: "When?", opts: ["As soon as possible", "This month", "Next quarter", "Just exploring"], submit: "Generate my proposal", loading: "Our AI is writing your proposal…", pdf: "Download PDF", wa: "Send to David on WhatsApp", again: "New proposal", err: "The server is busy. Try again in a moment, or message us on WhatsApp.", disc: "Preliminary AI-generated estimate based on our public price grid. The final quote is written and signed by DreamNova.", summary: "What we understood", approach: "Approach", deliverables: "What you get", options: "Recommended options", timeline: "Indicative timeline", next: "Next step", forw: "Prepared for", date: "Date" },
    fr: { eyebrow: "Devis intelligent", title: "Votre proposition sur mesure en 30 secondes.", lead: "Dites-nous ce dont vous avez besoin — notre IA rédige une proposition structurée à partir de notre grille tarifaire, téléchargeable en PDF. Le devis final est écrit par David.", name: "Nom", company: "Entreprise / organisation", sector: "Secteur", service: "Service", need: "De quoi avez-vous besoin ?", needPh: "Décrivez le projet en une ou deux phrases…", timing: "Quand ?", opts: ["Au plus vite", "Ce mois-ci", "Le trimestre prochain", "Je me renseigne"], submit: "Générer ma proposition", loading: "Notre IA rédige votre proposition…", pdf: "Télécharger le PDF", wa: "Envoyer à David sur WhatsApp", again: "Nouvelle proposition", err: "Le serveur est chargé. Réessayez dans un instant, ou écrivez-nous sur WhatsApp.", disc: "Estimation préliminaire générée par IA à partir de notre grille publique. Le devis final est rédigé et signé par DreamNova.", summary: "Ce que nous avons compris", approach: "Démarche", deliverables: "Ce que vous recevez", options: "Options recommandées", timeline: "Calendrier indicatif", next: "Prochaine étape", forw: "Préparé pour", date: "Date" }
  }[L];
  const esc = x => String(x ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ARROW = L === "he" ? "↖" : "↗";
  const pre = new URLSearchParams(location.search).get("s");
  const svcIdx = D.SVC.findIndex(s => s.id === pre);
  sec.innerHTML = `
    <div class="sec-head"><p class="eyebrow eyebrow--gold">${esc(Q.eyebrow)}</p><h2 class="h2">${esc(Q.title)}</h2><p class="lead">${esc(Q.lead)}</p></div>
    <div class="shell quote__shell reveal"><form class="core quote__form" novalidate>
      <label><span>${esc(Q.name)}</span><input name="name" autocomplete="name" maxlength="80"></label>
      <label><span>${esc(Q.company)}</span><input name="company" autocomplete="organization" maxlength="120"></label>
      <label><span>${esc(Q.sector)}</span><input name="sector" maxlength="120"></label>
      <label><span>${esc(Q.service)}</span><select name="service">${D.SERVICES.map((s, i) => `<option ${i === svcIdx ? "selected" : ""}>${esc(s[L][0])}</option>`).join("")}</select></label>
      <label class="wide"><span>${esc(Q.need)}</span><textarea name="need" rows="4" required minlength="10" maxlength="1500" placeholder="${esc(Q.needPh)}"></textarea></label>
      <label><span>${esc(Q.timing)}</span><select name="timing">${Q.opts.map(o => `<option>${esc(o)}</option>`).join("")}</select></label>
      <input name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
      <button class="btn btn--gold magnetic quote__go" type="submit"><span>${esc(Q.submit)}</span><span class="btn__ico">${ARROW}</span></button>
      <p class="quote__err" role="alert" hidden>${esc(Q.err)}</p>
    </form></div>
    <div class="quote__load" hidden><div class="quote__scan"><img src="${BASE}assets/brand/crest.svg" alt="" width="64" height="80"><span></span></div><p>${esc(Q.loading)}</p></div>
    <div class="quote__out" hidden></div>`;
  const form = sec.querySelector("form"), load = sec.querySelector(".quote__load"), out = sec.querySelector(".quote__out"), err = sec.querySelector(".quote__err");
  form.addEventListener("submit", async e => {
    e.preventDefault(); err.hidden = true;
    const fd = Object.fromEntries(new FormData(form)); fd.lang = L;
    if ((fd.need || "").trim().length < 10) { form.need.focus(); form.need.setCustomValidity({ he: "כתבו לפחות משפט אחד על הפרויקט", en: "Please describe your project in at least one sentence", fr: "Décrivez votre projet en une phrase au moins" }[L]); form.need.reportValidity(); form.need.oninput = () => form.need.setCustomValidity(""); return; }
    form.closest(".quote__shell").hidden = true; load.hidden = false; load.scrollIntoView({ block: "center", behavior: "smooth" }); // l'attente reste sous les yeux
    try {
      const r = await fetch(`${BASE}api/devis`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fd), signal: AbortSignal.timeout(90000) });
      const d = await r.json(); if (!d.ok || !d.proposal) throw 0;
      render(d.proposal, d.client || fd);
    } catch (_) { load.hidden = true; form.closest(".quote__shell").hidden = false; err.hidden = false; }
  });
  function render(p, c) {
    load.hidden = true; out.hidden = false;
    const date = new Date().toLocaleDateString({ he: "he-IL", en: "en-GB", fr: "fr-FR" }[L], { day: "numeric", month: "long", year: "numeric" });
    const list = a => (Array.isArray(a) ? a : []).map(x => `<li>${esc(x)}</li>`).join("");
    const waTxt = `${D.I[L]["wa.msg"]}\n\n${p.title || ""}\n${p.summary || ""}\n\n${(p.options || []).map(o => `• ${o.name} — ${o.price}`).join("\n")}`;
    out.innerHTML = `<article class="doc" dir="${L === "he" ? "rtl" : "ltr"}">
      <header class="doc__h"><img src="${BASE}assets/brand/crest.svg" alt="" width="48" height="60"><div><b>DreamNova</b><span>${esc(D.I[L]["hero.eyebrow"])}</span></div><dl><dt>${esc(Q.forw)}</dt><dd>${esc([c.name, c.company].filter(Boolean).join(" · ") || "—")}</dd><dt>${esc(Q.date)}</dt><dd>${esc(date)}</dd></dl></header>
      <h3 class="doc__t">${esc(p.title)}</h3>
      <section><h4>${esc(Q.summary)}</h4><p>${esc(p.summary)}</p></section>
      <div class="doc__cols"><section><h4>${esc(Q.approach)}</h4><ol>${list(p.approach)}</ol></section><section><h4>${esc(Q.deliverables)}</h4><ul>${list(p.deliverables)}</ul></section></div>
      <section><h4>${esc(Q.options)}</h4><div class="doc__opts">${(p.options || []).map(o => `<div class="doc__opt"><b>${esc(o.name)}</b><p>${esc(o.why)}</p><span>${esc(o.price)}</span></div>`).join("")}</div></section>
      <div class="doc__cols"><section><h4>${esc(Q.timeline)}</h4><p>${esc(p.timeline)}</p></section><section><h4>${esc(Q.next)}</h4><p>${esc(p.next_step)}</p></section></div>
      <footer class="doc__f"><p>${esc(Q.disc)}</p><p dir="ltr">DreamNova · David Amor · +972 58-492-1492 · dreamnova-next.vercel.app</p></footer>
    </article>
    <div class="quote__acts"><button class="btn btn--gold" data-a="pdf"><span>${esc(Q.pdf)}</span><span class="btn__ico">↓</span></button><a class="btn btn--glass" target="_blank" rel="noopener" href="https://wa.me/${D.WA}?text=${encodeURIComponent(waTxt)}"><span>${esc(Q.wa)}</span><span class="btn__ico">${ARROW}</span></a><button class="btn btn--glass" data-a="again"><span>${esc(Q.again)}</span><span class="btn__ico">↺</span></button></div>`;
    out.querySelector('[data-a="pdf"]').onclick = () => {
      const root = document.createElement("div"); root.id = "print-root"; root.innerHTML = out.querySelector(".doc").outerHTML;
      document.body.appendChild(root); document.body.classList.add("printing");
      const t0 = document.title; document.title = `DreamNova — ${p.title || "Proposal"}`;
      const done = () => { root.remove(); document.body.classList.remove("printing"); document.title = t0; removeEventListener("afterprint", done); };
      addEventListener("afterprint", done); window.print(); setTimeout(() => document.body.classList.contains("printing") && done(), 60000);
    };
    out.querySelector('[data-a="again"]').onclick = () => { out.hidden = true; form.reset(); form.closest(".quote__shell").hidden = false; };
    out.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.gsap) gsap.from(out.querySelectorAll(".doc > *"), { y: 30, opacity: 0, duration: .9, stagger: .06, ease: "expo.out" });
  }
})();
