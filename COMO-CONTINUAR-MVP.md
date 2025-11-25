# 🚀 Cómo Continuar con el MVP - Guía Rápida

## 📍 Dónde Estamos

✅ **Completado:** Borradores de Prescripciones (1/28 vistas)
⏳ **Siguiente:** Nueva Prescripción o Testing de Borradores

---

## 🎯 Opción 1: Probar Borradores (RECOMENDADO)

**Tiempo:** 30 minutos - 1 hora
**Objetivo:** Verificar que la implementación funciona correctamente

### Pasos:

#### 1. Iniciar el Backend

```powershell
# Desde la raíz del proyecto
docker-compose up -d eprescription-api oracle-db keycloak
```

#### 2. Verificar que el API está corriendo

```powershell
# Ver logs del API
docker logs -f eprescription-api

# Debe mostrar:
# Now listening on: http://[::]:8080
```

#### 3. Verificar Swagger

Abre en el navegador: http://localhost:8000/swagger

Verifica que estos endpoints existen:
- `GET /api/prescriptions/search`
- `GET /api/prescriptions/{id}`
- `POST /api/prescriptions`
- `DELETE /api/prescriptions/{id}`

#### 4. Iniciar el Frontend

```powershell
cd eprescription-frontend
npm start
```

Abre: http://localhost:4200

#### 5. Probar la Funcionalidad

1. **Login**
   - Usuario: `doctor1` / Password: `password123`
   - O el usuario que tengas configurado

2. **Navegar a Borradores**
   - Menú: Prescripciones → Borradores
   - URL: http://localhost:4200/prescripciones/borradores

3. **Verificar Carga**
   - ✅ Debe mostrar spinner de carga
   - ✅ Debe cargar borradores desde el backend
   - ✅ Si no hay borradores, debe mostrar mensaje "No hay borradores"

4. **Crear Datos de Prueba (si no hay borradores)**
   
   Opción A - Desde Swagger:
   ```
   POST /api/prescriptions
   {
     "patientId": "PAT-001",
     "doctorId": "DOC-001",
     "diagnoses": [
       {
         "cie10Code": "I10",
         "description": "Hipertensión arterial",
         "isPrimary": true
       }
     ],
     "medications": [
       {
         "medicationId": "MED-001",
         "dosage": "10mg",
         "frequency": "2 veces al día",
         "duration": 30,
         "instructions": "Tomar con alimentos"
       }
     ],
     "notes": "Borrador de prueba"
   }
   ```

   Opción B - Desde la UI:
   - Ir a: Prescripciones → Nueva
   - Llenar el formulario
   - Guardar como borrador

5. **Probar Operaciones**
   - ✅ Ver detalles de un borrador (doble clic)
   - ✅ Buscar borradores (por paciente, número)
   - ✅ Filtrar por fecha
   - ✅ Duplicar un borrador
   - ✅ Eliminar un borrador
   - ✅ Editar un borrador (debe navegar a nueva)

#### 6. Verificar en la Base de Datos

```powershell
# Conectar a Oracle
docker exec -it oracle-db sqlplus eprescription_user/eprescription_pass@//localhost:1521/XEPDB1

# Ver prescripciones
SELECT prescription_number, status, created_at 
FROM prescriptions 
WHERE status = 'draft'
ORDER BY created_at DESC;
```

### ✅ Checklist de Testing

- [ ] Backend está corriendo
- [ ] Frontend está corriendo
- [ ] Login funciona
- [ ] Página de borradores carga
- [ ] Se muestran borradores desde el backend
- [ ] Búsqueda funciona
- [ ] Filtros funcionan
- [ ] Ver detalles funciona
- [ ] Duplicar funciona (crea en backend)
- [ ] Eliminar funciona (elimina del backend)
- [ ] Editar navega correctamente
- [ ] Estados de carga se muestran
- [ ] Errores se manejan correctamente

---

## 🎯 Opción 2: Continuar con Nueva Prescripción

**Tiempo:** 3-4 horas
**Objetivo:** Completar el flujo de creación de prescripciones

### Archivo a Modificar

`eprescription-frontend/src/app/pages/prescripciones/nueva/nueva.component.ts`

### Tareas Principales

#### 1. Cargar Datos de Borrador

