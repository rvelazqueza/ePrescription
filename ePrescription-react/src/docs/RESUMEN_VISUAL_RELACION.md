# 🎯 Resumen Visual: Tipos de Alertas vs Reglas de Interacciones

## La Relación en 3 Puntos Clave

### 1️⃣ **TIPOS DE ALERTAS** = Qué hace el sistema

```javascript
{
  id: "TYPE-001",
  code: "INTERACTION_CRITICAL",
  name: "Interacción medicamentosa crítica",
  
  // 👇 ESTO define el COMPORTAMIENTO
  behavior: "block",              // 🚫 Bloquea la prescripción
  requiresJustification: true,    // ✍️  Pide justificación
  notifyPharmacy: true           // 📧 Notifica a farmacia
}
```

### 2️⃣ **REGLAS DE INTERACCIONES** = Cuándo se dispara

```javascript
{
  id: "RULE-001",
  alertTypeId: "TYPE-001",  // 🔗 VINCULADO AL TIPO
  
  // 👇 ESTO define CUÁNDO ocurre
  medicine1: "Warfarina",
  medicine2: "AAS",
  clinicalEffect: "Riesgo de sangrado"
}
```

### 3️⃣ **LA CONEXIÓN**

```
TIPO (TYPE-001)  ────────┐
                         │ alertTypeId
                         ↓
REGLA (RULE-001) ← "Warfarina + AAS"
REGLA (RULE-002) ← "Estatinas + Gemfibrozil"  
REGLA (RULE-004) ← "Metformina + Contraste"
REGLA (RULE-005) ← "AINEs + IECAs"

👆 Todas heredan el MISMO comportamiento del TYPE-001
```

---

## 📊 Ejemplo Práctico Visual

### Cuando el médico prescribe:

```
┌─────────────────────────────────────┐
│  PRESCRIPCIÓN                       │
│                                     │
│  ✓ Warfarina 5mg                   │
│  ✓ Ácido acetilsalicílico 100mg    │
└──────────────┬──────────────────────┘
               │
               ↓
    ┌──────────────────────┐
    │  Sistema busca REGLA │
    └──────────┬────────────┘
               │
               ↓
    ┌────────────────────────────────────┐
    │  ✓ Encuentra: RULE-001             │
    │    "Warfarina + AAS"               │
    │                                    │
    │    alertTypeId: "TYPE-001" ←──────┼──┐
    └────────────────────────────────────┘  │
                                            │
                    ┌───────────────────────┘
                    │
                    ↓
    ┌────────────────────────────────────┐
    │  Obtiene comportamiento de:        │
    │  TYPE-001                          │
    │                                    │
    │  behavior: "block" ────────────────┼──→ 🚫 BLOQUEA
    │  requiresJustification: true ──────┼──→ ✍️  PIDE JUSTIFICACIÓN
    │  notifyPharmacy: true ─────────────┼──→ 📧 NOTIFICA
    └────────────────────────────────────┘
```

---

## 🎨 Analogía Simple

Piensa en esto como **RECETAS DE COCINA**:

### **TIPO DE ALERTA** = INSTRUCCIÓN GENERAL
```
"Cuando veas algo PICANTE:"
  → Avisar al cliente
  → Poner chile en el lado
  → Ofrecer agua
```

### **REGLAS** = PLATILLOS ESPECÍFICOS
```
PLATO 1: "Tacos al pastor con habanero"    → Es PICANTE
PLATO 2: "Salsa verde con jalapeño"        → Es PICANTE
PLATO 3: "Chile relleno"                   → Es PICANTE

👆 TODOS tienen la misma instrucción general
```

---

## ✅ ¿Por qué esta arquitectura?

### Sin vinculación ❌
```javascript
// Tienes que definir el comportamiento EN CADA REGLA
RULE-001: { behavior: "block", notify: true, justify: true }
RULE-002: { behavior: "block", notify: true, justify: true }
RULE-003: { behavior: "block", notify: true, justify: true }
RULE-004: { behavior: "block", notify: true, justify: true }
RULE-005: { behavior: "block", notify: true, justify: true }

// Si cambias la política, tienes que editar 100+ reglas 😱
```

### Con vinculación ✅
```javascript
// Define UNA VEZ en el tipo
TYPE-001: { behavior: "block", notify: true, justify: true }

// Todas las reglas solo referencian
RULE-001: { alertTypeId: "TYPE-001" }
RULE-002: { alertTypeId: "TYPE-001" }
RULE-003: { alertTypeId: "TYPE-001" }
RULE-004: { alertTypeId: "TYPE-001" }
RULE-005: { alertTypeId: "TYPE-001" }

// Cambias en UN lugar y afecta a todas 🎉
```

---

## 🔑 Respuesta Rápida a tu Pregunta

**¿Cómo se relacionan?**

→ **Foreign Key**: `alertTypeId` en la Regla apunta al `id` del Tipo

→ **Relación**: 1 Tipo → Muchas Reglas (1:N)

→ **Herencia**: Las Reglas **heredan** el comportamiento del Tipo

→ **Propósito**: 
  - Tipo = POLÍTICA general del hospital
  - Regla = CASO clínico específico

---

**Piénsalo así**: 

- El **TIPO** es la **POLÍTICA** ("Todas las interacciones críticas se bloquean")
- La **REGLA** es el **CASO** ("Warfarina + AAS es una interacción crítica")
