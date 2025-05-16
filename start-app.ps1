Write-Host "Starting Quick Query Resolver with simplified folder structure..." -ForegroundColor Cyan

# Check if MongoDB is running
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "WARNING: MongoDB doesn't appear to be running. Please start MongoDB first." -ForegroundColor Yellow
}

# Start backend server in a new PowerShell window
Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"

# Brief pause to let the backend start
Start-Sleep -Seconds 3

# Start frontend in another PowerShell window
Write-Host "Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"

Write-Host "Servers started successfully!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "To run this script with execution policy bypass, use:" -ForegroundColor Yellow
Write-Host "powershell -ExecutionPolicy Bypass -File .\start-app.ps1" -ForegroundColor White
