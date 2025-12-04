# 📋 Task 15 - Plan de Trabajo Colaborativo

## 🎯 Objetivo

Integrar el frontend Angular con el backend API .NET 8, permitiendo que la aplicación web funcione completamente con datos reales desde el servidor.

## 👥 Roles

- **Kiro (AI)**: Configuración de interceptors, actualización de servicios, código TypeScript
- **Carlos (Tú)**: Pruebas en navegador, verificación de UI, feedback de integración

## 📊 Estrategia de Trabajo

Vamos a trabajar de forma **incremental y verificable**:
1. Yo implemento una funcionalidad
2. Tú la pruebas en el navegador
3. Me das feedback
4. Ajustamos si es necesario
5. Pasamos a la siguiente

## 🗺️ Fases del Task 15

### **Fase 1: Configuración Base** (15.1 - 15.3)
**Tiempo estimado**: 30-45 minutos

#### Subtareas:
- [ ] 15.1 - Actualizar environment.ts con URL del backend
- [ ] 15.2 - Crear HTTP interceptor para JWT token
- [ ] 15.3 - Crear HTTP interceptor para manejo de errores

#### ✅ Criterios de Éxito:
- Environment apunta a http://localhost:8000
- Interceptors configurados en app.config.ts
- Errores HTTP se manejan globalmente

#### 🧪 Pruebas que Harás:
1. Verificar que la app Angular compila sin errores
2. Abrir DevTools → Network y verificar que las peticiones van a localhost:8000
3. Verificar que los errores HTTP se muestran en consola

---

### **Fase 2: Autenticación** (15.4 - 15.6)
**Tiempo estimado**: 45-60 minutos

#### Subtareas:
- [ ] 15.4 - Actualizar AuthService para llamar endpoints del backend
- [ ] 15.5 - Implementar lógica de refresh token
- [ ] 15.6 - Actualizar guards para usar nuevo AuthService

#### ✅ Criterios de Éxito:
- Login funciona con Keycloak
- Token se guarda en localStorage
- Refresh token funciona automáticamente
- Guards protegen rutas correctamente

#### 🧪 Pruebas que Harás:
1. **Login**: Ir a /login e intentar iniciar sesión
   - Usuario: `doctor1` / Password: `Doctor123!`
   - Verificar que redirige al dashboard
2. **Token en DevTools**: 
   - Application → Local Storage → Verificar que existe el token
3. **Rutas Protegidas**:
   - Intentar acceder a /prescriptions sin login
   - Debe redirigir a /login
4. **Logout**:
   - Hacer logout y verificar que el token se elimina

---

### **Fase 3: Servicios de Datos - Parte 1** (15.7 - 15.9)
**Tiempo estimado**: 60-90 minutos

#### Subtareas:
- [ ] 15.7 - Actualizar PrescriptionService
- [ ] 15.8 - Actualizar PatientService
- [ ] 15.9 - Actualizar DoctorService

#### ✅ Criterios de Éxito:
- Servicios llaman a endpoints REST reales
- Datos se cargan desde el backend
- CRUD completo funciona para cada entidad

#### 🧪 Pruebas que Harás:

**Prescripciones:**
1. Ir a /prescriptions
2. Verificar que se carga la lista de prescripciones
3. Crear una nueva prescripción
4. Editar una prescripción existente
5. Eliminar una prescripción
6. Buscar prescripciones

**Pacientes:**
1. Ir a /patients
2. Verificar lista de pacientes
3. Crear nuevo paciente
4. Editar paciente
5. Ver detalles de paciente

**Doctores:**
1. Ir a /doctors
2. Verificar lista de doctores
3. Buscar por especialidad
4. Ver detalles de doctor

---

### **Fase 4: Servicios de Datos - Parte 2** (15.10 - 15.12)
**Tiempo estimado**: 45-60 minutos

#### Subtareas:
- [ ] 15.10 - Actualizar PharmacyService
- [ ] 15.11 - Actualizar InventoryService
- [ ] 15.12 - Actualizar DispensationService

#### ✅ Criterios de Éxito:
- Farmacias, inventario y dispensación funcionan con datos reales

#### 🧪 Pruebas que Harás:

**Farmacias:**
1. Ir a /pharmacies
2. Ver lista de farmacias
3. Buscar farmacias
4. Ver inventario de una farmacia

**Inventario:**
1. Ver stock de medicamentos
2. Agregar stock
3. Ver alertas de stock bajo
4. Ver medicamentos próximos a vencer

**Dispensación:**
1. Ir a /dispensations
2. Registrar nueva dispensación
3. Verificar dispensación
4. Ver historial de dispensaciones

---

### **Fase 5: Asistente de IA** (15.13 - 15.14)
**Tiempo estimado**: 60-90 minutos

#### Subtareas:
- [ ] 15.13 - Migrar componentes del asistente de IA
- [ ] 15.14 - Eliminar API key de Hugging Face del frontend

#### ✅ Criterios de Éxito:
- Asistente de IA llama al backend
- No hay API keys en el frontend
- Análisis clínico funciona
- Recomendaciones de medicamentos funcionan

