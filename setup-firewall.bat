@echo off
echo Setting up Windows Firewall for Text Comparison Tool...
echo.
echo This will allow incoming connections on port 5000
echo Run as Administrator for this to work
echo.

netsh advfirewall firewall add rule name="Text Comparison Tool" dir=in action=allow protocol=TCP localport=5000

echo.
echo Firewall rule added successfully!
echo Port 5000 is now open for incoming connections
pause