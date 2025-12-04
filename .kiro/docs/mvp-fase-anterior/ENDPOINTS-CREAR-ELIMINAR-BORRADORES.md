# Endpoints para Crear y Eliminar Borradores

## 1. Crear Borrador

### Endpoint
```
POST /api/prescriptions/create-draft
```

### Descripción
Crea una nueva prescripción en estado "draft" (borrador) con datos iniciales.

### Request Body
```json
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "diagnoses": [
    {
      "cie10Code": "I10",
      "description": "Essential hypertension"
    }
  ],
  "medications": [
    {
      "medicationId": "uuid",
      "dosage": "500mg",
      "quantity": 30,
      "frequency": "2 veces al día",
      "durationDays": 30
    }
  ]
}
```

### Response (201 Created)
```json
{
  "id": "uuid",
  "prescriptionNumber": "RX-2025-000031",
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
  "createdAt": "2025-12-02T10:00:00Z",
  "updatedAt": "2025-12-02T10:00:00Z",
  "medications": [...],
  "diagnoses": [...]
}
```

### Errores
- 400: Datos inválidos o incompletos
- 404: Paciente o Médico no encontrado
- 409: Conflicto en los datos

---

## 2. Eliminar Borrador

### Endpoint
```
DELETE /api/prescriptions/{id}
```

### Descripción
Elimina una prescripción en estado "draft" (borrador). Solo se pueden eliminar borradores.

### Parámetros
- `id` (path): ID de la prescripción a eliminar

### Request Body
```json
{
  // Sin body requerido
}
```

### Response (204 No Content)
```
// Sin contenido
```

### Errores
- 404: Prescripción no encontrada
- 400: No se puede eliminar una prescripción que no está en estado draft
- 409: La prescripción ya ha sido emitida o dispensada

---

## Implementación en Backend

### Ubicación de archivos
- Controller: `eprescription-API/src/ePrescription.API/Controllers/PrescriptionsController.cs`
- Service: `eprescription-API/src/ePrescription.Application/Commands/Prescriptions/`
- Repository: `eprescription-API/src/ePrescription.Infrastructure/Persistence/Repositories/PrescriptionRepository.cs`

### Pasos de implementación

1. **Agregar métodos al repositorio**
   - `CreateDraftAsync(CreateDraftCommand command)`
   - `DeleteDraftAsync(Guid id)`

2. **Crear comandos CQRS**
   - `CreateDraftCommand`
   - `CreateDraftCommandHandler`
   - `DeleteDraftCommand`
   - `DeleteDraftCommandHandler`

3. **Agregar endpoints al controller**
   - `POST /api/prescriptions/create-draft`
   - `DELETE /api/prescriptions/{id}`

4. **Validaciones**
   - Crear: Validar que paciente y médico existan
   - Eliminar: Solo borradores, no emitidas ni dispensadas

---

## Frontend Integration

### Métodos a actualizar en `borradores.component.ts`

1. **crearBorrador()**
   - Mostrar modal/formulario para datos iniciales
   - Llamar a `POST /api/prescriptions/create-draft`
   - Agregar nuevo borrador a la lista
   - Mostrar notificación de éxito

2. **eliminarBorrador(borrador: Borrador)**
   - Confirmar eliminación
   - Llamar a `DELETE /api/prescriptions/{id}`
   - Remover borrador de la lista
   - Mostrar notificación de éxito

### Métodos a actualizar en `prescripciones.service.ts`

```typescript
// Crear borrador
crearBorrador(data: CreateDraftRequest): Observable<PrescriptionDto> {
  return this.http.post<PrescriptionDto>(
    `${this.apiUrl}/create-draft`,
    data
  );
}

// Eliminar borrador
eliminarBorrador(id: string): Observable<void> {
  return this.http.delete<void>(
    `${this.apiUrl}/${id}`
  );
}
```

---

## Flujo de Uso

### Crear Borrador
1. Usuario hace clic en "Nuevo Borrador"
2. Se abre modal con formulario
3. Usuario selecciona paciente, médico, diagnósticos y medicamentos
4. Se envía POST a `/api/prescriptions/create-draft`
5. Se agrega nuevo borrador a la lista
6. Se muestra notificación de éxito

### Eliminar Borrador
1. Usuario hace clic en botón "Eliminar" en un borrador
2. Se muestra confirmación
3. Se envía DELETE a `/api/prescriptions/{id}`
4. Se remueve borrador de la lista
5. Se muestra notificación de éxito

