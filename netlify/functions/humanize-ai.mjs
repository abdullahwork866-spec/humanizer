// Netlify Function: proxies text to Gemini. API key stays on the server.
// Set GEMINI_API_KEY in Netlify → Site configuration → Environment variables.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MAX_CHARS = 6000;

const SYSTEM_PROMPT = `You are an expert editor who rewrites text so it reads like a real person wrote it.
Rules:
- Keep the exact meaning, facts, names, numbers and any links unchanged.
- Rewrite in your own wording and sentence structure; do not copy phrasing.
- Vary sentence length. Mix short and long sentences.
- Avoid AI-sounding words and phrases (delve, tapestry, landscape, leverage, utilize, moreover, furthermore, in conclusion, it is important to note, game-changer, etc.).
- Use natural contractions and plain everyday words.
- Keep the same language as the input and keep paragraph breaks.
- Do not add headings, notes or explanations. Output only the rewritten text.`;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);

  const key = process.env.GEMINI_API_KEY;
  if (!key) return json({ error: "GEMINI_API_KEY is not set on the server." }, 500);

  let text = "";
  try {
    ({ text } = await req.json());
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  text = (text || "").toString().trim();
  if (!text) return json({ error: "No text provided." }, 400);
  if (text.length > MAX_CHARS) return json({ error: `Text too long (max ${MAX_CHARS} chars per request).` }, 413);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text }] }],
          generationConfig: { temperature: 0.9, topP: 0.95 },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      return json({ error: data?.error?.message || "Gemini request failed." }, res.status);
    }

    const out = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    if (!out) return json({ error: "Gemini returned an empty response." }, 502);
    return json({ text: out.trim() });
  } catch (e) {
    return json({ error: "Server error: " + e.message }, 500);
  }
};

