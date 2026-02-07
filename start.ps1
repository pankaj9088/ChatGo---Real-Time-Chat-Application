# ChatGo - Start Script
# This script starts both backend and frontend servers

Write-Host "Starting ChatGo Application..." -ForegroundColor Green
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
$mongoRunning = $false
try {
    $mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($mongoTest.TcpTestSucceeded) {
        $mongoRunning = $true
        Write-Host "MongoDB is running on port 27017" -ForegroundColor Green
    }
} catch {
    Write-Host "MongoDB connection check failed" -ForegroundColor Yellow
}

if (-not $mongoRunning) {
    Write-Host "MongoDB is not running!" -ForegroundColor Red
    Write-Host "Please start MongoDB before running the application." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To start MongoDB:" -ForegroundColor Cyan
    Write-Host "  Windows: net start MongoDB" -ForegroundColor White
    Write-Host "  Or use MongoDB Atlas cloud database" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Backend Server' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Frontend Server' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop the servers" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy chatting!" -ForegroundColor Magenta
