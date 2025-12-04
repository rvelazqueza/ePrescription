# Estado Completo: Mock vs Real - ePrescription Frontend

## 📊 Resumen Ejecutivo

| Categoría | Total Vistas | Con Mock | Con Backend Real | % Completado |
|-----------|--------------|----------|------------------|--------------|
| **CRÍTICO (MVP)** | 5 | 4 | 1 | 20% |
| **IMPORTANTE** | 8 | 8 | 0 | 0% |
| **SECUNDARIO** | 15 | 15 | 0 | 0% |
| **TOTAL** | 28 | 27 | 1 | 3.6% |

---

## 🎯 FASE 1: MVP FUNCIONAL (CRÍTICO)

### 1. PRESCRIPCIONES ⭐⭐⭐ PRIORIDAD MÁXIMA

#### 1.1 Borradores (`borradores.component.ts`)
**Estado:** ✅ 100% Backend Real - COMPLETADO
**Archivo:** `eprescription-frontend/src/app/pages/prescripciones/borradores/borradores.component.ts`
**Documentación:** `TASK-15.19-BORRADORES-BACKEND-COMPLETADO.md`

**Implementación Completada:**
```typescript
loadDrafts() {
  this.prescripcionesService.getPrescripciones({ status: 'draft' }).subscribe({
    next: (prescriptions) => {
      this.borradores = this.mapPrescriptionsToBorradores(prescriptions);
      // ... actualizar UI
    }
  });
}
```

**Backend Conectado:** ✅ 
- Endpoint: `GET /api/prescriptions/search?status=draft`
- Service: `PrescripcionesService.getPrescripciones({ status: 'draft' })`

**Trabajo Completado:**
- [x] Eliminar array mock `borradores`
- [x] Implementar `loadDrafts()` con servicio real
- [x] Mapear `PrescriptionDto` → `Borrador`
- [x] Manejar estados de carga y error
- [x] Implementar operaciones CRUD (ver, editar, duplicar, eliminar)
- [x] UI con estados de carga y error
- **Tiempo Real:** ~2 horas ✅

---

#### 1.2 Nueva Prescripción (`nueva.component.ts`)
**Estado:** ⚠️ Parcialmente Mock
**Archivo:** `eprescription-frontend/src/app/pages/prescripciones/nueva/nueva.component.ts`

**Completado:**
- ✅ Servicios inyectados
- ✅ AI Assistant integrado (verificación de interacciones)
- ✅ `verificarConDrugBank()` conectado a backend real
- ✅ Búsqueda de pacientes real
- ⚠️ `cargarDatosBorrador()` incompleto
- ❌ No convierte medications del API
- ❌ `guardarCambios()` no persiste
- ❌ `finalizarPrescripcion()` no persiste

**Backend Disponible:** ✅
- `POST /api/prescriptions` - Crear
- `PUT /api/prescriptions/{id}` - Actualizar
- `GET /api/prescriptions/{id}` - Obtener
- `POST /api/AIAssistant/medications/check-interactions` - Verificar interacciones ✅

**Trabajo Requerido:**
- [ ] Completar `cargarDatosBorrador()`
- [ ] Implementar mapper medications
- [ ] Conectar `guardarCambios()` a `createPrescripcion()`
- [ ] Conectar `finalizarPrescripcion()` a `updatePrescripcion()`
- **Tiempo:** 2-3 horas

---

#### 1.3 Emitidas (`emitidas.component.ts`)
**Estado:** ❌ 100% Mock
**Archivo:** `eprescription-frontend/src/app/pages/prescripciones/emitidas/emitidas.component.ts`
**Línea:** 715-800+

**Datos Mock:**
```typescript
recetas: RecetaEmitida[] = [
  { id: 'RX-2025-001234', ... },
  { id: 'RX-2025-001235', ... },
  { id: 'RX-2025-009842', ... }
]
```

**Backend Disponible:** ✅
- Endpoint: `GET /api/prescriptions/search?status=issued`
- Service: `PrescripcionesService.getPrescripciones({ status: 'issued' })`

**Trabajo Requerido:**
- [ ] Eliminar array mock
- [ ] Implementar `loadIssuedPrescriptions()`
- [ ] Mapear datos del backend
- **Tiempo:** 2 horas

---

#### 1.4 Lista Principal (`prescripciones.component.ts`)
**Estado:** ❌ 100% Mock
**Archivo:** `eprescription-frontend/src/app/pages/prescripciones/prescripciones.component.ts`
**Línea:** 326+

**Backend Disponible:** ✅
- Endpoint: `GET /api/prescriptions/search`

**Trabajo Requerido:**
- [ ] Eliminar mock
- [ ] Implementar carga real
- **Tiempo:** 1-2 horas

---

### 2. PACIENTES ⭐⭐ CRÍTICO

