# Talonarios de Prescripciones - Requerimiento Crítico

## 🚨 Entidad Faltante Identificada

**Tabla**: `PRESCRIPTION_PADS` (Talonarios de Prescripciones)

**Prioridad**: **CRÍTICA** - Requerimiento regulatorio

**Identificado por**: Usuario (Control de cambios)

---

## 📋 Descripción

Los talonarios de prescripciones son documentos oficiales numerados que se asignan a los médicos para controlar y rastrear cada prescripción emitida. Es un requisito regulatorio en muchos países para:

1. **Trazabilidad**: Cada prescripción tiene un número único
2. **Control**: Limitar cantidad de prescripciones por talonario
3. **Auditoría**: Cumplimiento normativo
4. **Seguridad**: Prevenir falsificaciones

---

## 🗄️ Estructura de la Tabla

### PRESCRIPTION_PADS

```sql
CREATE TABLE PRESCRIPTION_PADS (
    ID RAW(16) PRIMARY KEY,
    DOCTOR_ID RAW(16) NOT NULL,
    PAD_NUMBER VARCHAR2(50) NOT NULL UNIQUE,
    START_NUMBER NUMBER(10) NOT NULL,
    END_NUMBER NUMBER(10) NOT NULL,
    CURRENT_NUMBER NUMBER(10) NOT NULL,
    ISSUED_DATE TIMESTAMP NOT NULL,
    EXPIRATION_DATE TIMESTAMP NOT NULL,
    STATUS VARCHAR2(20) NOT NULL,
    ISSUING_AUTHORITY VARCHAR2(200),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT FK_PRESCRIPTION_PADS_DOCTOR 
        FOREIGN KEY (DOCTOR_ID) REFERENCES DOCTORS(ID),
    
    CONSTRAINT CHK_PAD_STATUS 
        CHECK (STATUS IN ('Active', 'Exhausted', 'Expired', 'Cancelled')),
    
    CONSTRAINT CHK_PAD_NUMBERS 
        CHECK (START_NUMBER <= END_NUMBER AND CURRENT_NUMBER >= START_NUMBER)
);

CREATE INDEX IDX_PRESCRIPTION_PADS_DOCTOR ON PRESCRIPTION_PADS(DOCTOR_ID);
CREATE INDEX IDX_PRESCRIPTION_PADS_STATUS ON PRESCRIPTION_PADS(STATUS);
CREATE INDEX IDX_PRESCRIPTION_PADS_PAD_NUMBER ON PRESCRIPTION_PADS(PAD_NUMBER);
```

### Campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| ID | GUID | Identificador único |
| DOCTOR_ID | GUID | Médico asignado (FK) |
| PAD_NUMBER | VARCHAR(50) | Número del talonario (ej: "TAL-2024-001234") |
| START_NUMBER | INT | Número inicial del rango (ej: 1) |
| END_NUMBER | INT | Número final del rango (ej: 50) |
| CURRENT_NUMBER | INT | Próximo número a usar |
| ISSUED_DATE | TIMESTAMP | Fecha de emisión |
| EXPIRATION_DATE | TIMESTAMP | Fecha de vencimiento |
| STATUS | VARCHAR(20) | Active, Exhausted, Expired, Cancelled |
| ISSUING_AUTHORITY | VARCHAR(200) | Autoridad emisora |

---

## 🔗 Impacto en PRESCRIPTIONS

La tabla PRESCRIPTIONS debe agregar dos campos:

```sql
ALTER TABLE PRESCRIPTIONS ADD (
    PRESCRIPTION_PAD_ID RAW(16),
    PRESCRIPTION_NUMBER NUMBER(10),
    
    CONSTRAINT FK_PRESCRIPTIONS_PAD 
        FOREIGN KEY (PRESCRIPTION_PAD_ID) 
        REFERENCES PRESCRIPTION_PADS(ID)
);

CREATE INDEX IDX_PRESCRIPTIONS_PAD ON PRESCRIPTIONS(PRESCRIPTION_PAD_ID);
CREATE UNIQUE INDEX IDX_PRESCRIPTIONS_PAD_NUMBER 
    ON PRESCRIPTIONS(PRESCRIPTION_PAD_ID, PRESCRIPTION_NUMBER);
```

