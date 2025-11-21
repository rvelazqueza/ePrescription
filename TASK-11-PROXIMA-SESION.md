# Task 11: Comandos para Próxima Sesión

## 🚀 Inicio Rápido

```powershell
# 1. Verificar branch
git branch

# 2. Verificar Docker
docker ps

# 3. Buscar archivos con namespace incorrecto
Get-ChildItem -Path "eprescription-API/src" -Filter "*.cs" -Recurse | Select-String -Pattern "namespace ePrescription" | Select-Object Path -Unique
```

## 🔧 Corrección de Namespaces

### Archivos a Corregir
Cambiar `namespace ePrescription` por `namespace EPrescription` en:

```
eprescription-API/src/ePrescription.Application/Commands/Prescriptions/CreatePrescriptionCommandHandler.cs
eprescription-API/src/ePrescription.Application/Commands/Prescriptions/UpdatePrescriptionCommandHandler.cs
eprescription-API/src/ePrescription.Application/Mappings/PrescriptionMappingProfile.cs
eprescription-API/src/ePrescription.Application/Queries/Prescriptions/SearchPrescriptionsQueryHandler.cs
```

### Script de Búsqueda y Reemplazo
```powershell
# Buscar todos los archivos con namespace incorrecto
$files = Get-ChildItem -Path "eprescription-API/src" -Filter "*.cs" -Recurse | 
         Select-String -Pattern "^namespace ePrescription" | 
         Select-Object -ExpandProperty Path -Unique

# Mostrar archivos encontrados
$files | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }

# Reemplazar en cada archivo (REVISAR ANTES DE EJECUTAR)
foreach ($file in $files) {
    $content = Get-Content $file -Raw
    $newContent = $content -replace "namespace ePrescription", "namespace EPrescription"
    Set-Content -Path $file -Value $newContent -NoNewline
    Write-Host "Corregido: $file" -ForegroundColor Green
}
```

## ✅ Verificar Compilación

```powershell
# Navegar al proyecto
cd eprescription-API

# Limpiar build anterior
dotnet clean

# Compilar
dotnet build

# Si hay errores, guardarlos
dotnet build > build-errors.txt 2>&1
```

## 🚀 Iniciar API

```powershell
# Volver a raíz
cd ..

# Iniciar API con script
.\start-api-task11-fixed.ps1
```

## 🧪 Ejecutar Pruebas

### Pruebas Básicas (Sin Autenticación)
```powershell
# En otra terminal
.\test-task11-prescriptions.ps1
```

### Obtener Token de Keycloak
```powershell
$loginBody = @{
    username = "doctor@test.com"
    password = "Test123!"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -Body $loginBody `
    -ContentType "application/json"

$token = $response.accessToken
Write-Host "Token: $token"
```

### Probar Endpoint con Token
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Crear prescripción
$body = @{
    patientId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    doctorId = "3fa85f64-5717-4562-b3fc-2c963f66afa7"
    prescriptionDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    validUntil = (Get-Date).AddMonths(1).ToString("yyyy-MM-ddTHH:mm:ss")
    diagnoses = @(
        @{
            cie10Code = "J00"
            description = "Acute nasopharyngitis"
            isPrimary = $true
        }
    )
    medications = @(
        @{
            medicationId = "3fa85f64-5717-4562-b3fc-2c963f66afa8"
            dosage = "500mg"
            frequency = "Every 8 hours"
            duration = "7 days"
            administrationRoute = "Oral"
            instructions = "Take with food"
        }
    )
    notes = "Test prescription"
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/prescriptions" `
    -Method POST `
    -Headers $headers `
    -Body $body

$response | ConvertTo-Json -Depth 5
```

## 📝 Documentar Resultados

```powershell
# Crear archivo de resultados
@"
# Resultados de Pruebas - Task 11.12

## Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Compilación
- [ ] Exitosa
- [ ] Con errores

## Endpoints Probados
- [ ] POST /api/prescriptions
- [ ] GET /api/prescriptions/{id}
- [ ] PUT /api/prescriptions/{id}
- [ ] DELETE /api/prescriptions/{id}
- [ ] POST /api/prescriptions/search
- [ ] GET /api/prescriptions/patient/{id}
- [ ] GET /api/prescriptions/doctor/{id}
- [ ] GET /api/prescriptions/status/{status}

## Problemas Encontrados
(Describir aquí)

## Notas
(Notas adicionales)
"@ | Out-File "TASK-11-RESULTADOS-PRUEBAS.md"
```

## 🎯 Checklist de la Sesión

```markdown
- [ ] Corregir namespaces (EPrescription)
- [ ] Compilar proyecto exitosamente
- [ ] Iniciar API
- [ ] Ejecutar script de pruebas básicas
- [ ] Obtener token de Keycloak
- [ ] Probar POST /api/prescriptions
- [ ] Probar GET /api/prescriptions/{id}
- [ ] Probar PUT /api/prescriptions/{id}
- [ ] Probar DELETE /api/prescriptions/{id}
- [ ] Probar POST /api/prescriptions/search
- [ ] Probar endpoints adicionales
- [ ] Documentar resultados
- [ ] Marcar subtarea 11.12 como completada
- [ ] Continuar con subtarea 11.13 (tests de integración)
```

## 📚 Archivos de Referencia

- `TASK-11-TESTING-GUIDE.md` - Guía completa
- `TASK-11-TESTING-INSTRUCTIONS.md` - Instrucciones detalladas
- `TASK-11-ESTADO-ACTUAL.md` - Estado y bloqueadores
- `TASK-11-RESUMEN-SESION.md` - Resumen de esta sesión

## 🆘 Si Algo Sale Mal

### API no compila
```powershell
# Ver errores detallados
dotnet build --no-incremental > build-errors.txt 2>&1
type build-errors.txt
```

### API no inicia
```powershell
# Verificar .NET
dotnet --version

# Verificar Docker
docker ps

# Ver logs
docker logs eprescription-oracle-db
docker logs eprescription-keycloak
```

### No se puede obtener token
```powershell
# Verificar Keycloak
Invoke-RestMethod -Uri "http://localhost:8080/health/ready"

# Verificar usuarios en Keycloak
# (Usar admin console: http://localhost:8080)
```

## 💡 Tips

1. **Compilar frecuentemente** después de cada corrección
2. **Guardar logs** de errores para referencia
3. **Probar endpoints uno por uno** antes de automatizar
4. **Usar Postman** para pruebas interactivas
5. **Documentar todo** lo que encuentres

---

**¡Éxito en la próxima sesión!** 🚀