#### 🧪 Pruebas que Harás:
1. Ir al asistente de IA
2. Ingresar descripción clínica en español
3. Verificar que devuelve diagnósticos CIE-10
4. Verificar recomendaciones de medicamentos
5. Verificar validación de interacciones

---

### **Fase 6: Limpieza y Optimización** (15.15 - 15.16)
**Tiempo estimado**: 30-45 minutos

#### Subtareas:
- [ ] 15.15 - Actualizar manejo de estados de carga
- [ ] 15.16 - Eliminar servicios mock

#### ✅ Criterios de Éxito:
- Loading spinners funcionan correctamente
- No quedan servicios mock en el código
- Mensajes de error son claros

#### 🧪 Pruebas que Harás:
1. Verificar que aparecen spinners durante carga
2. Verificar mensajes de error claros
3. Verificar que no hay errores en consola

---

### **Fase 7: Pruebas End-to-End** (15.17 - 15.18)
**Tiempo estimado**: 60-90 minutos

#### Subtareas:
- [ ] 15.17 - Probar flujos principales end-to-end
- [ ] 15.18 - Realizar pruebas de integración

#### ✅ Criterios de Éxito:
- Todos los flujos principales funcionan
- No hay errores en consola
- Performance es aceptable

#### 🧪 Pruebas que Harás:

**Flujo 1: Crear Prescripción Completa**
1. Login como doctor
2. Buscar paciente
3. Crear nueva prescripción
4. Agregar diagnóstico CIE-10
5. Agregar medicamentos
6. Guardar prescripción
7. Verificar que aparece en la lista

**Flujo 2: Dispensar Medicamento**
1. Login como farmacéutico
2. Buscar prescripción
3. Verificar stock disponible
4. Registrar dispensación
5. Verificar que se actualiza el inventario

**Flujo 3: Usar Asistente de IA**
1. Login como doctor
2. Ir al asistente de IA
3. Ingresar síntomas
4. Obtener diagnósticos sugeridos
5. Obtener recomendaciones de medicamentos
6. Crear prescripción desde sugerencias

---

## 📝 Protocolo de Comunicación

### Cuando Yo (Kiro) Complete una Fase:
```
✅ Fase X completada
📦 Archivos modificados: [lista]
🧪 Pruebas a realizar: [instrucciones]
⏸️ Esperando tu feedback...
```

### Cuando Tú (Carlos) Pruebes:
Responde con:
```
✅ Funciona bien - continuar
⚠️ Hay un problema: [descripción]
❓ Tengo una pregunta: [pregunta]
```

---

## 🛠️ Comandos Útiles

### Backend (Docker)
```bash
# Iniciar servicios
.\start-docker.ps1

# Ver logs del API
docker-compose logs -f eprescription-api

# Reiniciar API
docker-compose restart eprescription-api
```

### Frontend (Angular)
```bash
# Ir a la carpeta del frontend
cd eprescription-frontend

# Instalar dependencias (si es necesario)
npm install

# Iniciar servidor de desarrollo
npm start

# Abrir en navegador
# http://localhost:4200
```

### Verificar Servicios
```bash
# Backend API
curl http://localhost:8000/api/patients

# Keycloak
curl http://localhost:8080
```

---

## 🐛 Troubleshooting Común

### Problema: CORS Error
**Solución**: Verificar que el backend tiene CORS configurado para http://localhost:4200

### Problema: 401 Unauthorized
**Solución**: 
1. Verificar que el token está en localStorage
2. Verificar que el interceptor está agregando el header Authorization
3. Hacer login nuevamente

### Problema: 404 Not Found
**Solución**:
1. Verificar que el backend está corriendo (docker-compose ps)
2. Verificar la URL en environment.ts
3. Verificar que el endpoint existe en el backend

### Problema: Network Error
**Solución**:
1. Verificar que Docker está corriendo
2. Verificar que el API está en puerto 8000
3. Ver logs del API: docker-compose logs eprescription-api

---

## 📊 Progreso del Task 15

```
Fase 1: Configuración Base          [✓] 3/3 ✅ COMPLETADA
Fase 2: Autenticación                [ ] 0/3
Fase 3: Servicios Parte 1            [ ] 0/3
Fase 4: Servicios Parte 2            [ ] 0/3
Fase 5: Asistente de IA              [ ] 0/2
Fase 6: Limpieza                     [ ] 0/2
Fase 7: Pruebas E2E                  [ ] 0/2

Total: 3/18 subtareas (17%)
```

---

## 🎯 Próximo Paso

**Empezamos con la Fase 1: Configuración Base**

Voy a:
1. Actualizar environment.ts
2. Crear interceptor de autenticación
3. Crear interceptor de errores

Después tú verificas que:
- La app compila
- Las peticiones van a localhost:8000
- Los errores se manejan correctamente

**¿Listo para empezar?** 🚀

---

**Última actualización**: 24 de Noviembre, 2025  
**Rama**: feature/task-15-frontend-integration  
**Estado**: Listo para iniciar
