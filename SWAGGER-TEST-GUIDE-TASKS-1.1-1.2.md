# Guía de Prueba en Swagger - Tareas 1.1 y 1.2

## Acceso a Swagger

1. Abre tu navegador en: **http://localhost:8000/index.html**

## Endpoints para Probar

### 1. Crear Prescripción en Borrador (Tarea 1.1)

**Endpoint:** `POST /api/prescriptions/draft`

**Descripción:** Crea una prescripción en estado borrador con validación de prescription pad.

**Request Body:**
```json
{
  "patientId": "550e8400-e29b-41d4-a716-446655440001",
  "doctorId": "550e8400-e29b-41d4-a716-446655440002",
  "medicalCenterId": "550e8400-e29b-41d4-a716-446655440003",
  "padId": "550e8400-e29b-41d4-a716-446655440004",
  "medications": [
    {
      "medicationId": "550e8400-e29b-41d4-a716-446655440005",
      "dosage": "500mg",
      "frequency": "Cada 8 horas",
      "durationDays": 7,
      "administrationRouteId": "550e8400-e29b-41d4-a716-446655440006",
      "quantity": 21,
      "instructions": "Tomar con agua",
      "aiSuggested": false
    }
  ],
  "diagnoses": [
    {
      "cie10Code": "J06.9",
      "isPrimary": true,
      "notes": "Infección respiratoria"
    }
  ],
  "notes": "Paciente con síntomas de resfriado"
}
```

**Validaciones Implementadas:**
- ✅ Verifica que el prescription pad existe
- ✅ Verifica que el pad pertenece al doctor
- ✅ Verifica que el pad no está expirado
- ✅ Verifica que el pad tiene disponibilidad
- ✅ Crea automáticamente un prescription slip (boleta)

**Response Esperado:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440007",
  "prescriptionNumber": "RX-2025-000001",
  "status": "draft",
  "patientId": "550e8400-e29b-41d4-a716-446655440001",
  "doctorId": "550e8400-e29b-41d4-a716-446655440002",
  "medications": [...],
  "diagnoses": [...]
}
```

---

### 2. Crear Prescripción (Emitir) (Tarea 1.2)

**Endpoint:** `POST /api/prescriptions`

**Descripción:** Emite una prescripción desde un borrador, decrementando la disponibilidad del pad y marcando el slip como usado.

**Request Body:**
```json
{
  "draftId": "550e8400-e29b-41d4-a716-446655440007",
  "padId": "550e8400-e29b-41d4-a716-446655440004"
}
```

**Validaciones Implementadas:**
- ✅ Verifica que el prescription pad existe
- ✅ Verifica que el pad pertenece al doctor
- ✅ Verifica que el pad no está expirado
- ✅ Verifica que el pad tiene disponibilidad
- ✅ Decrementa automáticamente la disponibilidad del pad
- ✅ Marca el prescription slip como usado

**Response Esperado:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440007",
  "prescriptionNumber": "RX-2025-000001",
  "status": "issued",
  "patientId": "550e8400-e29b-41d4-a716-446655440001",
  "doctorId": "550e8400-e29b-41d4-a716-446655440002"
}
```

---

### 3. Obtener Pads Disponibles

**Endpoint:** `GET /api/prescriptions/pads/available?doctorId={doctorId}`

**Descripción:** Obtiene los prescription pads disponibles para un doctor.

**Response Esperado:**
```json
{
  "doctorId": "550e8400-e29b-41d4-a716-446655440002",
  "pads": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "doctorId": "550e8400-e29b-41d4-a716-446655440002",
      "padTypeId": "550e8400-e29b-41d4-a716-446655440008",
      "totalCount": 50,
      "availableCount": 49,
      "expirationDate": "2025-12-31T23:59:59Z",
      "status": "active"
    }
  ],
  "totalAvailable": 49,
  "totalSlips": 50
}
```

---

## Flujo de Prueba Recomendado

1. **Primero:** Obtén los pads disponibles para un doctor
   ```
   GET /api/prescriptions/pads/available?doctorId=550e8400-e29b-41d4-a716-446655440002
   ```

2. **Segundo:** Crea una prescripción en borrador usando un pad disponible
   ```
   POST /api/prescriptions/draft
   ```

3. **Tercero:** Emite la prescripción desde el borrador
   ```
   POST /api/prescriptions
   ```

4. **Cuarto:** Verifica que la disponibilidad del pad disminuyó
   ```
   GET /api/prescriptions/pads/available?doctorId=550e8400-e29b-41d4-a716-446655440002
   ```

---

## Errores Esperados

### Error 404 - Pad no encontrado
```json
{
  "error": "Prescription pad not found: 550e8400-e29b-41d4-a716-446655440004"
}
```

### Error 400 - Pad no pertenece al doctor
```json
{
  "error": "Prescription pad does not belong to this doctor"
}
```

### Error 400 - Pad expirado
```json
{
  "error": "Prescription pad has expired"
}
```

### Error 400 - Pad sin disponibilidad
```json
{
  "error": "Prescription pad has no available count"
}
```

---

## Logging

Todos los eventos se registran en los logs del contenedor. Para ver los logs:

```bash
docker logs -f eprescription-api
```

Busca mensajes como:
- `Creating draft prescription - DoctorId: ...`
- `Draft prescription created successfully - PrescriptionNumber: ...`
- `Marked slip as used: ...`

---

## Notas Importantes

- Los IDs de ejemplo son UUIDs. Reemplázalos con IDs reales de tu base de datos.
- Asegúrate de que el doctor, paciente, medicamentos y diagnósticos existan en la base de datos.
- El prescription pad debe estar activo y no expirado.
- La disponibilidad del pad se decrementa automáticamente al emitir una prescripción.

