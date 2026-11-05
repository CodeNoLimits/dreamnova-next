#!/usr/bin/env python3
"""Pages /{he,en,fr}/client-machine/ de l'offre « Machine à clients » (W77). Même squelette que les pages de service."""
import html, pathlib
root = pathlib.Path(__file__).parent
U = "https://dreamnova-next.vercel.app"
FONTS = {"he": "family=Rubik:wght@400..800&family=Open+Sans:wght@400;600;700",
         "en": "family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Instrument+Serif:ital@0;1&family=Manrope:wght@300..700"}
FONTS["fr"] = FONTS["en"]
META = {
  "he": ("מכונת לקוחות — DreamNova", "אתר שמביא פניות, באוויר תוך 48 שעות, פרסום ממומן שמוביל אליו לקוחות, וכל פנייה במעקב. מחיר השקה ₪4,900."),
  "en": ("Client Machine — DreamNova", "Your site live in 48 hours, ads tuned behind it, every enquiry tracked. Launch price $1,490."),
  "fr": ("Machine à clients — DreamNova", "Votre site en ligne en 48 h, les pubs réglées derrière lui, chaque demande suivie. Prix de lancement 1 290 €."),
}
CSS = (".mc-price{display:flex;align-items:baseline;gap:12px;margin-top:28px}.mc-price small{font:500 12px/1 var(--f-body);letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}"
       ".mc-price b{font:600 clamp(40px,5vw,64px)/1 var(--f-display);letter-spacing:-.03em;color:var(--gold-pale)}"
       ".mc-note{margin-top:10px;max-width:520px;font-size:15px;line-height:1.55;color:#cfc6b6}"
       ".mc-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}"
       ".mc-paid{position:relative;z-index:3;margin:96px var(--pad) 0;padding:18px 22px;border-radius:18px;background:rgba(212,175,55,.12);box-shadow:inset 0 0 0 1px var(--line);color:var(--gold-pale)}"
       ".mc-end{padding-bottom:clamp(80px,10vw,140px)}"
       "html[lang=he] .mc-page .eyebrow,html[lang=he] .mc-price small,html[lang=he] .off__p small{letter-spacing:0;text-transform:none}"
       ".mc-page .svc-hero .eyebrow{white-space:nowrap}"
       ".mc-page .build-deliver{list-style:none;padding-inline-start:0;gap:0}.mc-page .build-deliver li{font-size:17px;line-height:1.5;padding:14px 0 14px 30px;border-bottom:1px solid var(--line2);position:relative}"
       "html[lang=he] .mc-page .build-deliver li{padding:14px 30px 14px 0}.mc-page .build-deliver li::before{content:\"\";position:absolute;inset-inline-start:2px;top:22px;width:12px;height:6px;border-inline-start:2px solid var(--gold);border-bottom:2px solid var(--gold);transform:rotate(-45deg)}"
       "html[lang=he] .mc-page .build-deliver li::before{transform:rotate(-45deg) scaleX(-1)}"
       ".mc-page .faq{max-width:1100px}.mc-page .faq summary{font-size:clamp(18px,1.6vw,22px)}.mc-page .build-steps p{font-size:16px}"
       "@media (max-width:767px){.mc-ctas .btn{flex:1 1 100%;justify-content:space-between}}")
for l, (title, desc) in META.items():
    alt = "".join(f'<link rel="alternate" hreflang="{x}" href="{U}/{x}/client-machine/">' for x in ("he", "en", "fr")) + f'<link rel="alternate" hreflang="x-default" href="{U}/en/client-machine/">'
    page = f'''<!doctype html>
<html lang="{l}" dir="{"rtl" if l == "he" else "ltr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)}</title><meta name="description" content="{html.escape(desc)}"><meta name="theme-color" content="#050403">
<link rel="canonical" href="{U}/{l}/client-machine/">{alt}
<meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:url" content="{U}/{l}/client-machine/"><meta property="og:image" content="{U}/assets/og.jpg"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../assets/brand/crest.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?{FONTS[l]}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../style.css"><style>{CSS}</style></head>
<body class="svc-page mc-page"><div class="grain" aria-hidden="true"></div><div id="app"><h1 class="sr-only">{html.escape(title)}</h1><p class="sr-only">{html.escape(desc)}</p></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="../../content.js"></script><script src="../../machine.js"></script></body></html>
'''
    p = root / l / "client-machine"; p.mkdir(parents=True, exist_ok=True); (p / "index.html").write_text(page); print(l, "ok")
