#!/usr/bin/env python3
# Page partenaire de Leeya (hébreu + anglais) : rôle, partage 50/50, liens, offres, cours, puis le portfolio en annexe
# (rendu en direct par portfolio.js dans #app). Pages privées (noindex). Prix du site : HE en ₪, EN en $ ; cours HE 990 ₪, EN 209 $.
import json
from pathlib import Path

R = Path(__file__).parent
HE = dict(dir="rtl", font="Rubik", title="ליאה · שותפה של DreamNova",
  eye="שותפות · DreamNova ישראל", h1="ליאה, ברוכה הבאה <em>לשותפות.</em>",
  lead="את השותפה הישראלית של DreamNova. את פותחת דלתות, דוד בונה ומוסר, ומתחלקים חצי־חצי.",
  role_eye="התפקיד שלך", role_h="שלושה דברים, בקצב שלך.",
  roles=[["פותחת שיחות", "עסקים מהרשת שלך: קליניקות, משרדים, חנויות, מסעדות, נדל״ן. שאלה אחת, שיחה אחת."],
         ["מראה את הדוגמאות", "את העבודות האמיתיות שלנו, ואת אווה, המזכירה הקולית שעונה בטלפון. רואים, שומעים, משתכנעים."],
         ["מביאה תלמידות לקורס", "לבעלות עסק שרוצות ללמוד לעבוד עם AI בעצמן: הקורס בעברית, 26 פרקים."]],
  split_eye="החלוקה", split_h="50/50. <em>פשוט.</em>",
  split=[["לקוח לשירותים של DreamNova", "50% מהרווח", "אחרי שהלקוח משלם"],
         ["תלמידה בקורס (990 ₪)", "50%, כלומר 495 ₪", "בכל הרשמה"]],
  links_eye="הקישורים שלך", links_h="כל פנייה מגיעה <em>עם השם שלך.</em>",
  links=[["לעסקים: שיחת ייעוץ של 15 דקות", "https://dreamnova-next.vercel.app/he/?ref=leeya#conseil"],
         ["לקורס ה־AI", "https://cours-ai-dreamnova.vercel.app/he/?ref=leeya"],
         ["כל העבודות שלנו", "https://dreamnova-next.vercel.app/he/portfolio/"],
         ["אווה, המזכירה הקולית", "https://dreamnova-voice-demo.vercel.app/"]],
  links_note="מי שפונה דרך הקישורים שלך מגיע לדוד בוואטסאפ עם הכיתוב ״בהמלצת ליאה״.",
  offers_eye="מה מציעים", offers_h="המחירים באתר, <em>מחירי פתיחה.</em>",
  offers=[["אבחון AI מלא", "7,500 ₪", "מזוכה במלואו בפרויקט"], ["אתר ספרינט 48 שעות", "4,900 ₪", ""], ["סוכן קולי AI 24/7", "9,900 ₪", ""],
          ["סרט תדמית AI", "11,500 ₪", ""], ["אתר פרימיום בהתאמה אישית", "19,500 ₪", ""], ["עוזר AI / RAG פרטי", "23,000 ₪", ""]],
  offers_note="המחיר הסופי תמיד נקבע בהצעה כתובה של דוד.",
  course_eye="הקורס", course_h="קורס AI בעברית, <em>990 ₪.</em>",
  course_p="26 פרקים קצרים, בהקלטות מסך אמיתיות: תמונות מוצר, רילס, אתר באוויר, רשימת לקוחות ראשונה. החזר כספי מלא תוך 14 יום, גישה לכל החיים.",
  course_cta="לעמוד הקורס", how_eye="איך זה עובד", how_h="ארבעה צעדים.",
  how=["את שולחת את הקישור שלך לעסק או לחברים.", "הפנייה מגיעה לדוד בוואטסאפ, עם השם שלך.", "דוד מדבר, מגיש הצעה, בונה ומוסר.", "הלקוח משלם, ואת מקבלת את החלק שלך."],
  annex="נספח · כל העבודות", annex_p="כל הדוגמאות האמיתיות, במקום אחד: דמואים חיים, פרויקטים של לקוחות (בלי שמות) ורילס.",
  foot="DreamNova · ירושלים · עמוד פרטי לליאה")
T = {"he": HE, "en": json.load(open(R / "tools_leeya_en.json"))}

CSS = open(R / "tools_leeya.css").read()

def page(L, t):
    roles = "".join(f'<div class="lp-card"><b>{a}</b><p>{b}</p></div>' for a, b in t["roles"])
    split = "".join(f'<div class="lp-row"><span>{a}</span><strong>{b}</strong><span>{c}</span></div>' for a, b, c in t["split"])
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
 <section class="lp-sec"><p class="k">{t['split_eye']}</p><h2>{t['split_h']}</h2><div class="lp-split">{split}</div></section>
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
    d = R / L / "leeya"; d.mkdir(parents=True, exist_ok=True)
    (d / "index.html").write_text(page(L, t)); print("ok", d)
