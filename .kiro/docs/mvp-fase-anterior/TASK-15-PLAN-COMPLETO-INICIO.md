# Task 15 - Plan Completo - Inicio de Ejecución

## Fecha: 2025-11-24
## Plan Seleccionado: Plan 3 - Completo (12-16 horas)

## 🎯 Objetivo General
Completar la integración del frontend Angular con el backend, eliminando todos los datos mock, implementando firma digital y agregando el asistente de IA.

## 📋 Subtasks Detallados

### ✅ FASE 1: Eliminar Mock Data (2-3 horas)

#### Subtask 15.16.1: Actualizar patient.service.ts
- **Archivo**: `eprescription-frontend/src/app/services/patient.service.ts`
- **Acción**: Eliminar `mockPrescriptions` (línea 444)
- **Conectar**: `getPrescriptionsByPatient()` con `prescripciones.service.ts`
- **Endpoint**: `POST /api/prescriptions/search?patientId={id}`

#### Subtask 15.16.2: Actualizar verificar.component.ts
- **Archivo**: `eprescription-frontend/src/app/pages/dispensacion/verificar/verificar.component.ts`
- **Acción**: Eliminar `mockPrescriptions` (línea 110)
- **Conectar**: Con `dispensation.service.ts` para verificación
- **Endpoint**: `POST /api/dispensations/verify`

#### Subtask 15.16.3: Actualizar registrar.component.ts
- **Archivo**: `eprescription-frontend/src/app/pages/dispensacion/registrar/registrar.component.ts`
- **Acción**: Eliminar `mockPrescriptionsForSelection` (línea 95)
- **Conectar**: Con `prescripciones.service.ts` para búsqueda
- **Endpoint**: `POST /api/prescriptions/search`

---

### 🔐 FASE 2: Firma Digital - Backend y Frontend (4-5 horas)

#### Subtask 15.13.1: Crear endpoints de firma en PrescriptionsController (Backend)
- **Archivo**: `eprescription-API/src/ePrescription.API/Controllers/PrescriptionsController.cs`
- **Endpoints a crear**:
  - `GET /api/prescriptions/pending-signature` - Obtener prescripciones pendientes de firma
  - `POST /api/prescriptions/{id}/sign` - Firmar una prescripción
  - `GET /api/prescriptions/signed` - Obtener prescripciones firmadas
  - `GET /api/prescriptions/{id}/signature-trail` - Obtener trazabilidad de firma

#### Subtask 15.13.2: Crear DTOs para firma digital (Backend)
- **Archivo**: `eprescription-API/src/ePrescription.Application/DTOs/PrescriptionDtos.cs`
- **DTOs a crear**:
  - `SignPrescriptionDto` - Para firmar prescripción
  - `SignatureDto` - Información de la firma
  - `SignatureTrailDto` - Trazabilidad de firma

#### Subtask 15.13.3: Crear commands/queries para firma (Backend)
- **Archivos a crear**:
  - `SignPrescriptionCommand.cs` y handler
  - `GetPendingSignatureQuery.cs` y handler
  - `GetSignedPrescriptionsQuery.cs` y handler
  - `GetSignatureTrailQuery.cs` y handler

#### Subtask 15.13.4: Actualizar firma.service.ts (Frontend)
- **Archivo**: `eprescription-frontend/src/app/services/firma.service.ts`
- **Acción**: Eliminar todos los datos mock (líneas 74-200+)
- **Conectar**: Con los nuevos endpoints del backend
- **Métodos a actualizar**:
  - `getPrescriptionsToSign()` → `GET /api/prescriptions/pending-signature`
  - `signPrescription()` → `POST /api/prescriptions/{id}/sign`
  - `getSignedPrescriptions()` → `GET /api/prescriptions/signed`
  - `getSignatureTrail()` → `GET /api/prescriptions/{id}/signature-trail`

#### Subtask 15.13.5: Probar firma digital end-to-end
- Crear prescripción
- Firmar prescripción
- Verificar firma
- Ver trazabilidad

---

### 🤖 FASE 3: Asistente de IA (6-8 horas)

#### Subtask 15.13.6: Crear interfaces TypeScript para AI
- **Archivo**: `eprescription-frontend/src/app/interfaces/ai-assistant.interfaces.ts`
- **Interfaces a crear**:
  - `ClinicalAnalysisRequest`
  - `ClinicalAnalysisResult`
  - `DiagnosisSuggestion`
  - `MedicationRecommendation`
  - `DrugInteraction`
  - `ContraindicationResult`

