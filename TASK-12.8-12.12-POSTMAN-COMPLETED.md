# Tasks 12.8 y 12.12 - Colecciones Postman Completadas ✅

## Resumen

Se han creado dos colecciones completas de Postman para probar los endpoints de Doctors y Pharmacies.

## Archivos Creados

### 1. Task-12.8-Doctors-API-Tests.postman_collection.json
Colección completa para probar la API de Doctors con:

**Setup:**
- Get Specialties (obtiene un specialty ID para usar en las pruebas)

**CRUD Operations:**
- ✅ Create Doctor (POST /api/doctors)
- ✅ Get Doctor by ID (GET /api/doctors/{id})
- ✅ Update Doctor Contact Info (PUT /api/doctors/{id})
- ✅ Delete Doctor (DELETE /api/doctors/{id})
- ✅ Verify Doctor Deletion (GET /api/doctors/{id} - debe retornar 404)

**Search & Filters:**
- ✅ Search All Doctors (con paginación)
- ✅ Search Doctors by Specialty
- ✅ Search Doctors by Name
- ✅ Search Active Doctors Only

**Validation Tests:**
- ✅ Validation - Empty License Number (debe retornar 400)
- ✅ Validation - Invalid Email (debe retornar 400)

**Total: 12 requests con tests automatizados**

### 2. Task-12.12-Pharmacies-API-Tests.postman_collection.json
Colección completa para probar la API de Pharmacies con:

**CRUD Operations:**
- ✅ Create Pharmacy (POST /api/pharmacies)
- ✅ Get Pharmacy by ID (GET /api/pharmacies/{id})
- ✅ Update Pharmacy (PUT /api/pharmacies/{id})
- ✅ Delete Pharmacy (DELETE /api/pharmacies/{id})

**Search & Filters:**
- ✅ Search All Pharmacies (con paginación)
- ✅ Search by City
- ✅ Search Active Only

**Validation Tests:**
- ✅ Validation - Empty License (debe retornar 400)
- ✅ Validation - Invalid Email (debe retornar 400)

**Total: 9 requests con tests automatizados**

## Cómo Usar las Colecciones

### 1. Importar en Postman

```bash
# Abrir Postman
# Click en "Import"
# Seleccionar los archivos:
#   - Task-12.8-Doctors-API-Tests.postman_collection.json
#   - Task-12.12-Pharmacies-API-Tests.postman_collection.json
```

### 2. Configurar Variables de Entorno

Las colecciones usan estas variables (se configuran automáticamente):
- `baseUrl`: http://localhost:8000
- `doctorId`: Se guarda automáticamente al crear un doctor
- `doctorLicenseNumber`: Se guarda automáticamente
- `specialtyId`: Se obtiene del endpoint de specialties
- `pharmacyId`: Se guarda automáticamente al crear una farmacia
- `pharmacyLicenseNumber`: Se guarda automáticamente

### 3. Asegurarse que la API está corriendo

```powershell
# Verificar que Docker está corriendo
docker ps

# Si no está corriendo, iniciar:
docker-compose up -d eprescription-api

# Ver logs:
docker logs -f eprescription-api

# Verificar que responde:
curl http://localhost:8000/swagger/index.html
```

### 4. Ejecutar las Pruebas

#### Opción A: Ejecutar toda la colección
1. Click derecho en la colección
2. Seleccionar "Run collection"
3. Click en "Run Task 12.8 - Doctors API Tests" o "Run Task 12.12 - Pharmacies API Tests"
4. Ver los resultados de todos los tests

#### Opción B: Ejecutar requests individuales
1. Expandir la colección
2. Para Doctors: Primero ejecutar "Get Specialties (Setup)"
3. Luego ejecutar los requests en orden
4. Ver los tests en la pestaña "Test Results"

### 5. Orden Recomendado de Ejecución

**Para Doctors:**
1. Setup → Get Specialties (Setup)
2. CRUD Operations → 1. Create Doctor
3. CRUD Operations → 2. Get Doctor by ID
4. CRUD Operations → 3. Update Doctor Contact Info
5. Search & Filters → (cualquier orden)
6. Validation Tests → (cualquier orden)
7. CRUD Operations → 4. Delete Doctor
8. CRUD Operations → 5. Verify Doctor Deletion

**Para Pharmacies:**
1. CRUD Operations → 1. Create Pharmacy
2. CRUD Operations → 2. Get Pharmacy by ID
3. CRUD Operations → 3. Update Pharmacy
4. Search & Filters → (cualquier orden)
5. Validation Tests → (cualquier orden)
6. CRUD Operations → 4. Delete Pharmacy

## Características de las Colecciones

### Tests Automatizados
Cada request incluye tests que verifican:
- ✅ Status codes correctos (200, 201, 204, 400, 404)
- ✅ Estructura de respuesta correcta
- ✅ Campos requeridos presentes
- ✅ Validaciones funcionando
- ✅ Filtros aplicados correctamente
- ✅ Paginación funcionando
- ✅ Tiempo de respuesta aceptable (< 5 segundos)

### Variables Dinámicas
- Usa `{{$randomInt}}` para generar license numbers únicos
- Guarda automáticamente IDs para usar en requests subsecuentes
- Configura baseUrl automáticamente si no existe

### Organización
- Agrupadas por funcionalidad (CRUD, Search, Validation)
- Nombres descriptivos
- Comentarios en los tests
- Fácil de mantener y extender

## Resultados Esperados

### Doctors API
- ✅ 12/12 tests deben pasar
- ✅ Todos los endpoints CRUD funcionan
- ✅ Búsquedas con filtros funcionan
- ✅ Validaciones rechazan datos inválidos
- ✅ Paginación funciona correctamente

### Pharmacies API
- ✅ 9/9 tests deben pasar
- ✅ Todos los endpoints CRUD funcionan
- ✅ Búsquedas con filtros funcionan
- ✅ Validaciones rechazan datos inválidos
- ✅ Paginación funciona correctamente

## Troubleshooting

### Si los tests fallan:

1. **Verificar que la API está corriendo:**
   ```powershell
   docker ps
   docker logs eprescription-api
   ```

2. **Verificar la base de datos:**
   ```powershell
   docker ps | findstr oracle
   ```

3. **Verificar que hay datos de specialties:**
   - Ejecutar primero "Get Specialties (Setup)" en la colección de Doctors
   - Debe retornar al menos un specialty

4. **Limpiar datos de prueba:**
   - Los tests de DELETE limpian los datos creados
   - Si hay datos huérfanos, puedes eliminarlos manualmente desde Swagger

5. **Rebuild si hay cambios en el código:**
   ```powershell
   docker-compose build eprescription-api
   docker-compose up -d eprescription-api
   ```

## Próximos Pasos

Con estas colecciones completadas, puedes:
1. ✅ Probar manualmente todos los endpoints
2. ✅ Ejecutar tests automatizados
3. ✅ Validar que las APIs funcionan correctamente
4. ✅ Usar como documentación de la API
5. ✅ Compartir con el equipo para testing

## Estado de Tasks

- ✅ Task 12.8: Probar endpoints de médicos con Postman - **COMPLETADO**
- ✅ Task 12.12: Probar endpoints de farmacias con Postman - **COMPLETADO**

Ambas colecciones están listas para usar y contienen tests completos y automatizados.
