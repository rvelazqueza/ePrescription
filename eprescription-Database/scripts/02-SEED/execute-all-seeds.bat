@echo off
REM =====================================================
REM Script: execute-all-seeds.bat
REM Description: Windows batch script to execute all seed data
REM Usage: execute-all-seeds.bat
REM =====================================================

echo ========================================
echo EPRESCRIPTION DATABASE - SEED DATA
echo Executing all seed scripts via Docker
echo ========================================
echo.

REM Execute the master SQL script inside Docker container
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus -S EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/00-execute-all-seeds.sql"

echo.
echo ========================================
echo Seed data execution completed!
echo ========================================
echo.

pause
