# 📋 Datos de Prueba - Prescripciones con Medicamentos Restringidos

## 🎯 Objetivo
Este documento contiene datos de prueba **ficticios** para validar el flujo completo de **prescripción → emisión → dispensación** de medicamentos controlados en el sistema ePrescription.

---

## ✅ Recetas Inicializadas Automáticamente

El sistema ya incluye **1 receta de prueba** cargada automáticamente:

### **RX-2025-001001** - Estupefaciente (Tramadol)
- **Paciente:** Carlos Ramírez González (Cédula: 118540123)
- **Médico:** Dr. Carlos Alberto Mendoza Herrera
- **Diagnóstico:** Dolor crónico lumbar
- **Medicamento:** Tramadol 50mg - 20 cápsulas
- **Estado:** ✅ Emitida, ⏳ Pendiente de dispensación
- **Talonario:** TAL-2025-000003-0001

---

## 📝 Datos para Crear Nuevas Prescripciones

### 🔴 ESTUPEFACIENTES (1 medicamento por receta)

#### **Prescripción 1: Morfina para dolor oncológico**
```
PACIENTE:
- Nombre: María López Martínez
- Cédula: 205430567
- Edad: 72 años
- Género: Femenino
- Alergias: Penicilina
- Condiciones crónicas: Cáncer de mama, Hipertensión

DIAGNÓSTICO: Dolor oncológico severo

MEDICAMENTO:
- Nombre: Morfina
- Concentración: 10mg
- Presentación: Tabletas
- Cantidad: 30 unidades
- Dosis: 10mg
- Frecuencia: Cada 6 horas
- Duración: 15 días
- Vía: Oral
- Indicaciones: Control de dolor oncológico. Tomar exactamente como se indica.

NOTAS CLÍNICAS: Paciente oncológica en tratamiento paliativo. Control estricto de dolor.
```

#### **Prescripción 2: Fentanilo transdérmico**
```
PACIENTE:
- Nombre: Elena Rojas Méndez
- Cédula: 806789012
- Edad: 68 años
- Género: Femenino
- Alergias: Morfina
- Condiciones crónicas: Cáncer de pulmón avanzado

DIAGNÓSTICO: Dolor oncológico crónico severo

MEDICAMENTO:
- Nombre: Fentanilo
- Concentración: 25mcg/hora
- Presentación: Parche transdérmico
- Cantidad: 8 parches
- Dosis: 25mcg/hora
- Frecuencia: Cambiar cada 72 horas
- Duración: 24 días
- Vía: Transdérmica
- Indicaciones: Aplicar en piel sana del torso o brazo superior. Rotar sitio de aplicación.

NOTAS CLÍNICAS: Paciente en cuidados paliativos. Rotación de opioide por intolerancia a morfina.
```

#### **Prescripción 3: Oxicodona post-operatoria**
```
PACIENTE:
- Nombre: Ricardo Torres Sánchez
- Cédula: 309876543
- Edad: 45 años
- Género: Masculino
- Alergias: Ninguna
- Condiciones crónicas: Ninguna

DIAGNÓSTICO: Dolor post-operatorio severo (cirugía de columna)

MEDICAMENTO:
- Nombre: Oxicodona
- Concentración: 5mg
- Presentación: Tabletas
- Cantidad: 20 unidades
- Dosis: 5mg
- Frecuencia: Cada 6-8 horas según necesidad
- Duración: 10 días
- Vía: Oral
- Indicaciones: Tomar con alimentos. No conducir vehículos. Control de dolor post-operatorio.

NOTAS CLÍNICAS: Post-operatorio inmediato de artrodesis lumbar. Control de dolor intenso.
```

---

### 🟠 PSICOTRÓPICOS (1 medicamento por receta)

#### **Prescripción 4: Diazepam para ansiedad**
```
PACIENTE:
- Nombre: Roberto Morales Jiménez
- Cédula: 302156789
- Edad: 45 años
- Género: Masculino
- Alergias: Ninguna
- Condiciones crónicas: Trastorno de ansiedad generalizada

DIAGNÓSTICO: Trastorno de ansiedad generalizada (F41.1)

MEDICAMENTO:
- Nombre: Diazepam
- Concentración: 5mg
- Presentación: Tabletas
- Cantidad: 30 tabletas
- Dosis: 5mg
- Frecuencia: 2 veces al día (mañana y noche)
- Duración: 15 días
- Vía: Oral
- Indicaciones: Tomar 1 tableta en la mañana y 1 en la noche. No conducir vehículos.

NOTAS CLÍNICAS: Paciente con crisis de ansiedad recurrentes. Iniciar tratamiento benzodiacepínico.
```

