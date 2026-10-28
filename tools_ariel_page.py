#!/usr/bin/env python3
# Page partenaire d'Ariel (français + hébreu) : rôle, liens ?ref=ariel, offres, cours, portfolio en annexe. noindex.
# Copie du gabarit de tools_leeya_page.py SANS la section « partage » (consigne David : aucune mention d'argent entre David et Ariel).
# FR en €, HE en ₪ (une seule devise par page).
import json
from pathlib import Path

R = Path(__file__).parent
T = json.load(open(R / "tools_ariel.json"))
CSS = open(R / "tools_leeya.css").read()

def page(L, t):
    roles = "".join(f'<div class="lp-card"><b>{a}</b><p>{b}</p></div>' for a, b in t["roles"])
    arrow = "↖" if L == "he" else "↗"
    links = "".join(f'<a class="lp-link" href="{u}" target="_blank" rel="noopener"><div>{a}<small>{u.replace("https://", "")}</small></div><i>{arrow}</i></a>' for a, u in t["links"])
    offers = "".join(f'<div><b>{a}</b><strong>{p}</strong>{f"<span>{n}</span>" if n else ""}</div>' for a, p, n in t["offers"])
    how = "".join(f"<li>{x}</li>" for x in t["how"])
    fonts = ("family=Rubik:wght@400..800" if L == "he" else "family=Bricolage+Grotesque:opsz,wght@12..96,400..800") + "&family=Open+Sans:wght@400;600;700&display=swap"
    return f"""<!doctype html>
<html lang="{L}" dir="{t['dir']}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{t['title']}</title><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#050403">
<link rel="icon" href="../../assets/brand/crest.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?{fonts}" rel="stylesheet">
<link rel="stylesheet" href="../../style.css"><style>.lp{{--lpf:"{t['font']}",system-ui,sans-serif}}{CSS}</style></head>
<body class="svc-page pf-page"><div class="grain" aria-hidden="true"></div>
<main class="lp">
 <div class="lp-top"><img src="../../assets/brand/crest.svg" alt=""> DreamNova</div>
 <p class="lp-eye">{t['eye']}</p>
 <h1>{t['h1']}</h1>
 <p class="lp-lead">{t['lead']}</p>
 <section class="lp-sec"><p class="k">{t['role_eye']}</p><h2>{t['role_h']}</h2><div class="lp-g3">{roles}</div></section>
 <section class="lp-sec"><p class="k">{t['links_eye']}</p><h2>{t['links_h']}</h2><div class="lp-links">{links}</div><p class="lp-note">{t['links_note']}</p></section>
 <section class="lp-sec"><p class="k">{t['offers_eye']}</p><h2>{t['offers_h']}</h2><div class="lp-off">{offers}</div><p class="lp-note">{t['offers_note']}</p></section>
 <section class="lp-sec"><p class="k">{t['course_eye']}</p><div class="lp-course"><div><h2 style="margin-top:0">{t['course_h']}</h2><p>{t['course_p']}</p></div><div><a class="lp-btn" href="{t['links'][1][1]}" target="_blank" rel="noopener">{t['course_cta']} {arrow}</a></div></div></section>
 <section class="lp-sec"><p class="k">{t['how_eye']}</p><h2>{t['how_h']}</h2><ol class="lp-how">{how}</ol></section>
 <section class="lp-annex"><p class="k">{t['annex']}</p><p>{t['annex_p']}</p></section>
</main>
<div id="app"></div>
<p class="lp-foot">{t['foot']}</p>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="../../content.js"></script><script src="../../portfolio.js"></script></body></html>
"""

for L, t in T.items():
    d = R / L / "ariel"; d.mkdir(parents=True, exist_ok=True)
    (d / "index.html").write_text(page(L, t)); print("ok", d)
