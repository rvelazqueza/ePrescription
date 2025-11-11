# Componente de Verificación de Recetas

## Descripción
Componente Angular homologado con la versión de React para la verificación de recetas médicas mediante códigos QR o tokens de verificación.

## Características Principales

### 🔍 Métodos de Verificación
- **Escaneo QR**: Activación de cámara para escanear códigos QR de recetas físicas
- **Búsqueda por Token**: Ingreso manual de tokens de verificación únicos
- **Entrada Manual**: Opción de ingresar códigos QR manualmente

### 📊 Estados de Verificación
- **Válida**: Receta puede ser dispensada
- **Vencida**: Receta ha expirado su período de validez
- **Anulada**: Receta fue cancelada por el médico
- **Ya dispensada**: Receta fue completamente dispensada anteriormente
- **Inválida**: No se pudo verificar la autenticidad

### 🎯 Funcionalidades
- Verificaciones recientes en sesión
- Modal detallado con información completa de la receta
- Información del paciente y médico prescriptor
- Lista de medicamentos prescritos
- Botones de acción (dispensar, imprimir, exportar)
- Protocolo de seguridad integrado

## Estructura de Archivos

```
verificar/
├── verificar.component.ts      # Lógica del componente
├── verificar.component.html    # Template HTML
├── verificar.component.css     # Estilos CSS
└── README.md                   # Documentación
```

## Datos Mock

El componente incluye datos de prueba con 4 recetas de ejemplo:
- RX-2025-009847 (Válida)
- RX-2025-009846 (Vencida)
- RX-2025-009845 (Ya dispensada)
- RX-2025-009844 (Anulada)

## Tokens de Ejemplo

Para pruebas, puedes usar estos tokens:
- `VRF-2025-9847-X8K4` - Receta válida
- `VRF-2025-9846-M2P5` - Receta vencida
- `VRF-2025-9845-N7R3` - Ya dispensada
- `VRF-2025-9844-Q1W9` - Receta anulada

## Códigos QR de Ejemplo

- `QR-9847-A3F2` - Receta válida
- `QR-9846-B7H9` - Receta vencida
- `QR-9845-C4J1` - Ya dispensada
- `QR-9844-D8K6` - Receta anulada

## Uso del Componente

### Importación
```typescript
import { VerificarRecetaComponent } from './pages/dispensacion/verificar/verificar.component';
```

### En el template
```html
<app-verificar-receta></app-verificar-receta>
```

## Dependencias

- `@angular/common` - CommonModule
- `@angular/forms` - FormsModule para ngModel
- `lucide-angular` - Iconos
- Tailwind CSS - Estilos

## Características Técnicas

### Signals de Angular
- `verificationMethod` - Método de verificación activo (qr/token)
- `isScanning` - Estado del escáner QR
- `verificationResult` - Resultado de la verificación actual
- `isResultOpen` - Estado del modal de resultados
- `recentVerifications` - Lista de verificaciones recientes

### Métodos Principales
- `startQRScan()` - Inicia simulación de escaneo QR
- `verifyByQR()` - Verifica receta por código QR
- `verifyByToken()` - Verifica receta por token
- `proceedToDispensation()` - Procede a dispensación
- `printPrescription()` - Imprime receta

## Estilos y UX

### Gradientes y Colores
- Verde esmeralda para elementos principales
- Estados diferenciados por colores (verde=válido, rojo=error, naranja=advertencia)
- Efectos de hover y transiciones suaves

### Responsive Design
- Adaptable a dispositivos móviles
- Grid responsive para tokens de ejemplo
- Modal adaptativo

### Accesibilidad
- Navegación por teclado
- Indicadores visuales claros
- Textos descriptivos

## Integración con el Sistema

### Navegación
El componente se integra en la ruta de dispensación:
```
/dispensacion/verificar
```

### Flujo de Trabajo
1. Usuario selecciona método de verificación
2. Ingresa/escanea código QR o token
3. Sistema verifica autenticidad
4. Muestra resultado detallado
5. Permite proceder a dispensación si es válida

## Protocolo de Seguridad

El componente incluye recordatorios del protocolo:
- ✓ Verificar identidad del paciente
- ✓ Confirmar datos de la receta
- ✓ Contactar médico en caso de duda
- ✓ No dispensar sin verificación exitosa
- ✓ Registrar anomalías

## Futuras Mejoras

- Integración con cámara real para escaneo QR
- Conexión con API backend para verificación
- Historial persistente de verificaciones
- Notificaciones push para estados críticos
- Exportación de reportes de verificación