# Workflow de Desarrollo - Task 9 y Siguientes

## 🎯 Estrategia Recomendada: Desarrollo Híbrido

### Infraestructura en Docker + API Local

```
┌─────────────────────────────────────┐
│  Docker Compose                     │
│  ├─ Oracle DB (puerto 1521)        │
│  └─ Keycloak (puerto 8080)         │
└─────────────────────────────────────┘
              ↑
              │ Conexión
              ↓
┌─────────────────────────────────────┐
│  API Local (.NET)                   │
│  └─ Visual Studio / dotnet run     │
│     (puerto 5000)                   │
└─────────────────────────────────────┘
```

---

## 🚀 Setup Inicial

### 1. Crear appsettings.Development.Local.json

```powershell
# Crear archivo de configuración para desarrollo local
cd eprescription-API/src/ePrescription.API
```

Crear archivo `appsettings.Development.Local.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "User Id=eprescription_user;Password=EprescriptionPass123!;Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XEPDB1)))"
  },
  "Keycloak": {
    "Authority": "http://localhost:8080/realms/eprescription",
    "Audience": "eprescription-api",
    "RequireHttpsMetadata": false,
    "TokenUrl": "http://localhost:8080/realms/eprescription/protocol/openid-connect/token",
    "UserInfoUrl": "http://localhost:8080/realms/eprescription/protocol/openid-connect/userinfo",
    "ClientId": "eprescription-api",
    "ClientSecret": "your-client-secret-here"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

### 2. Agregar al .gitignore

```powershell
# Agregar a .gitignore
echo "appsettings.Development.Local.json" >> .gitignore
```

---

## 📋 Workflow Diario

### Opción A: Desarrollo Local (Recomendado)

```powershell
# 1. Iniciar solo infraestructura en Docker
docker-compose up -d oracle-db keycloak

# 2. Verificar que estén corriendo
docker ps

# 3. Correr API localmente
cd eprescription-API
dotnet run --project src/ePrescription.API --launch-profile Development

# O desde Visual Studio: F5 (Debug) o Ctrl+F5 (Run)
```

**Ventajas:**
- ⚡ Hot reload automático
- 🐛 Debugging con breakpoints
- 🚀 Cambios instantáneos
- 💻 Mejor experiencia de desarrollo

**URLs:**
- API: http://localhost:5000
- Swagger: http://localhost:5000/swagger
- Keycloak: http://localhost:8080
- Oracle: localhost:1521

---

### Opción B: Todo en Docker (Para testing)

```powershell
# 1. Hacer cambios en código

# 2. Rebuild y restart
docker-compose build backend-api
docker-compose up -d backend-api

# 3. Ver logs
docker-compose logs -f backend-api
```

**Cuándo usar:**
- ✅ Testing de integración final
- ✅ Validar antes de commit/push
- ✅ Simular ambiente productivo

---

## 🔧 Scripts Útiles

### Script: Desarrollo Local

```powershell
# dev-local.ps1
Write-Host "Iniciando desarrollo local..." -ForegroundColor Cyan

# Iniciar infraestructura
Write-Host "1. Iniciando Oracle y Keycloak..." -ForegroundColor Yellow
docker-compose up -d oracle-db keycloak

# Esperar a que estén healthy
Write-Host "2. Esperando a que servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar estado
Write-Host "3. Verificando estado..." -ForegroundColor Yellow
docker ps --format "table {{.Names}}\t{{.Status}}"

Write-Host "`n✅ Infraestructura lista!" -ForegroundColor Green
Write-Host "`nAhora puedes:" -ForegroundColor Cyan
Write-Host "  - Abrir Visual Studio y presionar F5" -ForegroundColor White
Write-Host "  - O ejecutar: dotnet run --project eprescription-API/src/ePrescription.API" -ForegroundColor White
Write-Host "`nURLs:" -ForegroundColor Cyan
Write-Host "  - API: http://localhost:5000" -ForegroundColor White
Write-Host "  - Swagger: http://localhost:5000/swagger" -ForegroundColor White
Write-Host "  - Keycloak: http://localhost:8080" -ForegroundColor White
```

### Script: Rebuild Docker

```powershell
# rebuild-docker.ps1
Write-Host "Rebuilding Docker API..." -ForegroundColor Cyan

# Stop API
Write-Host "1. Deteniendo API..." -ForegroundColor Yellow
docker-compose stop backend-api

# Rebuild
Write-Host "2. Rebuilding imagen..." -ForegroundColor Yellow
docker-compose build backend-api

# Start
Write-Host "3. Iniciando API..." -ForegroundColor Yellow
docker-compose up -d backend-api

# Logs
Write-Host "4. Mostrando logs..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
docker-compose logs --tail 50 backend-api

Write-Host "`n✅ API actualizado!" -ForegroundColor Green
```

---

## 🎯 Recomendación para Task 9

### Durante Desarrollo (90% del tiempo)

```powershell
# Usar desarrollo local
.\dev-local.ps1

# Luego abrir Visual Studio y F5
# O ejecutar:
cd eprescription-API
dotnet watch run --project src/ePrescription.API
```

**Beneficios:**
- Cambios en código se reflejan automáticamente (hot reload)
- Puedes usar debugger
- Mucho más rápido

### Antes de Commit (10% del tiempo)

```powershell
# Validar con Docker
.\rebuild-docker.ps1

# Ejecutar validaciones
.\validate-implementation.ps1
```

---

## 📊 Comparación de Tiempos

| Acción | Local | Docker |
|--------|-------|--------|
| **Primer inicio** | 5 seg | 2-3 min |
| **Cambio de código** | Instantáneo | 2-3 min |
| **Debugging** | ✅ Completo | ❌ Limitado |
| **Hot reload** | ✅ Sí | ❌ No |

---

## 🔍 Troubleshooting

### Problema: API local no conecta a Oracle

**Solución:**
```powershell
# Verificar que Oracle esté corriendo
docker ps | Select-String "oracle"

# Probar conexión
docker exec eprescription-oracle-db sqlplus eprescription_user/EprescriptionPass123!@//localhost:1521/XEPDB1
```

### Problema: API local no conecta a Keycloak

**Solución:**
```powershell
# Verificar Keycloak
curl http://localhost:8080

# Verificar realm
curl http://localhost:8080/realms/eprescription
```

---

## 💡 Tips Pro

### 1. Usar dotnet watch

```powershell
# Hot reload automático
dotnet watch run --project src/ePrescription.API
```

### 2. Ver logs en tiempo real

```powershell
# Logs de infraestructura
docker-compose logs -f oracle-db keycloak
```

### 3. Limpiar y reiniciar

```powershell
# Si algo falla, reiniciar todo
docker-compose down
docker-compose up -d oracle-db keycloak
```

---

## ✅ Checklist Pre-Commit

Antes de hacer commit, SIEMPRE:

```powershell
# 1. Rebuild Docker
docker-compose build backend-api
docker-compose up -d backend-api

# 2. Validar
.\validate-implementation.ps1

# 3. Si todo pasa, commit
git add .
git commit -m "feat: ..."
git push
```

---

**Documento generado automáticamente**  
**Fecha**: 14 de Noviembre, 2025  
**Recomendación**: Desarrollo Local + Validación Docker
