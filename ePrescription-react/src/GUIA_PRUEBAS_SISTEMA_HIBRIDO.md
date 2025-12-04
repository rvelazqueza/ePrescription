# 🧪 Guía de Pruebas: Sistema Híbrido de Roles

## 📍 Cómo Llegar al Sistema

### Paso 1: Iniciar la Aplicación

1. Abre tu aplicación ePrescription
2. Inicia sesión (o usa `isAuthenticated = true` en App.tsx para desarrollo)
3. Una vez en el dashboard, busca el menú lateral

---

### Paso 2: Navegar a Roles y Permisos

**Ruta:** Menú Lateral → **Seguridad y usuarios** → **Roles y permisos**

O desde la barra de navegación: `/seguridad/roles`

---

## 🎯 Qué Verás Al Entrar

### Pantalla Principal

Verás un header azul con:
```
┌────────────────────────────────────────────────┐
│ 🛡️ Roles y Permisos                           │
│ Sistema Híbrido RBAC • Roles Base +            │
│ Personalizados • HIPAA/FDA/FHIR Compliant     │
└────────────────────────────────────────────────┘
```

### 4 Cards de Estadísticas

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total roles │ Roles       │ Total       │ Pendientes  │
│     8       │ activos: 8  │ usuarios:82 │     0       │
│ 5 base +    │             │             │ Aprobación  │
│ 3 personal. │             │             │ requerida   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Qué significan:**
- **Total roles: 8** → 5 roles base + 3 personalizados
- **Roles activos: 8** → Todos están activos
- **Total usuarios: 82** → Suma de usuarios asignados
- **Pendientes: 0** → No hay roles esperando aprobación

---

## 📑 Sistema de Tabs

Verás 3 tabs principales:

```
┌─────────────┬────────────────────────┬─────────────┐
│ 🛡️ Roles   │ ⭐ Roles              │ ⚠️ Pendien- │
│  Base (5)   │  Personalizados (3)   │  tes (0)    │
└─────────────┴────────────────────────┴─────────────┘
```

---

## 🧪 PRUEBA 1: Ver Roles Base

### Acción:
1. Asegúrate de estar en el tab **"Roles Base (5)"**
2. Verás una tabla con 5 filas

### Qué Esperar:

```
┌──────────────────┬─────────────────┬────────────┬──────────┬─────────────────┐
│ Rol Base         │ Descripción     │ Asignac.   │ Derivados│ Acciones        │
├──────────────────┼─────────────────┼────────────┼──────────┼─────────────────┤
│ 🛡️ Administrador│ Acceso total... │ 2 directos │ 0 perso. │ Ver | Crear     │
│ ADMIN            │                 │            │          │ permisos         │
├──────────────────┼─────────────────┼────────────┼──────────┼─────────────────┤
│ 🛡️ Médico       │ Profesional...  │ 42 directos│ 3 perso. │ Ver | Crear     │
│ DOCTOR           │                 │            │          │ permisos         │
├──────────────────┼─────────────────┼────────────┼──────────┼─────────────────┤
│ 🛡️ Farmacéutico │ Profesional...  │ 11 directos│ 1 perso. │ Ver | Crear     │
│ PHARMACIST       │                 │            │          │ permisos         │
├──────────────────┼─────────────────┼────────────┼──────────┼─────────────────┤
│ 🛡️ Médico Jefe  │ Médico con...   │ 4 directos │ 1 perso. │ Ver | Crear     │
│ CHIEF_DOCTOR     │                 │            │          │ permisos         │
├──────────────────┼─────────────────┼────────────┼──────────┼─────────────────┤
│ 🛡️ Administrativo│ Personal...     │ 18 directos│ 0 perso. │ Ver | Crear     │
│ ADMIN_STAFF      │                 │            │          │ permisos         │
└──────────────────┴─────────────────┴────────────┴──────────┴─────────────────┘
```

### Pruebas en esta vista:

**A) Ver Permisos de un Rol Base:**
1. Haz clic en **"Ver permisos"** en cualquier rol (ej: Médico)
2. Se abrirá un dialog grande mostrando:
   - Todos los permisos del rol organizados por módulo
   - Pestañas: Permisos | Seguridad | Auditoría
