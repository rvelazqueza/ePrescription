# 💊 Manual de Usuario - Módulo 2: Prescripciones Médicas

## Sistema ePrescription - Guía Completa de Prescripción

**Versión:** 1.0.0  
**Módulo:** Prescripciones Médicas  
**Roles:** Médicos, Médicos Jefes

---

## 📋 Descripción General

El módulo de **Prescripciones** es el corazón del sistema ePrescription. Permite a los médicos crear, gestionar y emitir recetas médicas electrónicas de forma segura, cumpliendo con normativas internacionales.

### ¿Qué puedes hacer?

- ✅ Crear recetas nuevas con asistencia inteligente
- ✅ Guardar borradores para completar después
- ✅ Emitir recetas con firma digital
- ✅ Buscar recetas por paciente, número o fecha
- ✅ Duplicar recetas para renovaciones
- ✅ Gestionar centros médicos
- ✅ Detectar interacciones medicamentosas
- ✅ Cumplir con HIPAA, FDA 21 CFR Part 11 y HL7

---

## 🗂️ Páginas del Módulo

El módulo de Prescripciones incluye 6 páginas principales:

1. **Nueva receta** - Crear prescripciones
2. **Mis borradores** - Recetas no emitidas
3. **Recetas emitidas** - Historial de prescripciones
4. **Buscar receta** - Búsqueda avanzada
5. **Duplicar receta** - Copiar receta existente
6. **Centros médicos** - Gestionar lugares de prescripción

---

## 📝 1. Nueva Receta

### 🎯 Objetivo
Crear una nueva prescripción médica electrónica con todos los datos requeridos.

### Acceso
```
Menú → Prescripciones → Nueva receta
O: Dashboard → "Nueva Receta" (acción rápida)
```

---

### Paso a Paso: Crear Receta Completa

#### **Paso 1: Seleccionar Paciente**

1. **Click en "Seleccionar paciente"**
   - Se abre diálogo de búsqueda
   - Ver lista de pacientes recientes

2. **Buscar paciente**
   ```
   Por nombre: "Juan Pérez"
   Por cédula: "123456789"
   Por código: "PAC-001"
   ```

3. **Seleccionar de la lista**
   - Click en paciente
   - Se cargan datos automáticamente

**Datos cargados automáticamente:**
```
✅ Nombre completo
✅ Cédula
✅ Edad y sexo
✅ Alergias conocidas
✅ Condiciones crónicas
✅ Medicamentos actuales
✅ Peso, talla, grupo sanguíneo
```

💡 **Consejo:** Si el paciente tiene alergias, aparecerá alerta amarilla.

⚠️ **Advertencia:** Si el paciente no existe, puede crear uno nuevo desde el diálogo.

---

#### **Paso 2: Agregar Medicamentos**

1. **Click en "+ Agregar medicamento"**

2. **Buscar medicamento**
   ```
   Por nombre: "Paracetamol"
   Por principio activo: "Acetaminofén"
   Por código: "MED-001"
   ```

3. **Seleccionar presentación**
   ```
   Ejemplo: Paracetamol 500mg comprimidos
   ```

4. **Configurar posología**

**Campos obligatorios:**

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| **Dosis** | 500 mg | Cantidad por toma |
| **Frecuencia** | Cada 8 horas | Intervalo entre dosis |
| **Vía** | Oral | Forma de administración |
| **Duración** | 5 días | Tiempo total del tratamiento |
| **Cantidad** | 15 | Unidades a dispensar |

**Campos opcionales:**

| Campo | Ejemplo | Descripción |
|-------|---------|-------------|
| **Indicaciones** | "Tomar con alimentos" | Instrucciones especiales |
| **Condiciones** | "Solo si hay dolor" | Cuando tomar |

5. **Click en "Agregar"**
   - Medicamento aparece en tabla
   - Sistema valida interacciones

---

#### **Paso 3: Revisar Alertas Clínicas**

El sistema verifica automáticamente:

**🔴 Alertas Críticas (Bloquean emisión):**
```
❌ Alergia conocida al medicamento
   Paciente: María López
   Alergia: Penicilina
   Medicamento: Amoxicilina
   
   Acción: Quitar medicamento o cambiar paciente
```

