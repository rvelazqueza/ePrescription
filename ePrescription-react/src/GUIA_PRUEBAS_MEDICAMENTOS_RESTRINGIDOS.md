# 🧪 Guía de Pruebas - Sistema de Medicamentos Restringidos

## 📋 Resumen del Sistema

El sistema ePrescription implementa **control estricto de talonarios** según el tipo de medicamento a prescribir, siguiendo normativas internacionales (HL7, FDA, OMS).

---

## 🎯 Tipos de Talonarios y Restricciones

| Tipo | Límite | Color | Uso |
|------|--------|-------|-----|
| **Estupefacientes** | 1 medicamento/receta | 🔴 Rojo | Opioides y narcóticos |
| **Psicotrópicos** | 1 medicamento/receta | 🟠 Naranja | Benzodiacepinas, estimulantes |
| **Antimicrobianos** | 3 medicamentos/receta | 🟣 Púrpura | Antibióticos |
| **Receta Libre** | Sin límite | 🟢 Verde | Medicamentos no controlados |

---

## 👥 Perfiles de Prueba Disponibles

### **Profesional 1: Dr. Carlos Alberto Mendoza Herrera**
- **ID:** DOC-001
- **Licencia:** RM-12345-COL
- **Talonarios disponibles:**
  - ✅ **Receta Libre:** 2 talonarios (95 boletas disponibles)
  - ✅ **Estupefacientes:** 1 talonario (25 boletas disponibles)
  - ✅ **Psicotrópicos:** 1 talonario (25 boletas disponibles)

### **Profesional 2: Dra. María Elena Rodríguez Silva**
- **ID:** DOC-002
- **Licencia:** RM-54321-COL
- **Talonarios disponibles:**
  - ❌ **Sin talonarios** (saldo: 0 boletas)
  - 💡 Perfil ideal para probar compra de talonarios

### **Profesional 3: Dr. Jorge Luis Ramírez Castro**
- **ID:** DOC-003
- **Licencia:** RM-78901-COL
- **Talonarios disponibles:**
  - ✅ **Antimicrobianos:** 1 talonario (3 boletas disponibles - casi agotado)
  - ✅ **Receta Libre:** 1 talonario (50 boletas disponibles)

### **Profesional 4: Dra. Ana Patricia González Vargas** ⭐
- **ID:** DOC-004
- **Licencia:** RM-99999-COL
- **Talonarios disponibles:** (PERFIL COMPLETO PARA PRUEBAS)
  - ✅ **Estupefacientes:** 2 talonarios (45 boletas disponibles)
  - ✅ **Psicotrópicos:** 2 talonarios (42 boletas disponibles)
  - ✅ **Antimicrobianos:** 3 talonarios (135 boletas disponibles)
  - ✅ **Receta Libre:** 5 talonarios (220 boletas disponibles)

---

## 💊 Medicamentos de Prueba por Categoría

### 🔴 ESTUPEFACIENTES (1 por receta)

| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Morfina** | Dolor severo | 10mg tabletas |
| **Codeína** | Dolor moderado | 30mg tabletas |
| **Tramadol** | Dolor moderado-severo | 50mg cápsulas |
| **Fentanilo** | Dolor severo/crónico | Parche transdérmico 25mcg |
| **Oxicodona** | Dolor severo | 5mg tabletas |
| **Metadona** | Dolor crónico | 10mg tabletas |
| **Hidrocodona** | Dolor moderado-severo | 5mg tabletas |
| **Buprenorfina** | Dolor crónico | Parche 10mcg |

### 🟠 PSICOTRÓPICOS (1 por receta)

#### Benzodiacepinas
| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Diazepam** | Ansiedad/relajante | 5mg tabletas |
| **Alprazolam** | Ansiedad/pánico | 0.5mg tabletas |
| **Clonazepam** | Ansiedad/convulsiones | 2mg tabletas |
| **Lorazepam** | Ansiedad | 1mg tabletas |
| **Bromazepam** | Ansiedad | 3mg tabletas |

#### Hipnóticos/Sedantes
| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Zolpidem** | Insomnio | 10mg tabletas |
| **Zopiclona** | Insomnio | 7.5mg tabletas |
| **Eszopiclona** | Insomnio | 3mg tabletas |

#### Estimulantes
| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Metilfenidato** | TDAH | 10mg tabletas |
| **Anfetamina** | TDAH/narcolepsia | 5mg tabletas |
| **Lisdexanfetamina** | TDAH | 30mg cápsulas |

#### Antipsicóticos
| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Risperidona** | Esquizofrenia/bipolaridad | 2mg tabletas |
| **Quetiapina** | Esquizofrenia/bipolaridad | 25mg tabletas |

### 🟣 ANTIMICROBIANOS (hasta 3 por receta)

#### Penicilinas
| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Amoxicilina** | Infecciones bacterianas | 500mg cápsulas |
| **Amoxicilina/Ácido Clavulánico** | Infecciones resistentes | 875/125mg tabletas |
| **Penicilina G** | Infecciones bacterianas | 1.000.000 UI vial |
| **Ampicilina** | Infecciones bacterianas | 500mg cápsulas |

#### Cefalosporinas
| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Cefalexina** | Infecciones piel/respiratorias | 500mg cápsulas |
| **Cefuroxima** | Infecciones respiratorias | 250mg tabletas |
| **Ceftriaxona** | Infecciones graves | 1g vial IM/IV |
| **Cefepime** | Infecciones graves | 1g vial IV |

#### Macrólidos
| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Azitromicina** | Infecciones respiratorias/piel | 500mg tabletas |
| **Claritromicina** | Infecciones respiratorias | 500mg tabletas |
| **Eritromicina** | Infecciones bacterianas | 500mg tabletas |

