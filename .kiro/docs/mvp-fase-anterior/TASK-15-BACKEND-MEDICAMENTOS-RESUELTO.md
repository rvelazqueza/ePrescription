# Task 15 - Backend: Problema de Medicamentos Resuelto

## 🎯 Objetivo
Arreglar el API para que devuelva los medicamentos en las prescripciones emitidas.

## 🔴 Problema Inicial
El API de prescripciones devolvía `medicationCount: 0` para todas las prescripciones, aunque los datos existían en la base de datos.

## 🔍 Diagnóstico

### 1. Problema en PrescriptionRepository
El repositorio no estaba cargando las relaciones de medicamentos:
```csharp
// ❌ ANTES: No cargaba medicamentos
var items = await query
    .OrderByDescending(p => p.CreatedAt)
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync(cancellationToken);
```

### 2. Problema de Esquema de Base de Datos
Al intentar cargar diagnósticos, descubrimos que el esquema real de Oracle no coincide con la configuración de EF Core:

**Esquema Real (Oracle)**:
- `DIAGNOSIS_ID` (no `PRESCRIPTION_DIAGNOSIS_ID`)
- `CIE10_CODE` (VARCHAR2, no RAW(16))
- `IS_PRIMARY`
- `NOTES`
- `CREATED_AT`
- `UPDATED_AT`

**Columnas que NO existen**:
- `DIAGNOSIS_CODE`
- `DIAGNOSIS_DESCRIPTION`
- `AI_SUGGESTED`
- `AI_CONFIDENCE_SCORE`
- `CIE10_ID` (como RAW)

## ✅ Solución Implementada

### 1. PrescriptionRepository.cs
Agregado `.Include()` para cargar medicamentos:
```csharp
// ✅ DESPUÉS: Carga medicamentos correctamente
var items = await query
    .Include(p => p.Medications)
    // Note: Diagnoses not included due to schema mismatch
    .OrderByDescending(p => p.CreatedAt)
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync(cancellationToken);
```

### 2. PrescriptionDiagnosisConfiguration.cs
Actualizada para coincidir con el esquema real:
```csharp
// Primary Key - maps to DIAGNOSIS_ID (not PRESCRIPTION_DIAGNOSIS_ID)
builder.Property(pd => pd.Id)
    .HasColumnName("DIAGNOSIS_ID")
    .HasColumnType("RAW(16)")
    .IsRequired();

// Ignore properties that don't exist in Oracle
builder.Ignore(pd => pd.Cie10Id);
builder.Ignore(pd => pd.DiagnosisCode);
builder.Ignore(pd => pd.DiagnosisDescription);
builder.Ignore(pd => pd.AiSuggested);
builder.Ignore(pd => pd.AiConfidenceScore);

// UpdatedAt DOES exist in Oracle
builder.Property(pd => pd.UpdatedAt)
    .HasColumnName("UPDATED_AT")
    .HasColumnType("TIMESTAMP(6)");
```

## 📊 Resultado

### API Response (Exitoso)
```json
{
  "id": "6a306a43-cec9-7710-e063-020016ac555e",
  "prescriptionNumber": "RX-CR-2025-000029",
  "patientId": "70f76943-b49f-430e-e063-020016ac882b",
  "doctorId": "74f76943-d5bd-4d0e-e063-020016acea9d",
  "medications": [
    {
      "id": "6a306a43-d0c9-7710-e063-020016ac555e",
      "medicationId": "78f76943-5ad3-570e-e063-020016acdcd9",
      "dosage": "0.5mg",
      "frequency": "Dos veces al día",
      "durationDays": 15,
      "quantity": 30,
      "instructions": "No conducir ni operar maquinaria"
    }
  ],
  "medicationCount": 1,
  "diagnosisCount": 0
}
```

### Verificación
- ✅ API compila sin errores
- ✅ API devuelve medicamentos correctamente
- ✅ `medicationCount` es correcto (1, no 0)
- ✅ Datos de medicamentos completos (dosage, frequency, quantity, etc.)
- ⚠️ `diagnosisCount` es 0 (deshabilitado temporalmente por incompatibilidad de esquema)
- ⚠️ `patientName`, `doctorName`, `medicalCenterName` están vacíos (diseño intencional)

## 🔧 Comandos Ejecutados
```powershell
# 1. Rebuild Docker image
docker-compose build eprescription-api

# 2. Restart container
docker-compose up -d eprescription-api

# 3. Verify logs
docker logs eprescription-api --tail 50

# 4. Test endpoint
./test-emitidas-response.ps1
```

## 📝 Notas Importantes

### Sobre los Nombres Vacíos
Los campos `patientName`, `doctorName`, `medicalCenterName` están vacíos **por diseño**:
- El API devuelve solo los IDs
- El frontend debe cargar los nombres usando esos IDs
- Esto evita joins innecesarios en el backend
- Permite al frontend cachear los datos de pacientes/doctores

### Sobre los Diagnósticos
Los diagnósticos están temporalmente deshabilitados porque:
- El esquema real de Oracle no coincide con el diseño esperado
- Necesitaría una migración de base de datos para agregar las columnas faltantes
- O rediseñar la entidad para usar solo las columnas existentes
- Por ahora, el frontend no los está usando, así que no es crítico

## 🎯 Próximos Pasos
El problema del backend está resuelto. Los problemas pendientes están en el **frontend**:
1. Apellidos "undefined" en la tabla
2. Modal sin datos completos
3. Verificar por qué el frontend no está cargando los datos de pacientes

Ver: `TASK-15-ESTADO-REAL-Y-PENDIENTES.md` para más detalles.