---

## ⚙️ Reglas de Negocio

### 1. Asignación de Talonarios

- Los talonarios son asignados por una autoridad sanitaria
- Cada talonario tiene un rango de números (ej: 1-50)
- Un médico puede tener múltiples talonarios activos

### 2. Validación Pre-Prescripción

Antes de crear una prescripción, el sistema DEBE validar:

```
✓ El médico tiene al menos un talonario activo
✓ El talonario no está vencido (ExpirationDate > NOW)
✓ Quedan números disponibles (CurrentNumber <= EndNumber)
✓ El talonario está en estado 'Active'
```

### 3. Creación de Prescripción

Al crear una prescripción:

```
1. Seleccionar talonario activo del médico
2. Asignar PrescriptionNumber = CurrentNumber
3. Incrementar CurrentNumber += 1
4. Si CurrentNumber > EndNumber:
   - Marcar talonario como 'Exhausted'
   - Notificar al médico
```

### 4. Estados del Talonario

| Estado | Descripción |
|--------|-------------|
| **Active** | Talonario vigente con números disponibles |
| **Exhausted** | Todos los números fueron usados |
| **Expired** | Fecha de vencimiento superada |
| **Cancelled** | Cancelado por autoridad (pérdida, robo, etc.) |

---

## 💻 Implementación en Código

### Entidad Domain

```csharp
public class PrescriptionPad : BaseEntity
{
    public Guid DoctorId { get; private set; }
    public string PadNumber { get; private set; }
    public int StartNumber { get; private set; }
    public int EndNumber { get; private set; }
    public int CurrentNumber { get; private set; }
    public DateTime IssuedDate { get; private set; }
    public DateTime ExpirationDate { get; private set; }
    public PadStatus Status { get; private set; }
    public string IssuingAuthority { get; private set; }
    
    // Navigation
    public Doctor Doctor { get; private set; }
    public ICollection<Prescription> Prescriptions { get; private set; }
    
    public bool IsAvailable()
    {
        return Status == PadStatus.Active 
            && CurrentNumber <= EndNumber 
            && ExpirationDate > DateTime.UtcNow;
    }
    
    public int GetNextNumber()
    {
        if (!IsAvailable())
            throw new InvalidOperationException("Talonario no disponible");
            
        var number = CurrentNumber;
        CurrentNumber++;
        
        if (CurrentNumber > EndNumber)
            Status = PadStatus.Exhausted;
            
        return number;
    }
}

public enum PadStatus
{
    Active,
    Exhausted,
    Expired,
    Cancelled
}
```

### Validación en CreatePrescriptionCommand

```csharp
public class CreatePrescriptionCommandHandler
{
    public async Task<Result> Handle(CreatePrescriptionCommand request)
    {
        // 1. Validar que el médico tiene talonarios disponibles
        var availablePad = await _padRepository
            .GetAvailablePadForDoctor(request.DoctorId);
            
        if (availablePad == null)
        {
            return Result.Failure(
                "El médico no tiene talonarios disponibles. " +
                "Debe solicitar un nuevo talonario antes de emitir prescripciones."
            );
        }
        
        // 2. Obtener número de prescripción
        var prescriptionNumber = availablePad.GetNextNumber();
        
        // 3. Crear prescripción
        var prescription = new Prescription(
            patientId: request.PatientId,
            doctorId: request.DoctorId,
            prescriptionPadId: availablePad.Id,
            prescriptionNumber: prescriptionNumber,
            // ... otros campos
        );
        
        // 4. Guardar cambios
        await _prescriptionRepository.AddAsync(prescription);
        await _padRepository.UpdateAsync(availablePad);
        await _unitOfWork.SaveChangesAsync();
        
        return Result.Success(prescription.Id);
    }
}
```

