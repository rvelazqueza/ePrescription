# Task 15 - Guía de Debugging para Recetas Emitidas

## 🐛 Problema Reportado

1. **Información del paciente viene como "undefined"**
2. **No se muestran medicamentos en las prescripciones**

## 🔍 Diagnóstico

Esto sugiere que el backend está devolviendo datos pero en un formato diferente al esperado, o que algunos campos están vacíos/null.

---

## 🧪 Paso 1: Probar el Endpoint Directamente

### Opción A: Usar PowerShell Script

```powershell
# Ejecutar el script de prueba
.\test-emitidas-response.ps1
```

Este script mostrará:
- ✅ La estructura completa de la respuesta
- ✅ Los campos disponibles en cada item
- ✅ Si faltan campos esperados

### Opción B: Usar curl

```powershell
curl http://localhost:8000/api/prescriptions/search?status=active&pageSize=10
```

### Opción C: Usar Postman

```
GET http://localhost:8000/api/prescriptions/search?status=active&pageSize=10
```

---

## 🔍 Paso 2: Revisar Logs del Frontend

### Abrir DevTools (F12) → Console

Ahora el componente tiene logs detallados:

```javascript
// Debe ver algo como:
✅ Prescripciones cargadas: {items: [...], totalCount: X}
📊 Total de items: X
🔍 Primera prescripción (muestra): {...}
  - PatientId: "guid-aqui" o undefined
  - Medications: [...] o undefined
  - Diagnoses: [...] o undefined

🔄 Mapeando prescripciones... X
📝 Mapeando prescripción: RX-XXXX
  - PatientId: "guid-aqui" o undefined
  - Medications count: X o 0
  - Diagnoses count: X o 0
  - Cargando datos del paciente...
  - Paciente cargado: "Nombre" o "No encontrado"
```

---

## 🔍 Paso 3: Identificar el Problema

### Caso 1: PatientId es undefined

**Síntoma**:
```
  - PatientId: undefined
  - ⚠️ PatientId inválido o faltante
```

**Causa**: El backend no está devolviendo el campo `patientId`

**Solución**: Verificar el DTO del backend

```csharp
// Backend - PrescriptionDto.cs
public class PrescriptionDto
{
    public Guid Id { get; set; }
    public string PrescriptionNumber { get; set; }
    public Guid PatientId { get; set; }  // ✅ Debe estar presente
    // ...
}
```

### Caso 2: Medications es undefined o vacío

**Síntoma**:
```
  - Medications count: 0
  - Medications: undefined
```

**Causa**: El backend no está incluyendo los medicamentos en la respuesta

**Solución**: Verificar que el backend incluye las relaciones

```csharp
// Backend - GetPrescriptionsQueryHandler.cs
var prescriptions = await _context.Prescriptions
    .Include(p => p.Medications)  // ✅ Debe incluir
    .Include(p => p.Diagnoses)    // ✅ Debe incluir
    .Where(p => p.Status == status)
    .ToListAsync();
```

### Caso 3: Nombres de campos diferentes

**Síntoma**: Los datos existen pero con nombres diferentes

**Frontend espera**:
```typescript
{
  patientId: "guid",
  medications: [...],
  diagnoses: [...]
}
```

**Backend podría estar enviando**:
```json
{
  "patient_id": "guid",  // ❌ snake_case
  "prescriptionMedications": [...],  // ❌ nombre diferente
  "prescriptionDiagnoses": [...]  // ❌ nombre diferente
}
```

**Solución**: Ajustar el mapeo en el backend o frontend

---

## 🛠️ Soluciones Posibles

### Solución 1: Verificar Backend DTO

```csharp
// eprescription-API/src/ePrescription.Application/DTOs/PrescriptionDtos.cs

public class PrescriptionDto
{
    public Guid Id { get; set; }
    public string PrescriptionNumber { get; set; }
    
    // ✅ CRÍTICO: Estos campos deben estar presentes
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    
    // ✅ CRÍTICO: Estas listas deben estar pobladas
    public List<PrescriptionDiagnosisDto> Diagnoses { get; set; }
    public List<PrescriptionMedicationDto> Medications { get; set; }
    
    public DateTime PrescriptionDate { get; set; }
    public DateTime ExpirationDate { get; set; }
    public string Status { get; set; }
}
```

### Solución 2: Verificar Query Handler

