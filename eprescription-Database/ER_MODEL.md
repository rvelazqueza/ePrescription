# Modelo Entidad-Relación - ePrescription

## Diagrama de Entidades

Este documento describe el modelo entidad-relación completo del sistema ePrescription, normalizado en 4NF/5NF.

## Entidades Principales

### 1. Gestión de Pacientes
- **PATIENTS**: Información básica de pacientes
- **PATIENT_CONTACTS**: Contactos (email, teléfono, dirección) - 4NF
- **PATIENT_ALLERGIES**: Alergias y contraindicaciones

### 2. Gestión de Médicos
- **DOCTORS**: Información de médicos
- **SPECIALTIES**: Catálogo de especialidades médicas
- **DOCTOR_MEDICAL_CENTERS**: Asignaciones médico-centro (temporal) - 5NF

### 3. Centros Médicos
- **MEDICAL_CENTERS**: Hospitales, clínicas, consultorios
- **ADDRESSES**: Direcciones físicas (compartida)

### 4. Prescripciones
- **PRESCRIPTIONS**: Prescripciones médicas
- **PRESCRIPTION_DIAGNOSES**: Diagnósticos por prescripción (FK a CIE-10) - 4NF
- **PRESCRIPTION_MEDICATIONS**: Medicamentos por prescripción - 4NF
- **CIE10_CATALOG**: Catálogo oficial de diagnósticos CIE-10

### 5. Medicamentos
- **MEDICATIONS**: Catálogo de medicamentos
- **ADMINISTRATION_ROUTES**: Vías de administración
- **DRUG_INTERACTIONS**: Interacciones medicamentosas - 5NF

### 6. Farmacias e Inventario
- **PHARMACIES**: Farmacias registradas
- **INVENTORY**: Inventario por farmacia y lote
- **DISPENSATIONS**: Registro de dispensaciones
- **DISPENSATION_ITEMS**: Ítems dispensados por dispensación - 4NF

### 7. Seguridad
- **USERS**: Usuarios del sistema
- **ROLES**: Roles del sistema
- **PERMISSIONS**: Permisos granulares
- **USER_ROLES**: Asignación usuario-rol - 5NF
- **ROLE_PERMISSIONS**: Asignación rol-permiso - 5NF

### 8. Auditoría (INMUTABLE)
- **AUDIT_LOGS**: Registro de auditoría completo
- **AI_ANALYSIS_LOGS**: Logs de análisis de IA

## Relaciones Principales

### Prescripciones
```
PATIENTS (1) ----< (N) PRESCRIPTIONS (N) >---- (1) DOCTORS
                        |
                        +----< (N) PRESCRIPTION_DIAGNOSES (N) >---- (1) CIE10_CATALOG
                        |
                        +----< (N) PRESCRIPTION_MEDICATIONS (N) >---- (1) MEDICATIONS
```

### Dispensación
```
PRESCRIPTIONS (1) ----< (N) DISPENSATIONS (N) >---- (1) PHARMACIES
                                |
                                +----< (N) DISPENSATION_ITEMS
```

### Médicos y Centros
```
DOCTORS (N) ----< DOCTOR_MEDICAL_CENTERS >---- (N) MEDICAL_CENTERS
```

### Seguridad
```
USERS (N) ----< USER_ROLES >---- (N) ROLES (N) ----< ROLE_PERMISSIONS >---- (N) PERMISSIONS
```

## Normalización

### 4NF (Cuarta Forma Normal)
Aplicada en:
- **PATIENT_CONTACTS**: Separa tipos de contacto (email, phone, address)
- **PRESCRIPTION_DIAGNOSES**: Separa diagnósticos múltiples
- **PRESCRIPTION_MEDICATIONS**: Separa medicamentos múltiples
- **DISPENSATION_ITEMS**: Separa ítems dispensados

### 5NF (Quinta Forma Normal)
Aplicada en:
- **DOCTOR_MEDICAL_CENTERS**: Relación temporal many-to-many
- **DRUG_INTERACTIONS**: Relación pura entre medicamentos
- **USER_ROLES**: Relación pura usuario-rol
- **ROLE_PERMISSIONS**: Relación pura rol-permiso

