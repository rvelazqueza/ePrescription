# Endpoints para Duplicar y Anular Recetas

## 1. Duplicar Receta

### Endpoint
```
POST /api/prescriptions/{id}/duplicate
```

### Descripción
Crea una copia de una prescripción existente como borrador.

### Parámetros
- `id` (path): ID de la prescripción a duplicar

### Request Body
```json
{
  // Sin body requerido
}
```

### Response (201 Created)
```json
{
  "id": "uuid",
  "prescriptionNumber": "RX-2025-000030",
  "patientId": "uuid",
  "patientName": "Nombre Paciente",
  "patientIdNumber": "1-2345-6789",
  "patientAge": 45,
  "patientGender": "M",
  "doctorId": "uuid",
  "doctorName": "Dr. Nombre",
  "doctorSpecialty": "Medicina General",
  "doctorLicenseNumber": "MED-001",
  "status": "draft",
  "prescriptionDate": "2025-12-02",
  "expirationDate": null,
  "medications": [...],
  "diagnoses": [...]
}
```

### Errores
- 404: Prescripción no encontrada
- 400: No se puede duplicar una prescripción en estado draft

---

## 2. Anular Receta

### Endpoint
```
PATCH /api/prescriptions/{id}/cancel
```

### Descripción
Cambia el estado de una prescripción a "cancelled" (anulada).

### Parámetros
- `id` (path): ID de la prescripción a anular

### Request Body
```json
{
  "reason": "Razón de la anulación (opcional)"
}
```

### Response (200 OK)
```json
{
  "id": "uuid",
  "prescriptionNumber": "RX-2025-000029",
  "status": "cancelled",
  "cancelledAt": "2025-12-02T10:30:00Z",
  "cancelReason": "Razón de la anulación"
}
```

### Errores
- 404: Prescripción no encontrada
- 400: No se puede anular una prescripción en estado draft o cancelled
- 409: La prescripción ya ha sido dispensada

---

## Implementación en Backend

### Ubicación de archivos
- Controller: `eprescription-API/src/ePrescription.API/Controllers/PrescriptionsController.cs`
- Service: `eprescription-API/src/ePrescription.Application/Commands/Prescriptions/`
- Repository: `eprescription-API/src/ePrescription.Infrastructure/Persistence/Repositories/PrescriptionRepository.cs`

### Pasos de implementación

1. **Agregar métodos al repositorio**
   - `DuplicatePrescriptionAsync(Guid id)`
   - `CancelPrescriptionAsync(Guid id, string reason)`

2. **Crear comandos CQRS**
   - `DuplicatePrescriptionCommand`
   - `DuplicatePrescriptionCommandHandler`
   - `CancelPrescriptionCommand`
   - `CancelPrescriptionCommandHandler`

3. **Agregar endpoints al controller**
   - `POST /api/prescriptions/{id}/duplicate`
   - `PATCH /api/prescriptions/{id}/cancel`

4. **Validaciones**
   - Duplicar: Solo recetas emitidas, dispensadas o vencidas
   - Anular: Solo recetas emitidas (no draft, no cancelled, no dispensadas)

---

## Frontend Integration

### Métodos a actualizar en `buscar.component.ts`

1. **duplicarReceta(receta: Receta)**
   - Llamar a `POST /api/prescriptions/{id}/duplicate`
   - Agregar nueva receta a `todasLasRecetas`
   - Mostrar notificación de éxito

2. **anularReceta(receta: Receta)**
   - Llamar a `PATCH /api/prescriptions/{id}/cancel`
   - Actualizar estado en `todasLasRecetas`
   - Mostrar notificación de éxito

