@echo off
setlocal
cd /d "%~dp0"
echo Das Goldene Buch Deines Lebens wird gestartet.
echo Dieses Fenster bitte waehrend der Benutzung geoeffnet lassen.
echo.
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080/
  py -m http.server 8080
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080/
  python -m http.server 8080
  goto :end
)
echo Auf diesem Windows-PC wurde Python nicht gefunden.
echo Bitte verwende die Online-Adresse auf der Itschana-Webseite.
pause
:end
endlocal
