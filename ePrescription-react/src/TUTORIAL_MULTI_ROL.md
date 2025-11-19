# 🎓 Tutorial Completo: Sistema Multi-Rol en ePrescription

## 📺 **Guía Paso a Paso para Usar el Sistema**

---

## 🎯 **PARTE 1: Para Usuarios Finales**

### **Escenario 1: Cambiar de Rol Durante la Sesión**

**Caso:** Eres Dr. García, Médico Jefe que también atiende consultas.

#### **Paso 1: Login**
```
1. Abrir aplicación ePrescription
2. Ingresar credenciales
3. Completar MFA (si está habilitado)
4. Sistema te autentica
```

**Resultado:**
- Sesión iniciada con rol primario: "Médico Jefe"
- Badge visible en header: `[👨‍⚕️ Médico Jefe ▼]`

---

#### **Paso 2: Ver Rol Activo**

**Ubicación:** Header superior derecho

```
┌────────────────────────────────────────────────┐
│  [Búsqueda...]  [👨‍⚕️ Médico Jefe ▼]  [🔔]    │
└────────────────────────────────────────────────┘
                      ↑
                 Tu rol activo
```

**Color del badge:**
- Azul = Médico Jefe
- Verde = Médico
- Naranja = Farmacéutico
- Rojo = Administrador
- Gris = Administrativo

---

#### **Paso 3: Cambiar a Médico (para consultas)**

**Acción:**
1. Clic en el badge `[👨‍⚕️ Médico Jefe ▼]`
2. Se abre un menú:

```
┌────────────────────────────────┐
│  Roles asignados               │
├────────────────────────────────┤
│  ○ 🩺 Médico                   │
│  ● 👨‍⚕️ Médico Jefe     ✓      │ ← Activo ahora
├────────────────────────────────┤
│  🕐 Volver a rol primario      │
└────────────────────────────────┘
```

3. Clic en `🩺 Médico`
4. Aparece modal de confirmación:

```
┌─────────────────────────────────────┐
│  Confirmar Cambio de Rol            │
├─────────────────────────────────────┤
│                                     │
│  De:  👨‍⚕️ Médico Jefe             │
│  A:   🩺 Médico                    │
│                                     │
│  🛡️ Los permisos cambiarán a:      │
│  ✓ Crear y firmar recetas          │
│  ✓ Ver pacientes                   │
│  ✓ Consultar inventario            │
│                                     │
│  Razón del cambio (opcional):       │
│  [Voy a atender consultas______]   │
│                                     │
│  ⚠️ Este cambio quedará registrado  │
│                                     │
│  [Cancelar]  [Cambiar Rol]         │
└─────────────────────────────────────┘
```

5. (Opcional) Escribir razón: "Voy a atender consultas"
6. Clic en `[Cambiar Rol]`

---

#### **Paso 4: Confirmación**

**Resultado inmediato:**

1. Toast de confirmación:
```
✅ Rol cambiado exitosamente
   Ahora está trabajando como: Médico
```

2. Badge actualizado:
```
[🩺 Médico ▼]  ← Cambió de azul a verde
```

3. Permisos actualizados:
   - Puedes prescribir como Médico
   - Puedes firmar recetas
   - NO puedes aprobar medicamentos controlados (solo Jefe)

---

#### **Paso 5: Trabajar como Médico**

**Ahora puedes:**
- ✅ Crear recetas (`/prescripciones/nueva`)
- ✅ Firmar recetas
- ✅ Ver tus pacientes
- ✅ Consultar inventario
- ❌ NO aprobar medicamentos (necesitas ser Jefe)
- ❌ NO ver todas las recetas (solo Jefe)

**Todas tus acciones se auditan como "Médico":**
```json
{
  "action": "CREATE_PRESCRIPTION",
  "userId": "USR-001",
  "activeRole": "Médico",        ← Rol con el que actuaste
  "timestamp": "2025-10-08T10:30:00Z",
  "prescriptionId": "RX-12345"
}
```

---

#### **Paso 6: Volver a Médico Jefe**

**Opción A: Desde el dropdown**
1. Clic en `[🩺 Médico ▼]`
2. Seleccionar `👨‍⚕️ Médico Jefe`
3. Confirmar

**Opción B: Volver a primario (rápido)**
1. Clic en `[🩺 Médico ▼]`
2. Clic en `🕐 Volver a rol primario`
3. Confirmar

**Resultado:**
- Badge: `[👨‍⚕️ Médico Jefe ▼]` (azul)
- Permisos de Médico Jefe restaurados

---

### **Escenario 2: Sugerencia Contextual Automática**

**Caso:** Eres Lcda. Solís, Farmacéutica que también hace reportes.