#### 2.1 Lista de Pacientes (`lista.component.ts`)
**Estado:** ❌ Mock
**Archivo:** `eprescription-frontend/src/app/pages/pacientes/lista/lista.component.ts`

**Backend Disponible:** ✅
- Endpoint: `GET /api/patients/search`
- Service: `PatientService.searchPatients()`

**Trabajo Requerido:**
- [ ] Conectar a servicio real
- [ ] Implementar búsqueda real
- **Tiempo:** 2 horas

---

#### 2.2 Perfil de Paciente (`perfil.component.ts`)
**Estado:** ❌ 100% Mock
**Archivo:** `eprescription-frontend/src/app/pages/pacientes/perfil/perfil.component.ts`
**Línea:** 116+

**Datos Mock:**
```typescript
selectedPatient = {
  id: "PAT-001",
  nombre: "María Elena González Rodríguez",
  ...
}
```

**Backend Disponible:** ✅
- Endpoint: `GET /api/patients/{id}`
- Service: `PatientService.getPatientById()`

**Trabajo Requerido:**
- [ ] Eliminar mock
- [ ] Cargar desde route params
- [ ] Implementar carga real
- **Tiempo:** 1-2 horas

---

#### 2.3 Recetas del Paciente (`recetas.component.ts`)
**Estado:** ❌ 100% Mock
**Archivo:** `eprescription-frontend/src/app/pages/pacientes/recetas/recetas.component.ts`
**Línea:** 123-191

**Método Mock:**
```typescript
private loadMockData(): void {
  this.selectedPatient = { id: 'PAT-001', ... };
  this.prescriptions = [ ... ];
}
```

**Backend Disponible:** ✅
- Endpoint: `GET /api/prescriptions/search?patientId={id}`
- Service: `PrescripcionesService.getPrescriptionsByPatient()`

**Trabajo Requerido:**
- [ ] Eliminar `loadMockData()`
- [ ] Implementar carga real
- **Tiempo:** 1-2 horas

---

### 3. AUTENTICACIÓN ⭐⭐ CRÍTICO

#### 3.1 Login (`login.component.ts`)
**Estado:** ⚠️ Usa AuthService pero con mock
**Archivo:** `eprescription-frontend/src/app/pages/login/login.component.ts`
**Línea:** 86-88

**Problema:**
```typescript
const mockSignatureData = "mock-signature-data";
this.authService.validateGaudiSignature(cedula, mockSignatureData)
```

**Backend Disponible:** ✅
- Keycloak configurado
- AuthService implementado

**Trabajo Requerido:**
- [ ] Implementar firma GAUDI real
- [ ] Conectar a Keycloak real
- **Tiempo:** 2-3 horas

---

## 📋 FASE 2: MÓDULOS IMPORTANTES

### 4. MÉDICOS

#### 4.1 Lista de Médicos (`lista.component.ts`)
**Estado:** ⚠️ Usa DoctorService (verificar si es mock)
**Archivo:** `eprescription-frontend/src/app/pages/medicos/lista/lista.component.ts`
**Línea:** 99, 118

**Backend Disponible:** ✅
- Endpoint: `GET /api/doctors/search`
- Service: `DoctorService` (necesita verificación)

**Trabajo Requerido:**
- [ ] Verificar si DoctorService es mock o real
- [ ] Si es mock, conectar al backend
- **Tiempo:** 2-3 horas

---

#### 4.2 Editar Médico (`editar.component.ts`)
**Estado:** ⚠️ Similar a lista
**Archivo:** `eprescription-frontend/src/app/pages/medicos/editar/editar.component.ts`

**Trabajo Requerido:**
- [ ] Verificar y conectar
- **Tiempo:** 1-2 horas

---

### 5. INVENTARIO

#### 5.1 Alertas (`alertas.component.ts`)
**Estado:** ❌ Mock
**Archivo:** `eprescription-frontend/src/app/pages/inventario/alertas/alertas.component.ts`
**Línea:** 217

**Mock:**
```typescript
resolvedToday: Math.floor(Math.random() * 5)
```

**Backend Disponible:** ✅
- Endpoint: `GET /api/inventory/low-stock-alerts`
- Endpoint: `GET /api/inventory/expiring-stock-alerts`

**Trabajo Requerido:**
- [ ] Conectar a endpoints reales
- **Tiempo:** 2 horas

---

#### 5.2 Ajustes (`ajustes.component.ts`)
**Estado:** ❌ Mock
**Archivo:** `eprescription-frontend/src/app/pages/inventario/ajustes/ajustes.component.ts`
**Línea:** 577-581

**Mock:**
```typescript
previousStock: Math.floor(Math.random() * 1000) + 100,
unitCost: Math.random() * 2 + 0.1,
```

