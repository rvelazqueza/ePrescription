# Task 15.16 - Guía de Testing

## Fecha: 2025-11-24
## Estado: ✅ Código completado - Listo para testing

## 🎯 Objetivo
Guía para probar los cambios realizados en el Task 15.16 - Eliminación de datos mock del frontend.

## ⚠️ Errores Esperados en Desarrollo

### 1. **Errores de Conexión al Backend**

Si ves errores como:
```
Error al cargar prescripciones: HttpErrorResponse
Error al verificar prescripción por QR: HttpErrorResponse
```

**Causa**: El backend no está corriendo o no está accesible.

**Solución**:
```powershell
# Verificar que el backend esté corriendo
docker ps

# Si no está corriendo, iniciar con Docker
docker-compose up -d eprescription-api

# Verificar logs
docker logs eprescription-api
```

### 2. **Errores 404 - Endpoint No Encontrado**

Si ves errores como:
```
GET http://localhost:8000/api/prescriptions/qr/QR-123 404 (Not Found)
```

**Causa**: El endpoint no existe en el backend o la ruta es incorrecta.

**Solución**: Verificar que el backend tenga implementados los endpoints:
- `GET /api/prescriptions/qr/{qrCode}`
- `GET /api/prescriptions/{id}`
- `GET /api/prescriptions/search?status=Emitted`
- `POST /api/dispensations/register`

### 3. **Errores 401 - No Autorizado**

Si ves errores como:
```
GET http://localhost:8000/api/prescriptions/search 401 (Unauthorized)
```

**Causa**: No hay token de autenticación o el token expiró.

**Solución**:
1. Hacer login en la aplicación
2. Verificar que el interceptor de autenticación esté funcionando
3. Verificar que Keycloak esté corriendo

### 4. **Datos Vacíos**

Si la aplicación carga pero no muestra datos:

**Causa**: No hay datos en la base de datos.

**Solución**: Insertar datos de prueba en Oracle DB.

## 🧪 Plan de Testing

### Fase 1: Verificación de Compilación ✅

```powershell
cd eprescription-frontend
npm run build
```

**Resultado Esperado**: Compilación exitosa sin errores.

### Fase 2: Verificación de Backend

```powershell
# 1. Verificar que Docker esté corriendo
docker ps

# 2. Verificar logs del API
docker logs eprescription-api

# 3. Probar endpoint de health
curl http://localhost:8000/swagger/index.html
```

**Resultado Esperado**: 
- Contenedor `eprescription-api` corriendo
- Swagger UI accesible
- Sin errores en logs

### Fase 3: Testing de Componentes

#### 3.1 Testing de `verificar.component.ts`

**Escenario 1: Verificar por QR**
1. Navegar a `/dispensacion/verificar`
2. Ingresar un código QR válido
3. Click en "Verificar"

**Resultado Esperado**:
- Loading spinner aparece
- Se hace request a `/api/prescriptions/qr/{qrCode}`
- Se muestra información de la prescripción
- Se muestra estado de verificación

**Errores Posibles**:
- ❌ `Error al verificar prescripción por QR` → Backend no responde
- ❌ `Código QR no válido` → QR no existe en DB

#### 3.2 Testing de `registrar.component.ts`

**Escenario 1: Cargar prescripciones disponibles**
1. Navegar a `/dispensacion/registrar`
2. Observar la carga inicial

**Resultado Esperado**:
- Loading spinner aparece
- Se hace request a `/api/prescriptions/search?status=Emitted`
- Se muestra lista de prescripciones disponibles

**Errores Posibles**:
- ❌ `No se pudieron cargar las prescripciones disponibles` → Backend no responde
- ⚠️ Lista vacía → No hay prescripciones con status "Emitted" en DB

**Escenario 2: Seleccionar prescripción**
1. Click en una prescripción de la lista
2. Observar la carga de detalles

**Resultado Esperado**:
- Loading spinner aparece
- Se hace request a `/api/prescriptions/{id}`
- Se muestra formulario de dispensación con medicamentos

**Errores Posibles**:
- ❌ `No se pudieron cargar los detalles de la prescripción` → Backend no responde

**Escenario 3: Completar dispensación**
1. Seleccionar una prescripción
2. Revisar medicamentos
3. Click en "Completar Dispensación"
4. Confirmar

