// Cockpit : séquence d'entrée pilotée au défilement, puis points interactifs vers les pages de service.
(() => {
  const D = window.DN, L = document.documentElement.lang, BASE = new URL("./", document.currentScript.src).href;
  const sec = document.querySelector(".drive"); if (!sec) return;
  const CAR = BASE + "assets/car/";
  const T = D.DRIVE_I[L], S = D.SVC;
  sec.querySelectorAll("[data-d]").forEach(e => e.textContent = T[e.dataset.d]);
  const canvas = sec.querySelector(".drive__seq"), ctx = canvas.getContext("2d"), cockpit = sec.querySelector(".drive__cockpit"), loop = sec.querySelector(".drive__loop");
  const hotsEl = sec.querySelector(".drive__hots");

  if (!D.CAR) return;
  fetch(CAR + "hotspots.json", { cache: "no-store" }).then(r => r.ok ? r.json() : Promise.reject()).then(init).catch(() => {});

  function init(hots) {
    sec.hidden = false;
    const byId = Object.fromEntries(hots.map(h => [h.id, h]));
    const N = hots.frames || 80; // nombre d'images de la séquence
    const frames = new Array(N);
    let loaded = 0;
    for (let i = 0; i < N; i++) {
      const im = new Image(); im.decoding = "async";
      im.onload = () => { loaded++; if (i === 0) draw(0); };
      im.src = `${CAR}seq/f_${String(i).padStart(3, "0")}.webp`; frames[i] = im;
    }
    cockpit.style.backgroundImage = `url(${CAR}cockpit.webp)`;
    loop.dataset.src = CAR + "cockpit.mp4";

    // points interactifs : position normalisée sur l'image 16:9 recadrée « cover »
    hotsEl.innerHTML = S.map((s, i) => {
      const h = byId[s.hot]; if (!h) return "";
      const name = D.SERVICES[i][L][0];
      return `<a class="hot ${h.x > 0.62 ? "hot--left" : ""}" role="listitem" href="${BASE}${L}/s/${s.id}/" data-x="${h.x}" data-y="${h.y}" data-cursor="${T.tap}"><span class="hot__dot"></span><span class="hot__card"><span class="hot__part">${s.part[L]}</span><span class="hot__name">${name}</span></span></a>`;
    }).join("");
    const place = () => {
      const vw = sec.clientWidth, vh = innerHeight, sc = Math.max(vw / 16, vh / 9), w = 16 * sc, hh = 9 * sc, ox = (vw - w) / 2, oy = (vh - hh) / 2;
      hotsEl.querySelectorAll(".hot").forEach(a => { a.style.left = ox + a.dataset.x * w + "px"; a.style.top = oy + a.dataset.y * hh + "px"; });
      canvas.width = vw * Math.min(devicePixelRatio, 2); canvas.height = vh * Math.min(devicePixelRatio, 2); draw(cur);
    };
    let cur = 0;
    function draw(i) {
      const im = frames[i]; if (!im || !im.complete || !im.naturalWidth) return;
      const cw = canvas.width, ch = canvas.height, sc = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
      const w = im.naturalWidth * sc, h = im.naturalHeight * sc;
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
    }
    addEventListener("resize", place); place();

    const hook = () => {
      const g = window.gsap, ST = window.ScrollTrigger;
      if (!g || !ST || window.__DN?.reduced) { cockpit.style.opacity = 1; sec.classList.add("is-in"); return; }
      const intro = sec.querySelector(".drive__intro");
      ST.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 3.2, pin: sec.querySelector(".drive__pin"), scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: st => {
          const p = st.progress, seqEnd = 0.78;
          const f = Math.min(N - 1, Math.floor((p / seqEnd) * (N - 1)));
          if (f !== cur) { cur = f; requestAnimationFrame(() => draw(f)); }
          const k = Math.min(1, Math.max(0, (p - seqEnd) / 0.08));
          cockpit.style.opacity = k;
          if (k > 0.5 && !loop.src) loop.src = loop.dataset.src;
          k > 0.5 ? loop.play().catch(() => {}) : loop.pause();
          intro.style.opacity = Math.max(0, 1 - p * 3.2); intro.style.transform = `translateY(${-p * 120}px)`;
          sec.classList.toggle("is-in", p > seqEnd + 0.05);
        } });
      ST.refresh();
    };
    window.__DN ? hook() : addEventListener("dn:ready", hook, { once: true });
    window.__DNDRIVE = { frames: N, hots: hots.length };
  }
})();
