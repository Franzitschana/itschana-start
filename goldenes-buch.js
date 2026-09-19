(function () {
  'use strict';

  const STORAGE_KEY = 'itschana_goldenes_buch_v1';
  const RESET_KEY = 'reset_wahrnehmung_v2';

  function emptyBook() {
    return { format: 'itschana-goldenes-buch', version: 1, title: 'Das Goldene Buch Deines Lebens', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), entries: [] };
  }

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (parsed?.format === 'itschana-goldenes-buch' && Array.isArray(parsed.entries)) return parsed;
    } catch (error) {}
    return emptyBook();
  }

  function save(book) {
    book.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
    return book;
  }

  function migrateResetTraces() {
    const book = load();
    let traces = [];
    try { traces = JSON.parse(localStorage.getItem(RESET_KEY)) || []; } catch (error) {}
    if (!Array.isArray(traces)) return book;
    let changed = false;
    traces.forEach((trace) => {
      const sourceId = `reset:${trace.id}`;
      if (book.entries.some((entry) => entry.sourceId === sourceId)) return;
      book.entries.push({
        id: `gb-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        sourceId,
        type: 'wahrnehmung',
        date: trace.day,
        kin: trace.kin || null,
        title: 'Meine RESET-Wahrnehmung',
        text: [trace.observation, trace.feeling, trace.interpretation, trace.beforeWords, trace.change].filter(Boolean).join('\n\n'),
        details: trace,
        writtenAt: trace.savedAt || new Date().toISOString()
      });
      changed = true;
    });
    return changed ? save(book) : book;
  }

  function addEntry(entry) {
    const book = migrateResetTraces();
    const record = { id: `gb-${Date.now()}-${Math.random().toString(36).slice(2)}`, writtenAt: new Date().toISOString(), ...entry };
    book.entries.push(record);
    save(book);
    window.dispatchEvent(new CustomEvent('goldenes-buch:changed', { detail: { count: book.entries.length } }));
    return record;
  }

  function download() {
    const book = migrateResetTraces();
    const blob = new Blob([JSON.stringify(book, null, 2)], { type: 'application/json;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `goldenes-buch-des-lebens-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function imageThumbnail(image) {
    return new Promise((resolve) => {
      if (!image?.src || image.hidden) return resolve('');
      const canvas = document.createElement('canvas');
      const size = 480;
      canvas.width = size; canvas.height = size;
      try {
        canvas.getContext('2d').drawImage(image, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      } catch (error) { resolve(''); }
    });
  }

  const book = migrateResetTraces();
  window.GoldenesBuch = { load, addEntry, download, imageThumbnail, count: () => load().entries.length };
  window.dispatchEvent(new CustomEvent('goldenes-buch:ready', { detail: { count: book.entries.length } }));
})();
