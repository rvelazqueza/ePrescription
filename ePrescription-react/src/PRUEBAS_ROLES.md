# Guía de Pruebas - Sistema de Roles y Permisos

## 🧪 Casos de Prueba

### 1. Acceder a la configuración de roles
**Pasos:**
1. Navegar a: Seguridad y usuarios → Roles y permisos
2. Verificar que se muestren 5 roles predefinidos
3. Verificar estadísticas en las tarjetas superiores

**Resultado esperado:**
- ✅ Se muestran los roles: Administrador, Médico, Farmacéutico, Médico Jefe, Administrativo
- ✅ Tarjetas muestran: Total roles (5), Roles activos (5), Total usuarios (82)

---

### 2. Abrir panel de configuración
**Pasos:**
1. Hacer clic en "Configurar permisos" en el rol "Médico"
2. Verificar que se abra el diálogo modal

**Resultado esperado:**
- ✅ Modal se abre con título "Configuración de Rol: Médico"
- ✅ Se muestra descripción y código del rol
- ✅ Tabs visibles: Permisos, Seguridad, Auditoría
- ✅ Tab "Permisos" activa por defecto

---

### 3. Visualizar matriz de permisos
**Pasos:**
1. En el modal, revisar la matriz de permisos
2. Verificar módulos visibles

**Resultado esperado:**
- ✅ Se muestran 10 módulos
- ✅ Módulos críticos marcados con badge "CRÍTICO" rojo
- ✅ Checkboxes marcados según permisos actuales del rol
- ✅ Badges de color por nivel de permiso (azul, verde, rojo, morado, naranja)
- ✅ Contador de permisos activos por módulo

---

### 4. Validación SoD - Separación de Funciones
**Pasos:**
1. Abrir configuración del rol "Médico"
2. En módulo "Prescripciones", marcar el permiso "Dispensar"
3. Observar alertas

**Resultado esperado:**
- ❌ **ERROR en rojo**: "VIOLACIÓN SoD: Un rol no puede tener permisos de prescribir (firmar) Y dispensar..."
- ✅ Botón "Guardar cambios" deshabilitado
- ✅ Alerta visible en la parte superior del modal

---

### 5. Validación de dependencias
**Pasos:**
1. Abrir configuración del rol "Administrativo"
2. En módulo "Prescripciones", desmarcar "Ver recetas"
3. Sin cerrar el modal, intentar marcar "Editar recetas"

**Resultado esperado:**
- ❌ **ERROR**: "El permiso 'Editar recetas' requiere el permiso 'Ver recetas'"
- ✅ Botón "Guardar cambios" deshabilitado

---

### 6. Advertencias HIPAA
**Pasos:**
1. Abrir configuración del rol "Médico Jefe"
2. En módulo "Pacientes", marcar el permiso "Exportar PHI"
3. Observar advertencias

**Resultado esperado:**
- ⚠️ **ADVERTENCIA en amarillo**: "ADVERTENCIA HIPAA: El permiso 'Exportar PHI' permite exportar datos protegidos de salud..."
- ✅ Campo de justificación aparece
- ✅ Botón "Guardar cambios" habilitado pero requiere justificación

---

### 7. Guardar sin justificación (permisos críticos)
**Pasos:**
1. Con advertencias activas (paso anterior)
2. Intentar guardar sin escribir justificación
3. Hacer clic en "Guardar cambios"

**Resultado esperado:**
- ❌ Toast de error: "Justificación requerida"
- ✅ Descripción: "Debe proporcionar una razón para cambios en permisos críticos"
- ✅ Modal permanece abierto

---

### 8. Guardar con justificación
**Pasos:**
1. Con advertencias activas
2. Escribir justificación: "Autorizado por Director Médico para reportes especiales"
3. Hacer clic en "Guardar cambios"

**Resultado esperado:**
- ✅ Toast de éxito: "Rol actualizado correctamente"
- ✅ Modal se cierra
- ✅ Tabla de roles se recarga
- ✅ Cambios persistidos en el store

---

### 9. Ver información de seguridad
**Pasos:**
1. Abrir configuración de cualquier rol
2. Hacer clic en tab "Seguridad"

**Resultado esperado:**
- ✅ Se muestra nivel de seguridad del rol
- ✅ Badge indicando nivel (ALTO/CRÍTICO)
- ✅ Lista de cumplimiento normativo con checkmarks:
  - HIPAA
  - HL7 FHIR R4
  - FDA 21 CFR Part 11
  - OMS
- ✅ Información sobre aprobación y delegación

---

### 10. Ver auditoría
**Pasos:**
1. Abrir configuración de cualquier rol
2. Hacer clic en tab "Auditoría"

**Resultado esperado:**
- ✅ Se muestra historial de cambios
- ✅ Fecha de última modificación
- ✅ Usuario que realizó la modificación
- ✅ Log de eventos (actualización, creación)

---

### 11. Modificar múltiples permisos
**Pasos:**
1. Abrir configuración del rol "Farmacéutico"
2. Marcar varios permisos en diferentes módulos
3. Verificar que no haya conflictos
4. Guardar cambios

**Resultado esperado:**
- ✅ Checkboxes se marcan/desmarcan correctamente
- ✅ Validación en tiempo real funciona
- ✅ Si no hay errores, se puede guardar
- ✅ Toast de confirmación al guardar

---

### 12. Cancelar cambios
**Pasos:**
1. Abrir configuración de un rol
2. Modificar varios permisos
3. Hacer clic en "Cancelar"

**Resultado esperado:**
- ✅ Modal se cierra
- ✅ Cambios NO se guardan
- ✅ Al reabrir, permisos originales siguen intactos

