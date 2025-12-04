# Task 15 - Instrucciones de Prueba

## 🎯 Objetivo
Verificar que los nombres de medicamentos y datos de pacientes se cargan correctamente en la vista "Recetas Emitidas".

## ✅ Requisitos Previos

- ✅ Docker corriendo
- ✅ API en puerto 8000
- ✅ Frontend compilado
- ✅ Base de datos Oracle con datos

## 🚀 Pasos para Probar

### 1. Verificar que el API funciona

```powershell
# Probar endpoint de prescripciones
curl http://localhost:8000/api/prescriptions/6a306a43-cec9-7710-e063-020016ac555e

# Resultado esperado: JSON con medicamentos
```

### 2. Abrir el navegador

```
http://localhost:4200/prescripciones/emitidas
```

### 3. Verificar la tabla

**Buscar en la tabla:**
- ✅ Nombre del paciente: "Mateo Paredes Solís" (NO "Mateo undefined")
- ✅ Número de medicamentos: "1"
- ✅ Estado: "Emitida"

### 4. Abrir el modal de detalles

**Hacer doble clic en una fila** o **Clic en "Ver detalles"**

**Verificar en el modal:**
- ✅ Nombre del paciente: "Mateo Paredes Solís"
- ✅ Identificación: "000000049"
- ✅ Edad: "25 años"
- ✅ Sexo: "Masculino"

### 5. Verificar medicamentos en el modal

**En la sección "Medicamentos":**
- ✅ Nombre: "Paracetamol 500mg" (NO "Medicamento 78f76943")
- ✅ Dosis: "0.5mg"
- ✅ Frecuencia: "Dos veces al día"
- ✅ Duración: "15 días" (NO "undefined días")
- ✅ Cantidad: "30"

## 🔍 Debugging

### Si los nombres NO se cargan

1. **Abrir DevTools** (F12)
2. **Ir a la pestaña "Console"**
3. **Buscar errores** (líneas rojas)
4. **Verificar Network**:
   - GET /api/medications/{id} - ¿Devuelve 200?
   - GET /api/patients/{id} - ¿Devuelve 200?

### Logs esperados en la consola

```
✅ Prescripciones cargadas: 1
📊 Total de items: 1
🔍 Primera prescripción (muestra): {...}
  - PatientId: 70f76943-b49f-430e-e063-020016ac882b
  - Medications: 1
🔄 Mapeando prescripciones... 1
📝 Mapeando prescripción: RX-20250101-ABC12345
  - PatientId: 70f76943-b49f-430e-e063-020016ac882b
  - Cargando datos del paciente...
  - Paciente cargado: Mateo Paredes Solís
```

## 📊 Checklist de Verificación

- [ ] Tabla muestra nombres de pacientes correctamente
- [ ] Tabla muestra cantidad de medicamentos
- [ ] Modal abre sin errores
- [ ] Modal muestra nombre completo del paciente
- [ ] Modal muestra identificación del paciente
- [ ] Modal muestra edad del paciente
- [ ] Modal muestra sexo del paciente
- [ ] Modal muestra nombre del medicamento
- [ ] Modal muestra dosis del medicamento
- [ ] Modal muestra duración en días (NO "undefined")
- [ ] Modal muestra cantidad del medicamento
- [ ] Modal muestra frecuencia del medicamento
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs del API

## 🎯 Resultado Esperado

### Antes (Problema)
```
Tabla:
- Paciente: "Mateo undefined"
- Medicamentos: 1

Modal:
- Nombre: "Mateo undefined"
- Medicamento: "Medicamento 78f76943"
- Duración: "undefined días"
```

### Después (Solución)
```
Tabla:
- Paciente: "Mateo Paredes Solís" ✅
- Medicamentos: 1 ✅

Modal:
- Nombre: "Mateo Paredes Solís" ✅
- Medicamento: "Paracetamol 500mg" ✅
- Duración: "15 días" ✅
```

## 🔧 Troubleshooting

### Error: "Medicamento 78f76943" (nombre no carga)

**Causa**: El API de medicamentos no devuelve datos
**Solución**:
1. Verificar que el endpoint `/api/medications/{id}` funciona
2. Verificar que el medicamento existe en la BD
3. Revisar logs del API

### Error: "Mateo undefined" (paciente no carga)

**Causa**: El API de pacientes no devuelve datos
**Solución**:
1. Verificar que el endpoint `/api/patients/{id}` funciona
2. Verificar que el paciente existe en la BD
3. Revisar logs del API

### Error: "undefined días" (duración no mapea)

**Causa**: El backend devuelve `duration` en lugar de `durationDays`
**Solución**: Ya está corregido en el mapeo

## 📝 Notas

- Los nombres se cargan **asíncronamente** después de la tabla
- Puede haber un pequeño delay antes de que aparezcan los nombres
- Si hay muchos medicamentos, puede tomar más tiempo
- El cache evita cargar el mismo medicamento/paciente múltiples veces

## ✅ Confirmación

Una vez que todo funcione correctamente:
1. Tomar screenshot de la tabla
2. Tomar screenshot del modal
3. Verificar que NO hay errores en la consola
4. Confirmar que los nombres se cargan correctamente

**¡Listo para producción!**
