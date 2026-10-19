// Devis intelligent : Gemini rédige une proposition à partir de la grille publique (aucun prix inventé).
import GRID from "./grid.mjs";

const MODELS = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-lite-latest"];
const hits = new Map(); // ponytail: limite par IP en mémoire d'instance ; passer à un KV si le trafic grandit
const LANG_NAME = { he: "Hebrew", en: "English", fr: "French" };

function limited(ip) {
  const now = Date.now(), win = 3600e3, arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr); return arr.length > 6;
}
// écritures étrangères (arabe, devanagari, cyrillique, CJK) = sortie corrompue → on régénère
const BAD = /[\u0600-\u06FF\u0900-\u097F\u0400-\u04FF\u3040-\u30FF\u4E00-\u9FFF]/;
const clip = (v, n) => String(v || "").replace(/[<>]/g, "").slice(0, n).trim();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || "x";
  if (limited(ip)) return res.status(429).json({ error: "limit" });
  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (b.website) return res.status(200).json({ ok: true }); // pot de miel anti-robots
  const lang = ["he", "en", "fr"].includes(b.lang) ? b.lang : "en";
  const f = { name: clip(b.name, 80), company: clip(b.company, 120), sector: clip(b.sector, 120), service: clip(b.service, 120), need: clip(b.need, 1500), timing: clip(b.timing, 80) };
  if (f.need.length < 10) return res.status(400).json({ error: "need" });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "config" });
  const g = GRID[lang];
  const prompt = `You are the proposal writer of DreamNova, an AI design & engineering studio in Jerusalem founded by David Amor.
Write in ${LANG_NAME[lang]} only${lang === "he" ? " (natural, correct modern Hebrew, plural 'אתם')" : ""}.
Client request:
- Name: ${f.name || "-"}
- Company: ${f.company || "-"}
- Sector: ${f.sector || "-"}
- Service of interest: ${f.service || "-"}
- Need: ${f.need}
- Desired timing: ${f.timing || "-"}

Studio services: ${g.services.join(" | ")}
Official public price grid (the ONLY prices you may quote, copy them exactly, they are starting prices):
${g.offers.map(o => `- ${o.t}: ${o.price} — ${o.d}`).join("\n")}
- ${g.audit.t}: ${g.audit.price}

Rules: never invent a price, a discount, a client, a guarantee or a fixed deadline; if nothing in the grid fits, say "on quote" in the client's language; timeline only as an indicative range in weeks; be concrete, premium, warm; no markdown.
Return JSON with exactly these keys:
{"title": short proposal title, "summary": 2-3 sentences restating the need, "approach": [4-6 short steps], "deliverables": [3-6 items], "options": [1-3 objects {"name": offer name from the grid, "why": one sentence, "price": exact grid price or on-quote}], "timeline": indicative range, "next_step": one sentence inviting to a call with David}`;
  for (const m of MODELS.flatMap(x => [x, x])) { // 2 essais par modèle
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", maxOutputTokens: 1800, temperature: 0.6 } })
      });
      if (r.status === 503 || r.status === 429 || r.status === 404) continue;
      const d = await r.json();
      const txt = d?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
      if (BAD.test(txt)) continue;
      const out = JSON.parse(txt);
      return res.status(200).json({ ok: true, model: m, proposal: out, client: f });
    } catch (e) { /* modèle suivant */ }
  }
  return res.status(503).json({ error: "busy" });
}
