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
       "html[lang=he] .mc-page .off__d{display:none}html[lang=he] .mc-page .off__t{unicode-bidi:plaintext}"
       ".mc-page .faq{max-width:1100px}.mc-page .faq summary{font-size:clamp(18px,1.6vw,22px)}.mc-page .build-steps p{font-size:16px}"
       ".mc-page .faq{max-width:none}.mc-page .faq summary{min-height:44px}"
       ".mc-page .build-steps{grid-template-columns:repeat(6,1fr)}.mc-page .build-steps li{grid-column:span 2}.mc-page .build-steps li:nth-child(n+4){grid-column:span 3}"
       ".mc-page .build-steps__n{-webkit-text-stroke:1px rgba(240,217,140,.85)}"
       ".mc-page .spec b{font-size:clamp(19px,1.9vw,26px);font-weight:500;max-width:46ch}.mc-page .spec span{color:var(--gold)}"
       ".mc-know{margin-bottom:56px;align-self:start;padding:28px 30px;border-radius:22px;background:rgba(255,255,255,.03);box-shadow:inset 0 0 0 1px var(--line)}.mc-know .build-deliver li:last-child{border-bottom:0}"
       ".mc-proof__g{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:44px}"
       ".mc-fig{display:flex;flex-direction:column;border-radius:24px;overflow:hidden;background:linear-gradient(180deg,rgba(212,175,55,.06),rgba(255,255,255,.01));box-shadow:inset 0 0 0 1px var(--line);transition:transform .6s var(--ease),box-shadow .6s var(--ease)}"
       ".mc-fig:hover{transform:translateY(-4px);box-shadow:inset 0 0 0 1px rgba(240,217,140,.4),0 30px 60px -30px rgba(0,0,0,.9)}"
       ".mc-fig__i{display:block;aspect-ratio:16/10;overflow:hidden;background:#0b0907}.mc-fig__i img{width:100%;height:100%;object-fit:cover;object-position:top;transition:transform 1.2s var(--ease)}.mc-fig:hover .mc-fig__i img{transform:scale(1.04)}"
       ".mc-fig__b{position:relative;display:block;flex:1;padding:22px 72px 24px 24px}html[lang=he] .mc-fig__b{padding:22px 24px 24px 72px}.mc-fig__b b{display:block;font:600 20px/1.2 var(--f-display);margin-bottom:6px}.mc-fig__b>span:not(.mc-fig__c){display:block;color:#cfc6b6;font-size:15px;line-height:1.5}"
       ".mc-fig__c{position:absolute;inset-inline-end:20px;top:22px;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);color:var(--gold-lt)}"
       ".mc-end__g{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(32px,5vw,80px);align-items:center}.mc-end__r{padding:30px 32px;border-radius:24px;background:rgba(255,255,255,.03);box-shadow:inset 0 0 0 1px var(--line)}.mc-end__r .build-deliver li:last-child{border-bottom:0}"
       ".foot__row{align-items:baseline}"
       "@media (max-width:1100px){.mc-page .build-steps{grid-template-columns:1fr 1fr}.mc-page .build-steps li,.mc-page .build-steps li:nth-child(n+4){grid-column:auto}.mc-page .build-steps li:last-child{grid-column:1 / -1}}"
       "@media (min-width:721px){html[lang=he] .mc-page .off{grid-template-columns:70px 1fr auto auto;grid-template-areas:none}}""@media (max-width:900px){.mc-end__g{grid-template-columns:1fr}.mc-proof__g{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:84%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;margin-inline:calc(var(--pad) * -1);padding:4px var(--pad) 14px}.mc-proof__g::-webkit-scrollbar{display:none}.mc-fig{scroll-snap-align:start}}"
       "@media (max-width:720px){.mc-page .off{grid-template-columns:1fr auto;grid-template-areas:\"n n\" \"t c\" \"d d\" \"p p\";gap:6px 16px}.mc-page .off__p{text-align:start}.mc-page .build-steps{grid-template-columns:1fr}.mc-page .build-steps li:last-child{grid-column:auto}}"
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
