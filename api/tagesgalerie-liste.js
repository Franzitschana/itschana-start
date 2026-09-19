module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Nur GET ist erlaubt.' });
  try {
    const { list } = await import('@vercel/blob');
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(req.query.date || '')) ? String(req.query.date) : '';
    const prefix = date ? `tagesgalerie/${date}/` : 'tagesgalerie/';
    const blobs = [];
    let cursor;

    do {
      const result = await list({ prefix, cursor, limit: 1000 });
      blobs.push(...result.blobs);
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor && blobs.length < 5000);

    const images = blobs
      .filter(blob => /^tagesgalerie\/\d{4}-\d{2}-\d{2}\/.+\.png$/.test(blob.pathname))
      .map(blob => ({
        pathname: blob.pathname,
        date: blob.pathname.split('/')[1],
        uploadedAt: blob.uploadedAt
      }))
      .sort((a, b) => String(a.uploadedAt).localeCompare(String(b.uploadedAt)));
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ images });
  } catch (error) {
    console.error('Tagesgalerie Liste:', error);
    return res.status(500).json({ error: 'Die Tagesgalerie konnte gerade nicht gelesen werden.' });
  }
};
