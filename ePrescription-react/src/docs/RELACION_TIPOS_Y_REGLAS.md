# Relación entre Tipos de Alertas y Reglas de Interacciones

## 🎯 Concepto Clave

**Tipos de Alertas** y **Reglas de Interacciones** se relacionan mediante una arquitectura de **CATEGORÍA → INSTANCIAS**:

```
TIPO DE ALERTA (Categoría)
    ↓
    Define: QUÉ puede pasar y CÓMO debe reaccionar el sistema
    ↓
REGLAS DE INTERACCIONES (Instancias específicas)
    ↓
    Define: CUÁNDO debe dispararse exactamente
```

---

## 📊 Relación de Datos (1 a Muchos)

```
┌─────────────────────────────────────────┐
│  TIPO DE ALERTA: TYPE-001               │
│  "Interacción medicamentosa crítica"    │
│                                         │
│  Comportamiento: BLOCK                  │
│  Severidad: CRITICAL                    │
│  Requiere justificación: SÍ             │
│  Notificar farmacia: SÍ                 │
└──────────────┬──────────────────────────┘
               │
               │ (1 a muchos)
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  RULE-001    │  │  RULE-002    │  │  RULE-004    │
│              │  │              │  │              │
│ Warfarina    │  │ Estatinas    │  │ Metformina   │
│ + AAS        │  │ + Gemfibrozil│  │ + Contraste  │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Relación**: Un TIPO DE ALERTA puede tener MÚLTIPLES REGLAS asociadas.

---

## 🔍 Ejemplo Práctico Detallado

### **TIPO DE ALERTA** (La Categoría Padre)

```typescript
{
  id: "TYPE-001",
  code: "INTERACTION_CRITICAL",
  name: "Interacción medicamentosa crítica",
  
  // ⚠️ DEFINE EL COMPORTAMIENTO GENERAL
  severity: "critical",           // ← Qué tan grave es
  behavior: "block",              // ← Qué hace el sistema (bloquea prescripción)
  requiresAcknowledgment: true,   // ← Requiere que el médico confirme
  requiresJustification: true,    // ← Requiere justificación escrita
  notifyPharmacy: true,           // ← Notifica a farmacia
  autoLog: true,                  // ← Registra automáticamente
  status: "active"
}
```

**Este tipo dice**: "Cuando haya una interacción crítica, BLOQUEA la prescripción, pide justificación y notifica a farmacia"

---

### **REGLAS DE INTERACCIONES** (Los Casos Específicos)

Estas reglas están **VINCULADAS** al tipo de alerta mediante el campo `alertTypeId`:

#### Regla 1: Warfarina + AAS

```typescript
{
  id: "RULE-001",
  alertTypeId: "TYPE-001",  // ← VINCULACIÓN CON EL TIPO
  
  name: "Warfarina + Antiagregantes plaquetarios",
  medicine1: "Warfarina",
  medicine2: "Ácido acetilsalicílico, Clopidogrel",
  
  // DETALLES ESPECÍFICOS DE ESTA INTERACCIÓN
  mechanism: "Efecto aditivo anticoagulante/antiagregante",
  clinicalEffect: "Riesgo aumentado de sangrado mayor",
  recommendation: "Evitar combinación o usar con extrema precaución",
  evidenceLevel: "A",
  
  severity: "critical",
  status: "active"
}
```

#### Regla 2: Estatinas + Gemfibrozil

```typescript
{
  id: "RULE-002",
  alertTypeId: "TYPE-001",  // ← VINCULACIÓN CON EL MISMO TIPO
  
  name: "Estatinas + Gemfibrozil",
  medicine1: "Atorvastatina, Simvastatina, Rosuvastatina",
  medicine2: "Gemfibrozil",
  
  mechanism: "Gemfibrozil inhibe metabolismo de estatinas",
  clinicalEffect: "Riesgo severo de rabdomiólisis",
  recommendation: "Contraindicación absoluta",
  evidenceLevel: "A",
  
  severity: "critical",
  status: "active"
}
```

#### Regla 3: Metformina + Contraste

```typescript
{
  id: "RULE-004",
  alertTypeId: "TYPE-001",  // ← VINCULACIÓN CON EL MISMO TIPO
  
  name: "Metformina + Contraste yodado",
  medicine1: "Metformina",
  medicine2: "Contraste yodado (IV)",
  
  mechanism: "Riesgo de acidosis láctica",
  clinicalEffect: "Acidosis láctica",
  recommendation: "Suspender 48h antes y después",
  evidenceLevel: "A",
  
  severity: "critical",
  status: "active"
}
```

---

## 🔄 Flujo Completo de Evaluación

### **Paso 1: Médico prescribe medicamentos**

```javascript
const prescription = {
  medications: [
    { name: "Warfarina", dose: "5mg" },
    { name: "Ácido acetilsalicílico", dose: "100mg" }
  ]
};
```

### **Paso 2: Sistema busca REGLAS que coincidan**

```javascript
// El sistema busca en todas las reglas activas
const matchingRule = findMatchingRule("Warfarina", "AAS");

