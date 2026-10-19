// Chapitres cinématiques : accélération (vidéo + vitesse), espace (4 plans), valeurs (5 aventures). Activés par D.ON.
(() => {
  const D = window.DN, L = document.documentElement.lang, RTLc = L === "he", BASE = new URL("./", document.currentScript.src).href, C = D.CHAPTERS, ON = D.ON || {};
  const mob = matchMedia("(max-width: 1024px)").matches, esc = x => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); // tablette comprise : fichiers _m
  const SAVE = !!(navigator.connection && navigator.connection.saveData); // économiseur de données : affiches seulement
  const TOUCH = matchMedia("(hover: none) and (pointer: coarse)").matches; // tactile : épinglage par position:sticky (zéro saut de mise en page)
  const src = v => `${BASE}assets/${v}${mob ? "_m" : ""}.mp4`, poster = v => `${BASE}assets/${v}${mob ? "_m" : ""}.webp`;
  const ready = fn => window.__DN ? fn() : addEventListener("dn:ready", fn, { once: true });
  // affiches posées seulement à l'approche (≈1,5 écran), pas au chargement de la page
  const lazyPosters = el => { const io = new IntersectionObserver(es => { if (!es.some(e => e.isIntersecting)) return; el.querySelectorAll("video[data-poster]").forEach(v => { v.poster = v.dataset.poster; v.removeAttribute("data-poster"); }); io.disconnect(); }, { rootMargin: "1500px 0px" }); io.observe(el); };
  const sticky = (el, pinEl, vh) => { if (!TOUCH) return; pinEl.style.position = "sticky"; pinEl.style.top = "0"; pinEl.style.height = "100svh"; el.style.height = vh + "svh"; };

  // --- accélération
  const ac = document.querySelector(".chap--accel");
  if (ac && ON.accel) {
    const A = C.accel[L]; ac.hidden = false;
    ac.innerHTML = `<div class="chap__pin"><video class="chap__v" data-src="${src("car2/accel_v2")}" data-poster="${BASE}assets/car2/accel_v2${mob ? "_m" : ""}_poster.webp" muted loop playsinline preload="metadata"></video><div class="speed" aria-hidden="true"></div><div class="streak" aria-hidden="true"></div><div class="chap__shade"></div>
      <div class="chap__txt"><p class="eyebrow eyebrow--gold">${esc(A.eyebrow)}</p><h2 class="chap__t">${esc(A.t)}</h2><p class="chap__d">${esc(A.d)}</p></div></div>`;
    const v = ac.querySelector("video"), sp = ac.querySelector(".speed");
    lazyPosters(ac); sticky(ac, ac.querySelector(".chap__pin"), 240);
    ready(() => { const ST = window.ScrollTrigger; if (!ST) return;
      ST.create({ trigger: ac, start: "top 120%", once: true, onEnter: () => { if (SAVE) return; v.src = v.dataset.src; v.load(); } }); // la vidéo arrive juste avant qu'on la voie
      ST.create({ trigger: ac, start: "top top", end: TOUCH ? "bottom bottom" : () => "+=" + innerHeight * 1.4, pin: TOUCH ? false : ac.querySelector(".chap__pin"), scrub: true, refreshPriority: 9,
        onEnter: () => { v.play().catch(() => {}); window.DNAudio?.sfx("accel"); }, onEnterBack: () => v.play().catch(() => {}), onLeave: () => v.pause(), onLeaveBack: () => v.pause(),
        onUpdate: s => { const k = s.progress, out = Math.max(0, (k - .55) / .45); v.style.transform = `translateX(${(RTLc ? -1 : 1) * out * out * 70}vw) scale(${1 + k * .18})`; v.style.filter = `blur(${out * 6}px)`; ac.style.setProperty("--sw", out); sp.style.opacity = Math.min(1, k * 1.6); sp.style.setProperty("--k", k); v.playbackRate = 1 + k * 1.2; } });
      ST.sort(); ST.refresh(); });
  }

  // --- pile de plans (espace, valeurs)
  function stack(el, items, head, big, prio) {
    el.hidden = false;
    el.innerHTML = `<div class="chap__pin">${items.map((it, i) => `<video class="chap__v chap__layer${i ? "" : " is-on"}" data-src="${src(it.v)}" data-poster="${poster(it.v)}" muted loop playsinline preload="none"></video>`).join("")}
      <div class="chap__shade"></div>${head ? `<div class="chap__head"><p class="eyebrow eyebrow--gold">${esc(head.eyebrow)}</p><h2 class="h2">${esc(head.t)}</h2></div>` : ""}
      <div class="chap__txt chap__swap">${big ? `<span class="chap__big"></span>` : ""}<h2 class="chap__t"></h2><p class="chap__d"></p></div>
      <ol class="rooms__dots">${items.map(() => "<li></li>").join("")}</ol></div>`;
    const vids = [...el.querySelectorAll("video")], dots = [...el.querySelectorAll(".rooms__dots li")], sw = el.querySelector(".chap__swap");
    let cur = -1;
    const show = (i, boot) => { if (i === cur) return; cur = i; sw.classList.add("is-swap");
      vids.forEach((v, k) => { const on = k === i; v.classList.toggle("is-on", on); if (SAVE) return; if (!boot && (on || k === i + 1)) { if (!v.src) v.src = v.dataset.src; } if (on && !boot) v.play().catch(() => {}); else if (!on) v.pause(); });
      dots.forEach((d, k) => d.classList.toggle("is-on", k === i));
      setTimeout(() => { const it = items[i][L]; if (big) { sw.querySelector(".chap__big").textContent = it[0]; sw.querySelector(".chap__t").textContent = ""; sw.querySelector(".chap__d").textContent = it[1]; } else { sw.querySelector(".chap__t").textContent = it[0]; sw.querySelector(".chap__d").textContent = it[1]; } sw.classList.remove("is-swap"); }, 480);
      el.dispatchEvent(new CustomEvent("chap", { detail: i }));
    };
    const playCur = () => { const v = vids[cur]; if (!v) return; if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); };
    show(0, true); lazyPosters(el); sticky(el, el.querySelector(".chap__pin"), 100 + items.length * 75);
    ready(() => { const ST = window.ScrollTrigger; if (!ST) return;
      ST.create({ trigger: el, start: "top top", end: TOUCH ? "bottom bottom" : () => "+=" + innerHeight * items.length * .75, pin: TOUCH ? false : el.querySelector(".chap__pin"), scrub: true, refreshPriority: prio,
        snap: { snapTo: 1 / (items.length - 1), duration: { min: .3, max: .7 }, ease: "power2.inOut" },
        onUpdate: s => show(Math.min(items.length - 1, Math.round(s.progress * (items.length - 1)))),
        onEnter: () => playCur(), onEnterBack: () => playCur(),
        onLeave: () => vids.forEach(v => v.pause()), onLeaveBack: () => vids.forEach(v => v.pause()) });
      ST.sort(); ST.refresh(); });
  }
  const sp = document.querySelector(".chap--space"); if (sp && ON.space) stack(sp, C.space, null, false, 4);
  const va = document.querySelector(".chap--values"); if (va && ON.values) stack(va, C.values, C.values_i[L], true, 3);
})();