**🟡 Alertas Importantes (Permiten continuar):**
```
⚠️ Interacción medicamentosa
   Medicamento A: Warfarina
   Medicamento B: Aspirina
   Riesgo: Mayor sangrado
   
   Acción: [Continuar con precaución] o [Quitar]
```

**🔵 Alertas Informativas:**
```
ℹ️ Medicamento ya en uso
   El paciente usa: Omeprazol 20mg
   Nueva prescripción: Omeprazol 40mg
   
   Nota: Verificar dosis
```

💡 **Consejo:** Lea todas las alertas antes de emitir. Su juicio clínico prevalece.

---

#### **Paso 4: Agregar Más Medicamentos (si aplica)**

- Repetir paso 2 para cada medicamento
- Máximo: 10 medicamentos por receta (configurable)
- Mínimo: 1 medicamento

**Ejemplo de receta multimedicamento:**
```
1. Paracetamol 500mg - Dolor - Oral - 5 días
2. Ibuprofeno 400mg - Inflamación - Oral - 3 días
3. Omeprazol 20mg - Protección gástrica - Oral - 5 días
```

---

#### **Paso 5: Completar Datos de Prescripción**

**Información del Médico (auto-llenado):**
```
✅ Nombre: Dr. Juan Pérez
✅ Cédula profesional: MED-12345
✅ Especialidad: Medicina General
✅ Firma digital: Configurada
```

**Centro médico:**
```
Seleccionar: [Hospital General ▼]
   - Hospital General
   - Clínica San José
   - Consultorio Privado
```

**Diagnóstico:**
```
Ejemplo: "Cefalea tensional aguda"
Mínimo: 10 caracteres
Máximo: 500 caracteres
```

**Indicaciones generales (opcional):**
```
Ejemplo: "Reposo relativo. Hidratación abundante."
```

---

#### **Paso 6: Elegir Acción**

Tienes 3 opciones:

**A. Guardar como borrador**
```
[💾 Guardar borrador]

✅ Guarda sin emitir
✅ Puedes editar después
✅ No consume talonario
✅ No requiere firma

Caso de uso: Falta completar datos
```

**B. Emitir receta**
```
[📝 Emitir receta]

✅ Receta lista para dispensar
✅ Genera número único
✅ Requiere firma digital
✅ Consume talonario
✅ No se puede editar después

Caso de uso: Receta completa y validada
```

**C. Cancelar**
```
[❌ Cancelar]

⚠️ Se pierden todos los datos
⚠️ Pide confirmación
```

---

### ✅ Resultado: Receta Emitida

**Mensaje de confirmación:**
```
✅ Receta emitida exitosamente

Número: #12345
Paciente: Juan Pérez González
Medicamentos: 3
Fecha: 14 Oct 2025 10:30

[Ver receta] [Imprimir] [Enviar por email]
```

**Qué sucede al emitir:**
1. Se genera número único de receta
2. Se firma digitalmente
3. Se crea código QR para verificación
4. Se registra en auditoría
5. Se notifica al farmacéutico (opcional)
6. Se puede imprimir/exportar

---

## 📋 2. Mis Borradores

### 🎯 Objetivo
Ver, editar y completar recetas guardadas como borrador.

### Acceso
```
Menú → Prescripciones → Mis borradores
```

### Vista Principal

**Tabla de borradores:**
```
╔════════╦═══════════════╦════════════╦═════════╦══════════╗
║ Número ║ Paciente      ║ Fecha      ║ Medicam ║ Acciones ║
╠════════╬═══════════════╬════════════╬═════════╬══════════╣
║ DRA-12 ║ María López   ║ 14 Oct 25  ║ 2 meds  ║ [Editar] ║
║ DRA-11 ║ Pedro Gómez   ║ 13 Oct 25  ║ 1 med   ║ [Editar] ║
║ DRA-10 ║ Ana Torres    ║ 12 Oct 25  ║ 3 meds  ║ [Editar] ║
╚════════╩═══════════════╩════════════╩═════════╩══════════╝
```

### Acciones Disponibles

**1. Editar borrador**
```
Click en [Editar] → Abre Nueva Receta con datos precargados
```

**2. Eliminar borrador**
```
Click en [🗑️] → Pide confirmación → Elimina permanentemente
```

