@echo off
setlocal
start "ShowCarDetail API" cmd /k "cd /d %~dp0LocalApi && dotnet run"
timeout /t 3 >nul
start "ShowCarDetail React" cmd /k "cd /d %~dp0 && npm run dev"
