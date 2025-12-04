# Plan de Migración: Emitidas Component

## Estado Actual

El componente `emitidas.component.ts` actualmente usa **mock data hardcodeado** con 5 recetas de ejemplo.

### Mock Data Identificado

```typescript
recetas: RecetaEmitida[] = [
  // 5 recetas hardcodeadas con datos ficticios
  {
    id: 'RX-2025-001234',
    paciente: { nombre: 'Carlos Rodríguez Sánchez', ... },
    // ... más datos mock
  }
]
```

## Backend Disponible

✅ **Servicio ya configurado**: `PrescripcionesService`
✅ **Endpoints disponibles**:
- `GET /api/prescriptions/search` - Con filtros (patientId, doctorId, status, dates, pagination)
- `GET /api/prescriptions/{id}` - Detalle de prescripción
- `DELETE /api/prescriptions/{id}` - Eliminar/anular prescripción

## Plan de Migración

### Fase 1: Mapeo de Datos (15 min)

**Problema**: La interfaz local `RecetaEmitida` NO coincide con `PrescriptionDto` del backend.

**Diferencias clave**:

| Frontend (RecetaEmitida) | Backend (PrescriptionDto) |
|-------------------------|---------------------------|
| `paciente.nombre` | Necesita lookup a `/api/patients/{id}` |
| `paciente.cedula` | Necesita lookup a `/api/patients/{id}` |
| `medico.nombre` | Necesita lookup a `/api/doctors/{id}` |
| `diagnostico` (string) | `diagnoses[]` (array) |
| `medicamentos[].nombre` | `medications[].medicationName` ✅ |
| `estado` (emitida/dispensada/anulada) | `status` (string) |
| `farmacia` | No existe en backend |
| `fechaDispensacion` | No existe en backend |

**Solución**: Crear función de mapeo + llamadas adicionales para datos de paciente/médico.

### Fase 2: Integración con Backend (20 min)

#### 2.1 Cargar Prescripciones

```typescript
ngOnInit() {
  this.loadPrescriptions();
}

loadPrescriptions() {
  const params: SearchPrescriptionsParams = {
    status: 'Issued', // Solo recetas emitidas
    pageSize: 100 // Cargar todas
  };
  
  this.prescripcionesService.getPrescripciones(params)
    .subscribe({
      next: (response) => {
        this.mapPrescriptionsToRecetas(response.items);
      },
      error: (error) => {
        console.error('Error loading prescriptions:', error);
        // Mantener mock data como fallback
      }
    });
}
```

#### 2.2 Mapeo de Datos

```typescript
async mapPrescriptionsToRecetas(prescriptions: PrescriptionDto[]) {
  const recetas: RecetaEmitida[] = [];
  
  for (const p of prescriptions) {
    // Necesitamos cargar datos de paciente y médico
    const paciente = await this.loadPatientData(p.patientId);
    const medico = await this.loadDoctorData(p.doctorId);
    
    recetas.push({
      id: p.prescriptionNumber,
      paciente: {
        nombre: paciente.fullName,
        cedula: paciente.identificationNumber,
        edad: this.calculateAge(paciente.dateOfBirth),
        genero: paciente.gender === 'Male' ? 'M' : 'F'
      },
      diagnostico: p.diagnoses[0]?.description || 'Sin diagnóstico',
      medicamentos: p.medications.map(m => ({
        nombre: m.medicationName,
        dosis: m.dosage,
        cantidad: 0, // No disponible en backend
        frecuencia: m.frequency,
        duracion: `${m.duration} días`,
        estado: 'pendiente' // No disponible en backend
      })),
      fechaEmision: this.formatDate(p.prescriptionDate),
      fechaVencimiento: this.formatDate(p.expirationDate),
      estado: this.mapStatus(p.status),
      farmacia: null, // No disponible en backend
      fechaDispensacion: null, // No disponible en backend
      medico: {
        nombre: medico.fullName,
        especialidad: medico.specialtyName,
        codigoMedico: medico.licenseNumber,
        firmaDigital: true
      }
    });
  }
  
  this.recetas = recetas;
  this.filtrarRecetas();
  this.calcularEstadisticas();
}
```

