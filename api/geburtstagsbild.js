const MAX_TEXT = 500;

function clean(value, max = MAX_TEXT) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max);
}

function cleanEnergy(value) {
  const energy = value && typeof value === 'object' ? value : {};
  const kin = Number(energy.kin);
  const tone = Number(energy.tone);
  if (!Number.isInteger(kin) || kin < 1 || kin > 273 || !Number.isInteger(tone) || tone < 1 || tone > 13) return null;
  return {
    kin,
    tone,
    figure: clean(energy.figure, 100),
    keyword: clean(energy.keyword, 100),
    dimension: clean(energy.dimension, 100),
    wave: clean(energy.wave, 100),
    system: clean(energy.system, 100)
  };
}

function describe(label, energy) {
  return `${label}: KIN ${energy.kin}; ${energy.figure}; Ton ${energy.tone} · ${energy.keyword}; Ebene: ${energy.dimension}; Welle: ${energy.wave}; System: ${energy.system}.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Nur POST ist erlaubt.' });
  }
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'Der Bildmotor ist noch nicht freigeschaltet.' });

  const body = req.body || {};
  const name = clean(body.name, 120);
  const year = Number(body.year);
  const birthdayDate = clean(body.birthdayDate, 10);
  const perception = clean(body.perception);
  const cycle = cleanEnergy(body.cycleEnergy);
  const annual = cleanEnergy(body.annualEnergy);
  if (!name || !Number.isInteger(year) || year < 1900 || year > 2200 || !/^\d{4}-\d{2}-\d{2}$/.test(birthdayDate) || !cycle || !annual || !cycle.figure || !annual.figure) {
    return res.status(400).json({ error: 'Der Geburtstagsraum ist unvollständig.' });
  }

  const prompt = [
    'Create one evocative, natural, contemplative square artwork for a personal Itschana birthday space.',
    'The following Itschana facts are authoritative context. Keep the 52-year foundational companion distinct from the annual birthday energy. Do not recalculate, correct, replace, or invent calendar facts:',
    `Person: ${name}. Birthday year: ${year}. Birthday date: ${birthdayDate}.`,
    describe('52-year foundational companion', cycle),
    describe(`Annual birthday energy ${year}`, annual),
    perception ? `Personal perception for the new year: ${perception}.` : 'Personal perception for the new year: openness, quiet observation, and room for what wants to emerge.',
    'Let both energies meet through atmosphere, natural light, movement, landscape, spatial depth, texture, and open symbolic forms. The foundational companion may feel like a steady ground or horizon; the annual energy may arrive as a fresh movement, weather, light, or living presence.',
    'Do not portray a person or face unless the personal perception explicitly requests it.',
    'Do not add text, letters, numbers, captions, logos, calendars, glyphs, Maya symbols, or written labels inside the image.',
    'Do not assert a prophecy, diagnosis, doctrine, or fixed meaning. Leave generous visual openness for the viewer’s own perception.',
    'Calm visual center, rich natural light, tactile realism blended with gentle poetic abstraction, refined and emotionally warm.'
  ].join('\n');

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-image-2.5-flare', prompt, size: '1024x1024', quality: 'low', n: 1 })
    });
    const result = await response.json();
    if (!response.ok) {
      const status = response.status === 429 ? 429 : 502;
      return res.status(status).json({ error: 'Der Bildraum kann gerade noch kein Bild erzeugen.' });
    }
    const image = result?.data?.[0]?.b64_json;
    if (!image) return res.status(502).json({ error: 'Der Bildmotor hat kein Bild zurückgegeben.' });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ image: `data:image/png;base64,${image}` });
  } catch (error) {
    return res.status(500).json({ error: 'Der Bildraum konnte nicht geöffnet werden.' });
  }
}
