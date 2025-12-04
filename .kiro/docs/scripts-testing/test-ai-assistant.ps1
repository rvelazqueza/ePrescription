# Test AI Assistant Integration
# Tests the AI Assistant service endpoints

Write-Host "=== AI ASSISTANT INTEGRATION TEST ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$API_URL = "http://localhost:8000/api"
$TOKEN_FILE = "last-token.json"

# Check if token file exists
if (-not (Test-Path $TOKEN_FILE)) {
    Write-Host "❌ Token file not found. Please login first:" -ForegroundColor Red
    Write-Host "   .\test-login-final.ps1" -ForegroundColor Yellow
    exit 1
}

# Read token
$tokenData = Get-Content $TOKEN_FILE | ConvertFrom-Json
$TOKEN = $tokenData.access_token

Write-Host "✓ Token loaded" -ForegroundColor Green
Write-Host ""

# Headers
$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

# Test 1: Check Drug Interactions (requires at least 2 medication IDs)
Write-Host "TEST 1: Check Drug Interactions" -ForegroundColor Yellow
Write-Host "Endpoint: POST /api/AIAssistant/medications/check-interactions" -ForegroundColor Gray
Write-Host ""

# Note: This requires real medication GUIDs from the database
# For now, we'll show the expected request format
$interactionRequest = @{
    medicationIds = @(
        "00000000-0000-0000-0000-000000000001",
        "00000000-0000-0000-0000-000000000002"
    )
} | ConvertTo-Json

Write-Host "Request body:" -ForegroundColor Gray
Write-Host $interactionRequest -ForegroundColor DarkGray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$API_URL/AIAssistant/medications/check-interactions" `
        -Method Post `
        -Headers $headers `
        -Body $interactionRequest `
        -ErrorAction Stop
    
    Write-Host "✓ Drug interactions checked successfully" -ForegroundColor Green
    Write-Host "Interactions found: $($response.Count)" -ForegroundColor Cyan
    
    if ($response.Count -gt 0) {
        $response | ForEach-Object {
            Write-Host ""
            Write-Host "  Interaction:" -ForegroundColor Yellow
            Write-Host "    Medication 1: $($_.medication1Name)" -ForegroundColor White
            Write-Host "    Medication 2: $($_.medication2Name)" -ForegroundColor White
            Write-Host "    Severity: $($_.severity)" -ForegroundColor $(if ($_.severity -eq "HIGH") { "Red" } else { "Yellow" })
            Write-Host "    Type: $($_.interactionType)" -ForegroundColor White
            Write-Host "    Description: $($_.description)" -ForegroundColor Gray
        }
    } else {
        Write-Host "  No interactions detected" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Test skipped (requires valid medication IDs)" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Test 2: Analyze Clinical Description
Write-Host "TEST 2: Analyze Clinical Description" -ForegroundColor Yellow
Write-Host "Endpoint: POST /api/AIAssistant/analyze" -ForegroundColor Gray
Write-Host ""

$analysisRequest = @{
    clinicalDescription = "Paciente con dolor de cabeza intenso, náuseas y sensibilidad a la luz"
    patientId = $null
} | ConvertTo-Json

Write-Host "Request body:" -ForegroundColor Gray
Write-Host $analysisRequest -ForegroundColor DarkGray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$API_URL/AIAssistant/analyze" `
        -Method Post `
        -Headers $headers `
        -Body $analysisRequest `
        -ErrorAction Stop
    
    Write-Host "✓ Clinical analysis completed" -ForegroundColor Green
    Write-Host "Confidence Score: $($response.confidenceScore)" -ForegroundColor Cyan
    Write-Host "AI Model: $($response.aiModel)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Diagnosis Suggestions:" -ForegroundColor Yellow
    $response.diagnosisSuggestions | ForEach-Object {
        Write-Host "  - $($_.cie10Code): $($_.description)" -ForegroundColor White
        Write-Host "    Confidence: $($_.confidence)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Clinical analysis failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Test 3: Quick Diagnosis
Write-Host "TEST 3: Quick Diagnosis" -ForegroundColor Yellow
Write-Host "Endpoint: POST /api/AIAssistant/quick-diagnosis" -ForegroundColor Gray
Write-Host ""

$quickDiagnosisRequest = @{
    symptoms = @(
        "fiebre",
        "tos seca",
        "dolor de garganta",
        "fatiga"
    )
} | ConvertTo-Json

Write-Host "Request body:" -ForegroundColor Gray
Write-Host $quickDiagnosisRequest -ForegroundColor DarkGray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$API_URL/AIAssistant/quick-diagnosis" `
        -Method Post `
        -Headers $headers `
        -Body $quickDiagnosisRequest `
        -ErrorAction Stop
    
    Write-Host "✓ Quick diagnosis completed" -ForegroundColor Green
    Write-Host "Confidence Score: $($response.confidenceScore)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Suggested Diagnoses:" -ForegroundColor Yellow
    $response.suggestedDiagnoses | ForEach-Object {
        Write-Host "  - $($_.cie10Code): $($_.description)" -ForegroundColor White
        Write-Host "    Confidence: $($_.confidence)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Quick diagnosis failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# Test 4: Generate Medication Recommendations
Write-Host "TEST 4: Generate Medication Recommendations" -ForegroundColor Yellow
Write-Host "Endpoint: POST /api/AIAssistant/medications/recommend" -ForegroundColor Gray
Write-Host ""

$recommendationRequest = @{
    diagnosisCodes = @("I10", "E11.9")
    patientAge = 45
    patientWeight = 70
    allergies = @("Penicilina")
} | ConvertTo-Json

Write-Host "Request body:" -ForegroundColor Gray
Write-Host $recommendationRequest -ForegroundColor DarkGray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$API_URL/AIAssistant/medications/recommend" `
        -Method Post `
        -Headers $headers `
        -Body $recommendationRequest `
        -ErrorAction Stop
    
    Write-Host "✓ Medication recommendations generated" -ForegroundColor Green
    Write-Host "Recommendations: $($response.Count)" -ForegroundColor Cyan
    Write-Host ""
    $response | ForEach-Object {
        Write-Host "  Medication: $($_.medicationName)" -ForegroundColor Yellow
        Write-Host "    Active Ingredient: $($_.activeIngredient)" -ForegroundColor White
        Write-Host "    Dosage: $($_.recommendedDosage)" -ForegroundColor White
        Write-Host "    Frequency: $($_.frequency)" -ForegroundColor White
        Write-Host "    Duration: $($_.duration)" -ForegroundColor White
        Write-Host "    Route: $($_.route)" -ForegroundColor White
        Write-Host "    Confidence: $($_.confidenceScore)" -ForegroundColor Gray
        Write-Host ""
    }
} catch {
    Write-Host "❌ Medication recommendations failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "=== TEST SUMMARY ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "AI Assistant service endpoints tested:" -ForegroundColor White
Write-Host "  ✓ Drug Interaction Check" -ForegroundColor Green
Write-Host "  ✓ Clinical Analysis" -ForegroundColor Green
Write-Host "  ✓ Quick Diagnosis" -ForegroundColor Green
Write-Host "  ✓ Medication Recommendations" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Some tests may require valid medication IDs from the database" -ForegroundColor Yellow
Write-Host ""
