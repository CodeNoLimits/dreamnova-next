// Chapitres cinématiques : accélération (vidéo + vitesse), espace (4 plans), valeurs (5 aventures). Activés par D.ON.
(() => {
  const D = window.DN, L = document.documentElement.lang, BASE = new URL("./", document.currentScript.src).href, C = D.CHAPTERS, ON = D.ON || {};
  const mob = matchMedia("(max-width: 767px)").matches, esc = x => String(x).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const src = v => `${BASE}assets/${v}${mob ? "_m" : ""}.mp4`, poster = v => `${BASE}assets/${v}${mob ? "_m" : ""}.webp`;
  const ready = fn => window.__DN ? fn() : addEventListener("dn:ready", fn, { once: true });

  // --- accélération
  const ac = document.querySelector(".chap--accel");
  if (ac && ON.accel) {
    const A = C.accel[L]; ac.hidden = false;
    ac.innerHTML = `<div class="chap__pin"><video class="chap__v" src="${src("car2/accel")}" muted loop playsinline preload="metadata"></video><div class="speed" aria-hidden="true"></div><div class="chap__shade"></div>
      <div class="chap__txt"><p class="eyebrow eyebrow--gold">${esc(A.eyebrow)}</p><h2 class="chap__t">${esc(A.t)}</h2><p class="chap__d">${esc(A.d)}</p></div></div>`;
    const v = ac.querySelector("video"), sp = ac.querySelector(".speed");
    ready(() => { const ST = window.ScrollTrigger; if (!ST) return;
      ST.create({ trigger: ac, start: "top top", end: () => "+=" + innerHeight * 1.4, pin: ac.querySelector(".chap__pin"), scrub: true, refreshPriority: 9,
        onEnter: () => { v.play().catch(() => {}); window.DNAudio?.sfx("accel"); }, onEnterBack: () => v.play().catch(() => {}), onLeave: () => v.pause(), onLeaveBack: () => v.pause(),
        onUpdate: s => { const k = s.progress; v.style.transform = `scale(${1 + k * .18})`; sp.style.opacity = Math.min(1, k * 1.6); sp.style.setProperty("--k", k); v.playbackRate = 1 + k * 1.2; } });
      ST.sort(); ST.refresh(); });
  }

  // --- pile de plans (espace, valeurs)
  function stack(el, items, head, big, prio) {
    el.hidden = false;
    el.innerHTML = `<div class="chap__pin">${items.map((it, i) => `<video class="chap__v chap__layer${i ? "" : " is-on"}" data-src="${src(it.v)}" poster="${poster(it.v)}" muted loop playsinline preload="none"></video>`).join("")}
      <div class="chap__shade"></div>${head ? `<div class="chap__head"><p class="eyebrow eyebrow--gold">${esc(head.eyebrow)}</p><h2 class="h2">${esc(head.t)}</h2></div>` : ""}
      <div class="chap__txt chap__swap">${big ? `<span class="chap__big"></span>` : ""}<h2 class="chap__t"></h2><p class="chap__d"></p></div>
      <ol class="rooms__dots">${items.map(() => "<li></li>").join("")}</ol></div>`;
    const vids = [...el.querySelectorAll("video")], dots = [...el.querySelectorAll(".rooms__dots li")], sw = el.querySelector(".chap__swap");
    let cur = -1;
    const show = i => { if (i === cur) return; cur = i; sw.classList.add("is-swap");
      vids.forEach((v, k) => { const on = k === i; v.classList.toggle("is-on", on); if (on || k === i + 1) { if (!v.src) v.src = v.dataset.src; } if (on) v.play().catch(() => {}); else v.pause(); });
      dots.forEach((d, k) => d.classList.toggle("is-on", k === i));
      setTimeout(() => { const it = items[i][L]; if (big) { sw.querySelector(".chap__big").textContent = it[0]; sw.querySelector(".chap__t").textContent = ""; sw.querySelector(".chap__d").textContent = it[1]; } else { sw.querySelector(".chap__t").textContent = it[0]; sw.querySelector(".chap__d").textContent = it[1]; } sw.classList.remove("is-swap"); }, 280);
      el.dispatchEvent(new CustomEvent("chap", { detail: i }));
    };
    const playCur = () => { const v = vids[cur]; if (!v) return; if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); };
    show(0);
    ready(() => { const ST = window.ScrollTrigger; if (!ST) return;
      ST.create({ trigger: el, start: "top top", end: () => "+=" + innerHeight * items.length * .75, pin: el.querySelector(".chap__pin"), scrub: true, refreshPriority: prio,
        snap: { snapTo: 1 / (items.length - 1), duration: { min: .3, max: .7 }, ease: "power2.inOut" },
        onUpdate: s => show(Math.min(items.length - 1, Math.round(s.progress * (items.length - 1)))),
        onEnter: () => playCur(), onEnterBack: () => playCur(),
        onLeave: () => vids.forEach(v => v.pause()), onLeaveBack: () => vids.forEach(v => v.pause()) });
      ST.sort(); ST.refresh(); });
  }
  const sp = document.querySelector(".chap--space"); if (sp && ON.space) stack(sp, C.space, null, false, 4);
  const va = document.querySelector(".chap--values"); if (va && ON.values) stack(va, C.values, C.values_i[L], true, 3);
})();
