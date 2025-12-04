Write-Host "=== VERIFICANDO IDs EN LA BASE DE DATOS ===" -ForegroundColor Cyan
Write-Host ""

# Ejecutar el script SQL
docker exec -i eprescription-oracle-db sqlplus -s EPRESCRIPTION_USER/oracle123@//localhost:1521/XEPDB1 @/tmp/check-all-ids.sql

Write-Host ""
Write-Host "=== ANÁLISIS COMPLETADO ===" -ForegroundColor Green
