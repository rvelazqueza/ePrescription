# Task 12: Endpoints REST para Pacientes, Médicos y Farmacias

## Estado Inicial

**Fecha de Inicio**: 2025-11-20  
**Branch**: `feature/task-12-patients-doctors-pharmacies-api`  
**Base**: develop (con Task 11 mergeado - commit d4804f2)

## Objetivo

Implementar endpoints REST completos para la gestión de:
1. **Pacientes** (CRUD + búsqueda)
2. **Médicos** (CRUD + búsqueda por especialidad)
3. **Farmacias** (CRUD + búsqueda)

## Contexto

### Tareas Completadas Previamente

- ✅ Task 1-9: Infraestructura base, autenticación, autorización, auditoría
- ✅ Task 10: IA + WHO API + Traducción
- ✅ Task 11: Endpoints de Prescripciones (CRUD completo)

### Patrón a Seguir

Seguiremos el mismo patrón exitoso del Task 11:
- Clean Architecture (Domain → Application → Infrastructure → API)
- CQRS con MediatR
- DTOs con FluentValidation
- AutoMapper para mapeo
- Repository Pattern
- Paginación y filtros
- Autenticación JWT
- Autorización por roles
- Auditoría automática

## Subtareas del Task 12

### Pacientes (12.1 - 12.4)

- [ ] 12.1 Crear DTOs, validadores y mappers para pacientes
- [ ] 12.2 Crear commands/queries y handlers para pacientes (CRUD + búsqueda)
- [ ] 12.3 Crear PatientsController con endpoints
- [ ] 12.4 Probar endpoints de pacientes con Postman

### Médicos (12.5 - 12.8)

- [ ] 12.5 Crear DTOs, validadores y mappers para médicos
- [ ] 12.6 Crear commands/queries y handlers para médicos (CRUD + búsqueda por especialidad)
- [ ] 12.7 Crear DoctorsController con endpoints
- [ ] 12.8 Probar endpoints de médicos con Postman

### Farmacias (12.9 - 12.12)

- [ ] 12.9 Crear DTOs, validadores y mappers para farmacias
- [ ] 12.10 Crear commands/queries y handlers para farmacias (CRUD + búsqueda)
- [ ] 12.11 Crear PharmaciesController con endpoints
- [ ] 12.12 Probar endpoints de farmacias con Postman

### Funcionalidades Avanzadas (12.13 - 12.16)

- [ ] 12.13 Implementar búsqueda avanzada con múltiples filtros
- [ ] 12.14 Implementar paginación en todos los listados
- [ ] 12.15 Crear tests de integración para todos los endpoints
- [ ] 12.16 Commit y push de endpoints de pacientes, médicos y farmacias

## Entidades Existentes

### Patient (Domain)

```csharp
public class Patient : BaseEntity
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string IdentificationNumber { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; }
    public string BloodType { get; set; }
    public string Allergies { get; set; }
    public string EmergencyContact { get; set; }
    public string EmergencyPhone { get; set; }
    public Address Address { get; set; }
    public PhoneNumber PhoneNumber { get; set; }
    public Email Email { get; set; }
}
```

### Doctor (Domain)

```csharp
public class Doctor : BaseEntity
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public MedicalLicense MedicalLicense { get; set; }
    public Guid SpecialtyId { get; set; }
    public Specialty Specialty { get; set; }
    public PhoneNumber PhoneNumber { get; set; }
    public Email Email { get; set; }
    public List<DoctorMedicalCenter> DoctorMedicalCenters { get; set; }
}
```

### Pharmacy (Domain)

```csharp
public class Pharmacy : BaseEntity
{
    public string Name { get; set; }
    public string LicenseNumber { get; set; }
    public Address Address { get; set; }
    public PhoneNumber PhoneNumber { get; set; }
    public Email Email { get; set; }
    public string OperatingHours { get; set; }
}
```

## Endpoints a Implementar

### Patients API

```
POST   /api/patients                    - Crear paciente
GET    /api/patients/{id}               - Obtener por ID
PUT    /api/patients/{id}               - Actualizar
DELETE /api/patients/{id}               - Eliminar (soft delete)
POST   /api/patients/search             - Buscar con filtros
GET    /api/patients/identification/{number} - Por identificación
```

### Doctors API

```
POST   /api/doctors                     - Crear médico
GET    /api/doctors/{id}                - Obtener por ID
PUT    /api/doctors/{id}                - Actualizar
DELETE /api/doctors/{id}                - Eliminar (soft delete)
POST   /api/doctors/search              - Buscar con filtros
GET    /api/doctors/specialty/{specialtyId} - Por especialidad
GET    /api/doctors/license/{license}   - Por licencia médica
```

### Pharmacies API

```
POST   /api/pharmacies                  - Crear farmacia
GET    /api/pharmacies/{id}             - Obtener por ID
PUT    /api/pharmacies/{id}             - Actualizar
DELETE /api/pharmacies/{id}             - Eliminar (soft delete)
POST   /api/pharmacies/search           - Buscar con filtros
GET    /api/pharmacies/license/{license} - Por licencia
```

## Estructura de Archivos a Crear

### Application Layer