// Encuentra: RULE-001
{
  id: "RULE-001",
  alertTypeId: "TYPE-001",  // ← Aquí está la vinculación
  medicine1: "Warfarina",
  medicine2: "Ácido acetilsalicílico",
  ...
}
```

### **Paso 3: Sistema obtiene el TIPO DE ALERTA vinculado**

```javascript
// Usando el alertTypeId de la regla, busca el tipo
const alertType = getAlertType(matchingRule.alertTypeId);

// Obtiene: TYPE-001
{
  id: "TYPE-001",
  code: "INTERACTION_CRITICAL",
  behavior: "block",              // ← ESTO define qué hacer
  requiresJustification: true,    // ← ESTO también
  notifyPharmacy: true,          // ← Y ESTO
  ...
}
```

### **Paso 4: Sistema genera la alerta con ambos datos**

```javascript
const alert = {
  // Datos de la REGLA específica
  ruleId: "RULE-001",
  medicine1: "Warfarina",
  medicine2: "AAS",
  description: "Riesgo aumentado de sangrado mayor",  // De la regla
  recommendation: "Evitar combinación...",            // De la regla
  
  // Comportamiento del TIPO DE ALERTA
  alertTypeId: "TYPE-001",
  type: "interaction",
  severity: "critical",
  behavior: "block",              // ← Del tipo, no de la regla
  requiresJustification: true,    // ← Del tipo
  notifyPharmacy: true,          // ← Del tipo
  
  status: "active",
  action: "pending"
};
```

### **Paso 5: Sistema actúa según el TIPO**

```javascript
// Porque el tipo tiene behavior: "block"
if (alertType.behavior === "block") {
  // BLOQUEA la prescripción
  showBlockingModal();
}

// Porque el tipo tiene requiresJustification: true
if (alertType.requiresJustification) {
  // PIDE justificación al médico
  showJustificationField();
}

// Porque el tipo tiene notifyPharmacy: true
if (alertType.notifyPharmacy) {
  // NOTIFICA a la farmacia
  notifyPharmacist(alert);
}
```

---

## 📝 Tabla de Relaciones Completa

| Tipo de Alerta | Código | Comportamiento | Reglas Asociadas | Total Reglas |
|----------------|--------|----------------|------------------|--------------|
| TYPE-001 | INTERACTION_CRITICAL | BLOCK | RULE-001, RULE-002, RULE-004, RULE-005 | 4 |
| TYPE-002 | ALLERGY_ABSOLUTE | BLOCK | (Reglas de alergias por paciente) | Dinámico |
| TYPE-003 | CONTRAINDICATION | WARN | (Reglas de contraindicaciones) | Dinámico |
| TYPE-004 | DUPLICATE_THERAPY | WARN | (Reglas de duplicidad) | Dinámico |
| TYPE-005 | DOSE_MAX_EXCEEDED | WARN | (Reglas de dosis máximas) | Dinámico |

---

## 💡 Analogía del Mundo Real

Imagina que:

### **TIPO DE ALERTA = CATEGORÍA DE DELITO**

```
TIPO: "Robo con violencia"
  - Pena: Prisión de 5-15 años
  - Procedimiento: Juicio con jurado
  - Notificar: Fiscalía + Víctima
```

### **REGLAS = CASOS ESPECÍFICOS**

```
CASO 1: Robo a mano armada en banco
  - Tipo: "Robo con violencia"
  - Detalles: Arma de fuego, rehenes
  - Agravantes: Arma + Rehenes
  
CASO 2: Robo con intimidación en casa
  - Tipo: "Robo con violencia"
  - Detalles: Entrada forzada, amenazas
  - Agravantes: Violación de domicilio

