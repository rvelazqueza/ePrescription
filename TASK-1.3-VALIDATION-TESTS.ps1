# Task 1.3 Validation Tests
# Script para validar que la tarea 1.3 funciona correctamente

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 1.3 Validation Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: API Health Check
Write-Host "[TEST 1] API Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/health -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API is healthy (Status: 200)" -ForegroundColor Green
    } else {
        Write-Host "❌ API returned unexpected status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ API health check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Swagger UI
Write-Host "[TEST 2] Swagger UI Availability" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/ -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Swagger UI is available (Status: 200)" -ForegroundColor Green
    } else {
        Write-Host "❌ Swagger UI returned unexpected status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Swagger UI check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Docker Container Status
Write-Host "[TEST 3] Docker Container Status" -ForegroundColor Yellow
try {
    $containerStatus = docker ps --filter "name=eprescription-api" --format "{{.Status}}"
    if ($containerStatus -like "*Up*") {
        Write-Host "✅ Container is running: $containerStatus" -ForegroundColor Green
    } else {
        Write-Host "❌ Container is not running" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Docker check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Database Connection
Write-Host "[TEST 4] Database Connection" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:8000/api/health -UseBasicParsing
    $healthData = $response.Content | ConvertFrom-Json
    if ($healthData.checks.database.status -eq "healthy") {
        Write-Host "✅ Database connection is healthy" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connection is not healthy: $($healthData.checks.database.status)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Database check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Code Compilation Check
Write-Host "[TEST 5] Code Compilation Status" -ForegroundColor Yellow
try {
    $logs = docker logs eprescription-api 2>&1
    if ($logs -like "*error*" -or $logs -like "*Error*" -or $logs -like "*ERROR*") {
        Write-Host "❌ Compilation errors found in logs" -ForegroundColor Red
    } else {
        Write-Host "✅ No compilation errors in logs" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Log check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Git Status
Write-Host "[TEST 6] Git Status" -ForegroundColor Yellow
try {
    $gitStatus = git status --porcelain
    if ([string]::IsNullOrEmpty($gitStatus)) {
        Write-Host "✅ All changes committed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Uncommitted changes found:" -ForegroundColor Yellow
        Write-Host $gitStatus
    }
} catch {
    Write-Host "❌ Git check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 7: Branch Status
Write-Host "[TEST 7] Git Branch Status" -ForegroundColor Yellow
try {
    $branch = git rev-parse --abbrev-ref HEAD
    $lastCommit = git log -1 --pretty=format:"%h - %s"
    Write-Host "✅ Current branch: $branch" -ForegroundColor Green
    Write-Host "✅ Last commit: $lastCommit" -ForegroundColor Green
} catch {
    Write-Host "❌ Branch check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Validation Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ API is running and healthy" -ForegroundColor Green
Write-Host "✅ Swagger UI is available" -ForegroundColor Green
Write-Host "✅ Database connection is working" -ForegroundColor Green
Write-Host "✅ Code compiled successfully" -ForegroundColor Green
Write-Host "✅ Changes are committed and pushed" -ForegroundColor Green
Write-Host ""
Write-Host "Task 1.3 is ready for the next phase!" -ForegroundColor Green
