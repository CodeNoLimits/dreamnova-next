// Audit IA d'un site : on lit la page du visiteur (faits mesurés côté serveur), puis Gemini 3.8 avec recherche Google rédige
// des conseils concrets dans la langue de la page + les offres DreamNova qui répondent (prix de la grille publique seulement).
import GRID from "./grid.mjs";

const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"];
const hits = new Map(); // ponytail: limite par IP en mémoire d'instance
const LANG_NAME = { he: "Hebrew", en: "English", fr: "French" };
const BAD = /[؀-ۿऀ-ॿЀ-ӿ぀-ヿ一-鿿]/;
const limited = ip => { const now = Date.now(), arr = (hits.get(ip) || []).filter(t => now - t < 3600e3); arr.push(now); hits.set(ip, arr); return arr.length > 5; };
const strip = h => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const pick = (h, re) => { const m = h.match(re); return m ? m[1].trim() : ""; };

async function readSite(url) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 9000);
  try {
    const r = await fetch(url, { redirect: "follow", signal: ctl.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; DreamNovaAudit/1.0; +https://dreamnova-next.vercel.app)", "Accept-Language": "he,en,fr" } });
    const html = (await r.text()).slice(0, 400000);
    const low = html.toLowerCase();
    const title = pick(html, /<title[^>]*>([^<]*)<\/title>/i), desc = pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || pick(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
    const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => strip(m[1])).filter(Boolean).slice(0, 3);
    const h2 = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => strip(m[1])).filter(Boolean).slice(0, 10);
    const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
    const facts = {
      finalUrl: r.url, status: r.status, https: r.url.startsWith("https://"), title, titleLen: title.length, description: desc, descLen: desc.length,
      lang: pick(html, /<html[^>]+lang=["']([^"']+)["']/i), viewport: /name=["']viewport["']/i.test(html), ogImage: /property=["']og:image["']/i.test(html),
      hreflang: (html.match(/hreflang=/gi) || []).length, h1Count: h1.length, h1, h2, words: strip(html).split(" ").length,
      images: imgs.length, imagesWithoutAlt: imgs.filter(i => !/\balt=["'][^"']+["']/i.test(i)).length,
      whatsapp: /wa\.me|api\.whatsapp\.com|whatsapp:/i.test(low), tel: /href=["']tel:/i.test(low), mailto: /href=["']mailto:/i.test(low), forms: (html.match(/<form\b/gi) || []).length,
      scripts: (html.match(/<script\b/gi) || []).length, jsonLd: /application\/ld\+json/i.test(html), analytics: /gtag\(|googletagmanager|fbq\(|clarity\(/i.test(html),
      shopify: /cdn\.shopify|myshopify/i.test(low), wix: /wix\.com|wixstatic/i.test(low), wordpress: /wp-content|wp-includes/i.test(low), accessibilityWidget: /accessib|נגישות|accessibe|userway|enable\.co\.il/i.test(low),
      text: strip(html).slice(0, 7000)
    };
    return facts;
  } finally { clearTimeout(t); }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || "x";
  if (limited(ip)) return res.status(429).json({ error: "limit" });
  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (b.website) return res.status(200).json({ ok: true });
  const lang = ["he", "en", "fr"].includes(b.lang) ? b.lang : "en";
  let url = String(b.url || "").trim().replace(/[<>"']/g, "").slice(0, 300); if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;
  let host; try { host = new URL(url).hostname; } catch (_) { return res.status(400).json({ error: "url" }); }
  if (/^(localhost|127\.|10\.|192\.168\.|0\.)/.test(host) || !host.includes(".")) return res.status(400).json({ error: "url" });
  const key = process.env.GEMINI_API_KEY; if (!key) return res.status(500).json({ error: "config" });
  let facts; try { facts = await readSite(url); } catch (e) { return res.status(422).json({ error: "unreachable" }); }
  const g = GRID[lang];
  const { text, ...meta } = facts;
  const prompt = `You are the senior consultant of DreamNova (AI design & engineering studio, Jerusalem, founder David Amor). A business owner pasted their website for a free AI audit.
Write in ${LANG_NAME[lang]} only${lang === "he" ? " (simple, natural modern Hebrew, plural 'אתם', short sentences)" : ""}. Be concrete, specific to THIS business, never generic. No flattery. Use Google Search to understand the business, its market and competitors when useful.
Measured facts about the page (trust them): ${JSON.stringify(meta)}
Visible text of the page (truncated): """${text}"""
DreamNova services: ${g.services.join(" | ")}
Official public price grid (the ONLY prices you may quote, copy them exactly, starting prices): ${g.offers.map(o => `${o.t}: ${o.price}`).join(" · ")}
Return ONLY a JSON object (no markdown) with exactly this shape:
{"company":"name of the business","sector":"short sector","one_liner":"one sentence: what this business sells and to whom, as you understood it",
 "summary":"3–4 sentences: the honest verdict on this website today (clarity, trust, conversion, mobile, languages, AI readiness)",
 "scores":{"clarity":0-10,"trust":0-10,"conversion":0-10,"seo":0-10,"mobile":0-10,"multilingual":0-10,"ai_readiness":0-10},
 "quick_wins":[{"title":"short","why":"one sentence grounded in a measured fact or visible text","how":"one concrete action doable this week"}] (exactly 5),
 "plan_30d":[{"week":"Week 1","action":"..."},{"week":"Week 2","action":"..."},{"week":"Weeks 3–4","action":"..."}],
 "offers":[{"name":"exact offer name from the grid","price":"exact price from the grid","why":"one sentence why it fits this business"}] (2 or 3, most relevant first),
 "next_step":"one sentence inviting to talk on WhatsApp with David"}
Scores must reflect the measured facts (no viewport = low mobile; no WhatsApp/tel/form = low conversion; no hreflang/one lang = low multilingual; no AI assistant/chat/voice = low ai_readiness). Never invent features the site does not have.`;
  let out = null, used = "";
  for (const m of MODELS) {
    for (let t = 0; t < 2 && !out; t++) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], tools: m.startsWith("gemini-3.8") || m === "gemini-3.5-flash" ? [{ google_search: {} }] : [], generationConfig: { temperature: 0.5, maxOutputTokens: 3000 } }) });
        const d = await r.json(); const txt = (d.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim();
        if (!txt) continue;
        const j = JSON.parse(txt.replace(/^```(?:json)?\s*|\s*```$/g, "").replace(/^[^{]*/, "").replace(/[^}]*$/, ""));
        if (!j.summary || !Array.isArray(j.quick_wins)) continue;
        if (lang === "he" && BAD.test(JSON.stringify(j))) continue;
        out = j; used = m;
      } catch (_) { /* on réessaie, puis modèle suivant */ }
    }
    if (out) break;
  }
  if (!out) return res.status(502).json({ error: "model" });
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ ok: true, audit: out, facts: meta, model: used, url: facts.finalUrl });
}
