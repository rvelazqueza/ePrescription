# Guía de Solución de Problemas - Componente de Solicitud de Registro

## Errores Comunes y Soluciones

### 1. Error: "Cannot find module" o importaciones faltantes

**Problema**: Angular no puede encontrar los módulos importados.

**Solución**:
```bash
# Verificar que todas las dependencias estén instaladas
npm install

# Si usas Angular Material (opcional para notificaciones)
ng add @angular/material
```

### 2. Error: "Property does not exist on type"

**Problema**: TypeScript no reconoce las propiedades del componente.

**Solución**:
- Verificar que todas las propiedades estén declaradas en el componente
- Asegurar que los tipos estén correctamente definidos
- Verificar que los FormGroups estén inicializados con `!` o en el constructor

### 3. Error: "Cannot read property of undefined"

**Problema**: Acceso a propiedades no inicializadas en el template.

**Solución**:
```html
<!-- Usar safe navigation operator -->
<div>{{ getPerfilSeleccionado()?.label }}</div>

<!-- O usar *ngIf para verificar existencia -->
<div *ngIf="getPerfilSeleccionado()">
  {{ getPerfilSeleccionado().label }}
</div>
```

### 4. Error: "ExpressionChangedAfterItHasBeenCheckedError"

**Problema**: Cambios en el estado durante el ciclo de detección de cambios.

**Solución**:
```typescript
// Usar setTimeout para diferir cambios
private updateState() {
  setTimeout(() => {
    this.someProperty = newValue;
  });
}

// O usar ChangeDetectorRef
constructor(private cdr: ChangeDetectorRef) {}

private updateState() {
  this.someProperty = newValue;
  this.cdr.detectChanges();
}
```

### 5. Error: "Router not found" o navegación no funciona

**Problema**: Router no está correctamente inyectado o configurado.

**Solución**:
```typescript
// Verificar que Router esté importado
import { Router } from '@angular/router';

// Verificar que esté en el constructor
constructor(private router: Router) {}

// Verificar que la ruta esté configurada en app.routes.ts
{
  path: 'solicitud-registro',
  loadComponent: () => import('./pages/solicitud-registro/solicitud-registro.component').then(m => m.SolicitudRegistroComponent)
}
```

### 6. Error: "FormGroup not found" o formularios no funcionan

**Problema**: FormGroups no están correctamente inicializados.

**Solución**:
```typescript
// Verificar importaciones
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Verificar que estén en imports del componente
@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})

// Verificar inicialización en constructor
constructor(private fb: FormBuilder) {
  this.initializeForms();
}
```

### 7. Error: "Tailwind classes not working"

**Problema**: Estilos de Tailwind no se aplican.

**Solución**:
```css
/* Verificar que Tailwind esté configurado en styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```json
// Verificar tailwind.config.js
{
  "content": [
    "./src/**/*.{html,ts}"
  ]
}
```

### 8. Error: "Cannot bind to 'formGroup'"

**Problema**: ReactiveFormsModule no está importado.

**Solución**:
```typescript
@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
```

### 9. Error: "ngModel cannot be used with reactive forms"

**Problema**: Mezcla de template-driven y reactive forms.

**Solución**:
```html
<!-- En lugar de ngModel, usar formControlName -->
<input formControlName="nombreCompleto" />

<!-- O usar ngModel solo para campos no reactivos -->
<input [(ngModel)]="formData.codigoCorreo" />
```

### 10. Error: "Circular dependency detected"

**Problema**: Dependencias circulares entre módulos.

**Solución**:
- Revisar las importaciones
- Usar lazy loading para componentes
- Separar interfaces en archivos independientes

## Verificaciones Rápidas

### 1. Verificar que el componente se carga correctamente
```typescript
// En el constructor, agregar un console.log
constructor() {
  console.log('SolicitudRegistroComponent inicializado');
}
```

### 2. Verificar que los formularios se inicializan
```typescript
ngOnInit() {
  console.log('Formularios:', {
    paso1: this.paso1Form.valid,
    paso2: this.paso2Form.valid,
    paso3: this.paso3Form.valid
  });
}
```

### 3. Verificar que la navegación funciona
```typescript
volverAlLogin() {
  console.log('Navegando al login...');
  this.router.navigate(['/login']);
}
```

### 4. Verificar que los datos se actualizan
```typescript
updateFormData(field: string, value: any) {
  console.log('Actualizando:', field, value);
  (this.formData as any)[field] = value;
}
```

## Comandos Útiles para Debugging

```bash
# Verificar la compilación
ng build

# Ejecutar en modo desarrollo con source maps
ng serve --source-map

# Verificar linting
ng lint

# Ejecutar tests
ng test

# Verificar dependencias
npm ls

# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## Configuración Recomendada

### tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true
  }
}
```

### angular.json
```json
{
  "build": {
    "options": {
      "sourceMap": true,
      "optimization": false
    }
  }
}
```

## Contacto y Soporte

Si los problemas persisten:

1. Verificar la versión de Angular: `ng version`
2. Revisar la consola del navegador para errores específicos
3. Verificar que todas las dependencias estén actualizadas
4. Consultar la documentación oficial de Angular
5. Revisar los logs del servidor de desarrollo

## Logs Útiles

```typescript
// Agregar logs para debugging
console.log('Estado actual:', {
  paso: this.pasoActual,
  formData: this.formData,
  validaciones: {
    paso1: this.isStep1Valid,
    paso2: this.isStep2Valid,
    paso3: this.isStep3Valid
  }
});
```