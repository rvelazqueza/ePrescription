# 🧪 Cómo Probar el Dashboard con Datos Reales

## Inicio Rápido (5 minutos)

### 1. Iniciar el Sistema

```powershell
# Asegúrate de estar en la raíz del proyecto
cd C:\Users\...\eprescription-system

# Iniciar Docker
docker-compose up -d

# Verificar que todo esté corriendo
docker ps
```

Deberías ver:
- ✅ eprescription-api
- ✅ eprescription-database
- ✅ keycloak

### 2. Iniciar el Frontend

```powershell
# En otra terminal
cd eprescription-frontend
npm start
```

Espera a que compile y abre: http://localhost:4200

### 3. Login

Usa cualquiera de estos usuarios:
- **doctor1** / Doctor123!
- **farmaceutico1** / Farmaceutico123!
- **enfermera1** / Enfermera123!

---

## 🎯 Qué Probar

### Test 1: KPIs Reales

1. **Login** como doctor1
2. **Observa** el Dashboard
3. **Verifica** que los KPIs muestren números reales:
   - Recetas hoy: Debería mostrar el número real
   - Pacientes atendidos: Total en sistema
   - Borradores pendientes: Número real de borradores

### Test 2: Cambio de Rol

1. En el Dashboard, usa el **selector de rol** (arriba)
2. **Cambia** a "Farmacéutico"
3. **Observa** que los KPIs cambian:
   - Dispensaciones hoy
   - Recetas verificadas
   - Stock bajo

### Test 3: Actividad Reciente

1. **Observa** la sección "Actividad Reciente"
2. **Verifica** que muestre las últimas 4 acciones
3. **Nota** los timestamps relativos:
   - "Hace 5 min"
   - "Hace 2h"
   - "Ayer"

### Test 4: Navegación

1. **Click** en cualquier KPI
2. **Verifica** que navegue a la vista correspondiente
3. **Regresa** al Dashboard
4. **Click** en un item de actividad reciente
5. **Verifica** la navegación

### Test 5: Crear Datos y Ver Actualización

1. **Ve** a "Nueva Prescripción"
2. **Crea** una prescripción nueva
3. **Regresa** al Dashboard
4. **Verifica** que el contador de "Recetas hoy" aumentó
5. **Verifica** que aparece en "Actividad Reciente"

---

## 🧪 Testing Avanzado

### Script Automático

```powershell
# Ejecuta el script de testing
.\test-dashboard-data.ps1
```

Este script verifica:
- ✅ Autenticación con Keycloak
- ✅ Endpoint de recetas emitidas
- ✅ Endpoint de borradores
- ✅ Endpoint de pacientes
- ✅ Endpoint de dispensaciones
- ✅ Actividad reciente

### Testing Manual de Endpoints

#### 1. Obtener Token

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/realms/eprescription/protocol/openid-connect/token" `
    -Method Post `
    -ContentType "application/x-www-form-urlencoded" `
    -Body "grant_type=password&client_id=eprescription-app&client_secret=your-client-secret&username=doctor1&password=Doctor123!"

$token = $response.access_token
```

#### 2. Probar Recetas Hoy

```powershell
$today = (Get-Date).ToString("yyyy-MM-dd")
$headers = @{ "Authorization" = "Bearer $token" }

Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/search?status=Issued&startDate=$today&pageSize=1" `
    -Headers $headers
```

#### 3. Probar Borradores

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/search?status=Draft&pageSize=1" `
    -Headers $headers
```

#### 4. Probar Actividad Reciente

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/search?pageSize=4" `
    -Headers $headers
```

---

## 🔍 Qué Buscar

### ✅ Comportamiento Correcto

1. **KPIs muestran números reales** (no siempre 24, 18, 3, etc.)
2. **Actividad reciente muestra datos reales** (IDs reales, nombres reales)
3. **Timestamps son relativos** ("Hace X min" no "2024-01-15 10:30")
4. **Cambio de rol actualiza todo** (KPIs y actividad cambian)
5. **Navegación funciona** (click en KPIs lleva a vistas correctas)
6. **Sin errores en consola** (F12 para ver)

### ⚠️ Datos Mock Esperados

Estos datos **deberían** ser mock (es normal):
- Cambios "vs ayer" (muestra "N/A")
- Insights y recomendaciones
- Métricas del sistema
- Alertas clínicas (muestra 0)

### ❌ Problemas Comunes

#### Dashboard vacío o con errores

**Solución**:
```powershell
# Verifica que el backend esté corriendo
docker logs eprescription-api