#### **Prescripción 5: Alprazolam para trastorno de pánico**
```
PACIENTE:
- Nombre: Ana Vargas Castro
- Cédula: 401234567
- Edad: 38 años
- Género: Femenino
- Alergias: Sulfonamidas
- Condiciones crónicas: Ninguna

DIAGNÓSTICO: Trastorno de pánico (F41.0)

MEDICAMENTO:
- Nombre: Alprazolam
- Concentración: 0.5mg
- Presentación: Tabletas
- Cantidad: 60 tabletas
- Dosis: 0.5mg
- Frecuencia: 3 veces al día según necesidad
- Duración: 20 días
- Vía: Oral
- Indicaciones: Tomar según necesidad durante crisis de pánico. Máximo 3 tabletas al día.

NOTAS CLÍNICAS: Paciente con ataques de pánico frecuentes. Control en 2 semanas.
```

#### **Prescripción 6: Clonazepam para epilepsia**
```
PACIENTE:
- Nombre: Luis Fernando Pérez Mora
- Cédula: 507654321
- Edad: 35 años
- Género: Masculino
- Alergias: Ninguna
- Condiciones crónicas: Epilepsia

DIAGNÓSTICO: Epilepsia focal con crisis parciales complejas

MEDICAMENTO:
- Nombre: Clonazepam
- Concentración: 2mg
- Presentación: Tabletas
- Cantidad: 60 tabletas
- Dosis: 2mg
- Frecuencia: 2 veces al día
- Duración: 30 días
- Vía: Oral
- Indicaciones: Tomar en horario fijo. No suspender abruptamente. Control neurológico mensual.

NOTAS CLÍNICAS: Paciente con epilepsia controlada. Renovación de tratamiento anticonvulsivante.
```

#### **Prescripción 7: Metilfenidato para TDAH**
```
PACIENTE:
- Nombre: Andrés Castro Vargas
- Cédula: 907890123
- Edad: 12 años
- Género: Masculino
- Alergias: Ninguna
- Condiciones crónicas: TDAH

DIAGNÓSTICO: Trastorno por déficit de atención e hiperactividad (F90.0)

MEDICAMENTO:
- Nombre: Metilfenidato
- Concentración: 10mg
- Presentación: Tabletas
- Cantidad: 30 tabletas
- Dosis: 10mg
- Frecuencia: 1 vez al día en la mañana
- Duración: 30 días
- Vía: Oral
- Indicaciones: Administrar por la mañana con el desayuno. Control mensual obligatorio.

NOTAS CLÍNICAS: Paciente pediátrico con TDAH diagnosticado. Inicio de tratamiento estimulante.
```

#### **Prescripción 8: Zolpidem para insomnio**
```
PACIENTE:
- Nombre: Patricia González Núñez
- Cédula: 608765432
- Edad: 56 años
- Género: Femenino
- Alergias: Ninguna
- Condiciones crónicas: Insomnio crónico

DIAGNÓSTICO: Insomnio primario crónico

MEDICAMENTO:
- Nombre: Zolpidem
- Concentración: 10mg
- Presentación: Tabletas
- Cantidad: 30 tabletas
- Dosis: 10mg
- Frecuencia: 1 vez al día al acostarse
- Duración: 30 días
- Vía: Oral
- Indicaciones: Tomar inmediatamente antes de acostarse. Asegurar 7-8 horas de sueño.

NOTAS CLÍNICAS: Paciente con insomnio de conciliación. Tratamiento de corto plazo.
```

---

### 🟣 ANTIMICROBIANOS (hasta 3 medicamentos por receta)

#### **Prescripción 9: Amoxicilina para faringitis**
```
PACIENTE:
- Nombre: Laura Fernández Soto
- Cédula: 604567890
- Edad: 28 años
- Género: Femenino
- Alergias: Ninguna
- Condiciones crónicas: Ninguna

DIAGNÓSTICO: Faringitis bacteriana aguda

MEDICAMENTO:
- Nombre: Amoxicilina
- Concentración: 500mg
- Presentación: Cápsulas
- Cantidad: 21 cápsulas
- Dosis: 500mg
- Frecuencia: Cada 8 horas
- Duración: 7 días
- Vía: Oral
- Indicaciones: Completar tratamiento aunque mejoren los síntomas.

NOTAS CLÍNICAS: Infección de vías respiratorias superiores. Tratamiento ambulatorio.
```