```typescript
cargarDatosBorrador(borradorId: string) {
  this.isLoading = true;
  
  this.prescripcionesService.getPrescriptionById(borradorId).subscribe({
    next: (prescription) => {
      // Mapear datos del borrador al formulario
      this.pacienteSeleccionado = {
        id: prescription.patientId,
        // ... cargar datos completos del paciente
      };
      
      this.diagnosticos = prescription.diagnoses.map(d => ({
        codigo: d.cie10Code,
        descripcion: d.description,
        principal: d.isPrimary
      }));
      
      this.medicamentos = prescription.medications.map(m => ({
        id: m.medicationId,
        nombre: m.medicationName,
        dosis: m.dosage,
        frecuencia: m.frequency,
        duracion: m.duration,
        instrucciones: m.instructions
      }));
      
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error cargando borrador:', error);
      this.isLoading = false;
    }
  });
}
```

#### 2. Guardar Cambios (Auto-save)

```typescript
guardarCambios() {
  if (!this.pacienteSeleccionado || this.medicamentos.length === 0) {
    return;
  }

  const prescriptionDto = {
    patientId: this.pacienteSeleccionado.id,
    doctorId: this.medicoActual.id,
    diagnoses: this.diagnosticos.map(d => ({
      cie10Code: d.codigo,
      description: d.descripcion,
      isPrimary: d.principal
    })),
    medications: this.medicamentos.map(m => ({
      medicationId: m.id,
      dosage: m.dosis,
      frequency: m.frecuencia,
      duration: m.duracion,
      instructions: m.instrucciones
    })),
    notes: this.observaciones
  };

  if (this.borradorId) {
    // Actualizar borrador existente
    this.prescripcionesService.updatePrescripcion(this.borradorId, prescriptionDto).subscribe({
      next: (updated) => {
        console.log('Borrador actualizado:', updated);
        this.mostrarMensaje('Cambios guardados automáticamente');
      },
      error: (error) => {
        console.error('Error guardando cambios:', error);
      }
    });
  } else {
    // Crear nuevo borrador
    this.prescripcionesService.createPrescripcion(prescriptionDto).subscribe({
      next: (created) => {
        this.borradorId = created.id;
        console.log('Borrador creado:', created);
        this.mostrarMensaje('Borrador guardado');
      },
      error: (error) => {
        console.error('Error creando borrador:', error);
      }
    });
  }
}
```

#### 3. Finalizar Prescripción

```typescript
finalizarPrescripcion() {
  if (!this.validarPrescripcion()) {
    return;
  }

  // Primero guardar cambios
  this.guardarCambios();

  // Luego actualizar status a 'issued'
  const updateDto = {
    ...this.getPrescriptionDto(),
    status: 'issued'
  };

  this.prescripcionesService.updatePrescripcion(this.borradorId, updateDto).subscribe({
    next: (issued) => {
      console.log('Prescripción emitida:', issued);
      this.mostrarMensaje('Prescripción emitida exitosamente');
      this.router.navigate(['/prescripciones/emitidas']);
    },
    error: (error) => {
      console.error('Error emitiendo prescripción:', error);
      this.mostrarError('Error al emitir la prescripción');
    }
  });
}
```

#### 4. Auto-save cada X segundos

```typescript
ngOnInit() {
  // ... código existente

  // Auto-save cada 30 segundos
  this.autoSaveSubscription = interval(30000).subscribe(() => {
    if (this.formularioModificado) {
      this.guardarCambios();
      this.formularioModificado = false;
    }
  });
}

ngOnDestroy() {
  if (this.autoSaveSubscription) {
    this.autoSaveSubscription.unsubscribe();
  }
}
```

### Pasos de Implementación

1. **Revisar el componente actual**
   ```powershell
   code eprescription-frontend/src/app/pages/prescripciones/nueva/nueva.component.ts
   ```

2. **Identificar datos mock**
   - Buscar arrays hardcodeados
   - Buscar métodos que no usan servicios

3. **Implementar carga de borrador**
   - Método `cargarDatosBorrador()`
   - Mapeo de DTOs

4. **Implementar guardado**
   - Método `guardarCambios()`
   - Auto-save

5. **Implementar finalización**
   - Método `finalizarPrescripcion()`
   - Cambio de status

6. **Testing**
   - Crear nueva prescripción
   - Guardar como borrador
   - Verificar en borradores
   - Editar borrador
   - Finalizar prescripción
   - Verificar en emitidas

---

## 🎯 Opción 3: Hacer Emitidas (Más Rápido)

**Tiempo:** 2 horas
**Objetivo:** Completar otra vista similar a Borradores