```
DTOs/
  ├── PatientDtos.cs
  ├── DoctorDtos.cs
  └── PharmacyDtos.cs

Validators/
  ├── PatientValidators.cs
  ├── DoctorValidators.cs
  └── PharmacyValidators.cs

Mappings/
  ├── PatientMappingProfile.cs
  ├── DoctorMappingProfile.cs
  └── PharmacyMappingProfile.cs

Commands/
  ├── Patients/
  │   ├── CreatePatientCommand.cs
  │   ├── CreatePatientCommandHandler.cs
  │   ├── UpdatePatientCommand.cs
  │   ├── UpdatePatientCommandHandler.cs
  │   ├── DeletePatientCommand.cs
  │   └── DeletePatientCommandHandler.cs
  ├── Doctors/
  │   └── (similar structure)
  └── Pharmacies/
      └── (similar structure)

Queries/
  ├── Patients/
  │   ├── GetPatientQuery.cs
  │   ├── GetPatientQueryHandler.cs
  │   ├── SearchPatientsQuery.cs
  │   └── SearchPatientsQueryHandler.cs
  ├── Doctors/
  │   └── (similar structure)
  └── Pharmacies/
      └── (similar structure)
```

### API Layer

```
Controllers/
  ├── PatientsController.cs
  ├── DoctorsController.cs
  └── PharmaciesController.cs
```

### Infrastructure Layer

```
Persistence/Repositories/
  ├── PatientRepository.cs (actualizar)
  ├── DoctorRepository.cs (actualizar)
  └── PharmacyRepository.cs (actualizar)
```

## Datos Mock Disponibles

Según Task 3, ya tenemos datos mock en Oracle:
- **50 pacientes** con contactos y alergias
- **30 médicos** con asignaciones a centros médicos
- **20 farmacias** con inventario

## Configuración de Keycloak

Usuarios de prueba disponibles:
- **doctor1** / doctor123 (rol: Doctor)
- **admin.user** / admin123 (rol: Admin)
- **pharmacist1** / pharmacist123 (rol: Pharmacist)
- **patient1** / patient123 (rol: Patient)

## Estrategia de Implementación

### Fase 1: Pacientes (Estimado: 5-6 horas)

1. Crear DTOs y validadores
2. Crear commands y queries con handlers
3. Crear controller
4. Probar con Postman

### Fase 2: Médicos (Estimado: 5-6 horas)

1. Crear DTOs y validadores
2. Crear commands y queries con handlers (incluir búsqueda por especialidad)
3. Crear controller
4. Probar con Postman

### Fase 3: Farmacias (Estimado: 4-5 horas)

1. Crear DTOs y validadores
2. Crear commands y queries con handlers
3. Crear controller
4. Probar con Postman

### Fase 4: Funcionalidades Avanzadas (Estimado: 2-3 horas)

1. Implementar búsqueda avanzada con múltiples filtros
2. Implementar paginación consistente
3. Crear tests de integración
4. Documentación y commit final

## Commits Recomendados

```bash
# Después de pacientes
git add .
git commit -m "feat(task-12): implement patients REST API with CRUD and search"
git push

# Después de médicos
git add .
git commit -m "feat(task-12): implement doctors REST API with specialty search"
git push

# Después de farmacias
git add .
git commit -m "feat(task-12): implement pharmacies REST API with CRUD"
git push

# Final
git add .
git commit -m "feat(task-12): add advanced search, pagination and integration tests"
git push
```

## Desarrollo con Docker

Según las reglas del proyecto, usaremos Docker para desarrollo:

```powershell
# Rebuild después de cambios
docker-compose build eprescription-api

# Reiniciar contenedor
docker-compose up -d eprescription-api

# Ver logs
docker logs -f eprescription-api

# Probar API
# Swagger: http://localhost:8000/swagger
```

## Validaciones Importantes

### Patient

- IdentificationNumber: único, requerido
- Email: formato válido
- PhoneNumber: formato válido
- DateOfBirth: fecha válida, no futuro
- Gender: valores permitidos

### Doctor

- MedicalLicense: único, requerido, formato válido
- SpecialtyId: debe existir en BD
- Email: formato válido
- PhoneNumber: formato válido

### Pharmacy

- LicenseNumber: único, requerido
- Email: formato válido
- PhoneNumber: formato válido
- OperatingHours: formato válido

## Autorización por Roles

### Patients

- CREATE: Admin, Doctor
- READ: Admin, Doctor, Pharmacist, Patient (solo su propio registro)
- UPDATE: Admin, Doctor
- DELETE: Admin

### Doctors

- CREATE: Admin
- READ: Admin, Doctor, Pharmacist
- UPDATE: Admin, Doctor (solo su propio registro)
- DELETE: Admin

### Pharmacies

- CREATE: Admin
- READ: Admin, Doctor, Pharmacist
- UPDATE: Admin, Pharmacist (solo su propia farmacia)
- DELETE: Admin

## Auditoría

Todas las operaciones CRUD deben registrarse en audit_logs:
- Creación de paciente/médico/farmacia
- Actualización de datos
- Eliminación (soft delete)
- Búsquedas sensibles

## Próximos Pasos

1. Comenzar con subtarea 12.1 (DTOs de pacientes)
2. Seguir el patrón del Task 11
3. Hacer commits frecuentes
4. Probar cada endpoint antes de continuar
5. Documentar problemas encontrados

## Referencias

- **Task 11**: Patrón de implementación exitoso
- **Design.md**: Especificaciones de entidades
- **Requirements.md**: Requisitos funcionales
- **DOCKER-WORKFLOW-READY.md**: Guía de desarrollo con Docker

---

**Estado**: ✅ RAMA CREADA Y LISTA  
**Próximo**: Comenzar con subtarea 12.1