#### **Prescripción 10: Neumonía - Terapia Triple**
```
PACIENTE:
- Nombre: Jorge Hernández Rojas
- Cédula: 503456789
- Edad: 62 años
- Género: Masculino
- Alergias: Ninguna
- Condiciones crónicas: EPOC

DIAGNÓSTICO: Neumonía adquirida en la comunidad

MEDICAMENTO 1:
- Nombre: Ceftriaxona
- Concentración: 1g
- Presentación: Vial IM/IV
- Cantidad: 7 viales
- Dosis: 1g
- Frecuencia: Cada 24 horas
- Duración: 7 días
- Vía: Intravenosa
- Indicaciones: Administrar en 30 minutos por vía IV.

MEDICAMENTO 2:
- Nombre: Azitromicina
- Concentración: 500mg
- Presentación: Tabletas
- Cantidad: 5 tabletas
- Dosis: 500mg
- Frecuencia: 1 vez al día
- Duración: 5 días
- Vía: Oral
- Indicaciones: Tomar 1 hora antes o 2 horas después de las comidas.

MEDICAMENTO 3:
- Nombre: Levofloxacino
- Concentración: 750mg
- Presentación: Tabletas
- Cantidad: 7 tabletas
- Dosis: 750mg
- Frecuencia: 1 vez al día
- Duración: 7 días
- Vía: Oral
- Indicaciones: Tomar con abundante agua. Evitar exposición solar prolongada.

NOTAS CLÍNICAS: Paciente con neumonía bilateral. Tratamiento antibiótico triple.
```

#### **Prescripción 11: Ciprofloxacino + Metronidazol (infección mixta)**
```
PACIENTE:
- Nombre: Pedro Sánchez Gómez
- Cédula: 705678901
- Edad: 52 años
- Género: Masculino
- Alergias: Ninguna
- Condiciones crónicas: Diabetes tipo 2

DIAGNÓSTICO: Infección intraabdominal complicada

MEDICAMENTO 1:
- Nombre: Ciprofloxacino
- Concentración: 500mg
- Presentación: Tabletas
- Cantidad: 14 tabletas
- Dosis: 500mg
- Frecuencia: Cada 12 horas
- Duración: 7 días
- Vía: Oral
- Indicaciones: Tomar con abundante agua. No tomar con lácteos.

MEDICAMENTO 2:
- Nombre: Metronidazol
- Concentración: 500mg
- Presentación: Tabletas
- Cantidad: 21 tabletas
- Dosis: 500mg
- Frecuencia: Cada 8 horas
- Duración: 7 días
- Vía: Oral
- Indicaciones: No consumir alcohol durante el tratamiento. Tomar con alimentos.

NOTAS CLÍNICAS: Paciente post-quirúrgico con infección mixta. Cobertura amplia.
```

#### **Prescripción 12: Doxiciclina para acné**
```
PACIENTE:
- Nombre: Sofía Méndez Torres
- Cédula: 108901234
- Edad: 24 años
- Género: Femenino
- Alergias: Ninguna
- Condiciones crónicas: Ninguna

DIAGNÓSTICO: Acné vulgar moderado

MEDICAMENTO:
- Nombre: Doxiciclina
- Concentración: 100mg
- Presentación: Cápsulas
- Cantidad: 30 cápsulas
- Dosis: 100mg
- Frecuencia: 1 vez al día
- Duración: 30 días
- Vía: Oral
- Indicaciones: Tomar con alimentos. Evitar exposición solar. Usar protector solar SPF 50+.

NOTAS CLÍNICAS: Tratamiento antibiótico para acné resistente a tratamiento tópico.
```