# Verifica que Keycloak esté corriendo
docker logs keycloak

# Reinicia si es necesario
docker-compose restart
```

#### KPIs muestran 0

**Posibles causas**:
1. No hay datos en la base de datos
2. El backend no está respondiendo
3. Error de autenticación

**Solución**:
1. Crea algunas prescripciones primero
2. Verifica logs del backend
3. Verifica que el token sea válido

#### Timestamps no son relativos

**Causa**: Datos muy antiguos o muy nuevos

**Solución**: Normal, el formato cambia según la antigüedad:
- < 1 min: "Ahora"
- < 60 min: "Hace X min"
- < 24h: "Hace Xh"
- 1 día: "Ayer"
- < 7 días: "Hace X días"
- > 7 días: Fecha completa

---

## 📊 Escenarios de Prueba

### Escenario 1: Usuario Nuevo (Sin Datos)

**Esperado**:
- KPIs muestran 0
- Actividad reciente vacía
- Sin errores
- Mensaje amigable (opcional)

### Escenario 2: Usuario con Datos

**Esperado**:
- KPIs muestran números reales
- Actividad reciente con últimas 4 acciones
- Timestamps relativos
- Navegación funcional

### Escenario 3: Cambio de Rol

**Esperado**:
- KPIs cambian según el rol
- Actividad reciente cambia según el rol
- Sin delay notable (< 1 segundo)
- Sin errores

### Escenario 4: Error de Backend

**Esperado**:
- Dashboard muestra datos mock como fallback
- Sin pantalla vacía
- Mensaje de error en consola (F12)
- Usuario puede seguir navegando

---

## 🎯 Checklist de Validación

Marca cada item después de probarlo:

### Funcionalidad Básica
- [ ] Dashboard carga sin errores
- [ ] KPIs muestran números
- [ ] Actividad reciente muestra items
- [ ] Timestamps son relativos
- [ ] Navegación funciona

### Cambio de Rol
- [ ] Selector de rol funciona
- [ ] KPIs cambian al cambiar rol
- [ ] Actividad reciente cambia al cambiar rol
- [ ] Sin errores al cambiar

### Integración con Backend
- [ ] KPIs reflejan datos reales
- [ ] Actividad reciente muestra datos reales
- [ ] Crear prescripción actualiza dashboard
- [ ] Sin errores de autenticación

### Performance
- [ ] Dashboard carga rápido (< 2 segundos)
- [ ] Cambio de rol es rápido (< 1 segundo)
- [ ] Sin lag al navegar
- [ ] Sin múltiples requests innecesarios

### Manejo de Errores
- [ ] Backend caído: Muestra fallback
- [ ] Sin token: Redirige a login
- [ ] Datos vacíos: Muestra 0 sin errores
- [ ] Error de red: Mensaje apropiado

---

## 🐛 Debugging

### Ver Logs del Frontend

```
F12 → Console
```

Busca:
- ✅ "Loaded X prescriptions from backend"
- ✅ "Dashboard stats loaded for role: Médico"
- ❌ Errores en rojo

### Ver Logs del Backend

```powershell
docker logs -f eprescription-api
```

Busca:
- ✅ Requests a /api/prescriptions/search
- ✅ Responses con status 200
- ❌ Errores 500 o 401

### Ver Network Requests

```
F12 → Network → XHR
```

Verifica:
- ✅ Requests a /api/prescriptions/search
- ✅ Requests a /api/patients/search
- ✅ Requests a /api/dispensations/search
- ✅ Status 200 en todas

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs** (frontend y backend)
2. **Verifica que Docker esté corriendo**
3. **Asegúrate de tener datos** (crea prescripciones)
4. **Limpia caché del navegador** (Ctrl+Shift+R)
5. **Reinicia el sistema** si es necesario

---

## ✅ Resultado Esperado

Después de probar, deberías ver:

```
Dashboard:
├── ✅ KPIs con números reales
├── ✅ Actividad reciente con datos reales
├── ✅ Timestamps relativos legibles
├── ✅ Cambio de rol funcional
├── ✅ Navegación funcional
├── ⚠️ Algunos datos mock (documentados)
└── ✅ Sin errores en consola
```

---

**Tiempo de prueba**: 5-10 minutos
**Dificultad**: Fácil
**Resultado**: Dashboard funcional con datos reales

¡Disfruta probando el Dashboard! 🎉
