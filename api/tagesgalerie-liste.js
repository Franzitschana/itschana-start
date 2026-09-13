module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Nur GET ist erlaubt.' });
  try {
    const { list } = await import('@vercel/blob');
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(req.query.date || '')) ? String(req.query.date) : '';
    if (!date) return res.status(400).json({ error: 'Tagesdatum fehlt.' });
    const result = await list({ prefix: `tagesgalerie/${date}/` });
    const images = result.blobs.filter(blob => blob.pathname.endsWith('.png')).map(blob => ({ pathname: blob.pathname, uploadedAt: blob.uploadedAt }));
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ images });
  } catch (error) {
    console.error('Tagesgalerie Liste:', error);
    return res.status(500).json({ error: 'Die Tagesgalerie konnte gerade nicht gelesen werden.' });
  }
};