3. **IMPORTANTE:** Los permisos están en modo "solo lectura" - no puedes editarlos
4. Cierra el dialog con "X" o "Cancelar"

**B) Botón "Crear personalizado":**
1. Haz clic en **"Crear personalizado"** en el rol "Médico Jefe"
2. Se abrirá el **Wizard de 3 Pasos** (lo probaremos después)

---

## 🧪 PRUEBA 2: Ver Roles Personalizados

### Acción:
1. Haz clic en el tab **"⭐ Roles Personalizados (3)"**

### Qué Esperar:

```
┌─────────────────────┬──────────────┬──────────────┬──────────┬────────┬──────────┬─────────┐
│ Rol Personalizado   │ Rol Base     │ Usuario      │ Ajustes  │ Estado │ Vigencia │ Acciones│
├─────────────────────┼──────────────┼──────────────┼──────────┼────────┼──────────┼─────────┤
│ ⭐ Admin Respaldo TI│ Administrador│ Carlos Rojas │ -2 quit. │ active │ Permanen.│ Ver|Rev.│
│ ADMIN_BACKUP_IT     │              │ carlos.rojas@│          │        │          │         │
│                     │              │ hospital.com │          │        │          │         │
├─────────────────────┼──────────────┼──────────────┼──────────┼────────┼──────────┼─────────┤
│ ⭐ Médico Jefe ER   │ Médico Jefe  │ Dra. Ana     │ +1 agreg.│ active │ Permanen.│ Ver|Rev.│
│ CHIEF_DOCTOR_ER     │              │ Vargas Solís │          │        │          │         │
│                     │              │ ana.vargas@  │          │        │          │         │
├─────────────────────┼──────────────┼──────────────┼──────────┼────────┼──────────┼─────────┤
│ ⭐ Farmacéutico     │ Farmacéutico │ Lic. Marco   │+2 agreg. │ active │ Hasta    │ Ver|Rev.│
│ Investigador        │              │ Solís Castro │-2 quit.  │        │2025-12-31│         │
│ PHARMACIST_RESEARCH │              │ marco.solis@ │          │        │          │         │
└─────────────────────┴──────────────┴──────────────┴──────────┴────────┴──────────┴─────────┘
```

### Pruebas en esta vista:

**A) Ver Detalles de Rol Personalizado:**
1. Haz clic en **"Ver detalles"** en "Admin Respaldo TI"
2. Se abre un dialog mostrando:
   - Nombre del rol
   - Usuario asignado
   - Permisos efectivos (con los ajustes aplicados)
   - Justificación original
   - Fechas de creación y aprobación

**B) Revocar Rol:**
1. Haz clic en **"Revocar"** en cualquier rol
2. Sistema pide: "Razón para revocar el rol..."
3. Escribe algo como: "Prueba de revocación - fin de proyecto"
4. ✅ Toast de éxito: "Rol revocado - El rol personalizado ha sido desactivado"
5. El rol desaparece de esta lista (va a estado revocado)
6. **Recarga la página** para ver los datos iniciales de nuevo

---

## 🧪 PRUEBA 3: Crear un Rol Personalizado (PRINCIPAL)

Esta es la prueba más importante. Vamos a crear un rol personalizado paso a paso.

### Escenario:
Crear un rol para un **Médico de Investigación Clínica** que puede ver datos pero NO puede crear recetas.

### Paso a Paso:

#### 1. Iniciar Creación
1. Ve al tab **"Roles Base (5)"**
2. Busca el rol **"Médico"**
3. Haz clic en **"⭐ Crear personalizado"**
4. Se abre el **Wizard de 3 Pasos**

---

#### 2. PASO 1: Información Básica

Verás:
```
┌─────────────────────────────────────────────────┐
│ ⭐ Crear Rol Personalizado                     │
│ Crear un rol derivado de "Médico" con permisos │
│ ajustados                                       │
├─────────────────────────────────────────────────┤
│ Paso 1 de 3                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                 │
│ Nombre del rol personalizado*                  │
│ ┌─────────────────────────────────────────┐   │
│ │ Médico Investigador Clínico             │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ Descripción                                     │
│ ┌─────────────────────────────────────────┐   │
│ │ Médico dedicado a investigación clínica,│   │
│ │ sin prescripción directa de recetas     │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ ℹ️ Rol Base: Médico                            │
│ Este rol heredará todos los permisos del rol   │
│ base "Médico" y podrá agregar o quitar         │
│ permisos específicos.                           │
│                                                 │
│ [Cancelar]              [Siguiente →]           │
└─────────────────────────────────────────────────┘
```

