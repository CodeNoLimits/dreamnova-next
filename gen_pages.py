#!/usr/bin/env python3
"""Génère he/en/fr/index.html depuis index.html : texte pré-rendu, polices par langue, méta par langue."""
import json, re, subprocess, html, pathlib
root = pathlib.Path(__file__).parent
I = json.loads(subprocess.check_output(["node", "-e", "global.window={};require('./content.js');process.stdout.write(JSON.stringify(window.DN.I))"], cwd=root))
src = (root / "index.html").read_text()
FONTS = {
  "he": "family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Rubik:wght@400..800&family=Frank+Ruhl+Libre:wght@400;500&family=Heebo:wght@300..700",
  "en": "family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Instrument+Serif:ital@0;1&family=Manrope:wght@300..700",
}
FONTS["fr"] = FONTS["en"]
TITLE = {"he": "DreamNova — אנחנו בונים את הבלתי אפשרי", "en": "DreamNova — We build the impossible", "fr": "DreamNova — Nous construisons l'impossible"}
for l in ("he", "en", "fr"):
    T = I[l]; h = src
    h = h.replace('<html lang="he" dir="rtl">', f'<html lang="{l}" dir="{"rtl" if l == "he" else "ltr"}">')
    h = re.sub(r'family=Bricolage[^"]*&display=swap', FONTS[l] + "&display=swap", h)
    h = re.sub(r"<title>.*?</title>", f"<title>{html.escape(TITLE[l])}</title>", h)
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(T["hero.sub"])}">', h)
    h = h.replace('<link rel="alternate" hreflang="fr" href="https://dreamnova-next.vercel.app/fr/">', '<link rel="alternate" hreflang="fr" href="https://dreamnova-next.vercel.app/fr/">\n<link rel="alternate" hreflang="x-default" href="https://dreamnova-next.vercel.app/en/">') if "x-default" not in h else h
    # texte pré-rendu dans chaque élément data-i vide
    h = re.sub(r'(<([a-z0-9]+)[^>]*\bdata-i="([^"]+)"[^>]*>)(</\2>)', lambda m: m.group(1) + html.escape(T.get(m.group(3), "")) + m.group(4), h)
    for a, b in (('href="style.css"', 'href="../style.css"'), ('src="content.js"', 'src="../content.js"'), ('src="app.js"', 'src="../app.js"'),
                 ('src="rooms.js"', 'src="../rooms.js"'), ('src="drive.js"', 'src="../drive.js"'), ('src="quote.js"', 'src="../quote.js"'),
                 ('src="assets/', 'src="../assets/')):
        h = h.replace(a, b)
    (root / l / "index.html").write_text(h)
    print(l, "ok", len(re.findall(r'data-i="', h)), "textes")
