# 🔧 Solución: Scroll y Roles Personalizados en Editar Usuario

## 🎯 Problemas Identificados

### 1. **No hay scrollbar vertical en ningún tab**
- ❌ El `DialogContent` tiene altura fija pero `overflow-hidden`
- ❌ El `ScrollArea` global no funciona correctamente
- ❌ Los tabs no tienen scroll individual

### 2. **Roles personalizados no se muestran ni se pueden seleccionar**
- ❌ La lógica `isForThisUser` filtra TODOS los roles personalizados
- ❌ Solo muestra roles donde `role.userId === user.id`
- ❌ Los roles personalizados del usuario NO aparecen

---

## 📝 Correcciones Necesarias

### Cambio 1: Estructura del Diálogo (Línea 331)

**Antes:**
```tsx
<DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
```

**Después:**
```tsx
<DialogContent className="max-w-4xl h-[90vh] flex flex-col">
```

**Razón:** Quitar `overflow-hidden` y usar altura fija `h-[90vh]` en lugar de `max-h-[90vh]`

---

### Cambio 2: Contenedor de Tabs (Línea 346)

**Antes:**
```tsx
<Tabs defaultValue="basic" className="flex-1 overflow-hidden flex flex-col">
  <TabsList className="grid w-full grid-cols-5">
    ...
  </TabsList>

  <ScrollArea className="flex-1 pr-4">
    {/* Todos los TabsContent aquí */}
  </ScrollArea>
</Tabs>
```

**Después:**
```tsx
<Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
  <TabsList className="grid w-full grid-cols-5 flex-shrink-0">
    ...
  </TabsList>

  <div className="flex-1 min-h-0 overflow-hidden">
    {/* Cada TabsContent con su propio ScrollArea */}
  </div>
</Tabs>
```

**Razón:** 
- Agregar `min-h-0` para que flexbox funcione correctamente
- Agregar `flex-shrink-0` al TabsList
- Eliminar ScrollArea global y agregar un div contenedor

---

### Cambio 3: Tab "Información Básica" (Línea 357+)

**Antes:**
```tsx
<TabsContent value="basic" className="space-y-6 mt-4">
  <Alert>...</Alert>
  <div>...</div>
  ...
</TabsContent>
```

**Después:**
```tsx
<TabsContent value="basic" className="h-full m-0 p-0">
  <ScrollArea className="h-full px-1">
    <div className="space-y-6 mt-4 pr-4">
      <Alert>...</Alert>
      <div>...</div>
      ...
    </div>
  </ScrollArea>
</TabsContent>
```

**Razón:** Cada tab debe tener su propio ScrollArea con:
- `h-full` para ocupar toda la altura disponible
- `m-0 p-0` en el TabsContent
- `pr-4` en el contenido para separar del scrollbar

---

### Cambio 4: Tab "Rol" (Línea 457+)

**Antes:**
```tsx
<TabsContent value="role" className="space-y-6 mt-4">
  <Alert>...</Alert>
  <Card>...</Card>
  ...
</TabsContent>
```

**Después:**
```tsx
<TabsContent value="role" className="h-full m-0 p-0">
  <ScrollArea className="h-full px-1">
    <div className="space-y-6 mt-4 pr-4">
      <Alert>...</Alert>
      <Card>...</Card>
      ...
    </div>
  </ScrollArea>
</TabsContent>
```

---

### Cambio 5: Tab "Permisos" (Línea 832+)

**Antes:**
```tsx
<TabsContent value="permissions" className="space-y-6 mt-4">
  <Alert>...</Alert>
  <Card>...</Card>
  ...
</TabsContent>
```

**Después:**
```tsx
<TabsContent value="permissions" className="h-full m-0 p-0">
  <ScrollArea className="h-full px-1">
    <div className="space-y-6 mt-4 pr-4">
      <Alert>...</Alert>
      <Card>...</Card>
      ...
    </div>
  </ScrollArea>
</TabsContent>
```

---

### Cambio 6: Tab "Seguridad" (buscar donde esté)

**Antes:**
```tsx
<TabsContent value="security" className="space-y-6 mt-4">
  ...
</TabsContent>
```

