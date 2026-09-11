const MAX_TEXT = 500;

function clean(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, MAX_TEXT);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Nur POST ist erlaubt." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: "Der Bildmotor ist noch nicht freigeschaltet." });
  }

  const body = req.body || {};
  const kin = Number(body.kin);
  const tone = Number(body.tone);
  const displayName = clean(body.displayName);
  const toneKeyword = clean(body.toneKeyword);
  const waveName = clean(body.waveName);
  const toneText = clean(body.toneText);
  const figureText = clean(body.figureText);
  const resonance = Array.isArray(body.resonance) ? body.resonance.map(clean).filter(Boolean).slice(0, 3) : [];

  if (!Number.isInteger(kin) || kin < 1 || kin > 273 || !Number.isInteger(tone) || tone < 1 || tone > 13 || !displayName || !waveName) {
    return res.status(400).json({ error: "Der Itschana-Tagesraum ist unvollständig." });
  }

  const prompt = [
    "Create one evocative, natural, contemplative visual artwork for an Itschana day space.",
    "The following Itschana facts are authoritative context. Do not reinterpret, replace, correct, calculate, or invent calendar facts:",
    `KIN ${kin}; ${displayName}; Ton ${tone} · ${toneKeyword}; Welle: ${waveName}.`,
    toneText ? `Tone atmosphere: ${toneText}.` : "",
    figureText ? `Figure atmosphere: ${figureText}.` : "",
    resonance.length ? `Personal perception today: ${resonance.join(" · ")}.` : "Personal perception today: openness and quiet observation.",
    "Translate this context only into atmosphere, light, movement, nature, spatial depth, texture, and symbolic but non-dogmatic forms.",
    "Do not add text, letters, numbers, captions, logos, calendars, glyphs, Maya symbols, or written labels inside the image.",
    "Do not depict a fixed spiritual doctrine or claim a meaning. Leave visual openness for the viewer's own perception.",
    "Landscape-oriented feeling within a square composition, calm visual center, rich natural light, tactile realism blended with gentle poetic abstraction."
  ].filter(Boolean).join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-2.5-flare",
        prompt,
        size: "1024x1024",
        quality: "low",
        n: 1
      })
    });

    const result = await response.json();
    if (!response.ok) {
      const status = response.status === 429 ? 429 : 502;
      return res.status(status).json({ error: "Der Bildraum kann gerade noch kein Bild erzeugen.", detail: result?.error?.message || "OpenAI API error" });
    }

    const image = result?.data?.[0]?.b64_json;
    if (!image) return res.status(502).json({ error: "Der Bildmotor hat kein Bild zurückgegeben." });

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ image: `data:image/png;base64,${image}` });
  } catch (error) {
    return res.status(500).json({ error: "Der Bildraum konnte nicht geöffnet werden." });
  }
}
