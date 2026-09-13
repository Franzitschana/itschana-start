module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { get } = await import('@vercel/blob');
    const pathname = String(req.query.pathname || '');
    if (!/^tagesgalerie\/\d{4}-\d{2}-\d{2}\/[A-Za-z0-9._-]+\.png$/.test(pathname)) return res.status(400).end();
    const result = await get(pathname, { access: 'private' });
    if (!result) return res.status(404).end();
    res.setHeader('Content-Type', result.blob.contentType || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=300');
    const reader = result.stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch (error) {
    console.error('Tagesgalerie Bild:', error);
    res.status(500).end();
  }
};