**3. Ver detalles**
```
Click en número → Panel lateral con vista completa
```

**4. Búsqueda rápida**
```
[🔍 Buscar por paciente...]
```

**5. Filtros**
```
Por fecha: [Últimos 7 días ▼]
Por estado: [Todos ▼]
```

💡 **Consejo:** Revisa tus borradores al final del día para no dejar recetas pendientes.

---

### Panel de Detalles de Borrador

**Click en número de borrador:**
```
┌─────────────────────────────────────────┐
│ Borrador #DRA-12                        │
│ Estado: Borrador                    [×] │
├─────────────────────────────────────────┤
│ PACIENTE                                │
│ María Isabel López Pérez                │
│ Cédula: 1-2345-6789                     │
│ Edad: 45 años | Sexo: F                 │
│                                         │
│ MEDICAMENTOS                            │
│ 1. Paracetamol 500mg                    │
│    - Dosis: 500mg cada 8h               │
│    - Vía: Oral                          │
│    - Duración: 5 días                   │
│                                         │
│ 2. Omeprazol 20mg                       │
│    - Dosis: 20mg cada 24h               │
│    - Vía: Oral                          │
│    - Duración: 5 días                   │
│                                         │
│ INFORMACIÓN                             │
│ Diagnóstico: Gastritis aguda            │
│ Centro: Hospital General                │
│ Creado: 14 Oct 2025 09:15               │
│                                         │
│ [Continuar editando] [Eliminar]         │
└─────────────────────────────────────────┘
```

---

## 📋 3. Recetas Emitidas

### 🎯 Objetivo
Consultar historial de recetas emitidas, reimprimir y ver estado de dispensación.

### Acceso
```
Menú → Prescripciones → Recetas emitidas
```

### Vista Principal

**Tabla de recetas:**
```
╔════════╦═══════════════╦════════════╦═══════════╦════════════╦══════════╗
║ Número ║ Paciente      ║ Fecha      ║ Medicam   ║ Estado     ║ Acciones ║
╠════════╬═══════════════╬════════════╬═══════════╬════════════╬══════════╣
║ 12345  ║ Juan Pérez    ║ 14 Oct 25  ║ 3 meds    ║ Dispensada ║ [Ver]    ║
║ 12344  ║ Ana García    ║ 14 Oct 25  ║ 1 med     ║ Pendiente  ║ [Ver]    ║
║ 12343  ║ Luis Mora     ║ 13 Oct 25  ║ 2 meds    ║ Dispensada ║ [Ver]    ║
╚════════╩═══════════════╩════════════╩═══════════╩════════════╩══════════╝
```

**Estados de receta:**
- 🟢 **Dispensada:** Ya entregada en farmacia
- 🟡 **Pendiente:** Aún no dispensada
- 🔴 **Vencida:** Pasó plazo de vigencia
- ⚫ **Anulada:** Cancelada por médico/farmacia

### Filtros Avanzados

```
┌─────────────────────────────────────────┐
│ FILTRAR RECETAS                         │
├─────────────────────────────────────────┤
│ Por paciente:                           │
│ [Buscar paciente...____________]   [🔍] │
│                                         │
│ Por fecha:                              │
│ Desde: [📅 01/10/2025]                  │
│ Hasta: [📅 14/10/2025]                  │
│                                         │
│ Por estado:                             │
│ ☐ Todas                                 │
│ ☑ Pendientes                            │
│ ☑ Dispensadas                           │
│ ☐ Vencidas                              │
│ ☐ Anuladas                              │
│                                         │
│ Por centro:                             │
│ [Todos los centros ▼]                   │
│                                         │
│ [Aplicar filtros] [Limpiar]             │
└─────────────────────────────────────────┘
```

### Panel de Detalles de Receta

