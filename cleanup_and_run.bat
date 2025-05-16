@echo off
taskkill /F /IM node.exe >nul 2>&1
rmdir /s /q temp-app >nul 2>&1
powershell -ExecutionPolicy Bypass -File migrate_final.ps1
