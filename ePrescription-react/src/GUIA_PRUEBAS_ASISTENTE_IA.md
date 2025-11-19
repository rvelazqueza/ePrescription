# 🧪 Guía de Pruebas: Asistente de IA para Diagnóstico y Prescripción

## 📋 Tabla de Contenidos

1. [Inicio Rápido](#inicio-rápido)
2. [Verificación del Sistema](#verificación-del-sistema)
3. [Casos de Prueba con Ejemplos](#casos-de-prueba-con-ejemplos)
4. [Checklist de Validación](#checklist-de-validación)
5. [Problemas Comunes](#problemas-comunes)

---

## 🚀 Inicio Rápido

### Paso 1: Iniciar Sesión

1. Usuario: `admin@hospital.com`
2. Contraseña: `Admin123!`
3. MFA: `123456`

### Paso 2: Navegar a Nueva Receta

1. Click en sidebar: **Prescripciones > Nueva receta**
2. **IMPORTANTE:** Seleccionar un paciente primero
   - Click en botón **"Seleccionar Paciente"**
   - Elegir cualquier paciente de la lista (ej: María González)
   - Click en **"Seleccionar y continuar"**

### Paso 3: Abrir Asistente de IA

1. Buscar el botón **"Asistente IA"** (morado con gradiente + badge "Nuevo")
2. Ubicación: En la parte superior de la tabla de medicamentos, junto a "Agregar Medicamento"
3. Click para abrir el dialog

---

## ✅ Verificación del Sistema

### Test 1: Verificar que el botón existe

```
✓ El botón "Asistente IA" debe estar visible
✓ Debe tener un gradiente morado/azul
✓ Debe tener el badge "Nuevo"
✓ Debe estar junto al botón "Agregar Medicamento"
```

### Test 2: Verificar apertura del dialog

```
✓ Al hacer click se abre un dialog grande
✓ El dialog tiene título "Asistente de IA para Prescripción"
✓ Hay un campo de texto para descripción clínica
✓ Hay un botón "Analizar con IA (NLP)"
```

### Test 3: Verificar flujo completo

Vamos a hacer una prueba end-to-end:

1. **Abrir asistente** ✓
2. **Ingresar descripción clínica** ✓
3. **Click "Analizar con IA"** ✓
4. **Ver sugerencias** ✓
5. **Seleccionar diagnóstico** ✓
6. **Ver medicamentos generados** ✓
7. **Click "Aplicar a prescripción"** ✓
8. **Verificar que los medicamentos aparecen en la tabla** ✓

---

## 📝 Casos de Prueba con Ejemplos

### CASO 1: Infección Respiratoria (J06.9)

**Descripción clínica para copiar:**

```
Paciente masculino de 45 años con tos seca, fiebre de 38.5°C, dolor de garganta y malestar general de 3 días de evolución. Niega expectoración purulenta. Sin disnea.
```

**Resultado esperado:**

- ✅ **3-5 diagnósticos sugeridos**
  - Primera sugerencia: J06.9 (Infección aguda vías respiratorias superiores)
  - Confianza: ~85-92%
  
- ✅ **Al seleccionar J06.9, debe generar:**
  - **Paracetamol 500mg** - Oral - Cada 6 horas - 5 días
  - **Ambroxol 30mg** - Oral - Cada 8 horas - 7 días
  
- ✅ **Debe mostrar:**
  - Estado de stock: "Disponible" (verde)
  - Razonamiento: "Analgésico y antipirético de primera línea..."
  - Guía clínica: "OMS - Tratamiento de Infecciones Respiratorias Agudas"

**Verificación:**

```bash
1. Pegar descripción en campo de texto
2. Click "Analizar con IA" → Esperar 1-2 segundos
3. Verificar que aparezca J06.9 en primera posición
4. Click en la card de J06.9
5. Verificar que aparezcan 2 medicamentos
6. Click "Aplicar a prescripción"
7. Verificar en tabla principal que aparecen:
   - Paracetamol 500mg
   - Ambroxol 30mg
```

---

### CASO 2: Hipertensión Arterial (I10)

**Descripción clínica para copiar:**

```
Paciente femenino de 58 años con cifras de presión arterial elevadas 160/95 mmHg en múltiples tomas. Refiere cefalea occipital ocasional. Sin antecedentes de cardiopatía. Requiere iniciar tratamiento antihipertensivo.
```

**Resultado esperado:**

- ✅ **Primera sugerencia: I10 (Hipertensión esencial)**
  - Confianza: ~90-95%
  
- ✅ **Al seleccionar I10, debe generar:**
  - **Losartán 50mg** - Oral - Una vez al día - Continuo
  - **Hidroclorotiazida 12.5mg** - Oral - Una vez al día - Continuo
  
- ✅ **Debe mostrar:**
  - Guía clínica: "ACC/AHA 2017 de Hipertensión Arterial"
  - Instrucciones: "Tomar preferiblemente en la mañana"
  - Alternativas: "Enalapril 10mg, Telmisartán 40mg"

**Verificación:**

```bash
1. Pegar descripción
2. Analizar con IA
3. Seleccionar I10
4. Verificar 2 medicamentos (Losartán + HCTZ)
5. Aplicar a prescripción
6. Confirmar en tabla
```

---

### CASO 3: Diabetes Mellitus Tipo 2 (E11.9)

**Descripción clínica para copiar:**

```
Paciente masculino de 52 años con diagnóstico reciente de diabetes mellitus tipo 2. Glucemia en ayunas 185 mg/dL, HbA1c 8.2%. Sin complicaciones crónicas conocidas. Requiere iniciar metformina.
```

**Resultado esperado:**

- ✅ **Primera sugerencia: E11.9 (Diabetes mellitus no insulinodependiente)**
  - Confianza: ~92-96%
  
- ✅ **Al seleccionar E11.9, debe generar:**
  - **Metformina 850mg** - Oral - Cada 12 horas - Continuo
  
- ✅ **Debe mostrar:**
  - Confianza: 96%
  - Guía clínica: "ADA 2024 - Manejo de Diabetes Mellitus tipo 2"
  - Razonamiento: "Primera línea según ADA. Reduce HbA1c 1-2%..."
  - Instrucciones adicionales: "Dieta para diabetes. Ejercicio regular..."
  - Seguimiento: "Control en 2 semanas. HbA1c en 3 meses"

---

### CASO 4: Infección de Vías Urinarias (N39.0)

**Descripción clínica para copiar:**

```
Paciente femenino de 35 años con disuria, polaquiuria y urgencia miccional desde hace 2 días. Niega fiebre. Refiere dolor suprapúbico. Sospecha de infección de vías urinarias no complicada.
```

**Resultado esperado:**

- ✅ **Primera sugerencia: N39.0 (Infección vías urinarias)**
  - Confianza: ~88-92%
  
- ✅ **Al seleccionar N39.0, debe generar:**
  - **Ciprofloxacina 500mg** - Oral - Cada 12 horas - 7 días
  
- ✅ **Debe mostrar:**
  - Alternativas: "Nitrofurantoína 100mg, Trimetoprim-sulfametoxazol"
  - Contraindicaciones: "Embarazo, Menores de 18 años, Tendinopatías"
  - Instrucciones: "Tomar con abundante agua. Evitar lácteos 2h antes/después"
  - Guía: "IDSA 2019 - Infecciones del Tracto Urinario"

---

### CASO 5: Migraña (G43.9)

**Descripción clínica para copiar:**

```
Paciente femenino de 38 años con cefalea hemicraneal pulsátil de intensidad severa, asociada a náuseas y fotofobia. Duración de episodios 4-6 horas. Historia de migraña sin aura recurrente.
```

**Resultado esperado:**

- ✅ **Primera sugerencia: G43.9 (Migraña, sin especificar)**
  - Confianza: ~89-93%
  
- ✅ **Al seleccionar G43.9, debe generar:**
  - **Sumatriptán 50mg** - Oral - Al inicio de crisis (máx 2 dosis/día) - Según necesidad
  - **Naproxeno 500mg** - Oral - Cada 12 horas - 3-5 días
  
- ✅ **Debe mostrar:**
  - 2 medicamentos con efecto sinérgico
  - Nivel A de evidencia (badge verde)
  - Contraindicaciones: "Cardiopatía isquémica, HTA no controlada"
  - Instrucciones: "Identificar y evitar desencadenantes..."

---

### CASO 6: Gastritis (K29.7)

**Descripción clínica para copiar:**

```
Paciente masculino de 40 años con epigastralgia de 1 semana de evolución, tipo ardor, que mejora con alimentos. Sin síntomas de alarma. Niega melena o hematemesis. Sospecha de gastritis aguda.
```

**Resultado esperado:**

- ✅ **Primera sugerencia: K29.7 (Gastritis, no especificada)**
  
- ✅ **Al seleccionar K29.7:**
  - Debe generar medicamentos (si hay template)
  - O mostrar mensaje: "No hay template de prescripción para este diagnóstico"

---

### CASO 7: Ansiedad (F41.9)

**Descripción clínica para copiar:**

```
Paciente femenino de 42 años con síntomas de ansiedad generalizada. Preocupación excesiva, tensión muscular, dificultad para concentrarse y alteraciones del sueño desde hace 3 meses. Sin ideación suicida.
```

**Resultado esperado:**

- ✅ **Primera sugerencia: F41.9 (Trastorno de ansiedad, no especificado)**
  - Confianza: ~85-90%

---

### CASO 8: Tos (Síntoma General) - R05

**Descripción clínica para copiar:**

```
Paciente con tos persistente de 2 semanas de evolución, predominantemente seca, sin fiebre ni otros síntomas respiratorios. Niega exposición a tuberculosis.
```

**Resultado esperado:**

- ✅ **Sugerencias múltiples:**
  - R05 (Tos)
  - J20.9 (Bronquitis aguda)
  
---

### CASO 9: Gripe/Influenza (J11.1)

**Descripción clínica para copiar:**

```
Paciente con cuadro gripal clásico: fiebre alta 39°C, mialgias, artralgias, cefalea, tos seca y malestar general intenso de inicio súbito hace 24 horas. Niega contacto con caso confirmado de influenza.
```

**Resultado esperado:**

- ✅ **Primera sugerencia: J11.1 (Gripe con manifestaciones respiratorias)**

---

### CASO 10: Dolor Abdominal (R10.4)

**Descripción clínica para copiar:**

```
Paciente con dolor abdominal difuso de moderada intensidad, sin irradiación, asociado a distensión abdominal. Niega náuseas, vómitos, fiebre o alteraciones del tránsito intestinal.
```

**Resultado esperado:**

- ✅ **Sugerencias:**
  - R10.4 (Otros dolores abdominales)
  - K59.0 (Estreñimiento)

---

## 🎯 Checklist de Validación Completa

### Fase 1: Ingreso de Datos

- [ ] Campo de texto acepta descripción clínica
- [ ] Placeholder es visible y claro
- [ ] Botón "Analizar" se habilita cuando hay texto
- [ ] Botón "Analizar" se deshabilita durante procesamiento

### Fase 2: Análisis con IA

- [ ] Aparece loader/spinner "Analizando con IA..."
- [ ] Tiempo de espera: 1-2 segundos (simulación latencia)
- [ ] Toast de éxito muestra cantidad de sugerencias
- [ ] Si no hay resultados, muestra toast informativo

### Fase 3: Sugerencias de Diagnóstico

- [ ] Mínimo 3 diagnósticos mostrados
- [ ] Cada diagnóstico muestra:
  - [ ] Código CIE-10
  - [ ] Descripción completa
  - [ ] % de confianza (70-95%)
  - [ ] Categoría OMS
  - [ ] Razonamiento de IA
  - [ ] Notas clínicas
  - [ ] Badge de prevalencia
- [ ] Sugerencias ordenadas por confianza (mayor a menor)
- [ ] Hover effect en cards

### Fase 4: Selección de Diagnóstico

- [ ] Click en diagnóstico lo marca como seleccionado (borde verde)
- [ ] Aparece checkmark ✓ verde
- [ ] Toast confirma selección
- [ ] Vista cambia a mostrar medicamentos
- [ ] Diagnóstico seleccionado se muestra en alert verde

### Fase 5: Medicamentos Generados

- [ ] Lista de medicamentos aparece automáticamente
- [ ] Cada medicamento muestra:
  - [ ] Nombre genérico
  - [ ] Nombre comercial
  - [ ] Dosis
  - [ ] Vía de administración
  - [ ] Frecuencia
  - [ ] Duración
  - [ ] Instrucciones completas
- [ ] Badges de estado:
  - [ ] Estado de stock (verde/amarillo/rojo)
  - [ ] % de confianza
  - [ ] Nivel de evidencia
- [ ] Razonamiento de IA expandible
- [ ] Alternativas visibles (si hay)
- [ ] Contraindicaciones resaltadas en rojo

### Fase 6: Aplicación de Receta

- [ ] Botón "Aplicar a prescripción" visible
- [ ] Al hacer click:
  - [ ] Toast de confirmación
  - [ ] Dialog se cierra
  - [ ] Medicamentos aparecen en tabla principal
- [ ] Verificar en tabla:
  - [ ] Nombre del medicamento correcto
  - [ ] Dosis correcta
  - [ ] Frecuencia correcta
  - [ ] Vía correcta
  - [ ] Duración correcta
  - [ ] Instrucciones en campo "Observaciones"

### Fase 7: Búsqueda Manual (Alternativa)

- [ ] Campo de búsqueda manual CIE-10 funciona
- [ ] Buscar por código (ej: "I10") muestra resultados
- [ ] Buscar por descripción (ej: "hipertensión") muestra resultados
- [ ] Seleccionar de búsqueda manual también genera medicamentos

---

## 🔍 Dashboard de Auditoría

### Test de Auditoría

1. **Navegar a:** Auditoría y cumplimiento > Auditoría Asistente IA

2. **Verificar KPIs:**
   - [ ] Total sugerencias cuenta todas las generadas
   - [ ] Tasa de aceptación se calcula correctamente
   - [ ] Confianza promedio se muestra
   - [ ] Tiempo promedio se registra

3. **Verificar Tabla de Logs:**
   - [ ] Aparece registro de uso reciente
   - [ ] Muestra fecha/hora correcta
   - [ ] Muestra médico que usó el sistema
   - [ ] Muestra paciente seleccionado
   - [ ] Muestra diagnóstico elegido
   - [ ] Muestra cantidad de medicamentos
   - [ ] Muestra tiempo de decisión

4. **Verificar Gráficos:**
   - [ ] Distribución de sugerencias visible
   - [ ] Top diagnósticos se actualiza
   - [ ] Top medicamentos se actualiza

---

## 🐛 Problemas Comunes y Soluciones

### Problema 1: No aparece el botón "Asistente IA"

**Causa:** No se ha seleccionado un paciente primero

**Solución:**
```
1. Click en "Seleccionar Paciente"
2. Elegir cualquier paciente
3. El botón ahora debe ser visible
```

### Problema 2: No se generan sugerencias

**Causa:** Descripción clínica no coincide con keywords del sistema

**Solución:**
```
Usar exactamente las descripciones de ejemplo de esta guía
Incluir keywords específicos: "tos", "fiebre", "hipertensión", "diabetes", etc.
```

**Keywords que funcionan:**
- "infección respiratoria", "gripe", "tos"
- "hipertensión", "presión alta"
- "diabetes"
- "dolor abdominal", "dolor de cabeza", "migraña"
- "infección urinaria"
- "gastritis"
- "ansiedad", "depresión"

### Problema 3: No aparecen medicamentos después de seleccionar diagnóstico

**Causa:** No hay template de prescripción para ese diagnóstico específico

**Solución:**
```
Usar diagnósticos con templates disponibles:
✓ J06.9 - Infección respiratoria
✓ I10 - Hipertensión
✓ E11.9 - Diabetes
✓ N39.0 - Infección urinaria
✓ G43.9 - Migraña
```

### Problema 4: Los medicamentos no se agregan a la tabla

**Causa 1:** No se hizo click en "Aplicar a prescripción"

**Solución:**
```
Después de revisar los medicamentos, hacer click en el botón azul
"Aplicar a prescripción" al final del dialog
```

**Causa 2:** Error en la conversión de formato

**Solución:**
```
Verificar en consola del navegador (F12) si hay errores
Los medicamentos deben agregarse con IDs únicos tipo "ai-1234567890-0"
```

### Problema 5: El dialog no se cierra después de aplicar

**Causa:** Posible error de JavaScript

**Solución:**
```
Refrescar la página
Intentar nuevamente el flujo completo
```

---

## 📊 Métricas de Éxito para la Demo

Para que la demo sea exitosa, verificar:

### Métricas de Funcionalidad

- ✅ **100%** de los casos de prueba generan sugerencias
- ✅ **100%** de los diagnósticos con template generan medicamentos
- ✅ **100%** de las aplicaciones agregan medicamentos a la tabla
- ✅ **0** errores en consola del navegador

### Métricas de UX

- ✅ Tiempo de análisis: **1-2 segundos** (simulado)
- ✅ Tiempo total del flujo: **<1 minuto**
- ✅ Cantidad de clicks: **3-4** (abrir → analizar → seleccionar → aplicar)
- ✅ Toasts informativos en cada paso

### Métricas de Auditoría

- ✅ **100%** de los usos se registran en auditoría
- ✅ Dashboard se actualiza inmediatamente
- ✅ Logs incluyen toda la información requerida

---

## 🎬 Script para Demo en Vivo

### Demo Rápida (3 minutos)

```
1. Login → Seleccionar paciente (30 seg)

2. Click "Asistente IA" (5 seg)

3. Copiar descripción de infección respiratoria: (10 seg)
   "Paciente con tos, fiebre de 38.5°C, dolor de garganta 
    y malestar general de 3 días de evolución"

4. Click "Analizar con IA" → Esperar sugerencias (2 seg)

5. Mostrar diagnósticos: (30 seg)
   - "El sistema sugiere 3 diagnósticos ordenados por confianza"
   - "Cada uno con razonamiento clínico explicable"
   - "Primera sugerencia: J06.9 con 88% de confianza"

6. Click en J06.9 (5 seg)

7. Mostrar medicamentos generados: (45 seg)
   - "Automáticamente genera 2 medicamentos"
   - "Paracetamol y Ambroxol según guías OMS"
   - "Incluye dosis, frecuencia, duración, instrucciones"
   - "Muestra estado de stock"
   - "Razonamiento de IA: por qué se sugiere cada medicamento"

8. Click "Aplicar a prescripción" (5 seg)

9. Mostrar tabla actualizada: (20 seg)
   - "Los medicamentos ahora están en la receta"
   - "El médico puede editarlos si lo considera necesario"
   - "Todo el proceso tomó menos de 1 minuto"

10. Navegar a Auditoría: (30 seg)
    - "Cada uso del asistente se registra"
    - "Dashboard muestra métricas en tiempo real"
    - "100% trazabilidad para compliance"
```

### Demo Completa (10 minutos)

Seguir el mismo flujo pero:
- Mostrar 2-3 casos clínicos diferentes
- Explicar cada sección del sistema
- Mostrar búsqueda manual alternativa
- Profundizar en dashboard de auditoría
- Mostrar cumplimiento normativo (HL7, FDA, HIPAA)

---

## 📋 Checklist Pre-Demo

Antes de hacer la demostración:

### Técnico

- [ ] Sistema iniciado y cargado
- [ ] Login funcional
- [ ] Al menos 1 paciente seleccionable
- [ ] Botón "Asistente IA" visible
- [ ] Navegador con consola abierta (F12) para debug
- [ ] Ejemplos de descripciones clínicas copiados

### Presentación

- [ ] Guía impresa o en pantalla secundaria
- [ ] Ejemplos de descripciones preparados
- [ ] Story line definido (qué casos mostrar)
- [ ] Tiempo calculado (3 min vs 10 min)
- [ ] Respuestas preparadas para preguntas frecuentes

### Backup

- [ ] Screenshots del sistema funcionando
- [ ] Video de respaldo del flujo completo
- [ ] Plan B si hay error técnico

---

## 🎯 Objetivos de la Demo

Al finalizar, los usuarios deben entender:

1. **Cómo funciona:** Descripción → IA analiza → Sugerencias → Receta automática
2. **Beneficios:** Ahorro de tiempo + Reducción de errores + Adherencia a guías
3. **Seguridad:** Explicabilidad + Auditoría completa + Cumplimiento normativo
4. **Flexibilidad:** El médico siempre tiene la última palabra, puede editar o rechazar
5. **Escalabilidad:** Base para integrar IA real (AWS, Google, Azure)

---

## ✅ Conclusión

Con esta guía puedes:

- ✅ Probar todos los casos de uso implementados
- ✅ Verificar que el flujo completo funciona
- ✅ Hacer una demo profesional a stakeholders
- ✅ Identificar y resolver problemas rápidamente
- ✅ Mostrar el valor del asistente de IA

**El sistema está listo para demostración.**

Para soporte técnico, consultar: `/ASISTENTE_IA_GUIA.md`

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0 - Guía de Pruebas
