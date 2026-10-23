#!/bin/sh
cd "$(dirname "$0")" || exit 1
if ! command -v python3 >/dev/null 2>&1; then
 echo "Python 3 nicht gefunden. Bitte index.html direkt öffnen."
 read -r x
 exit 1
fi
printf 'Goldenes Buch unter http://localhost:8765 öffnen. Mit Strg+C beenden.\n'
(sleep 1; xdg-open http://localhost:8765 2>/dev/null) &
python3 -m http.server 8765 --bind 127.0.0.1