**Después:**
```tsx
<TabsContent value="security" className="h-full m-0 p-0">
  <ScrollArea className="h-full px-1">
    <div className="space-y-6 mt-4 pr-4">
      ...
    </div>
  </ScrollArea>
</TabsContent>
```

---

### Cambio 7: Tab "Auditoría" (buscar donde esté)

**Antes:**
```tsx
<TabsContent value="audit" className="space-y-6 mt-4">
  ...
</TabsContent>
```

**Después:**
```tsx
<TabsContent value="audit" className="h-full m-0 p-0">
  <ScrollArea className="h-full px-1">
    <div className="space-y-6 mt-4 pr-4">
      ...
    </div>
  </ScrollArea>
</TabsContent>
```

---

### Cambio 8: Mostrar TODOS los Roles Personalizados (Línea 625+)

**PROBLEMA PRINCIPAL:** La lógica actual filtra roles personalizados basándose en `userId`, pero debería mostrar TODOS los roles personalizados disponibles para que el administrador pueda asignarlos.

**Antes (Línea 636):**
```tsx
const isForThisUser = role.type === 'custom' && role.userId === user.id;
```

**Opción A - Mostrar Solo Roles del Usuario Actual:**
```tsx
// Filtrar solo roles personalizados de este usuario ANTES del .map()
const userCustomRoles = customRoles.filter(r => 
  r.type === 'custom' && 
  (r.userId === user.id || r.status === 'active')
);

// Luego iterar sobre userCustomRoles
{userCustomRoles.map((role) => {
  const isAssigned = assignedRoles.includes(role.name);
  const isPrimary = editedUser.role === role.name;
  // ... resto del código
})}
```

**Opción B - Mostrar TODOS pero Solo Permitir Seleccionar los del Usuario:**
```tsx
// Mantener la lógica actual pero modificar la condición
{customRoles.map((role) => {
  const isAssigned = assignedRoles.includes(role.name);
  const isPrimary = editedUser.role === role.name;
  
  // CAMBIAR ESTA LÍNEA:
  // En lugar de comparar userId, verificar si el rol no tiene userId asignado
  // O si es del usuario actual
  const isAvailableForUser = role.type === 'custom' && (
    !role.userId ||  // Rol personalizado sin asignar a usuario específico
    role.userId === user.id ||  // Rol asignado a este usuario
    role.status === 'active'  // Rol activo
  );
  
  return (
    <div key={role.id} className={`... ${!isAvailableForUser ? 'opacity-60' : ''}`}>
      <Checkbox
        checked={isAssigned}
        onCheckedChange={(checked) => {
          if (!isAvailableForUser) {
            toast.error('Rol no disponible', {
              description: 'Este rol personalizado no está disponible para este usuario',
              duration: 4000,
            });
            return;
          }
          // ... resto de la lógica
        }}
        disabled={isPrimary || !isAvailableForUser}
      />
      ...
    </div>
  );
})}
```

