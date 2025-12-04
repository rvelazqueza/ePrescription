# Nueva Prescripción - Plan de Corrección UI

## 🎯 Problemas Identificados

### 1. Datos Mock Hardcodeados
**Ubicación:** Template del componente
**Problemas:**
- Género "Femenino" hardcodeado
- Edad "45 años" como fallback
- ID "CC-52.841.963" como fallback
- Código médico "RM-12345-COL" hardcodeado
- Teléfono "+57 (1) 234-5678" hardcodeado
- Email "contacto@hospital.com" hardcodeado
- Fecha "10/10/2025 10:54 a.m." hardcodeada

### 2. Campos "undefined" y "NaN"
**Causa:** Intentar mostrar propiedades de `selectedPatient` que no existen o no están mapeadas correctamente

### 3. Información Visible Sin Paciente
**Problema:** La tarjeta de información del paciente se muestra completa incluso sin seleccionar paciente

---

## 🔧 Correcciones Necesarias

### 1. Ocultar Tarjeta de Prescripción Sin Paciente
Solo mostrar la tarjeta completa cuando hay un paciente seleccionado.

### 2. Eliminar Datos Hardcodeados
Reemplazar todos los valores mock con datos reales del paciente seleccionado.

### 3. Mapeo Correcto de Datos
Asegurar que `selectedPatient` tenga todas las propiedades necesarias:
- `fullName` ✅
- `gender` (para mostrar género)
- `age` o `birthDate` (para calcular edad)
- `idNumber` ✅
- `bloodType` (opcional)

### 4. Información del Médico
Obtener del usuario autenticado (AuthService).

### 5. Fecha y Hora Actual
Usar fecha/hora real del sistema.

---

## 📝 Cambios Específicos

### Template Changes

#### Antes:
```html
<!-- Siempre visible -->
<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <!-- Datos hardcodeados -->
  <span>Femenino</span>
  <span>{{ pacienteSeleccionado?.edad || 45 }} años</span>
  <span>ID: {{ pacienteSeleccionado?.cedula || 'CC-52.841.963' }}</span>
  <span>Código RM-12345-COL</span>
  <span>+57 (1) 234-5678</span>
  <span>10/10/2025 10:54 a.m.</span>
</div>
```

#### Después:
```html
<!-- Solo visible con paciente seleccionado -->
<div *ngIf="selectedPatient" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <!-- Datos reales -->
  <span>{{ selectedPatient.gender === 'M' ? 'Masculino' : 'Femenino' }}</span>
  <span>{{ selectedPatient.age }} años</span>
  <span>ID: {{ selectedPatient.idNumber }}</span>
  <span>Código {{ doctorCode }}</span>
  <span>{{ doctorPhone }}</span>
  <span>{{ currentDate | date:'dd/MM/yyyy HH:mm' }}</span>
</div>
```

---

## 🎨 Mejoras UX

### Estado Sin Paciente
Mostrar solo:
- Sección de selección de paciente
- Mensaje: "Seleccione un paciente para comenzar"

### Estado Con Paciente
Mostrar:
- Información completa del paciente
- Formulario de prescripción
- Botones de acción

---

## 📊 Propiedades Necesarias

### Component Properties
```typescript
// Datos del paciente (ya existe)
selectedPatient: PatientData | null = null;

// Datos del médico (obtener de AuthService)
doctorName: string = '';
doctorCode: string = '';
doctorPhone: string = '';
doctorEmail: string = '';

// Fecha actual
currentDate: Date = new Date();
```

### PatientData Interface
Verificar que incluya:
```typescript
interface PatientData {
  id: string;
  fullName: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  idType: string;
  idNumber: string;
  birthDate: string;
  age: number;  // ← Importante
  gender: 'M' | 'F';  // ← Importante
  bloodType?: string;
  phone?: string;
  email?: string;
  address?: string;
}
```

---

## ✅ Checklist de Implementación

- [ ] Agregar `*ngIf="selectedPatient"` a la tarjeta de prescripción
- [ ] Eliminar todos los valores hardcodeados
- [ ] Obtener datos del médico de AuthService
- [ ] Usar fecha/hora actual del sistema
- [ ] Mapear género correctamente (M/F → Masculino/Femenino)
- [ ] Calcular edad si no viene en el DTO
- [ ] Manejar campos opcionales con operador `?.`
- [ ] Agregar mensaje cuando no hay paciente seleccionado
- [ ] Verificar que no haya "undefined" o "NaN" en la UI
- [ ] Probar con diferentes pacientes

---

## 🚀 Implementación

### Paso 1: Actualizar Component Class
```typescript
export class NuevaPrescripcionComponent implements OnInit {
  // ... existing properties ...
  
  // Datos del médico
  doctorName: string = '';
  doctorCode: string = '';
  doctorPhone: string = '';
  doctorEmail: string = '';
  
  // Fecha actual
  currentDate: Date = new Date();
  
  constructor(
    // ... existing services ...
    private authService: AuthService
  ) {}
  
  ngOnInit() {
    // ... existing code ...
    this.loadDoctorInfo();
  }
  
  private loadDoctorInfo() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.doctorName = userInfo.name || '';
      // TODO: Obtener código, teléfono y email del perfil del médico
    }
  }
  
  getGenderLabel(gender: 'M' | 'F'): string {
    return gender === 'M' ? 'Masculino' : 'Femenino';
  }
}
```

### Paso 2: Actualizar Template
Ver archivo de cambios detallados.

---

## 📝 Notas

- El componente `PatientSelectionSectionComponent` ya maneja correctamente el estado sin paciente
- Solo necesitamos ocultar la tarjeta de prescripción hasta que se seleccione un paciente
- Los datos del médico deberían venir del perfil del usuario autenticado
- La fecha/hora debe actualizarse en tiempo real o al menos al cargar el componente

---

**Prioridad:** Alta
**Impacto:** UX crítico
**Tiempo Estimado:** 30 minutos
