# 🧪 Cómo Probar Emitidas

## Opción 1: Script Automático (Recomendado)

```powershell
.\test-emitidas-endpoint.ps1
```

Este script verifica:
- ✅ Autenticación con Keycloak
- ✅ Búsqueda de prescripciones emitidas
- ✅ Carga de datos de pacientes
- ✅ Formato correcto de respuestas

---

## Opción 2: Prueba Manual en Navegador

### Paso 1: Iniciar Servicios

```powershell
docker-compose up -d
```

Espera a que todos los servicios estén listos (~30 segundos).

### Paso 2: Verificar Backend

Abre Swagger: http://localhost:8000/swagger

Verifica que el endpoint esté disponible:
- `GET /api/prescriptions/search`

### Paso 3: Abrir la Aplicación

```
http://localhost:4200/prescripciones/emitidas
```

### Paso 4: Verificar Funcionalidad

#### ✅ Carga de Datos
- Deberías ver recetas reales (no las 5 hardcodeadas)
- Si no hay recetas, verás "No hay recetas"
- Si hay error, verás mensaje de error con botón "Reintentar"

#### ✅ Filtros
1. **Búsqueda**: Escribe nombre de paciente o ID de receta
2. **Estado**: Selecciona "Emitida", "Dispensada", etc.
3. **Fechas**: Selecciona rango de fechas

#### ✅ Paginación
- Si hay más de 10 recetas, verás botones de paginación
- Navega entre páginas

#### ✅ Ver Detalles
- **Doble clic** en cualquier fila
- Se abre modal lateral con detalles completos
- Verifica que muestre:
  - Datos del paciente
  - Medicamentos
  - Fechas
  - Estado

#### ✅ Anular Receta
1. Click en botón de 3 puntos (⋮) en una receta con estado "Emitida"
2. Click en "Anular receta"
3. Confirma en el modal
4. La receta debería desaparecer o cambiar de estado
5. Verifica en backend que se eliminó

---

## Opción 3: Prueba con Postman/cURL

### 1. Obtener Token

```bash
curl -X POST http://localhost:8080/realms/eprescription/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=doctor" \
  -d "password=doctor123" \
  -d "grant_type=password" \
  -d "client_id=eprescription-client" \
  -d "client_secret=your-client-secret-here"
```

Guarda el `access_token`.

### 2. Buscar Prescripciones Emitidas

```bash
curl -X GET "http://localhost:8000/api/prescriptions/search?status=Issued&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Deberías ver:
```json
{
  "items": [...],
  "totalCount": X,
  "page": 1,
  "pageSize": 10
}
```

### 3. Obtener Datos de Paciente

```bash
curl -X GET "http://localhost:8000/api/patients/PATIENT_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Qué Esperar

### ✅ Comportamiento Correcto

1. **Primera carga**:
   - Spinner de carga aparece
   - Después de 1-2 segundos, aparecen las recetas
   - Estadísticas se actualizan

2. **Sin recetas**:
   - Mensaje: "No hay recetas"
   - Icono de documento vacío

3. **Error de backend**:
   - Mensaje: "Error al cargar las recetas"
   - Botón "Reintentar"

4. **Filtros**:
   - Respuesta inmediata al escribir
   - Contador actualizado

5. **Anular receta**:
   - Modal de confirmación
   - Recarga automática después de anular

### ❌ Problemas Comunes

#### "Error al cargar las recetas"
**Causa**: Backend no está corriendo o no hay conexión
**Solución**: 
```powershell
docker-compose restart eprescription-api
docker logs eprescription-api
```

#### "No hay recetas"
**Causa**: No hay prescripciones con estado "Issued" en la BD
**Solución**: Crear algunas prescripciones primero desde "Nueva Prescripción"

#### Datos de paciente no aparecen
**Causa**: Paciente no existe en la BD
**Solución**: Verificar que los IDs de pacientes en prescripciones sean válidos

---

## Verificación de Datos

### Comparar con Mock Data Anterior

**Antes** (Mock):
- Siempre 5 recetas
- Siempre los mismos nombres
- Anular no persistía

**Ahora** (Real):
- Cantidad variable según BD
- Nombres reales de pacientes
- Anular persiste en BD

### Verificar en Base de Datos

```sql
-- Ver prescripciones emitidas
SELECT * FROM PRESCRIPTIONS WHERE STATUS = 'Issued';

-- Ver pacientes
SELECT * FROM PATIENTS;

-- Verificar que anular funciona
-- (la prescripción debería desaparecer o cambiar estado)
```

---

## Checklist de Testing

```
□ Backend corriendo (docker-compose up -d)
□ Frontend corriendo (ng serve o http://localhost:4200)
□ Login funciona
□ Página carga sin errores
□ Se muestran recetas reales (no mock)
□ Filtros funcionan
□ Paginación funciona
□ Modal de detalles abre
□ Datos de paciente se cargan
□ Anular receta funciona
□ Error handling funciona (apagar backend y verificar)
□ Reintentar funciona después de error
```

---

## Troubleshooting

### Frontend no compila
```powershell
cd eprescription-frontend
npm install
ng serve
```

### Backend no responde
```powershell
docker-compose restart eprescription-api
docker logs -f eprescription-api
```

### Keycloak no autentica
```powershell
docker-compose restart keycloak
# Esperar 30 segundos
```

### Base de datos vacía
```powershell
# Crear datos de prueba
# (usar script de seed o crear manualmente)
```

---

## Contacto

Si encuentras problemas, documenta:
1. Qué estabas haciendo
2. Qué esperabas que pasara
3. Qué pasó en realidad
4. Logs de consola (F12 → Console)
5. Logs de backend (`docker logs eprescription-api`)