### Estrategia

1. **Copiar estructura de Borradores**
   - Usar el mismo patrón
   - Cambiar `status='draft'` por `status='issued'`

2. **Archivo a Modificar**
   ```
   eprescription-frontend/src/app/pages/prescripciones/emitidas/emitidas.component.ts
   ```

3. **Cambios Principales**
   ```typescript
   // En lugar de:
   this.prescripcionesService.getPrescripciones({ status: 'draft' })
   
   // Usar:
   this.prescripcionesService.getPrescripciones({ status: 'issued' })
   ```

4. **Diferencias con Borradores**
   - No se pueden editar (solo ver)
   - No se pueden eliminar
   - Se pueden reimprimir
   - Tienen firma digital

---

## 📋 Checklist General

### Antes de Empezar Cualquier Vista

- [ ] Backend está corriendo
- [ ] Frontend compila sin errores
- [ ] Tienes el archivo abierto en el editor
- [ ] Has revisado el documento de estado

### Durante la Implementación

- [ ] Eliminar datos mock
- [ ] Inyectar servicios necesarios
- [ ] Implementar método de carga
- [ ] Implementar mapeo de DTOs
- [ ] Agregar estados de carga y error
- [ ] Actualizar template con estados
- [ ] Compilar y verificar errores

### Después de Implementar

- [ ] Compilación exitosa
- [ ] Testing manual con backend
- [ ] Documentar cambios
- [ ] Actualizar progreso en documentos
- [ ] Commit de cambios

---

## 🆘 Si Encuentras Problemas

### Backend no responde

```powershell
# Ver logs
docker logs eprescription-api

# Reiniciar
docker-compose restart eprescription-api

# Verificar que está corriendo
docker ps | findstr eprescription-api
```

### Frontend no compila

```powershell
# Limpiar y reinstalar
cd eprescription-frontend
rm -rf node_modules
npm install
npm run build
```

### Errores de CORS

Verificar en `eprescription-API/src/ePrescription.API/Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
```

### No hay datos en el backend

```sql
-- Crear prescripción de prueba
INSERT INTO prescriptions (
  prescription_id, prescription_number, patient_id, doctor_id,
  prescription_date, expiration_date, status, created_at, updated_at
) VALUES (
  SYS_GUID(), 'RX-2025-001', 'PAT-001', 'DOC-001',
  SYSDATE, SYSDATE + 30, 'draft', SYSDATE, SYSDATE
);
```

---

## 📞 Comandos Útiles

### Docker

```powershell
# Ver todos los contenedores
docker ps -a

# Ver logs de un contenedor
docker logs -f <container-name>

# Reiniciar un contenedor
docker-compose restart <service-name>

# Parar todo
docker-compose down

# Iniciar todo
docker-compose up -d
```

### Frontend

```powershell
# Compilar
npm run build

# Desarrollo
npm start

# Limpiar
rm -rf node_modules dist
npm install
```

### Git

```powershell
# Ver cambios
git status

# Agregar cambios
git add .

# Commit
git commit -m "feat: migrate borradores to backend"

# Push
git push origin main
```

---

## 🎯 Mi Recomendación

**Orden sugerido:**

1. ✅ **Probar Borradores** (30 min - 1h)
   - Verificar que funciona
   - Encontrar y arreglar bugs
   - Ganar confianza

2. 🚀 **Nueva Prescripción** (3-4h)
   - Completar flujo de prescripciones
   - Funcionalidad core del sistema

3. ⚡ **Emitidas** (2h)
   - Vista rápida y similar
   - Ganar momentum

4. 📋 **Lista Principal** (1-2h)
   - Completar módulo de prescripciones
   - Celebrar hito 1

**Total:** 6.5-10 horas para completar Prescripciones

---

## 📚 Documentos de Referencia

- `ESTADO-MOCK-VS-REAL-COMPLETO.md` - Estado general
- `TASK-15.19-BORRADORES-BACKEND-COMPLETADO.md` - Detalles técnicos
- `MVP-ELIMINACION-MOCKS-SESION-1.md` - Resumen de sesión
- `PROGRESO-MVP-VISUAL.md` - Progreso visual
- `COMO-CONTINUAR-MVP.md` - Este documento

---

**¿Listo para continuar? Dime qué opción prefieres:**

1. "Probar Borradores"
2. "Hacer Nueva Prescripción"
3. "Hacer Emitidas"
4. "Otra cosa"
