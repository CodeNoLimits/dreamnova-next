// Visite du studio : la caméra traverse 7 portails dorés au défilement.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const D = window.DN, L = document.documentElement.lang, RTL = L === "he";
const BASE = new URL("./", import.meta.url).href;
const sec = document.querySelector(".rooms"), pin = sec.querySelector(".rooms__pin");
const canvas = sec.querySelector(".rooms__gl"), cap = sec.querySelector(".rooms__cap");
const ROOMS = D.ROOMS, N = ROOMS.length, GAP = 14;
const mobile = innerWidth < 768;
const media = r => { const [k, v] = r.m.split(":"); return k === "v" ? { video: `${BASE}assets/reel/${v}.mp4` } : k === "r" ? { video: `${BASE}assets/rooms/${v}.mp4` } : { img: `${BASE}assets/work/${v}.webp` }; };

sec.querySelectorAll("[data-r]").forEach(e => e.textContent = D.ROOMS_I[L][e.dataset.r]);
sec.querySelector(".rooms__dots").innerHTML = ROOMS.map(() => "<li></li>").join("");
function fallback() { // seulement si la 3D est désactivée (mobile / sans WebGL) : vidéos chargées à l'approche
  sec.querySelector(".rooms__fallback").innerHTML = ROOMS.map(r => {
    const m = media(r), pn = (r.m.match(/room_0(\d)/) || [])[1];
    return `<article class="room-card">${m.video ? `<video data-src="${m.video}" ${pn ? `poster="${BASE}assets/rooms/poster_room_0${pn}.webp"` : ""} muted loop playsinline preload="none"></video>` : `<img src="${m.img}" alt="" loading="lazy">`}<div><b>${r[L][0]}</b><p>${r[L][1]}</p></div></article>`;
  }).join("");
  const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause(); }), { rootMargin: "200px" });
  sec.querySelectorAll(".room-card video").forEach(v => io.observe(v));
}

let gl = null;
try { gl = canvas.getContext("webgl2") || canvas.getContext("webgl"); } catch (e) {}
if (!gl || mobile) { sec.classList.add("no-gl"); fallback(); }
else start();

function archShape(w, h) {
  const s = new THREE.Shape(), r = w / 2;
  s.moveTo(-r, 0); s.lineTo(-r, h - r); s.absarc(0, h - r, r, Math.PI, 0, true); s.lineTo(r, 0); s.lineTo(-r, 0);
  return s;
}
function fitUV(geo) {
  geo.computeBoundingBox(); const b = geo.boundingBox, uv = geo.attributes.uv, p = geo.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (p.getX(i) - b.min.x) / (b.max.x - b.min.x), (p.getY(i) - b.min.y) / (b.max.y - b.min.y));
  uv.needsUpdate = true;
}
function cover(tex, aspect, target) {
  // recadre la texture comme object-fit: cover
  if (aspect > target) { tex.repeat.set(target / aspect, 1); tex.offset.set((1 - target / aspect) / 2, 0); }
  else { tex.repeat.set(1, aspect / target); tex.offset.set(0, (1 - aspect / target) / 2); }
}

