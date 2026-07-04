@echo off
echo ====================================
echo Stopping All Servers
echo ====================================
echo.

echo Killing node processes on ports 5000, 5001, 5002, 5173, 5174, 5175...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5002') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5174') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5175') do taskkill /PID %%a /F >nul 2>&1

echo Killing named server windows...
taskkill /FI "WINDOWTITLE eq Server Backend*" /T >nul 2>&1
taskkill /FI "WINDOWTITLE eq Booking Backend*" /T >nul 2>&1
taskkill /FI "WINDOWTITLE eq Home*" /T >nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend*" /T >nul 2>&1
taskkill /FI "WINDOWTITLE eq Admin Panel Server*" /T >nul 2>&1
taskkill /FI "WINDOWTITLE eq Admin Panel Client*" /T >nul 2>&1

echo All servers stopped.
echo.
pause