**Opción C - RECOMENDADA: Mostrar SOLO roles disponibles:**
```tsx
{/* Filtrar roles personalizados disponibles para este usuario */}
{(() => {
  const availableCustomRoles = customRoles.filter(role => {
    // Mostrar roles que:
    // 1. Están asignados a este usuario específicamente
    // 2. O son roles "genéricos" sin usuario específico
    return role.userId === user.id || !role.userId;
  });

  if (availableCustomRoles.length === 0) {
    return (
      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription>
          No hay roles personalizados disponibles para este usuario.
          Puede crear roles personalizados desde la página de Roles y Permisos.
        </AlertDescription>
      </Alert>
    );
  }

  return availableCustomRoles.map((role) => {
    const isAssigned = assignedRoles.includes(role.name);
    const isPrimary = editedUser.role === role.name;
    
    return (
      <div key={role.id} className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
        isAssigned ? 'bg-purple-50 border-purple-300' : 'hover:bg-gray-50'
      }`}>
        {/* ... resto del código sin cambios */}
      </div>
    );
  });
})()}
```

---

## 🎨 Resultado Esperado

Después de aplicar estos cambios:

### ✅ Scroll Funcional

```
┌─────────────────────────────────────────┐
│ Editar Usuario                          │
│ ID: USR-0001                            │
├─────────────────────────────────────────┤
│ [Información] [Rol] [Permisos] ...      │
├─────────────────────────────────────────┤
│ ╔═══════════════════════════════════╗ ↑ │
│ ║ Alert: Sistema Multi-Rol...       ║ │ │
│ ║                                    ║ │ │
│ ║ Card: Rol Primario                ║ │ │
│ ║ [Select: Administrador ▼]         ║ │ │
│ ║                                    ║ │ │
│ ║ Card: Roles Asignados             ║ │ │
│ ║ ┌────────────────────────────┐    ║ │ │ 
│ ║ │ ☑ Administrador            │    ║ │ │
│ ║ │ ☑ Médico                   │    ║ │ │ SCROLL
│ ║ │ ☐ Farmacéutico             │    ║ │ │ VERTICAL
│ ║ └────────────────────────────┘    ║ │ │
│ ║                                    ║ │ │
│ ║ ⭐ Roles Personalizados            ║ │ │
│ ║ ┌────────────────────────────┐    ║ │ │
│ ║ │ ☑ Admin Respaldo TI        │    ║ │ │
│ ║ │ ☐ Médico Investigador      │    ║ │ │
│ ║ └────────────────────────────┘    ║ ↓ │
│ ╚═══════════════════════════════════╝   │
│                                         │
│ [Cancelar]              [Guardar]       │
└─────────────────────────────────────────┘
```

### ✅ Roles Personalizados Visibles

- Se muestran roles personalizados del usuario actual
- Se pueden seleccionar con checkbox
- Tienen indicadores visuales (badges)
- Scroll interno si hay muchos roles

---

## 🔧 Pasos para Implementar

### Paso 1: Backup

```bash
# Hacer copia de seguridad del archivo
cp components/UserEditDialog.tsx components/UserEditDialog.tsx.backup
```

### Paso 2: Editar el Archivo

Abrir `/components/UserEditDialog.tsx` y aplicar los 8 cambios descritos arriba en orden.

### Paso 3: Verificar Estructura

El archivo debe tener esta estructura final:

```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-4xl h-[90vh] flex flex-col">  {/* ✅ Cambio 1 */}
    <DialogHeader>...</DialogHeader>

    <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">  {/* ✅ Cambio 2 */}
      <TabsList className="grid w-full grid-cols-5 flex-shrink-0">...</TabsList>
      
      <div className="flex-1 min-h-0 overflow-hidden">  {/* ✅ Cambio 2 */}
        
        {/* Tab 1: Información */}
        <TabsContent value="basic" className="h-full m-0 p-0">  {/* ✅ Cambio 3 */}
          <ScrollArea className="h-full px-1">
            <div className="space-y-6 mt-4 pr-4">
              {/* Contenido del tab */}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tab 2: Rol */}
        <TabsContent value="role" className="h-full m-0 p-0">  {/* ✅ Cambio 4 */}
          <ScrollArea className="h-full px-1">
            <div className="space-y-6 mt-4 pr-4">
              {/* Contenido del tab */}
              
              {/* Roles Personalizados */}
              {(() => {
                const availableCustomRoles = customRoles.filter(role => 
                  role.userId === user.id || !role.userId  {/* ✅ Cambio 8 */}
                );
                return availableCustomRoles.map(role => ...);
              })()}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tab 3: Permisos */}
        <TabsContent value="permissions" className="h-full m-0 p-0">  {/* ✅ Cambio 5 */}
          <ScrollArea className="h-full px-1">
            <div className="space-y-6 mt-4 pr-4">
              {/* Contenido del tab */}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tab 4: Seguridad */}
        <TabsContent value="security" className="h-full m-0 p-0">  {/* ✅ Cambio 6 */}
          <ScrollArea className="h-full px-1">
            <div className="space-y-6 mt-4 pr-4">
              {/* Contenido del tab */}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tab 5: Auditoría */}
        <TabsContent value="audit" className="h-full m-0 p-0">  {/* ✅ Cambio 7 */}
          <ScrollArea className="h-full px-1">
            <div className="space-y-6 mt-4 pr-4">
              {/* Contenido del tab */}
            </div>
          </ScrollArea>
        </TabsContent>
        
      </div>
    </Tabs>

    <DialogFooter>
      <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
      <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Guardar cambios</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🧪 Cómo Probar