---

### 13. Buscar y filtrar roles
**Pasos:**
1. En la página de roles (sin modal)
2. Usar campo de búsqueda si está disponible
3. Verificar filtrado de roles

**Resultado esperado:**
- ✅ Tabla de roles responde a búsqueda
- ✅ Roles se filtran correctamente

---

### 14. Responsive design
**Pasos:**
1. Abrir modal en diferentes tamaños de pantalla
2. Verificar que la matriz de permisos sea responsive

**Resultado esperado:**
- ✅ Modal se adapta al tamaño de pantalla
- ✅ Scroll vertical funciona cuando es necesario
- ✅ Checkboxes y badges se reorganizan en pantallas pequeñas

---

### 15. Estado deshabilitado del botón guardar
**Pasos:**
1. Crear errores de validación
2. Verificar estado del botón "Guardar cambios"

**Resultado esperado:**
- ✅ Botón aparece grisado/opaco
- ✅ Cursor muestra "not-allowed"
- ✅ Clic no hace nada
- ✅ Al corregir errores, botón se habilita automáticamente

---

## 🎯 Validaciones Específicas por Rol

### Rol: Médico
**Permisos que DEBE tener:**
- ✅ Prescripciones: create, read, update, sign
- ✅ Pacientes: create, read, update
- ✅ Usuarios: read_self

**Permisos que NO debe tener:**
- ❌ Prescripciones: dispense (SoD)
- ❌ Usuarios: manage_roles
- ❌ Sistema: configure, backup, restore

### Rol: Farmacéutico
**Permisos que DEBE tener:**
- ✅ Prescripciones: read, verify, dispense
- ✅ Inventario: create, read, update, adjust

**Permisos que NO debe tener:**
- ❌ Prescripciones: sign, create (SoD)
- ❌ Pacientes: update, export

### Rol: Administrador
**Permisos especiales:**
- ✅ Acceso a TODOS los módulos
- ✅ Permisos de nivel "admin" en todos los módulos
- ⚠️ No se puede modificar si es el único admin activo

---

## 📊 Checklist de Funcionalidades

- [ ] Modal se abre correctamente
- [ ] Tabs funcionan (Permisos, Seguridad, Auditoría)
- [ ] Checkboxes marcan/desmarcan permisos
- [ ] Validación SoD funciona (firmar vs dispensar)
- [ ] Validación de dependencias funciona
- [ ] Advertencias HIPAA se muestran
- [ ] Campo de justificación aparece cuando es necesario
- [ ] Botón guardar se deshabilita con errores
- [ ] Guardar sin justificación muestra error
- [ ] Guardar con justificación funciona
- [ ] Toast notifications funcionan
- [ ] Modal se cierra después de guardar
- [ ] Tabla se recarga después de guardar
- [ ] Cambios persisten en rolesStore
- [ ] Cancelar descarta cambios
- [ ] Badges de colores por nivel de permiso
- [ ] Iconos de módulos se muestran
- [ ] Módulos críticos marcados correctamente
- [ ] Contador de permisos por módulo funciona
- [ ] Tab Seguridad muestra información correcta
- [ ] Tab Auditoría muestra historial
- [ ] Cumplimiento normativo listado
- [ ] Validación en tiempo real funciona
- [ ] Responsive design funciona

---

## 🐛 Escenarios de Error a Verificar

### Error 1: Conflicto SoD
```
Acción: Marcar "firmar" Y "dispensar"
Error esperado: "VIOLACIÓN SoD: Un rol no puede tener permisos de prescribir (firmar) Y dispensar..."
```

### Error 2: Dependencia faltante
```
Acción: Marcar "editar" sin "leer"
Error esperado: "El permiso 'Editar recetas' requiere el permiso 'Ver recetas'"
```

### Error 3: Sin justificación
```
Acción: Guardar con advertencias sin justificación
Error esperado: "Justificación requerida"
```

---

## ✅ Criterios de Aceptación

**Para considerar el sistema completo y funcional:**

1. ✅ Todos los roles predefinidos se cargan desde rolesStore
2. ✅ Modal de configuración se abre sin errores
3. ✅ Todas las validaciones funcionan correctamente
4. ✅ Guardado persiste cambios en el store
5. ✅ Auditoría registra todas las modificaciones
6. ✅ Toast notifications informan al usuario correctamente
7. ✅ No hay errores en la consola del navegador
8. ✅ UX es intuitiva y profesional
9. ✅ Responsive design funciona en todos los tamaños
10. ✅ Cumplimiento normativo está documentado

---

## 🚀 Para Ejecutar Pruebas

```bash
# 1. Asegurar que la aplicación está corriendo
npm run dev

# 2. Navegar a la página de roles
http://localhost:5173/#/seguridad/roles

# 3. Ejecutar cada caso de prueba en orden
# 4. Documentar cualquier error encontrado
# 5. Verificar checklist de funcionalidades
```

---

## 📝 Reporte de Bugs (Template)

```markdown
### Bug #[número]

**Descripción:**
[Descripción breve del problema]

**Pasos para reproducir:**
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

**Resultado actual:**
[Lo que sucede actualmente]

**Resultado esperado:**
[Lo que debería suceder]

**Severidad:**
- [ ] Crítico (bloquea funcionalidad principal)
- [ ] Alto (funcionalidad afectada pero hay workaround)
- [ ] Medio (problema estético o UX)
- [ ] Bajo (mejora sugerida)

**Screenshots:**
[Si aplica]

**Consola:**
```
[Errores de consola si los hay]
```
```

---

**Fecha de última actualización**: Octubre 2025  
**Versión del sistema**: 1.0  
**Tester**: [Tu nombre]
