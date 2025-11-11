# Pruebas del Componente de Verificación de Recetas

## Funcionalidades a Probar

### ✅ Tabs de Navegación
- [ ] Tab "Escanear QR" se activa correctamente
- [ ] Tab "Buscar por Token" se activa correctamente
- [ ] Estilos visuales de tabs activos/inactivos funcionan
- [ ] Transiciones suaves entre tabs

### ✅ Verificación por QR
- [ ] Botón "Activar cámara" inicia simulación
- [ ] Animación de cámara activada se muestra
- [ ] Botón "Cancelar escaneo" funciona
- [ ] Input manual de QR acepta texto
- [ ] Botón "Verificar" procesa códigos QR
- [ ] Códigos QR válidos muestran resultado
- [ ] Códigos QR inválidos muestran error

### ✅ Verificación por Token
- [ ] Input de token convierte a mayúsculas automáticamente
- [ ] Botón "Verificar" procesa tokens
- [ ] Tokens de ejemplo son clickeables
- [ ] Tokens válidos muestran resultado
- [ ] Tokens inválidos muestran error

### ✅ Modal Lateral Derecho
- [ ] Modal se abre desde el lado derecho
- [ ] Animación de entrada funciona
- [ ] Header cambia color según estado de receta
- [ ] Información del paciente se muestra correctamente
- [ ] Información del médico se muestra correctamente
- [ ] Lista de medicamentos se renderiza
- [ ] Fechas se muestran correctamente
- [ ] Botón cerrar (X) funciona
- [ ] Click fuera del modal lo cierra

### ✅ Estados de Receta
- [ ] Estado "Válida" (verde) - permite dispensación
- [ ] Estado "Vencida" (rojo) - no permite dispensación
- [ ] Estado "Anulada" (rojo) - no permite dispensación
- [ ] Estado "Ya dispensada" (naranja) - no permite dispensación
- [ ] Estado "Inválida" (rojo) - no permite dispensación

### ✅ Botones de Acción
- [ ] "Proceder a dispensación" solo aparece para recetas válidas
- [ ] "Imprimir" funciona para todas las recetas
- [ ] "Exportar" funciona para todas las recetas
- [ ] Mensaje de "No se puede dispensar" aparece para recetas inválidas

### ✅ Verificaciones Recientes
- [ ] Lista se actualiza al verificar recetas
- [ ] Máximo 5 verificaciones recientes
- [ ] Click en verificación reciente abre modal
- [ ] Contador en header se actualiza

## Datos de Prueba

### Códigos QR Válidos:
- `QR-9847-A3F2` → Receta válida (María Elena González)
- `QR-9846-B7H9` → Receta vencida (Juan Carlos Martínez)
- `QR-9845-C4J1` → Ya dispensada (Ana Patricia Ruiz)
- `QR-9844-D8K6` → Receta anulada (Roberto Silva)

### Tokens Válidos:
- `VRF-2025-9847-X8K4` → Receta válida
- `VRF-2025-9846-M2P5` → Receta vencida
- `VRF-2025-9845-N7R3` → Ya dispensada
- `VRF-2025-9844-Q1W9` → Receta anulada

### Códigos/Tokens Inválidos:
- Cualquier texto que no coincida con los datos mock

## Casos de Prueba Específicos

### Caso 1: Verificación Exitosa por QR
1. Seleccionar tab "Escanear QR"
2. Hacer click en "Activar cámara"
3. Esperar 2 segundos (simulación)
4. Verificar que se abre el modal con información de receta válida
5. Verificar que aparece botón "Proceder a dispensación"

### Caso 2: Verificación por Token Manual
1. Seleccionar tab "Buscar por Token"
2. Escribir `vrf-2025-9847-x8k4` (minúsculas)
3. Verificar que se convierte a mayúsculas automáticamente
4. Hacer click en "Verificar"
5. Verificar que se abre el modal con información correcta

### Caso 3: Receta Vencida
1. Usar token `VRF-2025-9846-M2P5`
2. Verificar que el header del modal es rojo
3. Verificar que aparece mensaje "No se puede dispensar"
4. Verificar que no aparece botón de dispensación

### Caso 4: Verificaciones Recientes
1. Verificar 3 recetas diferentes
2. Verificar que aparece sección "Verificaciones Recientes"
3. Hacer click en una verificación reciente
4. Verificar que se abre el modal con la información correcta

## Responsive Design

### Desktop (>768px)
- [ ] Modal ocupa máximo 400px de ancho
- [ ] Tabs se muestran en línea
- [ ] Contador de verificaciones visible en header

### Mobile (<768px)
- [ ] Modal ocupa ancho completo
- [ ] Tabs mantienen funcionalidad
- [ ] Contador de verificaciones se oculta
- [ ] Botones se adaptan al ancho disponible

## Accesibilidad

- [ ] Navegación por teclado funciona
- [ ] Enter en inputs ejecuta verificación
- [ ] Escape cierra modal
- [ ] Textos alternativos en iconos
- [ ] Contraste de colores adecuado
- [ ] Focus visible en elementos interactivos