**Qué hacer:**
- **Nombre:** `Médico Investigador Clínico`
- **Descripción:** `Médico dedicado a investigación clínica, solo lectura de expedientes, sin prescripción directa`
- Haz clic en **"Siguiente"**

---

#### 3. PASO 2: Usuario y Permisos

```
┌─────────────────────────────────────────────────┐
│ Paso 2 de 3                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                 │
│ ID de Usuario*          Nombre Completo*       │
│ ┌─────────────────┐    ┌─────────────────┐    │
│ │ USR-0150        │    │ Dr. Luis García │    │
│ └─────────────────┘    └─────────────────┘    │
│                                                 │
│ Email del Usuario*                              │
│ ┌─────────────────────────────────────────┐   │
│ │ luis.garcia@hospital.com                │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ Permisos a Agregar (opcional)                  │
│ Formato: modulo.permiso                         │
│ ┌─────────────────────────────────────────┐   │
│ │ patients.export                         │   │
│ │ reports.export                          │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ Permisos a Quitar (opcional)                   │
│ Formato: modulo.permiso                         │
│ ┌─────────────────────────────────────────┐   │
│ │ prescriptions.create                    │   │
│ │ prescriptions.sign                      │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ [← Anterior]  [Cancelar]  [Siguiente →]        │
└─────────────────────────────────────────────────┘
```

**Qué hacer:**
- **ID Usuario:** `USR-0150` (inventa uno)
- **Nombre:** `Dr. Luis García Méndez`
- **Email:** `luis.garcia@hospital.com`
- **Permisos a Agregar:** 
  ```
  patients.export
  reports.export
  ```
  (Cada permiso en una línea)
  
- **Permisos a Quitar:**
  ```
  prescriptions.create
  prescriptions.sign
  ```
  (Cada permiso en una línea)

- Haz clic en **"Siguiente"**

---

#### 4. PASO 3: Justificación y Vigencia

```
┌─────────────────────────────────────────────────┐
│ Paso 3 de 3                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                 │
│ Justificación* (mínimo 20 caracteres)          │
│ ┌─────────────────────────────────────────┐   │
│ │ Dr. Luis García es médico investigador │   │
│ │ asignado al departamento de investiga-  │   │
│ │ ción clínica del proyecto COVID-2024.   │   │
│ │                                         │   │
│ │ Funciones:                              │   │
│ │ - Revisión de expedientes clínicos      │   │
│ │ - Exportación de datos anonimizados     │   │
│ │ - Análisis estadístico para estudios    │   │
│ │                                         │   │
│ │ NO requiere:                            │   │
│ │ - Prescripción directa de medicamentos  │   │
│ │ - Firma de recetas                      │   │
│ │                                         │   │
│ │ Aprobado por: Comité de Ética (2024-10)│   │
│ │ Protocolo: INV-COVID-2024-045          │   │
│ └─────────────────────────────────────────┘   │
│ Caracteres: 245 / 20 mínimo                    │
│                                                 │
│ Vigencia                                        │
│ ⚫ Permanente     ⚪ Temporal hasta: [_____]    │
│                                                 │
│ ℹ️ Este rol agrega permisos. Si incluye        │
│ permisos críticos, requerirá aprobación antes  │
│ de activarse.                                   │
│                                                 │
│ [← Anterior]  [Cancelar]  [+ Crear Rol]        │
└─────────────────────────────────────────────────┘
```

**Qué hacer:**
- **Justificación:** Copia el texto de ejemplo arriba (o escribe algo similar largo)
- **Vigencia:** Deja en "Permanente" (o selecciona "Temporal" y elige una fecha)
- Haz clic en **"+ Crear Rol Personalizado"**

---

#### 5. Resultado Esperado

**Si agregaste permisos críticos (como `patients.export`):**
```
⚠️ Rol creado - Requiere aprobación
El rol incluye permisos críticos y requiere 
aprobación antes de activarse
```

