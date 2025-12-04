# Diagnóstico del Problema de IDs y Nombres

## Fecha: 2025-01-XX

## Problema Reportado
El usuario ve que en la UI de Angular (vista Emitidas) todos los pacientes tienen el mismo nombre, y sospecha que hay datos mock.

## Investigación Realizada

### 1. Verificación de Base de Datos
✅ **PRESCRIPTIONS**: Los IDs son ÚNICOS y CORRECTOS
- Cada prescripción tiene un PRESCRIPTION_ID diferente
- Cada prescripción tiene un PATIENT_ID diferente
- Los DOCTOR_ID se repiten (normal - un doctor puede tener varias prescripciones)

```
Ejemplo de datos reales:
PRESCRIPTION_ID: 436A306AC97A1077E063020016AC555E
PATIENT_ID: 4369F7709F0C0E43E063020016AC882B
DOCTOR_ID: 4369F774BDE70E4DE063020016ACEA9D
```

### 2. Verificación del Frontend
✅ **NO HAY DATOS MOCK** en el componente emitidas
- El componente llama al servicio real: `prescripcionesService.getPrescripciones()`
- El servicio llama al API real: `http://localhost:8000/api/prescriptions/search`
- Para cada prescripción, intenta cargar el paciente: `patientService.getPatientById(patientId)`

### 3. Flujo de Datos Actual

```
1. Frontend solicita prescripciones → API
2. API devuelve prescripciones con patientId (GUID)
3. Frontend intenta cargar cada paciente por ID
4. Si falla → muestra "Paciente no encontrado"
```

## Problema Identificado

❌ **DESAJUSTE DE NOMBRES DE COLUMNAS**

El código C# espera columnas con ciertos nombres, pero Oracle tiene nombres diferentes:

**Código espera:**
- `ID_NUMBER` 

**Oracle tiene:**
- ¿? (necesitamos verificar con DESC PATIENTS)

## Próximos Pasos

1. ✅ Ejecutar `DESC PATIENTS` para ver nombres reales de columnas
2. ⏳ Verificar configuración de EF Core en `PatientConfiguration.cs`
3. ⏳ Corregir mapeo de columnas si es necesario
4. ⏳ Probar que el API de pacientes devuelve datos correctos

## Archivos Relevantes

- Frontend: `eprescription-frontend/src/app/pages/prescripciones/emitidas/emitidas.component.ts`
- Servicio: `eprescription-frontend/src/app/services/prescripciones.service.ts`
- Backend Config: `eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/PatientConfiguration.cs`
- Repositorio: `eprescription-API/src/ePrescription.Infrastructure/Persistence/Repositories/PrescriptionRepository.cs`

## Conclusión Preliminar

**NO es un problema de datos mock.** Es un problema de mapeo entre:
- Los nombres de columnas en Oracle
- La configuración de EF Core
- Lo que el API devuelve al frontend

Una vez que verifiquemos la estructura real de PATIENTS, podremos corregir el mapeo.