**Backend Disponible:** ✅
- Endpoint: `POST /api/inventory/add-stock`

**Trabajo Requerido:**
- [ ] Conectar a backend real
- **Tiempo:** 2 horas

---

### 6. DASHBOARD

#### 6.1 Dashboard Principal
**Estado:** ❌ Mock (según TASK-15.18)
**Archivo:** `eprescription-frontend/src/app/services/dashboard.service.ts`

**Backend Disponible:** ⚠️ Parcial
- Necesita endpoints de estadísticas

**Trabajo Requerido:**
- [ ] Implementar endpoints de estadísticas en backend
- [ ] Conectar dashboard a datos reales
- **Tiempo:** 3-4 horas

---

## 🔧 FASE 3: MÓDULOS SECUNDARIOS

### 7. SEGURIDAD (6 vistas)

#### 7.1 Usuarios (`usuarios.component.ts`)
**Estado:** ❌ 100% Mock
**Línea:** 837+
**Tiempo:** 2-3 horas

#### 7.2 Roles (`roles.component.ts`)
**Estado:** ❌ 100% Mock
**Línea:** 1505+
**Tiempo:** 2-3 horas

#### 7.3 Sesiones (`sesiones.component.ts`)
**Estado:** ❌ 100% Mock
**Línea:** 202+
**Tiempo:** 1-2 horas

#### 7.4 Mis Sesiones (`mis-sesiones.component.ts`)
**Estado:** ❌ 100% Mock
**Línea:** 381+
**Tiempo:** 1 hora

#### 7.5 Bloqueos (`bloqueos.component.ts`)
**Estado:** ❌ 100% Mock
**Línea:** 173+
**Tiempo:** 1-2 horas

#### 7.6 Aprobaciones (`aprobaciones.component.ts`)
**Estado:** ❌ 100% Mock
**Línea:** 490+
**Tiempo:** 2 horas

**Backend Disponible:** ⚠️ Parcial
- Keycloak para autenticación
- Necesita endpoints de gestión de usuarios

---

### 8. REPORTES (3 vistas)

#### 8.1 Exportar (`exportar.component.ts`)
**Estado:** ❌ Mock
**Línea:** 278+
**Tiempo:** 2 horas

#### 8.2 Actividad Médico (`actividad-medico.component.ts`)
**Estado:** ❌ Mock
**Línea:** 357+
**Tiempo:** 2 horas

#### 8.3 Actividad Farmacia (`actividad-farmacia.component.ts`)
**Estado:** ❌ Mock
**Línea:** 226+
**Tiempo:** 2 horas

**Backend Disponible:** ❌ No implementado
- Necesita endpoints de reportes

---

### 9. NOTIFICACIONES (2 vistas)

#### 9.1 Lista (`lista.component.ts`)
**Estado:** ❌ Mock
**Línea:** 413+
**Tiempo:** 1-2 horas

#### 9.2 Nueva (`nueva.component.ts`)
**Estado:** ❌ Mock
**Línea:** 474+
**Tiempo:** 1 hora

**Backend Disponible:** ❌ No implementado

---

### 10. INTEROPERABILIDAD

#### 10.1 FHIR IDs (`fhir-ids.component.ts`)
**Estado:** ❌ Mock
**Línea:** 509+
**Tiempo:** 2-3 horas

**Backend Disponible:** ❌ No implementado

---

### 11. MI PERFIL

#### 11.1 Mi Perfil (`mi-perfil.component.ts`)
**Estado:** ❌ Mock
**Línea:** 564+
**Tiempo:** 1-2 horas

**Backend Disponible:** ⚠️ Parcial (Keycloak)

---

## 📈 PLAN DE IMPLEMENTACIÓN MVP

### Semana 1: Módulos Críticos (15-20 horas)

**Día 1-2: Prescripciones (8-10h)**
1. Borradores (2-3h)
2. Nueva (3-4h)
3. Emitidas (2h)
4. Lista (1-2h)

**Día 3: Pacientes (4-6h)**
1. Lista (2h)
2. Perfil (1-2h)
3. Recetas (1-2h)

**Día 4: Auth + Dashboard (5-7h)**
1. Login (2-3h)
2. Dashboard (3-4h)

---

## 🎯 CRITERIOS DE ÉXITO MVP

### Funcionalidades Mínimas Requeridas:

✅ **Usuario puede:**
1. Iniciar sesión con Keycloak
2. Ver borradores reales de prescripciones
3. Crear nueva prescripción que se guarda en BD
4. Ver prescripciones emitidas reales
5. Buscar pacientes reales
6. Ver perfil de paciente real
7. Ver recetas de un paciente
8. Dashboard con estadísticas reales

❌ **Usuario NO puede (queda para después):**
- Gestionar usuarios/roles
- Ver reportes
- Gestionar notificaciones
- Usar FHIR
- Gestionar inventario completo

