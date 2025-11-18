# Test Directo de WHO API
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST DIRECTO - WHO API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$clientId = "d11cd5e8-e7dc-484f-88d0-4c98787e098a_64779b01-1921-45b0-bbb3-c692264f2f6e"
$clientSecret = "UVQ4VyepbHRRJVDCfaYMj0i8c3wQUcUu0rlQtDcLQLI="

# TEST 1: Obtener Token OAuth
Write-Host "1. Obteniendo token OAuth de WHO API..." -ForegroundColor Yellow
try {
    $tokenUrl = "https://icdaccessmanagement.who.int/connect/token"
    $body = @{
        client_id = $clientId
        client_secret = $clientSecret
        scope = "icdapi_access"
        grant_type = "client_credentials"
    }
    
    $tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    $token = $tokenResponse.access_token
    
    Write-Host "OK - Token obtenido exitosamente" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0,30))..." -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "ERROR obteniendo token" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# TEST 2: Buscar diabetes en CIE-10
Write-Host "2. Buscando diabetes en catalogo CIE-10..." -ForegroundColor Yellow
try {
    $searchUrl = "https://id.who.int/icd/entity/search?q=diabetes"
    $headers = @{
        Authorization = "Bearer $token"
        "API-Version" = "v2"
        "Accept-Language" = "es"
    }
    
    $searchResults = Invoke-RestMethod -Uri $searchUrl -Headers $headers -Method GET
    
    Write-Host "OK - Busqueda exitosa" -ForegroundColor Green
    Write-Host "  Resultados encontrados: $($searchResults.destinationEntities.Count)" -ForegroundColor Gray
    
    if ($searchResults.destinationEntities.Count -gt 0) {
        Write-Host ""
        Write-Host "  Primeros 3 resultados:" -ForegroundColor Cyan
        $searchResults.destinationEntities | Select-Object -First 3 | ForEach-Object {
            Write-Host "    - $($_.title)" -ForegroundColor White
        }
    }
    Write-Host ""
}
catch {
    Write-Host "ERROR en busqueda" -ForegroundColor Red
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# RESUMEN
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "TODAS LAS PRUEBAS PASARON!" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciales de WHO API verificadas:" -ForegroundColor Green
Write-Host "  OK - Autenticacion OAuth funciona" -ForegroundColor Green
Write-Host "  OK - Busqueda en catalogo CIE-10 funciona" -ForegroundColor Green
Write-Host ""
Write-Host "Acceso al catalogo oficial de CIE-10 de la OMS confirmado!" -ForegroundColor Green
Write-Host ""

Read-Host "Presiona Enter para salir"