#### **Situación:**
1. Rol activo: `[💊 Farmacéutico ▼]`
2. Navegas a: `/reportes/exportar`

#### **Sistema te ayuda:**

Aparece alerta automática:

```
┌──────────────────────────────────────────────┐
│  ⚠️  Sugerencia                              │
├──────────────────────────────────────────────┤
│  Esta sección normalmente requiere rol de    │
│  Administrativo                              │
│                                              │
│  ¿Cambiar a rol Administrativo?             │
│                                              │
│  [Ahora no]  [Cambiar a Administrativo]     │
└──────────────────────────────────────────────┘
```

#### **Opciones:**

**A. Aceptar sugerencia:**
1. Clic en `[Cambiar a Administrativo]`
2. Modal de confirmación
3. Rol cambia automáticamente
4. Puedes exportar reportes

**B. Rechazar:**
1. Clic en `[Ahora no]`
2. Alerta se oculta
3. Sigues como Farmacéutico
4. Puedes cambiar manualmente después

---

## 🎯 **PARTE 2: Para Administradores**

### **Escenario 3: Asignar Múltiples Roles a Usuario**

**Caso:** Admin necesita dar roles adicionales a Dr. García.

#### **Paso 1: Acceder a Gestión de Usuarios**

```
1. Login como Administrador
2. Ir a: "Seguridad y usuarios" → "Usuarios"
3. Buscar: "Dr. García" o "dr.garcia"
```

---

#### **Paso 2: Abrir Panel de Edición**

```
4. Doble clic en la fila de Dr. García
5. Se abre UserEditDialog (panel lateral)
```

---

#### **Paso 3: Ir a Pestaña "Rol"**

```
6. Clic en pestaña "Rol"
7. Ver sección de multi-rol:
```

**Vista actual:**

```
┌─────────────────────────────────────────┐
│  Rol Primario                           │
│  Rol predeterminado al iniciar sesión   │
├─────────────────────────────────────────┤
│  Rol primario *                         │
│  [Médico Jefe ▼]                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Roles Asignados                        │
│  Todos los roles que puede utilizar     │
├─────────────────────────────────────────┤
│  ☐ 🛡️ Administrador                    │
│  ☑ 🩺 Médico              ✓            │
│  ☑ 👨‍⚕️ Médico Jefe      [Primario]    │
│  ☐ 💊 Farmacéutico                      │
│  ☐ 📋 Administrativo                    │
└─────────────────────────────────────────┘
```

---

#### **Paso 4: Asignar Rol Adicional**

**Agregar "Farmacéutico":**

```
8. Marcar checkbox de "💊 Farmacéutico"
9. Checkbox cambia a: ☑
10. Aparece check verde: ✓
```

**Resultado visual:**

```
│  ☐ 🛡️ Administrador                    │
│  ☑ 🩺 Médico              ✓            │
│  ☑ 👨‍⚕️ Médico Jefe      [Primario]    │
│  ☑ 💊 Farmacéutico        ✓            │ ← Nuevo
│  ☐ 📋 Administrativo                    │
```

---

#### **Paso 5: Cambiar Rol Primario (Opcional)**

**Si quieres cambiar el rol primario:**

```
11. En dropdown "Rol primario"
12. Seleccionar nuevo rol (Ej: "Médico")
13. Automáticamente se asegura que esté en "Roles Asignados"
```

**Validación:**
- ✅ Rol primario siempre está asignado
- ✅ No puede quitar rol primario sin cambiarlo primero

---

#### **Paso 6: Intentar Quitar Rol Primario (Error)**

**Prueba:**
```
14. Intentar desmarcar checkbox del rol primario
```

**Sistema muestra error:**
```
❌ No puede quitar el rol primario
   Cambie el rol primario primero
```

**Solución:**
```
15. Cambiar rol primario a otro
16. Ahora puede quitar el anterior
```

---

#### **Paso 7: Guardar Cambios**

```
17. Revisar cambios
18. Clic en botón "Guardar cambios" (abajo)
19. Sistema valida
20. Toast de confirmación:
    ✅ Usuario actualizado exitosamente
21. Panel se cierra
```

**Usuario actualizado:**
```json
{
  "id": "USR-001",
  "username": "dr.garcia",
  "fullName": "Dr. Carlos García",
  "primaryRole": "Médico Jefe",
  "assignedRoles": ["Médico", "Médico Jefe", "Farmacéutico"],
  ...
}
```

---

#### **Paso 8: Usuario Afectado**

**Próximo login de Dr. García:**

1. Login normal
2. Rol activo inicial: "Médico Jefe" (primario)
3. Dropdown ahora muestra 3 roles:

```
┌────────────────────────────────┐
│  ○ 🩺 Médico                   │
│  ● 👨‍⚕️ Médico Jefe     ✓      │
│  ○ 💊 Farmacéutico             │ ← Nuevo
└────────────────────────────────┘
```

4. Puede cambiar entre los 3 roles

---

### **Escenario 4: Revisar Historial de Cambios de Rol**

**Caso:** Admin quiere ver qué roles ha usado un usuario.

#### **Opción A: Desde Auditoría**

```
1. Ir a: "Auditoría y cumplimiento" → "Log auditoría"
2. Filtros:
   - Acción: "ROLE_CHANGE"
   - Usuario: "dr.garcia"
   - Fecha: Última semana
3. Ver listado:
```

**Ejemplo de registro:**

```
┌─────────────────────────────────────────────────┐
│  #523 - ROLE_CHANGE                             │
├─────────────────────────────────────────────────┤
│  Usuario: Dr. Carlos García (@dr.garcia)        │
│  Cambio: Médico → Médico Jefe                   │
│  Razón: "Necesito aprobar recetas"              │
│  Ruta: /prescripciones/emitidas                 │
│  Fecha: 2025-10-08 14:30:25                     │
│  IP: 192.168.1.100                              │
└─────────────────────────────────────────────────┘
```

---

#### **Opción B: Desde Demo (Desarrollo)**

```
1. Navegar a: /demo/multi-rol
2. Pestaña: "Historial"
3. Ver cambios en tiempo real
```

---

## 🎯 **PARTE 3: Casos de Uso Reales**

### **Caso 1: Dr. García - Día Típico**

**Perfil:**
- Médico Jefe de Cardiología
- Roles: Médico + Médico Jefe

**Cronología:**

```
08:00 - Login
        Rol: Médico Jefe (primario)
        ↓
08:15 - Supervisión matutina
        Acción: Revisa recetas de residentes
        Rol activo: Médico Jefe
        Permisos: Aprobar, ver todas las recetas
        ↓
09:00 - Cambio de rol
        Clic en badge → Selecciona "Médico"
        Razón: "Inicio de consultas"
        ✅ Rol cambiado
        ↓
09:00-12:00 - Consultas
        Acción: Atiende 10 pacientes
        Rol activo: Médico
        Permisos: Prescribir, firmar
        ↓
        Prescribe 15 recetas como "Médico"
        Firma electrónica vinculada a "Médico"
        ↓
12:00 - Cambio de rol
        Clic en "Volver a rol primario"
        ✅ Médico Jefe restaurado
        ↓
12:30 - Aprobación de controlados
        Acción: Aprueba 3 medicamentos controlados
        Rol activo: Médico Jefe
        Solo Jefe puede aprobar
        ↓
14:00 - Genera reportes
        Acción: Exporta reporte mensual
        Rol activo: Médico Jefe
        Exportación permitida
```

**Auditoría del día:**
- Login: Médico Jefe
- Cambio 1: Médico Jefe → Médico (09:00)
- 15 prescripciones como "Médico"
- Cambio 2: Médico → Médico Jefe (12:00)
- 3 aprobaciones como "Médico Jefe"
- 1 exportación como "Médico Jefe"

**Cumplimiento:**
- ✅ Cada acción con rol específico
- ✅ Firmas vinculadas a rol correcto
- ✅ Segregación de responsabilidades clara

---

### **Caso 2: Lcda. Solís - Farmacéutica Jefe**

**Perfil:**
- Farmacéutica Jefe
- Roles: Farmacéutico + Administrativo

**Cronología:**

```
07:00 - Login
        Rol: Farmacéutico (primario)
        ↓
07:00-10:00 - Dispensación
        Acción: Dispensa 45 medicamentos
        Rol activo: Farmacéutico
        Permisos: Dispensar, verificar recetas
        ↓
10:00 - Navegación a reportes
        Va a: /reportes/exportar
        ⚠️  Sistema sugiere: "Cambiar a Administrativo"
        Clic en "Cambiar a Administrativo"
        ✅ Rol cambiado
        ↓
10:00-11:00 - Reportes
        Acción: Genera reporte mensual de farmacia
        Rol activo: Administrativo
        Permisos: Exportar, configurar reportes
        ↓
        Exporta a Excel
        ❌ NO puede dispensar (sin permisos)
        ↓
11:00 - Vuelve a farmacia
        Clic en badge → "Farmacéutico"
        ✅ Rol cambiado
        ↓
11:00-14:00 - Dispensación
        Continúa dispensando medicamentos
        Rol activo: Farmacéutico
```

**Beneficio del sistema:**
- ✅ Cambio rápido sin re-login
- ✅ Sugerencia automática útil
- ✅ Segregación: Como Admin NO dispensa
- ✅ Productividad alta

---