---

## 📝 CHECKLIST DE MIGRACIÓN POR COMPONENTE

### Template para cada componente:

```typescript
// ANTES (Mock)
data: Type[] = [ ...hardcoded data... ];

ngOnInit() {
  // Nada o mock
}

// DESPUÉS (Real)
data: Type[] = [];
isLoading = false;
error: string | null = null;

ngOnInit() {
  this.loadData();
}

private loadData() {
  this.isLoading = true;
  this.error = null;
  
  this.service.getData().subscribe({
    next: (data) => {
      this.data = this.mapData(data);
      this.isLoading = false;
    },
    error: (error) => {
      this.error = 'Error al cargar datos';
      this.isLoading = false;
      console.error('Error:', error);
    }
  });
}

private mapData(apiData: ApiDto[]): Type[] {
  return apiData.map(item => ({
    // Mapeo de API DTO a modelo del componente
  }));
}
```

---

## 🔍 SERVICIOS DISPONIBLES

### ✅ Servicios Implementados y Listos:

1. **AuthService** - `eprescription-frontend/src/app/services/auth.service.ts`
2. **PatientService** - `eprescription-frontend/src/app/services/patient.service.ts`
3. **PrescripcionesService** - `eprescription-frontend/src/app/services/prescripciones.service.ts`
4. **DispensationService** - `eprescription-frontend/src/app/services/dispensation.service.ts`
5. **InventoryService** - `eprescription-frontend/src/app/services/inventory.service.ts`
6. **PharmacyService** - `eprescription-frontend/src/app/services/pharmacy.service.ts`

### ⚠️ Servicios que Necesitan Verificación:

1. **DoctorService** - Verificar si es mock o real
2. **DashboardService** - Parcialmente implementado

### ❌ Servicios Faltantes:

1. **UserManagementService** - Para gestión de usuarios
2. **ReportsService** - Para reportes
3. **NotificationsService** - Para notificaciones
4. **FHIRService** - Para interoperabilidad

---

## 📊 RESUMEN DE ESTIMACIONES

| Fase | Módulos | Horas | Prioridad |
|------|---------|-------|-----------|
| **MVP (Fase 1)** | Prescripciones, Pacientes, Auth | 15-20h | ⭐⭐⭐ |
| **Importante (Fase 2)** | Médicos, Inventario, Dashboard | 8-12h | ⭐⭐ |
| **Secundario (Fase 3)** | Seguridad, Reportes, Otros | 15-20h | ⭐ |
| **TOTAL COMPLETO** | Todos los módulos | 38-52h | - |

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. **Empezar con Borradores** (más visible para el usuario)
2. **Continuar con Nueva Prescripción** (funcionalidad core)
3. **Seguir con Emitidas** (completar flujo de prescripciones)
4. **Pacientes** (necesario para prescripciones)
5. **Dashboard** (visibilidad general)

---

## 📌 NOTAS IMPORTANTES

- **Backend está 100% funcional** - Todos los endpoints necesarios para el MVP existen
- **Servicios están creados** - Solo falta usarlos en los componentes
- **El problema es SOLO en los componentes** - Tienen datos hardcodeados
- **La migración es mecánica** - Eliminar mock, agregar servicio, mapear datos
- **Testing es crítico** - Probar cada vista después de migrar

---

**Documento creado:** 2025-01-XX
**Última actualización:** 2025-01-XX - Borradores completado
**Estado:** 3.6% completado (1/28 vistas) - MVP en progreso

---

## 🎉 Últimas Actualizaciones

### ✅ Completado Recientemente:

**2025-01-15 - AI Assistant Integrado**
- ✅ Servicio `AIAssistantService` creado
- ✅ Verificación de interacciones medicamentosas conectada
- ✅ Método `verificarConDrugBank()` usando backend real
- ✅ Notificaciones de interacciones graves y moderadas
- ✅ Sin errores de compilación
- 📄 Ver: `AI-ASSISTANT-INTEGRADO.md`

**2025-01-15 - Nueva Prescripción Migrada**
- ✅ Búsqueda de pacientes conectada a backend real
- ✅ Eliminado mock data de pacientes
- ✅ Servicio `PatientService` integrado
- 📄 Ver: `NUEVA-PRESCRIPCION-MIGRADA-COMPLETADO.md`

**2025-01-XX - Borradores de Prescripciones**
- ✅ Eliminado mock data completamente
- ✅ Conectado a backend real (`GET /api/prescriptions/search?status=draft`)
- ✅ Implementado mapeo de DTOs
- ✅ Estados de carga y error
- ✅ Operaciones CRUD funcionales
- ✅ Compilación exitosa
- 📄 Ver: `TASK-15.19-BORRADORES-BACKEND-COMPLETADO.md`