El rol irá al tab **"Pendientes"** con estado `pending`.

**Si solo quitaste permisos:**
```
✅ Rol personalizado creado
El rol ha sido creado exitosamente
```

El rol aparece inmediatamente en el tab **"Roles Personalizados"** con estado `active`.

---

## 🧪 PRUEBA 4: Aprobar Rol Pendiente

Si en la prueba anterior agregaste permisos críticos, tu rol estará pendiente.

### Paso a Paso:

1. Ve al tab **"⚠️ Pendientes (1)"** (ahora tendrá 1)
2. Verás un card naranja con toda la información:

```
┌─────────────────────────────────────────────────┐
│ ⚠️ Médico Investigador Clínico      [Pendiente]│
│ Base: Médico • Usuario: Dr. Luis García        │
├─────────────────────────────────────────────────┤
│ Ajustes de Permisos:                           │
│                                                 │
│ ➕ Permisos Agregados:                         │
│ ┌────────────────────────────────────┐        │
│ │ • patients.export                  │        │
│ │ • reports.export                   │        │
│ └────────────────────────────────────┘        │
│                                                 │
│ ➖ Permisos Quitados:                          │
│ ┌────────────────────────────────────┐        │
│ │ • prescriptions.create             │        │
│ │ • prescriptions.sign               │        │
│ └────────────────────────────────────┘        │
│                                                 │
│ Justificación:                                 │
│ ┌────────────────────────────────────┐        │
│ │ Dr. Luis García es médico investi- │        │
│ │ gador asignado al departamento...  │        │
│ │ [texto completo mostrado]          │        │
│ └────────────────────────────────────┘        │
│                                                 │
│ Creado por: Administrador del Sistema          │
│ Fecha: 2025-10-09                              │
│                                                 │
│ [✓ Aprobar Rol]  [✗ Rechazar]                 │
└─────────────────────────────────────────────────┘
```

3. **Para Aprobar:**
   - Haz clic en **"✓ Aprobar Rol"**
   - ✅ Toast: "Rol aprobado - El rol ha sido activado"
   - El card desaparece de "Pendientes"
   - Aparece en tab "Roles Personalizados" con estado `active`

4. **Para Rechazar:**
   - Haz clic en **"✗ Rechazar"**
   - Sistema pide: "Razón para rechazar el rol..."
   - Escribe: "No hay aprobación del comité de ética"
   - ✅ Toast: "Rol rechazado - El usuario ha sido notificado"
   - El rol va a estado `rejected`

---

## 🧪 PRUEBA 5: Validaciones Automáticas

Intenta crear un rol que viole SoD (Separación de Funciones):

### Escenario: Rol que VIOLA SoD

1. Ve a "Roles Base" → "Farmacéutico"
2. Clic en "Crear personalizado"
3. **Paso 1:** 
   - Nombre: `Farmacéutico Híbrido` 
   - Siguiente
4. **Paso 2:**
   - Usuario: `USR-9999` / `Test User` / `test@test.com`
   - **Permisos a Agregar:** `prescriptions.sign` (⚠️ CONFLICTO!)
   - **Permisos a Quitar:** (dejar vacío)
   - Siguiente
5. **Paso 3:**
   - Justificación: "Prueba de validación de separación de funciones en el sistema"
   - Clic en "Crear Rol"

### Resultado Esperado:

```
❌ Error al crear rol
VIOLACIÓN SoD: Un rol no puede tener permisos de 
prescribir (firmar) Y dispensar. Esto viola las 
normas de Separación de Funciones (FDA 21 CFR Part 11).
```

**El sistema NO permite crear el rol.** ✅ Validación funcionando!

---

## 🧪 PRUEBA 6: Ver Estadísticas Actualizadas

Después de crear roles personalizados:

1. Observa los 4 cards en la parte superior
2. Los números deberían cambiar:

**Antes:**
```
Total roles: 8 (5 base + 3 personalizados)
Pendientes: 0
```

**Después de crear 1 rol pendiente:**
```
Total roles: 9 (5 base + 4 personalizados)
Pendientes: 1
```