#### Fluoroquinolonas
| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Ciprofloxacino** | Infecciones urinarias/respiratorias | 500mg tabletas |
| **Levofloxacino** | Infecciones respiratorias/urinarias | 750mg tabletas |
| **Moxifloxacino** | Infecciones respiratorias | 400mg tabletas |

#### Otros
| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Doxiciclina** | Infecciones/acné | 100mg cápsulas |
| **Metronidazol** | Infecciones anaerobias | 500mg tabletas |
| **Trimetoprim/Sulfametoxazol** | Infecciones urinarias | 160/800mg tabletas |
| **Clindamicina** | Infecciones anaerobias | 300mg cápsulas |
| **Vancomicina** | Infecciones por MRSA | 500mg vial IV |

### 🟢 RECETA LIBRE (sin límite)

| Medicamento | Uso Clínico | Presentación Sugerida |
|-------------|-------------|-----------------------|
| **Paracetamol** | Analgésico/antipirético | 500mg tabletas |
| **Ibuprofeno** | AINE - analgésico | 400mg tabletas |
| **Naproxeno** | AINE - analgésico | 250mg tabletas |
| **Omeprazol** | Gastroprotector | 20mg cápsulas |
| **Loratadina** | Antihistamínico | 10mg tabletas |
| **Metformina** | Antidiabético | 850mg tabletas |
| **Losartán** | Antihipertensivo | 50mg tabletas |
| **Atorvastatina** | Estatina | 20mg tabletas |

---

## 🧪 Casos de Prueba Recomendados

### ✅ **Caso 1: Prescripción de Estupefaciente**
1. Iniciar sesión como **Dr. Carlos Mendoza (DOC-001)**
2. Crear nueva receta
3. Agregar medicamento: **Tramadol 50mg**
4. ✅ Validar: Solo permite 1 medicamento
5. ❌ Intentar agregar: **Morfina** → Debe bloquear
6. Finalizar y verificar boleta de talonario de estupefacientes

### ✅ **Caso 2: Prescripción de Antimicrobianos**
1. Iniciar sesión como **Dr. Jorge Ramírez (DOC-003)**
2. Crear nueva receta
3. Agregar medicamentos:
   - **Amoxicilina 500mg**
   - **Azitromicina 500mg**
   - **Ciprofloxacino 500mg**
4. ✅ Validar: Permite hasta 3 antimicrobianos
5. ❌ Intentar agregar 4to: **Cefalexina** → Debe bloquear
6. Finalizar y verificar boleta de talonario antimicrobiano

### ✅ **Caso 3: Prescripción Mixta (Receta Libre)**
1. Iniciar sesión como **Dra. Ana González (DOC-004)**
2. Crear nueva receta
3. Agregar medicamentos:
   - **Paracetamol 500mg**
   - **Omeprazol 20mg**
   - **Loratadina 10mg**
   - **Ibuprofeno 400mg**
   - *(y más si desea)*
4. ✅ Validar: Sin límite de medicamentos
5. Finalizar y verificar boleta de talonario libre

### ✅ **Caso 4: Sin Talonarios Disponibles**
1. Iniciar sesión como **Dra. María Rodríguez (DOC-002)**
2. Intentar crear receta
3. ❌ Validar: Alerta de "Sin boletas disponibles"
4. Comprar talonarios desde el diálogo
5. ✅ Verificar nuevo saldo

### ✅ **Caso 5: Talonario Casi Agotado**
1. Iniciar sesión como **Dr. Jorge Ramírez (DOC-003)**
2. Ver indicador: "⚠️ 3 boletas restantes"
3. Crear 3 recetas consecutivas
4. ❌ Validar: Al intentar 4ta receta, debe pedir compra

---

## 🎨 Elementos Visuales a Verificar

### Badges de Tipo de Talonario
- **Estupefacientes:** Fondo rojo claro, texto rojo oscuro
- **Psicotrópicos:** Fondo naranja claro, texto naranja oscuro
- **Antimicrobianos:** Fondo púrpura claro, texto púrpura oscuro
- **Receta Libre:** Fondo verde claro, texto verde oscuro

### Facturas de Compra
- Debe mostrar "Tipo de Talonario" con badge de color
- Debe mostrar "Límite: X medicamento(s) por receta"
- Visible en pantalla y en PDF/impresión

### Panel de Saldo de Talonarios
- Muestra saldo total
- Botón para comprar más talonarios
- Indicador visual cuando saldo < 10

---

## 🔄 Flujo Completo de Prueba

```
1. Seleccionar Profesional con talonarios
   ↓
2. Verificar saldo de boletas por tipo
   ↓
3. Crear nueva receta
   ↓
4. Agregar medicamento(s) según tipo de talonario
   ↓
5. Validar límites automáticos
   ↓
6. Finalizar receta
   ↓
7. Verificar asignación de boleta
   ↓
8. Revisar factura/receta emitida con tipo de talonario
   ↓
9. Verificar nuevo saldo
```

---

## ⚠️ Validaciones Críticas

- ✅ **No mezclar** estupefacientes con psicotrópicos
- ✅ **Respetar límites** por tipo de medicamento
- ✅ **Asignar boleta correcta** según tipo
- ✅ **Bloquear prescripción** si no hay boletas
- ✅ **Mostrar tipo** en todos los documentos

---

## 📊 Métricas de Éxito

- [ ] Sistema identifica correctamente cada tipo de medicamento
- [ ] Límites se aplican estrictamente
- [ ] Talonarios se asignan por tipo correcto
- [ ] Facturas muestran tipo de talonario
- [ ] Saldos se actualizan en tiempo real
- [ ] Badges de color son distintivos y claros

---

**¡Sistema listo para pruebas exhaustivas!** 🚀