#### Subtask 15.13.7: Crear ai-assistant.service.ts
- **Archivo**: `eprescription-frontend/src/app/services/ai-assistant.service.ts`
- **Métodos a implementar**:
  - `analyzeClinicalDescription()` → `POST /api/aiassistant/analyze`
  - `getMedicationRecommendations()` → `POST /api/aiassistant/medications/recommend`
  - `checkDrugInteractions()` → `POST /api/aiassistant/medications/check-interactions`
  - `checkContraindications()` → `POST /api/aiassistant/medications/check-contraindications`
  - `getAnalysisHistory()` → `GET /api/aiassistant/history/{patientId}`

#### Subtask 15.13.8: Crear componente ai-assistant
- **Ubicación**: `eprescription-frontend/src/app/components/ai-assistant/`
- **Archivos a crear**:
  - `ai-assistant.component.ts`
  - `ai-assistant.component.html`
  - `ai-assistant.component.scss`
- **Funcionalidad**:
  - Input para descripción clínica
  - Botón de análisis
  - Lista de diagnósticos sugeridos (con CIE-10)
  - Lista de medicamentos recomendados
  - Alertas de interacciones
  - Alertas de contraindicaciones

#### Subtask 15.13.9: Integrar AI assistant en nueva-prescripcion
- **Archivo**: `eprescription-frontend/src/app/pages/prescripciones/nueva/nueva.component.ts`
- **Acción**:
  - Agregar panel colapsable del asistente
  - Permitir agregar diagnósticos sugeridos al formulario
  - Permitir agregar medicamentos recomendados al formulario
  - Mostrar alertas de interacciones antes de guardar
  - Validar contraindicaciones antes de guardar

#### Subtask 15.13.10: Crear estilos para AI assistant
- **Archivo**: `eprescription-frontend/src/app/components/ai-assistant/ai-assistant.component.scss`
- **Estilos**:
  - Panel colapsable
  - Lista de sugerencias
  - Badges para CIE-10
  - Alertas de interacciones (warning/danger)
  - Loading states
  - Animaciones suaves

---

### ✅ FASE 4: Pruebas y Validación (1-2 horas)

#### Subtask 15.17: Probar flujos end-to-end
- Login → Dashboard
- Crear prescripción completa
- Usar asistente de IA
- Firmar prescripción
- Verificar prescripción
- Dispensar prescripción

#### Subtask 15.18: Realizar pruebas de integración
- Verificar que no hay datos mock
- Verificar que todos los servicios usan el backend
- Verificar manejo de errores
- Verificar loading states

#### Subtask 15.19: Commit y push
- Revisar todos los cambios
- Commit con mensaje descriptivo
- Push a la rama feature/task-15-frontend-integration

---

## 🚀 Orden de Ejecución

1. **FASE 1** (Subtasks 15.16.1 - 15.16.3) - Eliminar mock data
2. **FASE 2** (Subtasks 15.13.1 - 15.13.5) - Firma digital
3. **FASE 3** (Subtasks 15.13.6 - 15.13.10) - Asistente de IA
4. **FASE 4** (Subtasks 15.17 - 15.19) - Pruebas y commit

## 📊 Progreso Actualizado

| Fase | Tiempo | Subtasks | Estado |
|------|--------|----------|--------|
| **Recetas Emitidas** | 45min | 1 | ✅ **COMPLETADO** |
| Fase 1 | 2-3h | 3 | ⏳ Pendiente |
| Fase 2 | 4-5h | 5 | ⏳ Pendiente |
| Fase 3 | 6-8h | 5 | ⏳ Pendiente |
| Fase 4 | 1-2h | 3 | ⏳ Pendiente |
| **Total** | **13-18h** | **16** | **~5% Completo** |

## ✅ Completado

### Recetas Emitidas - Integración con Backend
- ✅ Corregido status de `'Issued'` a `'active'`
- ✅ Actualizado mapeo de estados
- ✅ Corregido registrar.component.ts
- ✅ Corregido verificar.component.ts
- ✅ Corregido borradores.component.ts
- ✅ Listo para probar

**Ver**: `TASK-15-EMITIDAS-READY-TO-TEST.md`

## 🎯 Próximo Paso

**Probar Recetas Emitidas** y luego continuar con Borradores

¿Listo para probar?