```csharp
// eprescription-API/src/ePrescription.Application/Queries/Prescriptions/SearchPrescriptionsQueryHandler.cs

public async Task<PaginatedResult<PrescriptionDto>> Handle(
    SearchPrescriptionsQuery request, 
    CancellationToken cancellationToken)
{
    var query = _context.Prescriptions
        .Include(p => p.PrescriptionMedications)  // ✅ Incluir
            .ThenInclude(pm => pm.Medication)
        .Include(p => p.PrescriptionDiagnoses)    // ✅ Incluir
        .AsQueryable();
    
    // Aplicar filtros...
    
    var items = await query
        .Select(p => new PrescriptionDto
        {
            Id = p.Id,
            PrescriptionNumber = p.PrescriptionNumber,
            PatientId = p.PatientId,  // ✅ Mapear
            DoctorId = p.DoctorId,    // ✅ Mapear
            
            // ✅ Mapear medicamentos
            Medications = p.PrescriptionMedications.Select(pm => new PrescriptionMedicationDto
            {
                MedicationId = pm.MedicationId,
                MedicationName = pm.Medication.Name,
                Dosage = pm.Dosage,
                Frequency = pm.Frequency,
                Duration = pm.Duration
            }).ToList(),
            
            // ✅ Mapear diagnósticos
            Diagnoses = p.PrescriptionDiagnoses.Select(pd => new PrescriptionDiagnosisDto
            {
                Cie10Code = pd.Cie10Code,
                Description = pd.Description,
                IsPrimary = pd.IsPrimary
            }).ToList(),
            
            PrescriptionDate = p.PrescriptionDate,
            ExpirationDate = p.ExpirationDate,
            Status = p.Status
        })
        .ToListAsync(cancellationToken);
    
    return new PaginatedResult<PrescriptionDto>
    {
        Items = items,
        TotalCount = totalCount,
        // ...
    };
}
```

### Solución 3: Ajustar Mapeo en Frontend (si backend no se puede cambiar)

Si el backend envía los datos con nombres diferentes, ajustar el mapeo:

```typescript
// emitidas.component.ts

// Si el backend usa nombres diferentes
const receta: RecetaEmitida = {
  id: p.prescriptionNumber || p.id,
  paciente: {
    // Intentar diferentes nombres de campo
    nombre: paciente?.fullName || paciente?.name || 'Paciente no encontrado',
    cedula: paciente?.identificationNumber || paciente?.idNumber || 'N/A',
    // ...
  },
  // Intentar diferentes nombres para medicamentos
  medicamentos: (p.medications || p.prescriptionMedications || []).map(m => ({
    nombre: m.medicationName || m.name,
    dosis: m.dosage || m.dose,
    // ...
  })),
  // Intentar diferentes nombres para diagnósticos
  diagnostico: (p.diagnoses || p.prescriptionDiagnoses || [])[0]?.description || 'Sin diagnóstico'
};
```

---

## 📊 Checklist de Verificación

### Backend
- [ ] DTO tiene campo `PatientId`
- [ ] DTO tiene lista `Medications`
- [ ] DTO tiene lista `Diagnoses`
- [ ] Query incluye `.Include(p => p.PrescriptionMedications)`
- [ ] Query incluye `.Include(p => p.PrescriptionDiagnoses)`
- [ ] Mapeo en Select incluye todos los campos
- [ ] Nombres de campos coinciden con frontend (camelCase)

### Frontend
- [ ] Logs muestran la estructura de datos recibida
- [ ] PatientId no es undefined
- [ ] Medications no es undefined o vacío
- [ ] Diagnoses no es undefined o vacío
- [ ] Mapeo maneja casos donde datos faltan

---

## 🧪 Pruebas

### 1. Verificar Respuesta del Backend

```powershell
# Ejecutar script de prueba
.\test-emitidas-response.ps1

# Debe mostrar:
✅ PatientId: guid-valido
✅ Medications: X medicamentos
✅ Diagnoses: X diagnósticos
```

### 2. Verificar Logs del Frontend

```
F12 → Console

Debe ver:
✅ PatientId: "guid-valido"
✅ Medications count: X (mayor a 0)
✅ Diagnoses count: X (mayor a 0)
✅ Paciente cargado: "Nombre del Paciente"
```

### 3. Verificar Vista

```
✅ Se muestra nombre del paciente (no "undefined")
✅ Se muestra cédula del paciente
✅ Se muestra cantidad de medicamentos
✅ Se puede abrir modal de detalles
✅ Modal muestra medicamentos
```

---

## 📞 Próximos Pasos

1. **Ejecutar el script de prueba**: `.\test-emitidas-response.ps1`
2. **Revisar logs en consola del navegador** (F12)
3. **Compartir los resultados** para identificar el problema exacto
4. **Aplicar la solución correspondiente**

---

## 💡 Tip

Si el backend está devolviendo datos pero con nombres diferentes, es más rápido ajustar el mapeo en el frontend que cambiar el backend. Pero lo ideal es que ambos usen los mismos nombres (camelCase).

