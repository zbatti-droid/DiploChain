@echo off
echo ========================================
echo     DiploChain - Demarrage automatique
echo ========================================
echo.

echo [1/3] Demarrage de Ganache...
start "" "C:\Program Files\Ganache\Ganache.exe"
timeout /t 4 /nobreak > nul

echo [2/3] Demarrage du Backend...
start cmd /k "title DiploChain Backend && cd C:\Users\LENOVO\diploma-app\src\components\backend && node server.js"
timeout /t 3 /nobreak > nul

echo [3/3] Demarrage du Frontend...
start cmd /k "title DiploChain Frontend && cd C:\Users\LENOVO\diploma-app && npm run dev"
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo  Tout est demarre! Ouvrez:
echo  http://localhost:5173
echo ========================================
timeout /t 3 /nobreak > nul
start "" "http://localhost:5173"