#!/usr/bin/env python3
"""Génère he/en/fr/index.html depuis index.html : texte pré-rendu, polices par langue, méta par langue."""
import json, re, subprocess, html, pathlib
root = pathlib.Path(__file__).parent
I = json.loads(subprocess.check_output(["node", "-e", "global.window={};require('./content.js');process.stdout.write(JSON.stringify(window.DN.I))"], cwd=root))
src = (root / "index.html").read_text()
FONTS = {
  "he": "family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Rubik:wght@400..800&family=Open+Sans:wght@400;600;700",
  "en": "family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Instrument+Serif:ital@0;1&family=Manrope:wght@300..700",
}
FONTS["fr"] = FONTS["en"]
TITLE = {"he": "DreamNova — אנחנו בונים את הבלתי אפשרי", "en": "DreamNova — We build the impossible", "fr": "DreamNova — Nous construisons l'impossible"}
for l in ("he", "en", "fr"):
    T = I[l]; h = src
    h = h.replace('<html lang="he" dir="rtl">', f'<html lang="{l}" dir="{"rtl" if l == "he" else "ltr"}">')
    h = re.sub(r'family=Bricolage[^"]*&display=swap', FONTS[l] + "&display=swap", h)
    h = re.sub(r"<title>.*?</title>", f"<title>{html.escape(TITLE[l])}</title>", h)
    h = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{html.escape(TITLE[l])}">', h)
    h = h.replace('<meta property="og:image"', f'<link rel="canonical" href="https://dreamnova-next.vercel.app/{l}/">\n<meta property="og:url" content="https://dreamnova-next.vercel.app/{l}/">\n<meta property="og:image"', 1)
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(T["hero.sub"])}">', h)
    h = h.replace('<link rel="alternate" hreflang="fr" href="https://dreamnova-next.vercel.app/fr/">', '<link rel="alternate" hreflang="fr" href="https://dreamnova-next.vercel.app/fr/">\n<link rel="alternate" hreflang="x-default" href="https://dreamnova-next.vercel.app/en/">') if "x-default" not in h else h
    # texte pré-rendu dans chaque élément data-i vide
    h = re.sub(r'(<([a-z0-9]+)[^>]*\bdata-i="([^"]+)"[^>]*>)(</\2>)', lambda m: m.group(1) + html.escape(T.get(m.group(3), "")) + m.group(4), h)
    for a, b in (('href="style.css"', 'href="../style.css"'), ('src="content.js"', 'src="../content.js"'), ('src="app.js"', 'src="../app.js"'),
                 ('src="rooms.js"', 'src="../rooms.js"'), ('src="drive.js"', 'src="../drive.js"'), ('src="quote.js"', 'src="../quote.js"'), ('src="audit.js"', 'src="../audit.js"'), ('src="chapters.js"', 'src="../chapters.js"'), ('src="audio.js"', 'src="../audio.js"'), ('src="gear.js"', 'src="../gear.js"'),
                 ('src="assets/', 'src="../assets/')):
        h = h.replace(a, b)
    (root / l / "index.html").write_text(h)
    print(l, "ok", len(re.findall(r'data-i="', h)), "textes")

# --- 24 pages de service : méta statiques (titre, description, og, hreflang, canonical)
D = json.loads(subprocess.check_output(["node", "-e", "global.window={};require('./content.js');process.stdout.write(JSON.stringify({S:window.DN.SERVICES,V:window.DN.SVC}))"], cwd=root))
U = "https://dreamnova-next.vercel.app"
for l in ("he", "en", "fr"):
    for i, s in enumerate(D["V"]):
        sid, (name, desc, _) = s["id"], D["S"][i][l]
        alt = "".join(f'<link rel="alternate" hreflang="{x}" href="{U}/{x}/s/{sid}/">' for x in ("he", "en", "fr")) + f'<link rel="alternate" hreflang="x-default" href="{U}/en/s/{sid}/">'
        page = f'''<!doctype html>
<html lang="{l}" dir="{"rtl" if l == "he" else "ltr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(name)} — DreamNova</title><meta name="description" content="{html.escape(desc)}"><meta name="theme-color" content="#050403">
<link rel="canonical" href="{U}/{l}/s/{sid}/">{alt}
<meta property="og:title" content="{html.escape(name)} — DreamNova"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:url" content="{U}/{l}/s/{sid}/"><meta property="og:image" content="{U}/assets/og.jpg"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../../assets/brand/crest.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?{FONTS[l]}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../../style.css"></head>
<body class="svc-page" data-svc="{sid}"><div class="grain" aria-hidden="true"></div><div id="app"><h1 class="sr-only">{html.escape(name)}</h1></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="../../../content.js"></script><script src="../../../build.js"></script><script src="../../../svc.js"></script><script src="../../../audio.js"></script></body></html>
'''
        p = root / l / "s" / sid; p.mkdir(parents=True, exist_ok=True); (p / "index.html").write_text(page)
print("pages service ok", 24)

# --- grille de prix servie aux fonctions /api (devis, audit) : toujours dérivée de content.js
import subprocess as _sp
_js = r'''const fs=require("fs"); global.window={}; eval(fs.readFileSync("content.js","utf8")); const D=window.DN; const out={};
for (const L of ["he","en","fr"]) out[L]={services:D.SERVICES.map(s=>s[L][0]), offers:D.OFFERS[L].map(([t,d,[lab,p]])=>({t,d,price:(lab?lab+" ":"")+p}))};
fs.writeFileSync("api/grid.mjs","// généré depuis content.js — grille publique, ne pas éditer à la main\nexport default "+JSON.stringify(out)+";\n");
console.log("grille ok", out.he.offers.length, "offres ·", out.he.services.length, "services");'''
print(_sp.run(["node", "-e", _js], capture_output=True, text=True).stdout.strip() or "grille KO")