**Click en [Ver]:**
```
┌─────────────────────────────────────────┐
│ Receta #12345                      [×]  │
│ Estado: Dispensada ✅             │
├─────────────────────────────────────────┤
│ PACIENTE                                │
│ Juan Carlos Pérez González              │
│ Cédula: 1-1234-5678                     │
│ Edad: 52 años | Sexo: M | Sangre: O+   │
│ Alergias: Penicilina                    │
│                                         │
│ MEDICAMENTOS PRESCRITOS                 │
│ ┌───────────────────────────────────┐   │
│ │ 1. Paracetamol 500mg              │   │
│ │    Dosis: 500mg cada 8 horas      │   │
│ │    Vía: Oral                      │   │
│ │    Duración: 5 días               │   │
│ │    Cantidad: 15 comprimidos       │   │
│ │    Estado: ✅ Dispensado          │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ 2. Omeprazol 20mg                 │   │
│ │    Dosis: 20mg cada 24 horas      │   │
│ │    Vía: Oral                      │   │
│ │    Duración: 5 días               │   │
│ │    Cantidad: 5 cápsulas           │   │
│ │    Estado: ✅ Dispensado          │   │
│ └───────────────────────────────────┘   │
│                                         │
│ INFORMACIÓN MÉDICA                      │
│ Diagnóstico: Cefalea tensional y        │
│              gastritis aguda            │
│ Indicaciones: Tomar con alimentos       │
│                                         │
│ PRESCRIPTOR                             │
│ Dr. Juan Pérez López                    │
│ Cédula: MED-12345                       │
│ Especialidad: Medicina General          │
│ Centro: Hospital General                │
│                                         │
│ TRAZABILIDAD                            │
│ Emitida: 14 Oct 2025 10:30              │
│ Dispensada: 14 Oct 2025 11:45           │
│ Farmacéutico: Ana García                │
│ Farmacia: Farmacia Central              │
│                                         │
│ FIRMA DIGITAL                           │
│ ✅ Firmada digitalmente                 │
│ Certificado: CERT-2025-12345            │
│ Timestamp: 14/10/2025 10:30:15 UTC      │
│                                         │
│ [📄 Imprimir] [📧 Email] [📱 QR]       │
└─────────────────────────────────────────┘
```

### Acciones Disponibles

**1. Imprimir receta**
```
[📄 Imprimir] → Genera PDF → Abre para imprimir

Incluye:
✅ Datos del paciente
✅ Medicamentos con posología
✅ Código QR de verificación
✅ Firma digital del médico
✅ Membrete del centro médico
```

**2. Enviar por email**
```
[📧 Email] → Diálogo de envío

Para: paciente@email.com
CC: (opcional)
Asunto: Receta médica #12345

[Enviar]

✅ PDF adjunto automáticamente
✅ Registro en auditoría
```

**3. Ver código QR**
```
[📱 QR] → Muestra código QR grande

Farmacéutico puede escanear para:
✅ Verificar autenticidad
✅ Ver receta completa
✅ Registrar dispensación
```

**4. Reimprimir**
```
Mismo contenido que impresión original
Con marca de agua "COPIA"
Registro en auditoría: "Reimpresión solicitada"
```

---

## 🔍 4. Buscar Receta

### 🎯 Objetivo
Encontrar recetas específicas usando múltiples criterios.

### Acceso
```
Menú → Prescripciones → Buscar receta
```

### Opciones de Búsqueda

**Por número de receta:**
```
Número de receta: [_______] [Buscar]
Ejemplo: 12345
```

**Por paciente:**
```
Buscar paciente:
  Nombre: [Juan Pérez_____] [🔍]
  Cédula: [1-1234-5678_____] [🔍]
```

**Por rango de fechas:**
```
Desde: [📅 01/10/2025]
Hasta: [📅 14/10/2025]
[Buscar]
```

**Por medicamento:**
```
Medicamento: [Paracetamol_____] [🔍]
Encuentra todas las recetas que incluyan ese medicamento
```

**Por diagnóstico:**
```
Diagnóstico: [Hipertensión_____] [🔍]
Búsqueda en texto de diagnóstico
```

### Resultados

Muestra tabla similar a "Recetas emitidas" con resultados filtrados.

💡 **Consejo:** Usa búsqueda por paciente para ver historial de prescripciones.

---

## 📋 5. Duplicar Receta

### 🎯 Objetivo
Copiar una receta existente para renovación o prescripción similar.

### Acceso
```
Menú → Prescripciones → Duplicar receta
```

### Paso a Paso

**1. Buscar receta a duplicar**
```
Por número: [12345___] [Buscar]
O
Por paciente: [Buscar paciente...] [🔍]
```

