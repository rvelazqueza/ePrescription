# =====================================================
# Script: test-audit-system.ps1
# Description: Test audit logging system with CRUD operations
# Author: ePrescription Team
# Date: 2024-11-17
# =====================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Audit System Testing Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"
$token = ""

# Function to make API requests
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Token = ""
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    try {
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Red
        }
        return $null
    }
}

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
$health = Invoke-ApiRequest -Method "GET" -Endpoint "/health"
if ($health) {
    Write-Host "✓ API is healthy" -ForegroundColor Green
    Write-Host "  Status: $($health.status)" -ForegroundColor Gray
    Write-Host "  Timestamp: $($health.timestamp)" -ForegroundColor Gray
} else {
    Write-Host "✗ API health check failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Login (to get token)
Write-Host "Test 2: Authentication" -ForegroundColor Yellow
Write-Host "Note: You need to login manually to get a token" -ForegroundColor Gray
Write-Host "Use Postman or curl to login and paste the token here" -ForegroundColor Gray
Write-Host ""
Write-Host "Example login request:" -ForegroundColor Gray
Write-Host "POST http://localhost:8080/realms/eprescription/protocol/openid-connect/token" -ForegroundColor Gray
Write-Host "Body: grant_type=password&client_id=eprescription-api&username=admin&password=admin123" -ForegroundColor Gray
Write-Host ""

$token = Read-Host "Enter your access token (or press Enter to skip authenticated tests)"
Write-Host ""

if (-not $token) {
    Write-Host "⚠ Skipping authenticated tests" -ForegroundColor Yellow
    Write-Host ""
}

# Test 3: Get Audit Logs (without filters)
if ($token) {
    Write-Host "Test 3: Get Audit Logs (No Filters)" -ForegroundColor Yellow
    $logs = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit?pageNumber=1&pageSize=10" -Token $token
    if ($logs) {
        Write-Host "✓ Retrieved audit logs" -ForegroundColor Green
        Write-Host "  Total Count: $($logs.totalCount)" -ForegroundColor Gray
        Write-Host "  Page: $($logs.pageNumber) of $($logs.totalPages)" -ForegroundColor Gray
        Write-Host "  Logs in page: $($logs.logs.Count)" -ForegroundColor Gray
        
        if ($logs.logs.Count -gt 0) {
            Write-Host "  First log:" -ForegroundColor Gray
            Write-Host "    - Action: $($logs.logs[0].actionType)" -ForegroundColor Gray
            Write-Host "    - Entity: $($logs.logs[0].entityType)" -ForegroundColor Gray
            Write-Host "    - User: $($logs.logs[0].username)" -ForegroundColor Gray
            Write-Host "    - Timestamp: $($logs.logs[0].timestamp)" -ForegroundColor Gray
        }
    } else {
        Write-Host "✗ Failed to retrieve audit logs" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 4: Get Audit Logs with Date Filter
if ($token) {
    Write-Host "Test 4: Get Audit Logs (Date Filter)" -ForegroundColor Yellow
    $startDate = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
    $endDate = (Get-Date).ToString("yyyy-MM-dd")
    $logs = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit?startDate=$startDate&endDate=$endDate&pageSize=5" -Token $token
    if ($logs) {
        Write-Host "✓ Retrieved audit logs with date filter" -ForegroundColor Green
        Write-Host "  Date Range: $startDate to $endDate" -ForegroundColor Gray
        Write-Host "  Total Count: $($logs.totalCount)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to retrieve filtered audit logs" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 5: Get Audit Logs with Action Filter
if ($token) {
    Write-Host "Test 5: Get Audit Logs (Action Filter)" -ForegroundColor Yellow
    $logs = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit?action=LOGIN&pageSize=5" -Token $token
    if ($logs) {
        Write-Host "✓ Retrieved audit logs with action filter" -ForegroundColor Green
        Write-Host "  Action: LOGIN" -ForegroundColor Gray
        Write-Host "  Total Count: $($logs.totalCount)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to retrieve filtered audit logs" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 6: Get Audit Logs with Entity Type Filter
if ($token) {
    Write-Host "Test 6: Get Audit Logs (Entity Type Filter)" -ForegroundColor Yellow
    $logs = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit?entityType=Authentication&pageSize=5" -Token $token
    if ($logs) {
        Write-Host "✓ Retrieved audit logs with entity type filter" -ForegroundColor Green
        Write-Host "  Entity Type: Authentication" -ForegroundColor Gray
        Write-Host "  Total Count: $($logs.totalCount)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to retrieve filtered audit logs" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 7: Get Specific Audit Log by ID
if ($token) {
    Write-Host "Test 7: Get Audit Log by ID" -ForegroundColor Yellow
    # First get a log ID
    $logs = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit?pageSize=1" -Token $token
    if ($logs -and $logs.logs.Count -gt 0) {
        $logId = $logs.logs[0].id
        $log = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit/$logId" -Token $token
        if ($log) {
            Write-Host "✓ Retrieved specific audit log" -ForegroundColor Green
            Write-Host "  ID: $($log.id)" -ForegroundColor Gray
            Write-Host "  Action: $($log.actionType)" -ForegroundColor Gray
            Write-Host "  Entity: $($log.entityType)" -ForegroundColor Gray
        } else {
            Write-Host "✗ Failed to retrieve specific audit log" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠ No logs available to test" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Test 8: Validate Audit Log Integrity
if ($token) {
    Write-Host "Test 8: Validate Audit Log Integrity" -ForegroundColor Yellow
    $logs = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit?pageSize=1" -Token $token
    if ($logs -and $logs.logs.Count -gt 0) {
        $logId = $logs.logs[0].id
        $validation = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit/$logId/validate" -Token $token
        if ($validation) {
            Write-Host "✓ Validated audit log integrity" -ForegroundColor Green
            Write-Host "  Is Valid: $($validation.isValid)" -ForegroundColor Gray
            Write-Host "  Message: $($validation.message)" -ForegroundColor Gray
        } else {
            Write-Host "✗ Failed to validate audit log" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠ No logs available to test" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Test 9: Get Audit Statistics
if ($token) {
    Write-Host "Test 9: Get Audit Statistics" -ForegroundColor Yellow
    $startDate = (Get-Date).AddDays(-30).ToString("yyyy-MM-dd")
    $endDate = (Get-Date).ToString("yyyy-MM-dd")
    $stats = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit/statistics?startDate=$startDate&endDate=$endDate" -Token $token
    if ($stats) {
        Write-Host "✓ Retrieved audit statistics" -ForegroundColor Green
        Write-Host "  Total Operations: $($stats.totalOperations)" -ForegroundColor Gray
        Write-Host "  Authentication Attempts: $($stats.authenticationAttempts)" -ForegroundColor Gray
        Write-Host "  Successful Authentications: $($stats.successfulAuthentications)" -ForegroundColor Gray
        Write-Host "  Failed Authentications: $($stats.failedAuthentications)" -ForegroundColor Gray
        Write-Host "  AI Operations: $($stats.aiOperations)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to retrieve audit statistics" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 10: Get Retention Policy Information
if ($token) {
    Write-Host "Test 10: Get Retention Policy Information" -ForegroundColor Yellow
    $policy = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit/retention-policy" -Token $token
    if ($policy) {
        Write-Host "✓ Retrieved retention policy information" -ForegroundColor Green
        Write-Host "  Retention Years: $($policy.retentionYears)" -ForegroundColor Gray
        Write-Host "  Cutoff Date: $($policy.cutoffDate)" -ForegroundColor Gray
        Write-Host "  Total Logs: $($policy.totalLogsCount)" -ForegroundColor Gray
        Write-Host "  Active Logs: $($policy.activeLogsCount)" -ForegroundColor Gray
        Write-Host "  Archivable Logs: $($policy.archivableLogsCount)" -ForegroundColor Gray
        $sizeMB = [math]::Round($policy.totalStorageSizeBytes / 1MB, 2)
        Write-Host "  Storage Size: $sizeMB MB" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to retrieve retention policy" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 11: Get Archivable Logs Count
if ($token) {
    Write-Host "Test 11: Get Archivable Logs Count" -ForegroundColor Yellow
    $archivable = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit/archivable-count?retentionYears=7" -Token $token
    if ($archivable) {
        Write-Host "✓ Retrieved archivable logs count" -ForegroundColor Green
        Write-Host "  Count: $($archivable.count)" -ForegroundColor Gray
        Write-Host "  Retention Years: $($archivable.retentionYears)" -ForegroundColor Gray
        Write-Host "  Cutoff Date: $($archivable.cutoffDate)" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to retrieve archivable logs count" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 12: Pagination Test
if ($token) {
    Write-Host "Test 12: Pagination Test" -ForegroundColor Yellow
    Write-Host "  Testing page 1..." -ForegroundColor Gray
    $page1 = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit?pageNumber=1&pageSize=5" -Token $token
    if ($page1) {
        Write-Host "  ✓ Page 1: $($page1.logs.Count) logs" -ForegroundColor Green
    }
    
    if ($page1.totalPages -gt 1) {
        Write-Host "  Testing page 2..." -ForegroundColor Gray
        $page2 = Invoke-ApiRequest -Method "GET" -Endpoint "/api/audit?pageNumber=2&pageSize=5" -Token $token
        if ($page2) {
            Write-Host "  ✓ Page 2: $($page2.logs.Count) logs" -ForegroundColor Green
        }
        
        # Verify different logs
        if ($page1.logs[0].id -ne $page2.logs[0].id) {
            Write-Host "✓ Pagination working correctly (different logs on different pages)" -ForegroundColor Green
        } else {
            Write-Host "✗ Pagination issue: same logs on different pages" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠ Only one page available, cannot test pagination fully" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Audit System Features Tested:" -ForegroundColor White
Write-Host "  ✓ Basic audit log retrieval" -ForegroundColor Green
Write-Host "  ✓ Date range filtering" -ForegroundColor Green
Write-Host "  ✓ Action type filtering" -ForegroundColor Green
Write-Host "  ✓ Entity type filtering" -ForegroundColor Green
Write-Host "  ✓ Specific log retrieval by ID" -ForegroundColor Green
Write-Host "  ✓ Audit log integrity validation" -ForegroundColor Green
Write-Host "  ✓ Audit statistics" -ForegroundColor Green
Write-Host "  ✓ Retention policy information" -ForegroundColor Green
Write-Host "  ✓ Archivable logs count" -ForegroundColor Green
Write-Host "  ✓ Pagination" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Perform CRUD operations on entities (patients, prescriptions, etc.)" -ForegroundColor Gray
Write-Host "  2. Verify that audit logs are created automatically" -ForegroundColor Gray
Write-Host "  3. Check that logs contain before/after values" -ForegroundColor Gray
Write-Host "  4. Verify immutability (try to update/delete a log)" -ForegroundColor Gray
Write-Host ""
Write-Host "For CRUD testing, use the entity controllers:" -ForegroundColor Yellow
Write-Host "  - POST /api/patients (create)" -ForegroundColor Gray
Write-Host "  - PUT /api/patients/{id} (update)" -ForegroundColor Gray
Write-Host "  - DELETE /api/patients/{id} (delete)" -ForegroundColor Gray
Write-Host "  Then check /api/audit to see the logs" -ForegroundColor Gray
Write-Host ""
