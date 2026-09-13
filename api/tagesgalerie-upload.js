module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST ist erlaubt.' });

  try {
    const { put } = await import('@vercel/blob');
    const body = req.body || {};
    const image = String(body.image || '');
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(body.date || '')) ? String(body.date) : '';
    if (!date || !image.startsWith('data:image/png;base64,')) {
      return res.status(400).json({ error: 'Bild oder Tagesdatum fehlt.' });
    }

    const base64 = image.slice(image.indexOf(',') + 1);
    const buffer = Buffer.from(base64, 'base64');
    if (!buffer.length || buffer.length > 4 * 1024 * 1024) {
      return res.status(413).json({ error: 'Das Bild ist für diesen Galerie-Weg zu groß.' });
    }

    const pathname = `tagesgalerie/${date}/bild-${Date.now()}.png`;
    const blob = await put(pathname, buffer, {
      access: 'private',
      contentType: 'image/png',
      addRandomSuffix: true
    });

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, pathname: blob.pathname });
  } catch (error) {
    console.error('Tagesgalerie Upload:', error);
    return res.status(500).json({ error: 'Das Bild konnte gerade nicht in die Tagesgalerie gelegt werden.' });
  }
};
