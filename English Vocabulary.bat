@echo off
cd /d "%~dp0"

start "English Vocabulary Dev Server" cmd /k "npm run dev"

timeout /t 8 /nobreak >nul

start "" "http://localhost:5173"

exit