**Resultado Esperado**:
- Loading spinner aparece
- Se hace request a `POST /api/dispensations/register`
- Mensaje de éxito
- Vuelve a la lista de prescripciones

**Errores Posibles**:
- ❌ `Error al completar la dispensación` → Backend no responde o error en datos

## 🔧 Solución de Problemas Comunes

### Problema 1: "Cannot read property 'medications' of undefined"

**Causa**: La respuesta del backend no tiene la estructura esperada.

**Solución Temporal**: Agregar validaciones en el código:
```typescript
medications: prescription.medications?.map(...) || []
```

**Solución Permanente**: Verificar que el backend devuelva la estructura correcta.

### Problema 2: "Observable is not a function"

**Causa**: Servicio no inyectado correctamente.

**Solución**: Verificar que los servicios estén en el constructor:
```typescript
constructor(
  private prescripcionesService: PrescripcionesService,
  private dispensationService: DispensationService
) {}
```

### Problema 3: CORS Error

**Causa**: Backend no permite requests desde `localhost:4200`.

**Solución**: Verificar configuración de CORS en el backend:
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
```

## 📝 Checklist de Testing

### Pre-requisitos
- [ ] Backend corriendo en Docker
- [ ] Oracle DB con datos de prueba
- [ ] Keycloak corriendo
- [ ] Frontend compilando sin errores

### Testing Funcional
- [ ] Login funciona correctamente
- [ ] Navegación a `/dispensacion/verificar` funciona
- [ ] Navegación a `/dispensacion/registrar` funciona
- [ ] Verificación por QR hace request al backend
- [ ] Verificación por token hace request al backend
- [ ] Lista de prescripciones carga desde backend
- [ ] Selección de prescripción carga detalles desde backend
- [ ] Completar dispensación envía datos al backend

### Testing de Errores
- [ ] Error de conexión muestra mensaje apropiado
- [ ] QR inválido muestra mensaje apropiado
- [ ] Token inválido muestra mensaje apropiado
- [ ] Lista vacía muestra mensaje apropiado
- [ ] Error al completar muestra mensaje apropiado

### Testing de UX
- [ ] Loading spinners aparecen durante operaciones
- [ ] Mensajes de error son claros
- [ ] Mensajes de éxito son claros
- [ ] Navegación es intuitiva

## 🚀 Comandos Útiles para Testing

### Iniciar Todo el Stack
```powershell
# Iniciar backend y DB
docker-compose up -d

# Iniciar frontend
cd eprescription-frontend
npm start
```

### Ver Logs en Tiempo Real
```powershell
# Backend
docker logs -f eprescription-api

# Frontend (en la terminal donde corre npm start)
```

### Reiniciar Servicios
```powershell
# Reiniciar backend
docker-compose restart eprescription-api

# Reiniciar frontend (Ctrl+C y npm start de nuevo)
```

### Verificar Endpoints
```powershell
# Swagger UI
Start-Process "http://localhost:8000/swagger/index.html"

# Frontend
Start-Process "http://localhost:4200"
```

## 📊 Métricas de Éxito

### Compilación
- ✅ 0 errores de TypeScript
- ✅ 0 errores de compilación
- ✅ Build exitoso

### Runtime
- ✅ Aplicación carga sin errores de consola
- ✅ Requests al backend se completan exitosamente
- ✅ Datos se muestran correctamente en UI

### Funcionalidad
- ✅ Verificación de prescripciones funciona
- ✅ Registro de dispensaciones funciona
- ✅ Navegación entre componentes funciona

## 🎯 Próximos Pasos

1. **Testing Manual**: Probar cada flujo manualmente
2. **Insertar Datos de Prueba**: Agregar prescripciones en DB
3. **Verificar Endpoints**: Confirmar que todos los endpoints existen
4. **Ajustar Mapeos**: Si la estructura de datos del backend es diferente
5. **Testing End-to-End**: Probar flujo completo de dispensación

## 📞 Soporte

Si encuentras errores que no están documentados aquí:

1. Verificar logs del backend: `docker logs eprescription-api`
2. Verificar consola del navegador (F12)
3. Verificar Network tab para ver requests fallidos
4. Documentar el error con screenshots
5. Compartir logs para análisis

---

**Nota**: Es normal tener errores de conexión si el backend no está corriendo o no tiene los endpoints implementados. Los cambios de código están correctos, solo necesitan un backend funcional para testing completo.