CASO 3: Asalto en vía pública
  - Tipo: "Robo con violencia"
  - Detalles: Uso de fuerza física
  - Agravantes: Lesiones
```

**Todos son del MISMO TIPO** (Robo con violencia), pero **cada CASO es diferente** en sus detalles.

La **PENA** (comportamiento) se define por el TIPO, no por cada caso individual.

---

## 🎨 Diagrama Visual Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    CATÁLOGO DE TIPOS                        │
│                                                             │
│  TYPE-001: Interacción Crítica     [BLOCK + JUSTIFY]       │
│  TYPE-002: Alergia                 [BLOCK + JUSTIFY]       │
│  TYPE-003: Contraindicación        [WARN + JUSTIFY]        │
│  TYPE-004: Duplicidad              [WARN]                  │
│  TYPE-005: Dosis Excedida          [WARN + JUSTIFY]        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Foreign Key: alertTypeId
                       │
┌──────────────────────┴──────────────────────────────────────┐
│              CATÁLOGO DE REGLAS ESPECÍFICAS                 │
│                                                             │
│  RULE-001: Warfarina + AAS          → TYPE-001             │
│  RULE-002: Estatinas + Gemfibrozil  → TYPE-001             │
│  RULE-003: IECAs + Espironolactona  → TYPE-001             │
│  RULE-004: Metformina + Contraste   → TYPE-001             │
│                                                             │
│  RULE-XXX: Penicilina (alérgico)    → TYPE-002             │
│  RULE-XXX: AINEs (IR severa)        → TYPE-003             │
│  RULE-XXX: Dos estatinas            → TYPE-004             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Se evalúa en tiempo real
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                   PRESCRIPCIÓN ACTIVA                       │
│                                                             │
│  Warfarina 5mg + AAS 100mg                                 │
│         │                                                   │
│         ├──> Coincide con RULE-001                         │
│         │                                                   │
│         └──> Obtiene TYPE-001                              │
│              │                                              │
│              ├──> behavior: "block"                        │
│              ├──> requiresJustification: true              │
│              └──> notifyPharmacy: true                     │
│                                                             │
│         ┌────────────────────────────────┐                 │
│         │  🚫 PRESCRIPCIÓN BLOQUEADA     │                 │
│         │  ⚠️  Justificación requerida   │                 │
│         │  📧 Farmacia notificada        │                 │
│         └────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Ventajas de esta Arquitectura

### ✅ **Separación de Responsabilidades**

- **Tipos**: Definen políticas generales del hospital
- **Reglas**: Definen casos clínicos específicos

### ✅ **Mantenimiento Centralizado**

Si cambias el comportamiento en TYPE-001 de "block" a "warn":
```javascript
// Cambio en UN solo lugar
TYPE-001.behavior = "warn";

// Afecta automáticamente a TODAS las reglas vinculadas
// RULE-001, RULE-002, RULE-004, RULE-005
// Todas ahora solo ADVIERTEN en lugar de BLOQUEAR
```

### ✅ **Escalabilidad**

Puedes agregar 1000 reglas nuevas sin tocar los tipos:
```javascript
// Nueva regla, mismo comportamiento
{
  id: "RULE-999",
  alertTypeId: "TYPE-001",  // ← Hereda todo el comportamiento
  medicine1: "Medicamento X",
  medicine2: "Medicamento Y",
  ...
}
```

### ✅ **Consistencia**

Todas las interacciones críticas se comportan igual:
- Siempre bloquean
- Siempre piden justificación
- Siempre notifican a farmacia

---

## 📚 Resumen Final

| Aspecto | Tipos de Alertas | Reglas de Interacciones |
|---------|------------------|-------------------------|
| **Qué define** | Categorías generales | Casos específicos |
| **Cantidad** | Pocos (~10) | Muchas (~1000+) |
| **Cambian** | Raramente | Frecuentemente |
| **Define** | CÓMO reaccionar | CUÁNDO reaccionar |
| **Ejemplos** | "Interacción crítica" | "Warfarina + AAS" |
| **Comportamiento** | Block, Warn, Info | (Hereda del tipo) |
| **Relación** | 1 (padre) | Muchos (hijos) |

---

**Conclusión**: Los TIPOS son las "REGLAS DEL JUEGO" y las REGLAS son las "JUGADAS ESPECÍFICAS". Todos juegan con las mismas reglas, pero cada jugada es única.
