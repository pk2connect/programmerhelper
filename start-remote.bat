@echo off
echo Starting Text Comparison Tool for Remote Access...
echo.

REM Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "ip=%%a"
    goto :found
)
:found
set ip=%ip: =%

echo The application will be available at:
echo Local access: http://localhost:5000
echo Remote access: http://%ip%:5000
echo.
echo Make sure Windows Firewall allows port 5000
echo Press Ctrl+C to stop the application
echo.

dotnet run --urls "http://0.0.0.0:5000"
pause