### Fase 3: Funcionalidades Adicionales (15 min)

#### 3.1 Anular Receta

```typescript
confirmarAnularReceta() {
  if (this.recetaAAnular) {
    this.prescripcionesService.deletePrescripcion(this.recetaAAnular.id)
      .subscribe({
        next: () => {
          // Recargar lista
          this.loadPrescriptions();
          this.cerrarModalAnular();
        },
        error: (error) => {
          console.error('Error anulando receta:', error);
          alert('Error al anular la receta');
        }
      });
  }
}
```

#### 3.2 Filtros

Los filtros locales funcionarán igual, pero podemos optimizar enviando filtros al backend:

```typescript
filtrarRecetas() {
  const params: SearchPrescriptionsParams = {
    status: this.filtroEstado ? this.mapStatusToBackend(this.filtroEstado) : undefined,
    startDate: this.fechaDesde || undefined,
    endDate: this.fechaHasta || undefined
  };
  
  this.prescripcionesService.getPrescripciones(params)
    .subscribe({
      next: (response) => {
        this.mapPrescriptionsToRecetas(response.items);
        // Luego aplicar filtro de búsqueda local
        this.aplicarFiltroBusquedaLocal();
      }
    });
}
```

## Problemas Identificados

### 🔴 Problema 1: Datos Faltantes en Backend

El backend NO tiene:
- `farmacia` (dónde se dispensó)
- `fechaDispensacion` (cuándo se dispensó)
- `estado` de cada medicamento individual (dispensado/pendiente)
- `cantidad` de medicamentos

**Impacto**: 
- No podemos mostrar "Farmacia Sucre" en recetas dispensadas
- No podemos mostrar estado individual de medicamentos
- Estadísticas de "Parcialmente Dispensada" no funcionarán

**Solución Temporal**: 
- Mostrar estos campos como "No disponible" o null
- Documentar para futura implementación en backend

### 🔴 Problema 2: Múltiples Llamadas HTTP

Para cada prescripción necesitamos:
1. GET `/api/prescriptions/{id}`
2. GET `/api/patients/{patientId}`
3. GET `/api/doctors/{doctorId}`

**Impacto**: Performance - 3 llamadas por receta = 15 llamadas para 5 recetas

**Solución**:
- Cachear pacientes y médicos ya cargados
- O mejor: Pedir al backend que incluya datos relacionados en la respuesta

### 🟡 Problema 3: Formato de Fechas

Backend: `"2025-01-15T10:30:00Z"` (ISO 8601)
Frontend: `"15/01/2025"` (DD/MM/YYYY)

**Solución**: Función de formateo

```typescript
formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-ES');
}
```

## Estimación de Tiempo

| Tarea | Tiempo |
|-------|--------|
| Crear funciones de mapeo | 15 min |
| Integrar carga de datos | 20 min |
| Implementar anular receta | 10 min |
| Optimizar filtros | 10 min |
| Testing y ajustes | 15 min |
| **TOTAL** | **70 min (~1 hora)** |

## Decisión Requerida

**¿Procedemos con esta migración sabiendo que algunos datos no estarán disponibles?**

Opciones:
1. ✅ **Proceder** - Migrar con datos disponibles, marcar campos faltantes como "No disponible"
2. ❌ **Esperar** - Primero extender backend para incluir datos de dispensación
3. 🔄 **Híbrido** - Migrar pero mantener mock data como fallback si falla el backend

**Recomendación**: Opción 1 (Proceder) - Es mejor tener datos reales aunque incompletos que mock data.

## Siguiente Paso

¿Quieres que proceda con la implementación?
