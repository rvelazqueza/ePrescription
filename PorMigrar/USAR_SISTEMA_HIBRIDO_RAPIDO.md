# Guía Rápida: Usar Sistema Híbrido de Roles

## 🎯 Cómo Decidir: ¿Rol Base o Personalizado?

### Usar ROL BASE cuando:
- ✅ Usuario tiene funciones estándar
- ✅ Permisos del rol base son exactamente lo que necesita
- ✅ Es un caso común (médico regular, admin regular, etc.)
- ✅ Quieres asignación rápida (1 minuto)

### Usar ROL PERSONALIZADO cuando:
- ✅ Usuario necesita permisos especiales
- ✅ Debe quitar algunos permisos del rol base
- ✅ Debe agregar permisos extra justificados
- ✅ Es un caso excepcional pero legítimo
- ✅ Funciones híbridas o temporales

---

## 📋 Ejemplo Práctico: Toma de Decisión

### Caso 1: Dr. Juan Médico General
**Pregunta:** ¿Necesita permisos diferentes al rol "Médico" estándar?
**Respuesta:** No, es un médico regular.
**Solución:** ✅ Usar rol base `ROLE-002` (Médico)

```typescript
// En tu código:
assignUserRole(drJuan.id, 'ROLE-002'); // Listo!
```

---

### Caso 2: Dra. Ana - Médico Jefe de Emergencias
**Pregunta:** ¿Necesita permisos diferentes al rol "Médico Jefe" estándar?
**Respuesta:** Sí, necesita anular alertas críticas en emergencias.
**Solución:** ✅ Crear rol personalizado derivado de `ROLE-004` (Médico Jefe)

```typescript
// En tu código:
createCustomRole('ROLE-004', {
  name: 'Médico Jefe ER',
  userId: draAna.id,
  userName: draAna.fullName,
  userEmail: draAna.email,
  permissionAdjustments: {
    added: ['clinical_alerts.override'], // Permiso extra
    removed: []
  },
  justification: 'Médico jefe de sala de emergencias requiere capacidad de anular alertas en situaciones críticas de vida o muerte donde el juicio clínico prevalece sobre alertas automatizadas.',
  validUntil: undefined // Permanente
}, currentAdmin.id, currentAdmin.name);
```

---

### Caso 3: Carlos - Admin de Soporte Técnico
**Pregunta:** ¿Necesita todos los permisos de administrador?
**Respuesta:** No, NO debe poder eliminar usuarios ni restaurar sistema.
**Solución:** ✅ Crear rol personalizado derivado de `ROLE-001` (Admin)

```typescript
// En tu código:
createCustomRole('ROLE-001', {
  name: 'Admin Respaldo TI',
  userId: carlos.id,
  userName: carlos.fullName,
  userEmail: carlos.email,
  permissionAdjustments: {
    added: [],
    removed: ['users.delete', 'system.restore'] // Quitar permisos
  },
  justification: 'Administrador de soporte técnico nivel 2. No requiere acceso a funciones críticas de eliminación para reducir superficie de riesgo.',
  validUntil: undefined
}, currentAdmin.id, currentAdmin.name);
```

---

## 🔄 Flujo Visual

```
¿Usuario nuevo?
    ↓
    ¿Sus funciones son estándar?
        ├── SÍ → Usar ROL BASE
        │        ↓
        │        Asignar rol (1 min)
        │        ↓
        │        ✅ Listo
        │
        └── NO → ¿Qué necesita?
                 ↓
                 ¿Necesita MÁS permisos?
                     ├── SÍ → ROL PERSONALIZADO
                     │        ↓
                     │        Seleccionar rol base más cercano
                     │        ↓
                     │        Agregar permisos extra
                     │        ↓
                     │        Escribir justificación
                     │        ↓
                     │        ⚠️ ¿Permisos críticos agregados?
                     │             ├── SÍ → Requiere aprobación
                     │             └── NO → Activo inmediatamente
                     │
                     └── ¿Necesita MENOS permisos?
                                ↓
                                ROL PERSONALIZADO
                                ↓
                                Seleccionar rol base
                                ↓
                                Quitar permisos innecesarios
                                ↓
                                Escribir justificación
                                ↓
                                ✅ Activo inmediatamente (sin aprobación)
```

---

## 💡 Tips de Uso

### 1. Justificación Efectiva

**❌ MAL:**
```typescript
justification: 'Necesita permisos'
// Error: Muy corto, no explica nada
```

**✅ BIEN:**
```typescript
justification: 'Farmacéutico asignado al departamento de investigación clínica del proyecto XYZ. No realiza dispensación directa de medicamentos pero requiere capacidad de exportar datos para estudios de investigación aprobados por comité de ética el 2024-07-15. Toda exportación es auditada según protocolo INV-2024-045.'
// ✅ Detallado, justificado, con contexto
```