function start() {
  const renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030202); scene.fog = new THREE.FogExp2(0x030202, 0.045);
  const cam = new THREE.PerspectiveCamera(mobile ? 70 : 55, 1, 0.1, 200);

  // sol : grille dorée + reflet doux
  // sol sombre réfléchissant (bande dorée qui se perd dans le brouillard)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, N * GAP + 60), new THREE.MeshBasicMaterial({ color: 0x070504 }));
  floor.rotation.x = -Math.PI / 2; floor.position.z = -(N * GAP) / 2; scene.add(floor);

  // portails
  const W = 5.2, H = 7.4, T = 0.22, portals = [];
  const inner = archShape(W, H), outer = archShape(W + T * 2, H + T);
  const frameShape = archShape(W + T * 2, H + T); frameShape.holes.push(archShape(W, H));
  const frameGeo = new THREE.ExtrudeGeometry(frameShape, { depth: 0.35, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2, curveSegments: 48 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1206, metalness: 0.9, roughness: 0.3, emissive: 0xffcf5a, emissiveIntensity: 2.4 });
  const screenGeo = new THREE.ShapeGeometry(inner, 48); fitUV(screenGeo);
  const loader = new THREE.TextureLoader();
  ROOMS.forEach((r, i) => {
    const g = new THREE.Group(); g.position.set((i % 2 ? 1 : -1) * 0.0, 0, -i * GAP);
    const frame = new THREE.Mesh(frameGeo, frameMat); frame.position.z = -0.175; g.add(frame);
    const m = media(r), target = W / H;
    let tex, video = null;
    if (m.video) {
      video = document.createElement("video"); Object.assign(video, { muted: true, loop: true, playsInline: true, crossOrigin: "anonymous", preload: "metadata" });
      video.dataset.src = m.video; const vtex = new THREE.VideoTexture(video); vtex.colorSpace = THREE.SRGBColorSpace;
      const pn = (r.m.match(/room_0(\d)/) || [])[1];
      tex = pn ? loader.load(`${BASE}assets/rooms/poster_room_0${pn}.webp`, t => cover(t, t.image.width / t.image.height, target)) : vtex;
      video.addEventListener("loadedmetadata", () => cover(vtex, video.videoWidth / video.videoHeight, target));
      video.addEventListener("playing", () => { if (tex !== vtex) { screenRef.material.map = vtex; screenRef.material.needsUpdate = true; } }, { once: true });
    } else {
      tex = loader.load(m.img, t => cover(t, t.image.width / t.image.height, target));
    }
    tex.colorSpace = THREE.SRGBColorSpace;
    const screen = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, color: 0xffffff }));
    var screenRef = screen;
    g.add(screen);
    // halo derrière le portail
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(W * 2.6, H * 1.7), new THREE.MeshBasicMaterial({ map: glowTex(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }));
    halo.position.set(0, H / 2, -1.2); g.add(halo);
    scene.add(g); portals.push({ g, screen, video, frame, halo });
  });

  // poussière dorée
  const P = mobile ? 900 : 2200, pos = new Float32Array(P * 3), seed = new Float32Array(P);
  for (let i = 0; i < P; i++) { pos[i * 3] = (Math.random() - .5) * 26; pos[i * 3 + 1] = Math.random() * 12; pos[i * 3 + 2] = 10 - Math.random() * (N * GAP + 30); seed[i] = Math.random(); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3)); pg.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
  const pm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { t: { value: 0 }, px: { value: renderer.getPixelRatio() } },
    vertexShader: `attribute float seed;uniform float t;uniform float px;varying float a;void main(){vec3 p=position;p.y+=sin(t*.4+seed*30.)*.35;p.x+=cos(t*.3+seed*20.)*.25;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=(2.+seed*4.)*px*(8./-mv.z);a=.35+.65*seed;}`,
    fragmentShader: `varying float a;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(1.,.82,.45,a*smoothstep(.5,0.,d));}` });
  scene.add(new THREE.Points(pg, pm));

  // lumière
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const key = new THREE.PointLight(0xffd88a, 40, 30); scene.add(key);

  // postprod : halo lumineux
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, cam));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.55, 0.86);
  composer.addPass(bloom); composer.addPass(new OutputPass());

  const resize = () => { const w = pin.clientWidth, h = pin.clientHeight; renderer.setSize(w, h, false); composer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  resize(); addEventListener("resize", resize);

  // état
  let prog = 0, smooth = 0, active = -1, visible = false, mx = 0, my = 0;
  addEventListener("pointermove", e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  new IntersectionObserver(([e]) => visible = e.isIntersecting, { rootMargin: "100px" }).observe(pin);
  const OFF = 11.5, zStart = OFF, zEnd = -(N - 1) * GAP + OFF;
  const nums = sec.querySelector(".rooms__num"), nameEl = sec.querySelector(".rooms__name"), lineEl = sec.querySelector(".rooms__line"), dots = [...sec.querySelectorAll(".rooms__dots li")];
  function setRoom(i) {
    if (i === active) return; active = i; cap.classList.add("is-swap");
    dots.forEach((d, k) => d.classList.toggle("is-on", k === i));
    setTimeout(() => { nums.textContent = `${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`; nameEl.textContent = ROOMS[i][L][0]; lineEl.textContent = ROOMS[i][L][1]; cap.classList.remove("is-swap"); }, 260);
  }
  setRoom(0);

  const hook = () => {
    const ST = window.ScrollTrigger;
    if (!ST || window.__DN?.reduced) { sec.classList.add("no-gl"); fallback(); return; }
    const head = sec.querySelector(".rooms__head");
    ST.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * N * 0.55, pin: pin, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 6,
      snap: { snapTo: 1 / (N - 1), duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut", delay: 0.05 },
      onUpdate: s => { prog = s.progress; head.style.opacity = Math.max(0, 1 - s.progress * 6); } });
    ST.sort(); ST.refresh();
  };
  window.__DN ? hook() : addEventListener("dn:ready", hook, { once: true });

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    const t = clock.getElapsedTime();
    smooth += (prog - smooth) * 0.08;
    const z = zStart + (zEnd - zStart) * smooth;
    cam.position.set(Math.sin(smooth * Math.PI * 3) * 0.6 + mx * 0.9, 3.4 + Math.sin(t * .6) * 0.08 - my * 0.5, z);
    cam.lookAt(mx * 1.5 * (RTL ? -1 : 1), 3.6 - my * 0.6, z - 12);
    key.position.set(0, 5, z - 6);
    pm.uniforms.t.value = t;
    let near = 0;
    portals.forEach((p, i) => {
      const d = p.g.position.z - z; // négatif = devant la caméra
      const dist = -d;
      if (Math.abs(dist - OFF) < GAP / 2) near = i;
      // l'écran s'efface quand on le traverse
      p.screen.material.opacity = THREE.MathUtils.clamp((dist - 3.5) / 4, 0, 1);
      p.halo.material.opacity = 0.45 * THREE.MathUtils.smoothstep(dist, 3, 10);
      
      if (p.video) {
        const want = dist > -2 && dist < GAP * 2.6;
        if (want) { if (!p.video.src) p.video.src = p.video.dataset.src; if (p.video.paused) p.video.play().catch(() => {}); }
        else if (!p.video.paused) p.video.pause();
      }
    });
    setRoom(near);
    composer.render();
  })();
  window.__DNROOMS = true;
}

function glowTex() {
  if (glowTex.t) return glowTex.t;
  const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d");
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, "rgba(255,210,120,.55)"); g.addColorStop(.4, "rgba(212,175,55,.18)"); g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g; x.fillRect(0, 0, 256, 256); return glowTex.t = new THREE.CanvasTexture(c);
}