## Índices Principales

### Búsqueda Rápida
- `idx_cie10_code`: Búsqueda por código CIE-10
- `idx_cie10_description`: Búsqueda por descripción (case-insensitive)
- `idx_prescription_number`: Búsqueda por número de prescripción
- `idx_patient_identification`: Búsqueda por cédula/identificación
- `idx_doctor_license`: Búsqueda por licencia médica

### Integridad Referencial
- Todas las foreign keys tienen índices automáticos
- Constraints de unicidad en códigos y números

### Performance
- Índices en campos de búsqueda frecuente
- Índices compuestos para queries complejas

## Constraints

### Unicidad
- Números de identificación (pacientes, médicos)
- Números de prescripción
- Códigos CIE-10
- Códigos de medicamentos
- Licencias médicas

### Integridad Referencial
- Todas las FK con ON DELETE RESTRICT (por defecto)
- Cascadas solo en tablas de detalle (ej: PRESCRIPTION_MEDICATIONS)

### Check Constraints
- Fechas válidas (expiration_date > prescription_date)
- Valores numéricos positivos (quantity, duration_days)
- Estados válidos (status en PRESCRIPTIONS, DISPENSATIONS)

## Triggers

### Auditoría Automática
- `trg_audit_immutable`: Previene UPDATE/DELETE en AUDIT_LOGS
- `trg_update_timestamp`: Actualiza updated_at automáticamente

### Validaciones
- `trg_validate_prescription_dates`: Valida fechas de prescripción
- `trg_check_drug_interactions`: Alerta sobre interacciones

## Tipos de Datos

### Identificadores
- **RAW(16)**: UUIDs para PKs (16 bytes = 128 bits)

### Texto
- **VARCHAR2**: Campos de texto variable
- **CLOB**: Campos de texto largo (notes, instructions)

### Numéricos
- **NUMBER(10,2)**: Cantidades con decimales
- **NUMBER(1)**: Booleanos (0/1)
- **NUMBER(5,4)**: Scores de confianza (0.0000-9.9999)

### Fechas
- **DATE**: Fechas sin hora
- **TIMESTAMP**: Fechas con hora precisa

## Consideraciones de Diseño

### Desnormalización Controlada
- `diagnosis_code` en PRESCRIPTION_DIAGNOSES (performance)
- `diagnosis_description` en PRESCRIPTION_DIAGNOSES (performance)

### Campos de Auditoría
- `created_at`: Timestamp de creación
- `updated_at`: Timestamp de última actualización
- `is_active`: Soft delete

### Campos de IA
- `ai_suggested`: Indica si fue sugerido por IA
- `ai_confidence_score`: Score de confianza de la IA

### Inmutabilidad
- **AUDIT_LOGS**: Completamente inmutable (trigger)
- **AI_ANALYSIS_LOGS**: Inmutable para trazabilidad

## Estimación de Tamaño

### Tablas Grandes (>100K registros)
- AUDIT_LOGS
- PRESCRIPTIONS
- PRESCRIPTION_MEDICATIONS
- CIE10_CATALOG

### Tablas Medianas (10K-100K registros)
- PATIENTS
- MEDICATIONS
- DISPENSATIONS

### Tablas Pequeñas (<10K registros)
- DOCTORS
- PHARMACIES
- SPECIALTIES
- ADMINISTRATION_ROUTES

## Estrategia de Particionamiento (Futuro)

Para tablas grandes, considerar:
- **AUDIT_LOGS**: Particionamiento por rango de fechas (mensual)
- **PRESCRIPTIONS**: Particionamiento por rango de fechas (anual)
- **DISPENSATIONS**: Particionamiento por rango de fechas (anual)

---

**Versión**: 1.0.0  
**Fecha**: 11 de noviembre de 2025  
**Normalización**: 4NF/5NF  
**Motor**: Oracle Database 21c Express Edition