### Prueba 1: Verificar Scroll en Tab "Información"
1. Abrir edición de usuario
2. Tab "Información"
3. ✅ Debe haber scrollbar vertical si el contenido excede la altura

### Prueba 2: Verificar Scroll en Tab "Rol"
1. Abrir edición de usuario
2. Tab "Rol"
3. ✅ Debe haber scrollbar vertical
4. ✅ Sección "Roles Base" debe tener scroll interno
5. ✅ Sección "Roles Personalizados" debe tener scroll interno

### Prueba 3: Verificar Roles Personalizados Visibles
1. Abrir edición de usuario (ej: Dr. Juan Pérez)
2. Tab "Rol"
3. Scroll hasta "Roles Personalizados"
4. ✅ Debe mostrar roles personalizados del usuario
5. ✅ Checkboxes deben ser seleccionables
6. ✅ Debe mostrar badges (Temporal, Pendiente, etc.)

### Prueba 4: Asignar Rol Personalizado
1. En "Roles Personalizados"
2. Marcar checkbox de un rol disponible
3. ✅ Debe quedar seleccionado
4. ✅ Checkmark verde debe aparecer
5. Ir a "Rol Primario" arriba
6. ✅ El rol personalizado debe aparecer en el selector

### Prueba 5: Verificar Scroll en Otros Tabs
1. Tab "Permisos" ✅ Scroll
2. Tab "Seguridad" ✅ Scroll
3. Tab "Auditoría" ✅ Scroll

---

## 💡 Nota Importante sobre Roles Personalizados

En el archivo `rolesStore.ts`, los roles personalizados tienen un campo `userId`:

```typescript
export interface CustomRoleDefinition {
  id: string;
  name: string;
  userId: string;  // Usuario específico al que está asignado
  // ...
}
```

**Opciones de filtrado:**

1. **Restrictivo (actual):** Solo muestra roles donde `userId === user.id`
   - PRO: Más seguro, solo roles específicos del usuario
   - CON: Si no hay roles creados para ese usuario, no se muestra nada

2. **Permisivo:** Muestra todos los roles donde `userId === user.id OR !userId`
   - PRO: Muestra roles "genéricos" que cualquier puede usar
   - CON: Puede mostrar demasiados roles si hay muchos genéricos

3. **Híbrido (recomendado):** Muestra roles del usuario + roles sin asignar
   - PRO: Balance entre seguridad y flexibilidad
   - CON: Requiere que existan roles sin `userId` asignado

**Recomendación Final:** Usar Opción C (filtrado previo) para mejor rendimiento y UX.

---

## ✅ Checklist de Verificación

- [ ] Cambio 1: DialogContent con `h-[90vh]` sin `overflow-hidden`
- [ ] Cambio 2: Tabs con `min-h-0` y div contenedor
- [ ] Cambio 3: Tab "Información" con ScrollArea individual
- [ ] Cambio 4: Tab "Rol" con ScrollArea individual
- [ ] Cambio 5: Tab "Permisos" con ScrollArea individual
- [ ] Cambio 6: Tab "Seguridad" con ScrollArea individual
- [ ] Cambio 7: Tab "Auditoría" con ScrollArea individual
- [ ] Cambio 8: Filtrado de roles personalizados corregido
- [ ] Pruebas: Scroll funciona en todos los tabs
- [ ] Pruebas: Roles personalizados visibles y seleccionables

---

## 🎉 Resultado Final

Después de aplicar todos los cambios:

✅ **Scrollbar vertical funcional** en TODOS los tabs
✅ **Roles personalizados visibles** y seleccionables
✅ **UX mejorada** con scroll suave
✅ **Sin regresiones** en funcionalidad existente

**Archivo modificado:** `/components/UserEditDialog.tsx`  
**Líneas aproximadas modificadas:** ~15 cambios puntuales  
**Complejidad:** Media (cambios estructurales en JSX)  
**Impacto:** Alto (corrige problema crítico de usabilidad)

---

**Fecha:** 2025-10-10  
**Estado:** Pendiente de implementación  
**Prioridad:** Alta  
**Estimación:** 15-20 minutos