### **Caso 3: Alerta de Seguridad**

**Escenario:** Usuario con patrón sospechoso

```
Usuario: dr.lopez
Actividad detectada:
- 09:00 - Médico → Admin
- 09:05 - Admin → Médico
- 09:10 - Médico → Admin
- 09:15 - Admin → Médico
... (15 cambios en 1 hora)

↓

Sistema bloquea:
"Demasiados cambios de rol. Contacte soporte."

↓

Administrador revisa:
1. Va a Auditoría
2. Filtra por usuario: dr.lopez
3. Ve patrón anormal
4. Investiga razones
5. Puede bloquear usuario si es necesario
```

**Seguridad:**
- ✅ Rate limiting activo
- ✅ Auditoría detecta patrones
- ✅ Admin puede investigar
- ✅ Prevención de abuso

---

## 🎓 **PARTE 4: Mejores Prácticas**

### **Para Usuarios:**

**✅ HACER:**
1. Cambiar a rol adecuado para cada tarea
2. Usar razón descriptiva en cambios importantes
3. Volver a rol primario al finalizar tareas especiales
4. Aceptar sugerencias contextuales cuando sean correctas

**❌ NO HACER:**
1. Cambiar de rol excesivamente (rate limit)
2. Usar rol con más permisos de los necesarios
3. Ignorar sugerencias sin revisar

---

### **Para Administradores:**

**✅ HACER:**
1. Asignar solo roles necesarios
2. Definir rol primario según función principal
3. Revisar periódicamente roles asignados
4. Monitorear auditoría de cambios de rol
5. Capacitar usuarios sobre uso correcto

**❌ NO HACER:**
1. Asignar todos los roles a un usuario
2. Dar Admin a usuarios que no lo necesitan
3. Ignorar alertas de patrones sospechosos

---

## 🎯 **PARTE 5: Preguntas Frecuentes**

### **P1: ¿Puedo trabajar con múltiples roles al mismo tiempo?**
**R:** No. Trabajas con UN rol activo a la vez, pero puedes cambiar entre tus roles asignados sin re-login.

---

### **P2: ¿Qué pasa con mis permisos al cambiar de rol?**
**R:** Tus permisos cambian completamente al rol nuevo. Solo tienes los permisos del rol activo.

---

### **P3: ¿Se registran mis cambios de rol?**
**R:** Sí, todos los cambios se auditan con timestamp, razón, rol anterior/nuevo, ruta e IP.

---

### **P4: ¿Puedo quitarme el rol primario?**
**R:** No directamente. Debes cambiar primero el rol primario a otro, luego puedes quitar el anterior.

---

### **P5: ¿Cuántas veces puedo cambiar de rol?**
**R:** Máximo 10 veces por hora. Si necesitas más, contacta soporte.

---

### **P6: ¿Qué pasa si estoy inactivo 30 minutos?**
**R:** El sistema te vuelve automáticamente a tu rol primario por seguridad.

---

### **P7: ¿Las firmas electrónicas se vinculan al rol activo?**
**R:** Sí, cada firma se vincula al rol con el que firmaste (cumple FDA 21 CFR Part 11).

---

### **P8: ¿Puedo cambiar de rol en mitad de una tarea?**
**R:** Sí, pero se recomienda completar la tarea actual antes de cambiar.

---

### **P9: ¿Qué son las sugerencias contextuales?**
**R:** El sistema te sugiere cambiar de rol cuando detecta que la página requiere permisos de otro rol que tienes asignado.

---

### **P10: ¿Cómo veo mi historial de cambios de rol?**
**R:** Los admins pueden ver en Auditoría. Tú ves los últimos cambios en la sesión actual.

---

## ✅ **RESUMEN RÁPIDO**

**Para cambiar de rol:**
```
1. Clic en badge de rol activo (header)
2. Seleccionar rol deseado
3. Confirmar en modal
4. Listo! Trabajas con nuevo rol
```

**Para asignar roles (Admin):**
```
1. Seguridad → Usuarios
2. Doble clic en usuario
3. Pestaña "Rol"
4. Marcar checkboxes de roles
5. Guardar
```

**Para ver historial (Admin):**
```
1. Auditoría → Log auditoría
2. Filtrar por "ROLE_CHANGE"
3. Ver registros
```

---

## 🎉 **¡Listo para Usar!**

El sistema multi-rol está completamente funcional y listo para mejorar tu flujo de trabajo.

**Beneficios:**
- ✅ Cambio rápido sin re-login
- ✅ Seguridad según estándares internacionales
- ✅ Auditoría total
- ✅ UX fluido y profesional

---

**Documento creado:** Octubre 2025  
**Versión:** 1.0  
**Tipo:** Tutorial Interactivo
