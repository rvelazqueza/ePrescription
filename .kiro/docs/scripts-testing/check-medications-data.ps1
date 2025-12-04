#!/usr/bin/env pwsh

Write-Host "Checking database for medications and related data..." -ForegroundColor Cyan

# Query to check tables
$query = @"
SET PAGESIZE 100
SET LINESIZE 200
SELECT TABLE_NAME FROM USER_TABLES WHERE TABLE_NAME LIKE '%MEDICATION%' OR TABLE_NAME LIKE '%ROUTE%' OR TABLE_NAME LIKE '%CENTER%' ORDER BY TABLE_NAME;
EXIT;
"@

# Save query to temp file
$query | Out-File -FilePath temp_query.sql -Encoding ASCII

# Execute query
Write-Host "`nTables in database:" -ForegroundColor Yellow
docker exec -i eprescription-oracle-db bash -c "cat > /tmp/query.sql << 'EOF'
$query
EOF
sqlplus -s EPRESCRIPTION_USER/EprescriptionPass123\!@XEPDB1 @/tmp/query.sql"

# Clean up
Remove-Item temp_query.sql -ErrorAction SilentlyContinue

Write-Host "`nDone!" -ForegroundColor Green