---

## 📊 Queries Útiles

### Talonarios Disponibles por Médico

```sql
SELECT * FROM PRESCRIPTION_PADS
WHERE DOCTOR_ID = :doctorId
  AND STATUS = 'Active'
  AND CURRENT_NUMBER <= END_NUMBER
  AND EXPIRATION_DATE > SYSDATE
ORDER BY ISSUED_DATE ASC;
```

### Talonarios Próximos a Agotarse

```sql
SELECT 
    pp.PAD_NUMBER,
    d.FIRST_NAME || ' ' || d.LAST_NAME AS DOCTOR_NAME,
    pp.CURRENT_NUMBER,
    pp.END_NUMBER,
    (pp.END_NUMBER - pp.CURRENT_NUMBER + 1) AS REMAINING
FROM PRESCRIPTION_PADS pp
JOIN DOCTORS d ON pp.DOCTOR_ID = d.ID
WHERE pp.STATUS = 'Active'
  AND (pp.END_NUMBER - pp.CURRENT_NUMBER + 1) <= 5
ORDER BY REMAINING ASC;
```

### Prescripciones por Talonario

```sql
SELECT 
    pp.PAD_NUMBER,
    COUNT(p.ID) AS TOTAL_PRESCRIPTIONS,
    MIN(p.PRESCRIPTION_NUMBER) AS FIRST_NUMBER,
    MAX(p.PRESCRIPTION_NUMBER) AS LAST_NUMBER
FROM PRESCRIPTION_PADS pp
LEFT JOIN PRESCRIPTIONS p ON pp.ID = p.PRESCRIPTION_PAD_ID
WHERE pp.ID = :padId
GROUP BY pp.PAD_NUMBER;
```

---

## 🎯 Tareas de Implementación

### Alta Prioridad:

1. ✅ Crear entidad `PrescriptionPad` en Domain
2. ✅ Crear configuración EF Core `PrescriptionPadConfiguration`
3. ✅ Agregar campos `PrescriptionPadId` y `PrescriptionNumber` a `Prescription`
4. ✅ Crear repositorio `IPrescriptionPadRepository`
5. ✅ Implementar validación en `CreatePrescriptionCommandHandler`
6. ✅ Crear endpoints REST para gestión de talonarios
7. ✅ Agregar scripts SQL de migración
8. ✅ Actualizar datos mock con talonarios de ejemplo

### Media Prioridad:

9. ✅ Crear DTOs para talonarios
10. ✅ Implementar queries de consulta de talonarios
11. ✅ Agregar notificaciones cuando talonarios están por agotarse
12. ✅ Implementar auditoría de asignación de talonarios

### Baja Prioridad:

13. ⏳ Dashboard de control de talonarios
14. ⏳ Reportes de uso de talonarios
15. ⏳ Integración con sistema de autoridad sanitaria

---

## 📝 Notas Regulatorias

### Normativas Aplicables:

- **FDA 21 CFR Part 11**: Registros electrónicos y firmas electrónicas
- **Normativas locales**: Cada país puede tener requisitos específicos
- **Trazabilidad**: Obligatoria para prescripciones controladas

### Auditoría Requerida:

- Registro de asignación de talonarios
- Registro de cada uso de número de talonario
- Alertas de talonarios vencidos o agotados
- Reporte de talonarios cancelados (pérdida/robo)

---

## ✅ Conclusión

La implementación de PRESCRIPTION_PADS es **CRÍTICA** y debe completarse antes del despliegue en producción. Sin esta tabla, el sistema no cumple con los requisitos regulatorios básicos para la emisión de prescripciones médicas.

**Impacto**: Alto
**Esfuerzo**: Medio (8-12 horas)
**Prioridad**: Crítica

