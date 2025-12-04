# Cómo Probar el AI Assistant

## 🎯 Objetivo

Probar la integración del Asistente de IA en el componente Nueva Prescripción.

---

## 🚀 Inicio Rápido

### 1. Iniciar Backend con Docker

```powershell
# Iniciar todos los servicios
docker-compose up -d

# Ver logs del API
docker logs -f eprescription-api

# Verificar que está corriendo
docker ps
```

**Verificar que el API responde:**
```powershell
curl http://localhost:8000/swagger/index.html
```

### 2. Iniciar Frontend

```powershell
cd eprescription-frontend
npm start
```

**URL:** http://localhost:4200

---

## 🧪 Prueba Manual en la UI

### Paso 1: Login
1. Ir a: http://localhost:4200/login
2. Usar credenciales de médico:
   - Usuario: `doctor1`
   - Password: `Doctor123!`

### Paso 2: Nueva Prescripción
1. Navegar a: **Prescripciones → Nueva Receta**
2. URL: http://localhost:4200/prescripciones/nueva

### Paso 3: Seleccionar Paciente
1. Hacer clic en **"Seleccionar Paciente"**
2. Buscar un paciente (ej: "María")
3. Seleccionar de la lista

### Paso 4: Agregar Medicamentos
1. Hacer clic en **"Agregar Medicamento"**
2. Agregar primer medicamento:
   - Medicamento: Warfarina
   - Cantidad: 30 tabletas
   - Dosis: 5mg
   - Frecuencia: 1 vez al día
   - Vía: Oral
   - Duración: 30 días

3. Agregar segundo medicamento:
   - Medicamento: Aspirina
   - Cantidad: 30 tabletas
   - Dosis: 100mg
   - Frecuencia: 1 vez al día
   - Vía: Oral
   - Duración: 30 días

### Paso 5: Verificar Interacciones
1. Hacer clic en **"Verificar con DrugBank"**
2. Observar las notificaciones

**Resultados Esperados:**

**Caso 1: Sin IDs de medicamentos (actual)**
- Notificación azul: "Consultando AI Assistant"
- Notificación informativa: "Para verificar interacciones, los medicamentos deben estar registrados en el sistema"

**Caso 2: Con IDs de medicamentos (futuro)**
- Notificación azul: "Consultando AI Assistant"
- Si hay interacciones graves:
  - Notificación roja: "Interacciones graves detectadas"
  - Alertas en pantalla con detalles
- Si no hay interacciones:
  - Notificación verde: "No se encontraron interacciones"

---

## 🔧 Prueba con Script PowerShell

### Opción 1: Prueba Completa

```powershell
# 1. Login
.\test-login-final.ps1

# 2. Probar AI Assistant
.\test-ai-assistant.ps1
```

### Opción 2: Prueba Individual

```powershell
# Verificar interacciones
$token = (Get-Content last-token.json | ConvertFrom-Json).access_token

$body = @{
    medicationIds = @(
        "guid-medicamento-1",
        "guid-medicamento-2"
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/AIAssistant/medications/check-interactions" `
    -Method Post `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } `
    -Body $body
```

---

## 📊 Endpoints Disponibles

### 1. Verificar Interacciones
```http
POST /api/AIAssistant/medications/check-interactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "medicationIds": ["guid-1", "guid-2"]
}
```

### 2. Analizar Descripción Clínica
```http
POST /api/AIAssistant/analyze
Authorization: Bearer {token}
Content-Type: application/json

{
  "clinicalDescription": "Paciente con dolor de cabeza intenso",
  "patientId": "guid-optional"
}
```

### 3. Diagnóstico Rápido
```http
POST /api/AIAssistant/quick-diagnosis
Authorization: Bearer {token}
Content-Type: application/json

{
  "symptoms": ["fiebre", "tos", "dolor de garganta"]
}
```

### 4. Recomendaciones de Medicamentos
```http
POST /api/AIAssistant/medications/recommend
Authorization: Bearer {token}
Content-Type: application/json

{
  "diagnosisCodes": ["I10", "E11.9"],
  "patientAge": 45,
  "patientWeight": 70,
  "allergies": ["Penicilina"]
}
```

---

## 🐛 Troubleshooting

### Problema: "Token file not found"
**Solución:**
```powershell
.\test-login-final.ps1
```

### Problema: "API no responde"
**Solución:**
```powershell
# Verificar que el contenedor está corriendo
docker ps

# Ver logs
docker logs eprescription-api

# Reiniciar si es necesario
docker-compose restart eprescription-api
```

### Problema: "Se necesitan al menos 2 medicamentos"
**Solución:**
- Agregar al menos 2 medicamentos antes de verificar interacciones

### Problema: "Los medicamentos deben estar registrados"
**Explicación:**
- Los medicamentos agregados manualmente no tienen IDs del backend
- Esta es una limitación conocida
- Las alertas locales siguen funcionando

**Solución Futura:**
- Integrar búsqueda de medicamentos desde el backend
- Usar IDs reales de la tabla MEDICATIONS

---

## 📝 Notas Importantes

### Configuración Requerida

**Para análisis clínico con IA:**
- API key de Hugging Face
- Configurar en `appsettings.Local.json`

**Para traducción:**
- API key de DeepL
- Configurar en `appsettings.Local.json`

### Limitaciones Actuales

1. **IDs de Medicamentos:**
   - Los medicamentos agregados manualmente no tienen IDs
   - La verificación requiere IDs reales del backend

2. **APIs Externas:**
   - Hugging Face y DeepL requieren configuración
   - Sin configuración, algunos endpoints pueden fallar

3. **Datos de Prueba:**
   - Se necesitan medicamentos reales en la base de datos
   - Usar script de inserción de datos de prueba si es necesario

---

## ✅ Checklist de Prueba

- [ ] Backend corriendo en Docker
- [ ] Frontend corriendo en localhost:4200
- [ ] Login exitoso
- [ ] Navegación a Nueva Prescripción
- [ ] Selección de paciente funciona
- [ ] Agregar medicamentos funciona
- [ ] Botón "Verificar con DrugBank" visible
- [ ] Click en verificar muestra notificaciones
- [ ] Sin errores en consola del navegador
- [ ] Sin errores en logs del backend

---

## 🎯 Resultados Esperados

### UI
- ✅ Notificaciones aparecen correctamente
- ✅ Alertas se muestran en pantalla
- ✅ Sin errores de compilación
- ✅ Experiencia de usuario fluida

### Backend
- ✅ Endpoint responde correctamente
- ✅ Validaciones funcionan
- ✅ Logs muestran las peticiones
- ✅ Sin errores 500

### Integración
- ✅ Frontend llama al backend
- ✅ Token de autenticación funciona
- ✅ Respuestas se procesan correctamente
- ✅ Errores se manejan apropiadamente

---

## 📚 Documentación Adicional

- **Guía Completa:** `AI-ASSISTANT-INTEGRADO.md`
- **Resumen de Sesión:** `MVP-SESION-5-AI-ASSISTANT-COMPLETADO.md`
- **Estado General:** `ESTADO-MOCK-VS-REAL-COMPLETO.md`
- **Script de Prueba:** `test-ai-assistant.ps1`

---

**Última Actualización:** 2025-01-15
**Estado:** ✅ Listo para probar
