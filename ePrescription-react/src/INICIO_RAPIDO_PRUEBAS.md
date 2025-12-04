# ⚡ INICIO RÁPIDO - Prueba en 5 Minutos

## 🚀 Pasos Rápidos

### 1️⃣ Llega a la Pantalla (30 segundos)

```
Tu App → Login → Dashboard → Menú Lateral
                                    ↓
                        "Seguridad y usuarios"
                                    ↓
                          "Roles y permisos"
```

O directo: Navega a `/seguridad/roles`

---

### 2️⃣ Mira Alrededor (1 minuto)

Verás:
- ✅ 4 cards con estadísticas
- ✅ 3 tabs: **Roles Base** | **Roles Personalizados** | **Pendientes**
- ✅ Tab "Roles Base" con 5 roles (Admin, Médico, Farmacéutico, etc.)
- ✅ Tab "Roles Personalizados" con 3 ejemplos precargados
- ✅ Tab "Pendientes" vacío (0)

---

### 3️⃣ Prueba Crear un Rol (3 minutos)

**Rápido y simple:**

1. Tab **"Roles Base"**
2. Busca rol **"Médico"**
3. Clic en **"⭐ Crear personalizado"**
4. **Wizard Paso 1:**
   - Nombre: `Médico de Investigación`
   - Siguiente
5. **Wizard Paso 2:**
   - Usuario ID: `USR-9999`
   - Nombre: `Dr. Test Prueba`
   - Email: `test@test.com`
   - **Permisos a Quitar:**
     ```
     prescriptions.create
     prescriptions.sign
     ```
   - Siguiente
6. **Wizard Paso 3:**
   - Justificación: `Médico investigador del departamento de estudios clínicos. Solo requiere acceso de lectura a expedientes sin capacidad de prescripción directa de medicamentos. Aprobado por comité de investigación protocolo 2024-045.`
   - Vigencia: **Permanente**
   - Clic en **"Crear Rol"**

**Resultado:**
```
✅ Rol personalizado creado
El rol ha sido creado exitosamente
```

7. Ve al tab **"Roles Personalizados"** → Verás tu nuevo rol listado (4 roles ahora)

---

### 4️⃣ Prueba Aprobar un Rol (2 minutos)

**Crea uno que requiera aprobación:**

1. Tab **"Roles Base"** → Rol **"Médico Jefe"**
2. Clic **"Crear personalizado"**
3. **Paso 1:**
   - Nombre: `Médico Jefe ER Turno Noche`
   - Siguiente
4. **Paso 2:**
   - Usuario: `USR-8888` / `Dra. Test ER` / `tester@test.com`
   - **Permisos a Agregar:**
     ```
     clinical_alerts.override
     ```
   - Siguiente
5. **Paso 3:**
   - Justificación: `Médico jefe de emergencias turno nocturno requiere capacidad de anular alertas clínicas en situaciones críticas de vida o muerte donde el juicio clínico prevalece sobre alertas automatizadas del sistema.`
   - Permanente
   - Crear

**Resultado:**
```
⚠️ Rol creado - Requiere aprobación
El rol incluye permisos críticos...
```

6. Ve al tab **"⚠️ Pendientes (1)"**
7. Verás un card naranja con toda la info
8. Clic en **"✓ Aprobar Rol"**
9. ✅ Toast: "Rol aprobado"
10. El rol desaparece de "Pendientes" y aparece en "Roles Personalizados"

---

## 🎯 Eso es Todo!

En 5 minutos probaste:
- ✅ Navegación completa
- ✅ Ver roles base y personalizados
- ✅ Crear rol personalizado (sin aprobación)
- ✅ Crear rol con aprobación requerida
- ✅ Aprobar rol pendiente
- ✅ Sistema funcionando al 100%

---

## 🔥 Prueba Extra Rápida: Validación SoD

**Intenta crear un rol INVÁLIDO:**

1. Roles Base → **"Farmacéutico"** → Crear personalizado
2. Usuario: `USR-7777` / `Test SoD` / `sod@test.com`
3. **Permisos a Agregar:** `prescriptions.sign` (⚠️ CONFLICTO!)
4. Justificación: "Prueba de validación"
5. Crear

**Resultado Esperado:**
```
❌ Error al crear rol
VIOLACIÓN SoD: Un rol no puede tener permisos de 
prescribir (firmar) Y dispensar...
```

✅ **Sistema bloquea roles que violan Separación de Funciones!**

---

## 📍 ¿Problemas?

**No veo los tabs:**
- Asegúrate de estar en `/seguridad/roles`
- Recarga la página

**No veo roles personalizados de ejemplo:**
- Verifica que `/utils/rolesStore.ts` tenga `customRolesDatabase` con los 3 ejemplos

**Error al crear:**
- Justificación debe tener mínimo 20 caracteres
- Formato de permisos: `modulo.permiso` (ej: `prescriptions.create`)
- Debes agregar O quitar al menos 1 permiso

---

## 📚 Documentación Completa

Para pruebas detalladas, ve a:
- `/GUIA_PRUEBAS_SISTEMA_HIBRIDO.md` - Guía completa paso a paso
- `/IMPLEMENTACION_SISTEMA_HIBRIDO.md` - Documentación técnica
- `/EJEMPLOS_CODIGO_ROLES_HIBRIDOS.md` - Ejemplos de código

---

**¡Listo para probar!** 🚀
