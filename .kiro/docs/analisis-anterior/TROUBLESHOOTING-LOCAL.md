# 🔧 Troubleshooting - Desarrollo Local

## Problemas Comunes y Soluciones

### 1. .NET no se encuentra

**Síntoma:**
```
dotnet : The term 'dotnet' is not recognized...
```

**Solución:**
```powershell
# Arreglar PATH en esta sesión
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH

# Verificar
dotnet --version
```

**Solución Permanente:**
```powershell
# Ejecutar como Administrador
.\fix-dotnet-simple.ps1

# Luego reiniciar PowerShell
```

---

### 2. Puerto 5000 ocupado

**Síntoma:**
```
Failed to bind to address http://localhost:5000
```

**Solución 1 - Detener API en Docker:**
```powershell
docker stop eprescription-backend-api
```

**Solución 2 - Ver qué está usando el puerto:**
```powershell
# Ver proceso
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess

# Matar proceso (reemplaza PID)
Stop-Process -Id <PID> -Force
```

**Solución 3 - Usar otro puerto:**
```powershell
# En start-dev-local.ps1, cambiar:
dotnet watch run --project src/ePrescription.API --urls http://localhost:5001
```

---

### 3. Oracle no conecta

**Síntoma:**
```
ORA-12541: TNS:no listener
```

**Verificar:**
```powershell
# Ver si Oracle está corriendo
docker ps | findstr oracle

# Ver logs
docker logs eprescription-oracle-db

# Probar conexión
Test-NetConnection -ComputerName localhost -Port 1521
```

**Solución:**
```powershell
# Reiniciar Oracle
docker restart eprescription-oracle-db

# Esperar 30 segundos
Start-Sleep -Seconds 30

# Verificar health
docker ps --filter "name=oracle"
```

---

### 4. Keycloak no conecta

**Síntoma:**
```
Unable to connect to Keycloak at http://localhost:8080
```

**Verificar:**
```powershell
# Ver si Keycloak está corriendo
docker ps | findstr keycloak

# Probar acceso
curl http://localhost:8080
```

**Solución:**
```powershell
# Reiniciar Keycloak
docker restart eprescription-keycloak

# Esperar 20 segundos
Start-Sleep -Seconds 20

# Verificar
curl http://localhost:8080
```

---

### 5. Error de compilación

**Síntoma:**
```
Build FAILED
```

**Solución:**
```powershell
cd eprescription-API

# Limpiar
dotnet clean

# Restaurar paquetes
dotnet restore

# Compilar
dotnet build
```

---

### 6. Cambios no se reflejan (Hot Reload no funciona)

**Síntoma:**
Los cambios en el código no se ven en el API

**Verificar:**
- Estás usando `dotnet watch run` (no solo `dotnet run`)
- El archivo se guardó correctamente
- No hay errores de compilación en la consola

**Solución:**
```powershell
# Detener el API (Ctrl+C)
# Reiniciar con watch
cd eprescription-API
dotnet watch run --project src/ePrescription.API --urls http://localhost:5000
```

---

### 7. Archivo de configuración no se carga

**Síntoma:**
El API usa configuración incorrecta

**Verificar:**
```powershell
# Ver qué ambiente está usando
$env:ASPNETCORE_ENVIRONMENT
# Debería mostrar: Local
```

**Solución:**
```powershell
# Establecer ambiente
$env:ASPNETCORE_ENVIRONMENT = "Local"

# Verificar que existe el archivo
Test-Path eprescription-API/src/ePrescription.API/appsettings.Local.json
```

---

### 8. Error de Entity Framework / Migraciones

**Síntoma:**
```
No database provider has been configured
```

**Solución:**
```powershell
cd eprescription-API

# Ver migraciones pendientes
dotnet ef migrations list --project src/ePrescription.Infrastructure --startup-project src/ePrescription.API

# Aplicar migraciones
dotnet ef database update --project src/ePrescription.Infrastructure --startup-project src/ePrescription.API
```

---

### 9. Swagger no carga

**Síntoma:**
http://localhost:5000/swagger no funciona

**Verificar:**
- El API está corriendo
- Estás en ambiente Development o Local
- No hay errores en la consola

**Solución:**
```powershell
# Swagger solo funciona en Development/Local
$env:ASPNETCORE_ENVIRONMENT = "Local"

# Reiniciar API
```

---

### 10. Logs no se generan

**Síntoma:**
No se crea la carpeta `logs/`

**Solución:**
```powershell
# Crear carpeta manualmente
cd eprescription-API/src/ePrescription.API
mkdir logs

# Verificar permisos de escritura
```

---

## Scripts de Diagnóstico

### Script Completo de Verificación

```powershell
.\test-local-api.ps1
```

Este script verifica:
- .NET instalado
- Docker corriendo
- Oracle accesible
- Keycloak accesible
- Proyecto compila
- Configuración existe

### Verificación Rápida

```powershell
# .NET
dotnet --version

# Docker
docker ps

# Oracle
Test-NetConnection localhost -Port 1521

# Keycloak
curl http://localhost:8080

# Compilación
cd eprescription-API
dotnet build
```

---

## Comandos Útiles

### Reiniciar Todo

```powershell
# Detener API local (Ctrl+C en la ventana del API)

# Reiniciar infraestructura
docker-compose restart oracle-db keycloak

# Esperar
Start-Sleep -Seconds 30

# Reiniciar API local
.\start-dev-local.ps1
```

### Limpiar y Empezar de Nuevo

```powershell
# Detener todo
docker-compose down

# Limpiar compilación
cd eprescription-API
dotnet clean
cd ..

# Iniciar infraestructura
docker-compose up -d oracle-db keycloak

# Esperar
Start-Sleep -Seconds 30

# Iniciar API local
.\start-dev-local.ps1
```

### Ver Logs en Tiempo Real

```powershell
# Logs del API (en la consola donde corre)
# Ya se muestran automáticamente

# Logs de Oracle
docker logs -f eprescription-oracle-db

# Logs de Keycloak
docker logs -f eprescription-keycloak
```

---

## Contacto y Ayuda

Si ninguna de estas soluciones funciona:

1. Verifica que Docker Desktop esté corriendo
2. Reinicia tu computadora
3. Verifica que tienes espacio en disco
4. Revisa los logs completos del error

### Información para Debug

Cuando pidas ayuda, incluye:

```powershell
# Versión de .NET
dotnet --version

# Estado de Docker
docker ps

# Logs del API (últimas 50 líneas)
# Copiar de la consola donde corre el API

# Configuración
cat eprescription-API/src/ePrescription.API/appsettings.Local.json
```
