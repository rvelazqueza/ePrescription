@echo off
echo Verificando usuario eprescription...
docker exec -i eprescription-oracle-db sqlplus sys/OraclePassword123!@//localhost:1521/XEPDB1 as sysdba << EOF
SELECT username FROM dba_users WHERE username = 'EPRESCRIPTION';
EXIT;
EOF

echo.
echo Ejecutando seed-data como SYS...
docker exec -i eprescription-oracle-db bash -c "cd /opt/oracle/scripts && sqlplus sys/OraclePassword123!@//localhost:1521/XEPDB1 as sysdba @seed-data.sql"

pause