**Después de aprobar:**
```
Total roles: 9 (5 base + 4 personalizados)
Pendientes: 0
```

---

## 📊 Resumen de Pruebas

### Checklist de Pruebas:

- [ ] **Prueba 1:** Ver roles base (5 roles) ✓
- [ ] **Prueba 2:** Ver roles personalizados (3 roles) ✓
- [ ] **Prueba 3:** Crear rol personalizado (wizard 3 pasos) ✓
- [ ] **Prueba 4:** Aprobar rol pendiente ✓
- [ ] **Prueba 5:** Validar SoD (rechazo automático) ✓
- [ ] **Prueba 6:** Ver estadísticas actualizadas ✓
- [ ] **Extra:** Revocar rol personalizado ✓
- [ ] **Extra:** Ver detalles de rol base ✓
- [ ] **Extra:** Ver detalles de rol personalizado ✓

---

## 🐛 Troubleshooting

### Problema: No veo los roles personalizados de ejemplo

**Solución:** Los roles se cargan desde `/utils/rolesStore.ts`. Asegúrate de que el archivo tenga los 3 roles de ejemplo:
- CUSTOM-001: Admin Respaldo TI
- CUSTOM-002: Médico Jefe ER
- CUSTOM-003: Farmacéutico Investigador

### Problema: Error al crear rol

**Posibles causas:**
1. Justificación muy corta (< 20 caracteres)
2. Usuario sin ID/nombre/email
3. Ningún permiso agregado ni quitado
4. Formato incorrecto de permisos (debe ser `modulo.permiso`)

### Problema: No aparece el tab "Pendientes"

**Solución:** El tab siempre está visible, pero si no hay roles pendientes mostrará "(0)". Crea un rol con permisos críticos para ver uno pendiente.

---

## 🎯 Próximos Pasos Después de Probar

Una vez que hayas completado todas las pruebas:

1. **Experimenta creando diferentes roles:**
   - Médico sin firma
   - Admin sin restore
   - Farmacéutico con export

2. **Prueba diferentes validaciones:**
   - Intenta crear roles con conflictos
   - Prueba permisos que requieren otros permisos
   - Crea roles temporales con fechas

3. **Explora la auditoría:**
   - Cada acción se registra
   - Ve a "Auditoría y cumplimiento" para ver logs

4. **Integra con usuarios:**
   - En "Usuarios", asigna roles personalizados a usuarios reales
   - Prueba el sistema multi-rol

---

## 💡 Tips de Prueba

### Para Desarrollo Rápido:

1. **Salta el login:** En `App.tsx`, cambia `isAuthenticated` a `true`
2. **Datos de prueba:** Usa IDs inventados (USR-9999, USR-8888, etc.)
3. **Reload rápido:** Después de revocar, recarga la página para volver a estado inicial

### Para Probar Validaciones:

**Formatos correctos de permisos:**
```
✅ prescriptions.create
✅ patients.export
✅ clinical_alerts.override

❌ prescriptions (falta .permiso)
❌ create (falta modulo.)
❌ prescriptions_create (usar punto, no guión bajo)
```

### Para Probar Aprobaciones:

1. Agrega permisos "críticos" como:
   - `clinical_alerts.override`
   - `patients.export`
   - `security.manage`
   - `system.restore`

2. Solo quitar permisos → No requiere aprobación
3. Agregar permisos normales → No requiere aprobación
4. Agregar permisos críticos → Requiere aprobación ⚠️

---

## ✅ Confirmación de Éxito

Si puedes hacer todo esto, el sistema está funcionando perfectamente:

1. ✅ Ver 5 roles base
2. ✅ Ver 3 roles personalizados de ejemplo
3. ✅ Crear un nuevo rol personalizado
4. ✅ Ver el rol en "Pendientes" (si tiene permisos críticos)
5. ✅ Aprobar el rol
6. ✅ Ver el rol en "Roles Personalizados" activo
7. ✅ Revocar el rol
8. ✅ Sistema rechaza roles que violan SoD
9. ✅ Estadísticas se actualizan correctamente

---

**¡Felicidades! El sistema híbrido de roles está 100% funcional.** 🎉

¿Necesitas ayuda con alguna prueba específica o encontraste algún problema? ¡Dime y te ayudo!
