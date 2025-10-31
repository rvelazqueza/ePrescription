# Cómo Usar el Rol "Médico Jefe"

## Acceso al Rol

### 1. Cambiar Rol desde Top-Bar
1. En la barra superior, busca el dropdown "Cambiar rol"
2. Haz clic en el dropdown
3. Selecciona "Médico Jefe" (aparece con icono de escudo indigo)
4. El badge del rol cambiará a color indigo

### 2. Identificación Visual
- **Badge**: Fondo indigo claro con texto indigo oscuro
- **Icono**: Escudo (Shield) para representar autoridad médica
- **Posición**: Segundo en la lista (después de Doctor)

## Funcionalidades Específicas

### Reportes y Analítica
- **Acceso completo** a `/reportes/actividad-medico`
- **Acceso completo** a `/reportes/exportar`
- **Acceso limitado** a `/reportes/actividad-farmacia` (con sugerencia de cambio a Farmacéutico)

### Permisos Especiales
- Ver estadísticas detalladas de todos los médicos
- Generar reportes de actividad médica
- Exportar datos en múltiples formatos
- Acceso a información sensible de prescripciones

## Sugerencias Automáticas

### Cuándo Aparecen
El sistema sugerirá cambiar a "Médico Jefe" cuando:
- Visites `/reportes/actividad-medico` sin ser Médico Jefe o Administrador
- Intentes acceder a reportes que requieren supervisión médica

### Cómo Funcionan
1. Modal automático aparece después de 1 segundo
2. Explica por qué se sugiere el rol
3. Permite cambiar inmediatamente o descartar
4. Se recuerda la decisión por sesión

## Diferencias con Otros Roles

### vs Doctor
- **Doctor**: Acceso básico a prescripciones y pacientes
- **Médico Jefe**: + Reportes de actividad médica + Supervisión

### vs Administrador  
- **Administrador**: Acceso completo a todo el sistema
- **Médico Jefe**: Enfocado en supervisión médica y reportes

### vs Farmacéutico
- **Farmacéutico**: Dispensación e inventario
- **Médico Jefe**: Supervisión médica y reportes

## Casos de Uso Típicos

### 1. Supervisión Médica
- Revisar actividad de médicos del departamento
- Identificar patrones de prescripción
- Monitorear alertas clínicas

### 2. Reportes Gerenciales
- Generar reportes mensuales de actividad
- Exportar datos para análisis externos
- Crear informes de cumplimiento

### 3. Análisis de Rendimiento
- Comparar productividad entre médicos
- Identificar necesidades de capacitación
- Optimizar flujos de trabajo

## Navegación Recomendada

1. **Inicio**: Cambiar rol a "Médico Jefe"
2. **Dashboard**: Ver resumen general
3. **Reportes**: Ir a "Actividad por Médico"
4. **Análisis**: Revisar estadísticas detalladas
5. **Exportar**: Generar reportes según necesidad

## Notas Técnicas

- El rol se persiste en localStorage
- Cambios de rol son inmediatos
- No requiere recargar la página
- Compatible con todos los navegadores modernos