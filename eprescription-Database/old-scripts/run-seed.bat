@echo off
echo Ejecutando seed-data.sql en Oracle...
docker exec -i eprescription-oracle-db bash -c "cd /opt/oracle/scripts && echo exit | sqlplus eprescription/eprescription123@//localhost:1521/XEPDB1 @seed-data.sql"
echo.
echo Proceso completado.
pause