#### **Prescripción 13: Cefalexina para infección de piel**
```
PACIENTE:
- Nombre: Fernando Mora Villalobos
- Cédula: 409876543
- Edad: 40 años
- Género: Masculino
- Alergias: Ninguna
- Condiciones crónicas: Ninguna

DIAGNÓSTICO: Celulitis de miembro inferior izquierdo

MEDICAMENTO:
- Nombre: Cefalexina
- Concentración: 500mg
- Presentación: Cápsulas
- Cantidad: 28 cápsulas
- Dosis: 500mg
- Frecuencia: Cada 6 horas
- Duración: 7 días
- Vía: Oral
- Indicaciones: Completar tratamiento completo. Elevar pierna afectada.

NOTAS CLÍNICAS: Infección de tejidos blandos. Evaluar respuesta en 48-72 horas.
```

---

## 👥 Pacientes Ficticios Adicionales

Para facilitar las pruebas, aquí hay más pacientes que puedes usar:

| Nombre Completo | Cédula | Edad | Género | Sangre | Alergias | Condiciones |
|-----------------|--------|------|--------|--------|----------|-------------|
| **Daniel Vargas Solís** | 210987654 | 51 | M | A+ | Ninguna | Hipertensión |
| **Gabriela Mora Chaves** | 311234567 | 33 | F | O- | Aspirina | Ninguna |
| **Ricardo Jiménez Quesada** | 412345678 | 67 | M | B+ | Penicilina | EPOC, Diabetes |
| **Valentina Castro Ruiz** | 513456789 | 19 | F | AB+ | Ninguna | Asma |
| **Esteban Rojas Pérez** | 614567890 | 44 | M | O+ | Ninguna | Ninguna |
| **Carolina Sánchez Mora** | 715678901 | 29 | F | A- | Sulfonamidas | Ninguna |
| **Mauricio Torres Vargas** | 816789012 | 58 | M | B- | Ninguna | Artritis reumatoide |
| **Isabella Fernández Cruz** | 917890123 | 16 | F | O+ | Ninguna | Ninguna |
| **Alejandro Gutiérrez Salas** | 101234567 | 71 | M | A+ | Yodo | Insuficiencia renal |
| **Camila Rodríguez Mora** | 201345678 | 26 | F | B+ | Ninguna | Ninguna |

---

## 🧪 Escenarios de Prueba Sugeridos

### ✅ Escenario 1: Prescripción de Estupefaciente
1. Crear receta con **Tramadol** o **Morfina**
2. Validar que solo permite **1 medicamento**
3. Emitir receta
4. Verificar asignación de talonario de **estupefacientes**
5. Dispensar total o parcialmente
6. Verificar estado de dispensación

### ✅ Escenario 2: Prescripción de Psicotrópico
1. Crear receta con **Diazepam** o **Alprazolam**
2. Validar que solo permite **1 medicamento**
3. Emitir receta
4. Verificar asignación de talonario de **psicotrópicos**
5. Dispensar y verificar control

### ✅ Escenario 3: Prescripción de Antimicrobianos
1. Crear receta con **hasta 3 antimicrobianos** (ej: Ceftriaxona + Azitromicina + Levofloxacino)
2. Validar límite de 3 medicamentos
3. Intentar agregar 4to → debe bloquear
4. Emitir receta
5. Verificar talonario de **antimicrobianos**

### ✅ Escenario 4: Dispensación Parcial
1. Usar receta con **Alprazolam 60 tabletas**
2. Dispensar solo **30 tabletas** la primera vez
3. Verificar estado **parcialmente dispensada**
4. Completar dispensación con las 30 restantes
5. Verificar estado **totalmente dispensada**

### ✅ Escenario 5: Validación de Restricciones
1. Intentar prescribir **Tramadol + Morfina** juntos → debe bloquear
2. Intentar prescribir **Diazepam + Alprazolam** juntos → debe bloquear
3. Intentar 4 antimicrobianos → debe bloquear

---

## 📊 Métricas de Validación

- [ ] Sistema clasifica correctamente cada medicamento
- [ ] Límites por tipo se respetan estrictamente
- [ ] Talonarios se asignan según tipo correcto
- [ ] Dispensación parcial funciona correctamente
- [ ] Estados de recetas se actualizan en tiempo real
- [ ] Validaciones bloquean combinaciones prohibidas
- [ ] Historial de dispensación se registra correctamente

---

**Sistema completo de datos de prueba listo para validación exhaustiva** 🚀

**NOTA IMPORTANTE:** Todos los datos son **ficticios** y creados únicamente con **fines de prueba y desarrollo**. No representan pacientes, médicos o prescripciones reales.