**2. Seleccionar receta**
```
Click en [Duplicar] en receta deseada
```

**3. Revisión automática**
```
✅ Se copian medicamentos
✅ Se copian dosis
✅ Se copia paciente
✅ Se limpia número (es nueva receta)
✅ Se actualiza fecha
```

**4. Editar si necesario**
```
Puedes modificar:
- Dosis
- Duración
- Agregar/quitar medicamentos
- Cambiar indicaciones
```

**5. Emitir o guardar**
```
[Emitir receta] o [Guardar borrador]
```

### Casos de Uso

**Caso 1: Renovación de medicamento crónico**
```
Paciente: María López
Medicamento: Losartán 50mg
Última receta: Hace 30 días

Acción:
1. Duplicar receta anterior
2. Actualizar duración a 30 días
3. Emitir nueva receta
```

**Caso 2: Protocolo estándar**
```
Diagnóstico: Infección urinaria
Protocolo: Ciprofloxacina + Analgésico

Acción:
1. Duplicar receta de protocolo
2. Cambiar paciente
3. Ajustar dosis según peso
4. Emitir
```

⚠️ **Advertencia:** Siempre revisar antes de emitir. Pacientes pueden tener nuevas alergias o condiciones.

---

## 🏥 6. Centros Médicos

### 🎯 Objetivo
Gestionar lugares desde donde prescribes (hospital, clínica, consultorio).

### Acceso
```
Menú → Prescripciones → Centros médicos
```

### Lista de Centros

```
╔════╦═══════════════════╦═══════════════════╦═════════════╦══════════╗
║ ID ║ Nombre            ║ Dirección         ║ Teléfono    ║ Acciones ║
╠════╬═══════════════════╬═══════════════════╬═════════════╬══════════╣
║ 01 ║ Hospital General  ║ San José Centro   ║ 2222-3333   ║ [Editar] ║
║ 02 ║ Clínica San José  ║ Escazú            ║ 2288-7777   ║ [Editar] ║
║ 03 ║ Consultorio       ║ Sabana Norte      ║ 8888-9999   ║ [Editar] ║
╚════╩═══════════════════╩═══════════════════╩═════════════╩══════════╝
```

### Agregar Nuevo Centro

**Click en [+ Nuevo centro]:**
```
┌─────────────────────────────────────────┐
│ AGREGAR CENTRO MÉDICO                   │
├─────────────────────────────────────────┤
│ Nombre *                                │
│ [Hospital San Juan_____________]        │
│                                         │
│ Dirección *                             │
│ [Av. Central, San José_________]        │
│                                         │
│ Ciudad                                  │
│ [San José________]                      │
│                                         │
│ Teléfono *                              │
│ [+506 2222-4444_]                       │
│                                         │
│ Email                                   │
│ [info@hospital.com_____________]        │
│                                         │
│ Sitio web                               │
│ [www.hospital.com______________]        │
│                                         │
│ [Guardar] [Cancelar]                    │
└─────────────────────────────────────────┘
```

**Campos obligatorios (*)**
- Nombre del centro
- Dirección
- Teléfono

💡 **Consejo:** Agrega todos tus centros médicos para facilitar selección al prescribir.

---

## ⚠️ Alertas Clínicas

### Tipos de Alertas

El sistema detecta automáticamente 4 tipos de alertas:

**1. Alergia al medicamento 🔴**
```
Severidad: CRÍTICA
Acción: BLOQUEA emisión

Ejemplo:
❌ ALERGIA DETECTADA
Paciente: María López
Alergia conocida: Penicilina
Medicamento prescrito: Amoxicilina

Debe remover el medicamento para continuar.
```

**2. Interacción medicamentosa 🟡**
```
Severidad: ALTA/MEDIA
Acción: ADVIERTE, permite continuar

Ejemplo:
⚠️ INTERACCIÓN DETECTADA
Medicamento A: Warfarina (anticoagulante)
Medicamento B: Aspirina (antiagregante)
Efecto: Riesgo aumentado de sangrado
Recomendación: Monitoreo estrecho de INR

[Continuar con precaución] [Remover medicamento]
```

