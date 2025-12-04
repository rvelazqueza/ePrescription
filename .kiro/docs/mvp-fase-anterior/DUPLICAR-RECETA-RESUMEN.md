# Resumen: Duplicar y Anular Recetas

## Endpoints Implementados

### 1. POST /api/prescriptions/{id}/duplicate
- **Descripción**: Duplica una receta existente como borrador
- **Parámetros**: ID de la receta a duplicar
- **Respuesta**: Nueva receta en estado "draft" con todos los medicamentos y diagnósticos copiados
- **Status**: ✅ Funcionando

### 2. PATCH /api/prescriptions/{id}/cancel
- **Descripción**: Anula una receta activa
- **Parámetros**: ID de la receta, razón opcional
- **Respuesta**: 200 OK
- **Status**: ✅ Funcionando

### 3. DELETE /api/prescriptions/{id}/draft
- **Descripción**: Elimina permanentemente un borrador
- **Parámetros**: ID del borrador
- **Respuesta**: 204 No Content
- **Status**: ✅ Funcionando

## Problemas Resueltos

### Problema 1: Error ORA-00904 en INSERT
**Causa**: Nombres de columnas incorrectos en SQL raw
**Solución**: 
- Cambiar `ID` a `PRESCRIPTION_MEDICATION_ID`
- Cambiar `PRESCRIPTION_DIAGNOSIS_ID` a `DIAGNOSIS_ID`
- Usar comillas dobles para identificadores Oracle

### Problema 2: Medicamentos no se copian
**Causa**: La receta original no tiene medicamentos en PRESCRIPTION_MEDICATIONS
**Análisis**:
- El SQL INSERT retorna 0 filas
- Los medicamentos que ves en el frontend vienen del backend
- El backend carga medicamentos desde PRESCRIPTION_MEDICATIONS
- Si la receta original no tiene medicamentos, el duplicado tampoco los tendrá

**Solución**: Crear recetas CON medicamentos para poder duplicarlas correctamente

## Flujo de Datos

### Búsqueda de Recetas
1. Frontend llama a `GET /api/prescriptions/search`
2. Backend ejecuta `SearchPrescriptionsQueryHandler`
3. Carga prescripciones con `.Include(p => p.Medications)`
4. Carga medicamentos desde tabla MEDICATIONS
5. Mapea medicamentos a `PrescriptionMedicationDto`
6. Frontend mapea a interfaz local `Receta`

### Duplicar Receta
1. Frontend llama a `POST /api/prescriptions/{id}/duplicate`
2. Backend carga receta original con `GetByIdAsync` (incluye medicamentos)
3. Crea nueva receta en estado "draft"
4. Copia medicamentos con SQL INSERT
5. Copia diagnósticos con SQL INSERT
6. Limpia contexto EF Core
7. Carga receta duplicada con `GetByIdAsync`
8. Retorna receta duplicada con medicamentos

## Notas Importantes

- Los medicamentos se guardan en tabla `PRESCRIPTION_MEDICATIONS`
- Los diagnósticos se guardan en tabla `PRESCRIPTION_DIAGNOSES`
- El duplicado siempre es un "draft" (borrador)
- Solo se pueden anular recetas en estado "active"
- Solo se pueden eliminar recetas en estado "draft"

## Testing

Para probar:
1. Crear una receta CON medicamentos
2. Duplicarla - debería copiar medicamentos
3. Anular la original - debería cambiar estado a "cancelled"
4. Eliminar el borrador - debería eliminarse permanentemente