---

### 2. Vigencia del Rol

**Permanente:**
```typescript
validUntil: undefined // Sin fecha de expiración
```

**Temporal:**
```typescript
validUntil: '2025-12-31' // Expira automáticamente
// Usar para: proyectos temporales, consultores, pruebas
```

---

### 3. Revisar Roles Existentes

Antes de crear un rol personalizado nuevo, verifica si ya existe uno similar:

```typescript
// Buscar roles personalizados derivados del mismo rol base
const existingCustomRoles = getCustomRolesByBaseRole('ROLE-004');

// ¿Alguno tiene permisos similares?
existingCustomRoles.forEach(role => {
  console.log(`${role.name}:`, role.permissionAdjustments);
});

// Si encuentras uno similar, considera reutilizar el concepto
```

---

## 📊 Estadísticas Esperadas

En un hospital típico de 200 usuarios:

```
Roles Base (directos):     180 usuarios (90%)
├─ Médico:                  120 usuarios
├─ Farmacéutico:             30 usuarios
├─ Administrativo:           25 usuarios
├─ Administrador:             3 usuarios
└─ Médico Jefe:               2 usuarios

Roles Personalizados:       20 usuarios (10%)
├─ Médico Jefe ER:            2 usuarios
├─ Admin Respaldo TI:         1 usuario
├─ Farmacéutico Investigador: 1 usuario
├─ Médico Consultor:          3 usuarios
└─ Otros casos especiales:   13 usuarios

TOTAL:                     200 usuarios
```

**Proporción ideal:** 85-95% roles base, 5-15% roles personalizados.

---

## 🚨 Errores Comunes y Soluciones

### Error 1: Crear rol personalizado para todo

**❌ MAL:**
```typescript
// Crear rol personalizado para cada médico
createCustomRole('ROLE-002', {...}); // Dr. Juan
createCustomRole('ROLE-002', {...}); // Dr. Pedro
createCustomRole('ROLE-002', {...}); // Dr. Carlos
// Todos con permisos idénticos al rol base
```

**✅ BIEN:**
```typescript
// Usar rol base para médicos estándar
assignUserRole(drJuan.id, 'ROLE-002');
assignUserRole(drPedro.id, 'ROLE-002');
assignUserRole(drCarlos.id, 'ROLE-002');

// Solo crear personalizado cuando realmente necesario
createCustomRole('ROLE-004', {...}); // Dra. Ana (ER, necesita override)
```

---

### Error 2: Justificación vaga

**❌ MAL:**
```typescript
justification: 'Necesita más permisos para su trabajo'
// Muy vago, no pasará auditorías
```

**✅ BIEN:**
```typescript
justification: 'Médico jefe de sala de emergencias del Hospital Central requiere capacidad de anular alertas clínicas en situaciones críticas de vida o muerte donde el juicio clínico inmediato prevalece sobre alertas automatizadas del sistema. Cada anulación requiere justificación obligatoria en expediente médico y es auditada según protocolo ER-2024-002. Aprobado por Director Médico el 2024-09-10.'
```

---

### Error 3: No revisar vencimientos

**❌ MAL:**
```typescript
// Crear rol temporal y olvidarse
createCustomRole('ROLE-003', {
  validUntil: '2024-12-31',
  ...
});
// Se olvida revisar en enero 2025
```

**✅ BIEN:**
```typescript
// 1. Crear con vencimiento
createCustomRole('ROLE-003', {
  validUntil: '2024-12-31',
  ...
});

// 2. Configurar recordatorio mensual
// 3. Sistema auto-desactiva al vencer
// 4. Dashboard muestra roles próximos a vencer
```

---

## 🎯 Checklist: Crear Rol Personalizado

Antes de crear un rol personalizado, verifica:

- [ ] ¿Ningún rol base existente sirve?
- [ ] ¿La necesidad es legítima y justificable?
- [ ] ¿Puedo explicar claramente POR QUÉ este usuario necesita esto?
- [ ] ¿Es permanente o temporal? (definir validUntil)
- [ ] ¿Agregando permisos críticos? (requiere aprobación)
- [ ] ¿La justificación es detallada? (>50 caracteres recomendado)
- [ ] ¿El usuario está de acuerdo con la asignación?
- [ ] ¿Está documentado en la política de seguridad del hospital?

Si respondes SÍ a todas → Adelante con rol personalizado.
Si alguna es NO → Reconsiderar o usar rol base.

---

## 📞 Soporte

### ¿Dudas sobre qué usar?

**Pregunta simple:** ¿Este usuario hace algo diferente a los demás de su tipo?
- **No** → Rol base
- **Sí** → Rol personalizado

---

**Recuerda:** Los roles personalizados son para EXCEPCIONES legítimas, no para la norma. Mantén la simplicidad usando roles base siempre que sea posible.