**3. Contraindicación por condición 🟡**
```
Severidad: ALTA
Acción: ADVIERTE

Ejemplo:
⚠️ CONTRAINDICACIÓN
Paciente: Juan Pérez
Condición: Insuficiencia renal crónica
Medicamento: Metformina
Motivo: Requiere ajuste de dosis

[Ver recomendaciones] [Continuar] [Remover]
```

**4. Duplicación terapéutica 🔵**
```
Severidad: INFO
Acción: INFORMA

Ejemplo:
ℹ️ MEDICAMENTO DUPLICADO
El paciente ya usa: Omeprazol 20mg
Prescripción nueva: Omeprazol 40mg
Nota: Verificar si es cambio de dosis intencional

[Entendido]
```

### Panel de Alertas

Durante la prescripción:
```
┌─────────────────────────────────────────┐
│ ⚠️ ALERTAS CLÍNICAS (2)                 │
├─────────────────────────────────────────┤
│ 🔴 CRÍTICA (1)                          │
│ Alergia a Amoxicilina                   │
│ [Ver detalles] [Remover medicamento]    │
│                                         │
│ 🟡 ADVERTENCIA (1)                      │
│ Interacción: Warfarina + Aspirina       │
│ [Ver detalles] [Continuar con          │
│                 precaución]             │
│                                         │
│ No podrás emitir mientras haya          │
│ alertas críticas sin resolver.          │
└─────────────────────────────────────────┘
```

---

## 📊 Estadísticas y Reportes

### Mis Estadísticas

**Ver desde Dashboard:**
```
Dashboard → "Ver mis estadísticas"
```

**Métricas mostradas:**
```
┌─────────────────────────────────────────┐
│ ESTADÍSTICAS DEL MES                    │
├─────────────────────────────────────────┤
│ Recetas emitidas: 245                   │
│ Promedio por día: 12                    │
│ Pacientes atendidos: 187                │
│                                         │
│ Medicamentos más prescritos:            │
│ 1. Paracetamol 500mg (78 veces)         │
│ 2. Omeprazol 20mg (56 veces)            │
│ 3. Losartán 50mg (45 veces)             │
│                                         │
│ Diagnósticos frecuentes:                │
│ 1. Hipertensión arterial (34)           │
│ 2. Cefalea (28)                         │
│ 3. Gastritis (25)                       │
│                                         │
│ [Exportar reporte PDF]                  │
└─────────────────────────────────────────┘
```

---

## 🖨️ Impresión y Exportación

### Formato de Receta Impresa

**Incluye:**
```
┌─────────────────────────────────────────┐
│     🏥 HOSPITAL GENERAL                 │
│  RECETA MÉDICA ELECTRÓNICA              │
│                                         │
│ Nº: 12345    Fecha: 14/10/2025 10:30   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│ PACIENTE                                │
│ Nombre: Juan Carlos Pérez González      │
│ Cédula: 1-1234-5678                     │
│ Edad: 52 años  Sexo: M  Sangre: O+     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ MEDICAMENTOS PRESCRITOS                 │
│                                         │
│ 1. PARACETAMOL 500mg comprimidos        │
│    Dosis: 500mg cada 8 horas            │
│    Vía: Oral                            │
│    Duración: 5 días                     │
│    Cantidad: 15 comprimidos             │
│    Indicaciones: Tomar con alimentos    │
│                                         │
│ 2. OMEPRAZOL 20mg cápsulas              │
│    Dosis: 20mg cada 24 horas            │
│    Vía: Oral                            │
│    Duración: 5 días                     │
│    Cantidad: 5 cápsulas                 │
│    Indicaciones: En ayunas              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ DIAGNÓSTICO                             │
│ Cefalea tensional y gastritis aguda     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ PRESCRIPTOR                             │
│ Dr. Juan Pérez López                    │
│ Cédula profesional: MED-12345           │
│ Especialidad: Medicina General          │
│ Firma digital: ✅ CERT-2025-12345       │
│                                         │
│         [QR CODE]                       │
│    Escanear para verificar              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Cumple: HIPAA | FDA 21 CFR Part 11      │
│         HL7 FHIR R4                     │
└─────────────────────────────────────────┘
```

### Formatos de Exportación

