@echo off
echo ===================================================
echo Tour Website - Startup Script
echo ===================================================
echo.

echo [1/4] Starting Backend (Port 5000)...
start "Booking Backend" cmd /k "cd backend && npm start"
timeout /t 3 >nul

echo [2/4] Starting Original Admin Panel Server (Port 5002)...
start "Admin Panel Server" cmd /k "cd admin-panel/server && npm start"
timeout /t 3 >nul

echo [3/4] Starting Vendor Panel (Port 5174)...
start "Vendor Panel" cmd /k "cd Home && npm run dev"
timeout /t 3 >nul

echo [4/4] Starting Customer Frontend (Port 5173)...
start "Customer Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo All services started successfully!
echo ===================================================
echo.
echo Access URLs:
echo - Customer Site:  http://localhost:5173
echo - Vendor Panel:   http://localhost:5174
echo - Admin Panel:    http://localhost:5002
echo.
echo Press any key to close this window (servers will continue running)...
pause >nul