**PDF:**
- Tamaño: Carta (8.5" x 11")
- Resolución: 300 DPI
- Incluye código QR

**Email:**
- PDF adjunto
- Asunto personalizable
- Cuerpo con resumen

**FHIR:**
- Formato: JSON
- Estándar: FHIR R4
- Para interoperabilidad

---

## ❓ Preguntas Frecuentes

**P: ¿Cuántos medicamentos puedo agregar?**
R: Hasta 10 medicamentos por receta (configurable por administrador).

**P: ¿Puedo editar una receta emitida?**
R: No. Una vez emitida, la receta no puede modificarse. Debe crear una nueva.

**P: ¿Qué pasa si me equivoco al emitir?**
R: Puede anular la receta y crear una nueva. La anulación queda registrada en auditoría.

**P: ¿Los borradores caducan?**
R: Los borradores se conservan 30 días. Después se eliminan automáticamente.

**P: ¿Puedo prescribir sin paciente seleccionado?**
R: No. El paciente es obligatorio para cumplimiento normativo.

**P: ¿El código QR caduca?**
R: El QR es permanente mientras la receta esté vigente.

---

## 🎯 Casos de Uso Prácticos

### Caso 1: Consulta de rutina

**Escenario:** Paciente con hipertensión controlada, renovación de medicamento.

**Pasos:**
1. Seleccionar paciente desde lista recientes
2. Click "Duplicar receta anterior"
3. Verificar dosis (sin cambios)
4. Actualizar duración a 30 días
5. Emitir receta
6. Imprimir y entregar

⏱️ **Tiempo:** 2 minutos

---

### Caso 2: Paciente nuevo con múltiples síntomas

**Escenario:** Cefalea, gastritis y ansiedad.

**Pasos:**
1. Crear paciente nuevo si no existe
2. Agregar 3 medicamentos:
   - Paracetamol (dolor)
   - Omeprazol (gastritis)
   - Alprazolam (ansiedad)
3. Sistema detecta interacción leve
4. Revisar alerta y continuar
5. Agregar indicaciones especiales
6. Emitir receta
7. Explicar al paciente

⏱️ **Tiempo:** 5-7 minutos

---

### Caso 3: Urgencia médica

**Escenario:** Paciente con dolor agudo, necesita receta inmediata.

**Pasos:**
1. Seleccionar paciente rápido (búsqueda por cédula)
2. Agregar medicamento analgésico
3. Sistema detecta alergia a morfina
4. Cambiar a tramadol
5. Sin alertas críticas
6. Emitir inmediatamente
7. Código QR para farmacia

⏱️ **Tiempo:** 3 minutos

---

## ✅ Checklist de Dominio

**Básico:**
- [ ] Seleccionar paciente
- [ ] Agregar un medicamento
- [ ] Guardar borrador
- [ ] Emitir receta simple
- [ ] Imprimir receta

**Intermedio:**
- [ ] Agregar 3+ medicamentos
- [ ] Interpretar alertas
- [ ] Duplicar receta
- [ ] Buscar recetas pasadas
- [ ] Enviar receta por email

**Avanzado:**
- [ ] Gestionar centros médicos
- [ ] Resolver interacciones complejas
- [ ] Usar estadísticas para mejorar práctica
- [ ] Exportar en formato FHIR
- [ ] Capacitar a colegas

---

## 🔗 Módulos Relacionados

- **Módulo 4:** [Pacientes](./MANUAL_04_PACIENTES.md) - Gestión de pacientes
- **Módulo 8:** [Alertas Clínicas](./MANUAL_08_ALERTAS.md) - Interacciones
- **Módulo 9:** [Firma Digital](./MANUAL_09_FIRMA.md) - Verificación
- **Módulo 14:** [Catálogos](./MANUAL_14_CATALOGOS.md) - Medicamentos

---

## 📞 Soporte

**¿Necesitas ayuda con prescripciones?**
- Centro de Ayuda (menú)
- Email: soporte@eprescription.hospital.com
- Teléfono: +506 2222-3333
- Chat en vivo (ícono 💬)

---

**Fecha de actualización:** Octubre 2025  
**Versión del documento:** 1.0.0  
**Cumplimiento:** HIPAA, FDA 21 CFR Part 11, HL7 FHIR R4
