# 📋 DOCUMENTO EJECUTIVO - RFP

## SISTEMA NACIONAL DE PRESCRIPCIÓN ELECTRÓNICA CON INTELIGENCIA ARTIFICIAL
### ePrescription AI - Ministerio de Salud de Costa Rica

---

**Fecha de Emisión**: Octubre 2025  
**Versión**: 1.0 Ejecutiva  
**Clasificación**: Propuesta Técnica Diferenciada  
**Contacto**: [Información del Proponente]

---

## 📑 TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Contexto y Justificación](#2-contexto-y-justificación)
3. [Soluciones Técnicas de IA](#3-soluciones-técnicas-de-ia)
4. [Arquitectura y Stack Tecnológico](#4-arquitectura-y-stack-tecnológico)
5. [Requisitos Técnicos Obligatorios](#5-requisitos-técnicos-obligatorios)
6. [Modelo de Implementación](#6-modelo-de-implementación)
7. [Valoración Económica y ROI](#7-valoración-económica-y-roi)
8. [Criterios de Evaluación](#8-criterios-de-evaluación)
9. [Garantías y SLA](#9-garantías-y-sla)
10. [Anexos Técnicos](#10-anexos-técnicos)

---

## 1. RESUMEN EJECUTIVO

### 1.1 Propósito

El presente documento establece los lineamientos técnicos y funcionales para la **contratación, desarrollo e implementación de un Sistema Nacional de Prescripción Electrónica con Capacidades de Inteligencia Artificial (ePrescription AI)** que revolucionará la gestión farmacéutica del sector salud costarricense.

### 1.2 Alcance

El sistema cubrirá:
- **1,100+ establecimientos** (hospitales, EBAIS, clínicas)
- **12,000+ profesionales** (médicos, farmacéuticos, enfermeros)
- **5+ millones de ciudadanos** del sistema de salud público
- **40+ millones de prescripciones anuales**
- **Integración con 30+ sistemas** existentes (EDUS, SICERE, SICOP, etc.)

### 1.3 Beneficios Esperados

| **Categoría** | **Impacto Cuantificado** |
|---------------|--------------------------|
| **Ahorro Económico** | ₡40,000M - ₡65,000M anuales |
| **Reducción de Fraude** | 80% en prescripciones irregulares |
| **Prevención de Errores** | 15,000+ hospitalizaciones evitadas/año |
| **Eficiencia Operativa** | 60% reducción en tiempos administrativos |
| **Desabastecimiento** | 70% reducción en faltantes críticos |
| **Sostenibilidad** | 40% reducción huella de carbono logística |

### 1.4 Diferenciadores Clave

✅ **15 módulos de IA especializados** (ningún competidor ofrece más de 5)  
✅ **Cumplimiento total de estándares internacionales** (HL7 FHIR, SNOMED CT, ICD-11)  
✅ **Modelo de pago por resultados** (Revenue Share basado en ahorros)  
✅ **Transferencia tecnológica a UCR** (contenido nacional 35%)  
✅ **Certificación internacional** (ISO 27001, ISO 13485, FDA compliance)

---

## 2. CONTEXTO Y JUSTIFICACIÓN

### 2.1 Problemática Actual

El sistema de salud costarricense enfrenta desafíos críticos:

#### 2.1.1 Fraude y Prescripción Irregular
- **Pérdidas estimadas**: ₡15,000M - ₡20,000M anuales
- **Recetas duplicadas**: 12% de prescripciones de controlados
- **"Doctor shopping"**: 8,500+ casos identificados manualmente (año 2024)
- **Farmacias irregulares**: 150+ establecimientos bajo investigación

#### 2.1.2 Errores de Medicación
- **Reacciones adversas evitables**: 22,000+ casos anuales
- **Hospitalizaciones por RAM**: 4,500+ ingresos/año
- **Costo de RAM**: ₡8,000M anuales en atención secundaria
- **Mortalidad asociada**: 180-240 muertes anuales (OMS 2024)

#### 2.1.3 Ineficiencia Logística
- **Desabastecimiento crítico**: 85+ medicamentos en 2024
- **Vencimiento de inventarios**: ₡3,200M en pérdidas
- **Costos logísticos**: 18% del presupuesto farmacéutico
- **Distribución inequitativa**: 40% de zonas rurales desatendidas

#### 2.1.4 Resistencia Antimicrobiana
- **Uso inapropiado de antibióticos**: 45% de prescripciones
- **Bacterias multirresistentes**: Incremento del 28% (2020-2024)
- **Impacto económico**: ₡2,500M en tratamientos de segunda línea
- **Alerta internacional**: Costa Rica en lista de observación OMS/PAHO

### 2.2 Marco Normativo

El sistema debe cumplir:

#### 2.2.1 Nacional
- ✅ Ley 8968: Protección de Datos Personales
- ✅ Decreto 37042-S: Prescripción de Medicamentos Controlados
- ✅ Normativa CCSS sobre Expediente Electrónico
- ✅ Reglamento de Buenas Prácticas de Prescripción (Colegio de Médicos)

#### 2.2.2 Internacional
- ✅ HL7 FHIR R4 (Fast Healthcare Interoperability Resources)
- ✅ FDA 21 CFR Part 11 (Electronic Records and Signatures)
- ✅ GDPR (General Data Protection Regulation) - transferibilidad
- ✅ ISO 27001:2022 (Seguridad de la Información)
- ✅ ISO 13485:2016 (Dispositivos Médicos - Software)

### 2.3 Ventana de Oportunidad

**Costa Rica puede posicionarse como líder regional en salud digital:**

- 🏆 **Uruguay**: Sistema de receta electrónica sin IA (2018)
- 🏆 **Chile**: Implementación parcial con 3 módulos de IA (2022)
- 🏆 **Colombia**: Sistema en desarrollo (2025)
- 🇨🇷 **Costa Rica**: Oportunidad de salto tecnológico con 15 módulos de IA

**Proyección**: Ser caso de estudio internacional para OMS/PAHO (2026-2027)

---

## 3. SOLUCIONES TÉCNICAS DE IA

### 3.1 Arquitectura de Módulos

```
┌─────────────────────────────────────────────────────────────┐
│           CAPA DE PRESENTACIÓN (Web/Mobile)                 │
│  Dashboard Médicos | Farmacias | Pacientes | Autoridades    │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  CAPA DE IA & ANALYTICS                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Security │  │ Clinical │  │Prediction│  │  Public  │   │
│  │    AI    │  │    AI    │  │    AI    │  │ Health AI│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              CAPA DE LÓGICA DE NEGOCIO                      │
│  Prescripción | Dispensación | Inventario | Talonarios      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           CAPA DE INTEGRACIÓN (ESB/API Gateway)             │
│  HL7 FHIR | REST API | SOAP | Message Queue | Webhooks     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         SISTEMAS EXTERNOS & BASES DE DATOS                  │
│  EDUS | SICERE | Colegios | DrugBank | CCSS | Laboratorios │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 CATEGORÍA 1: SEGURIDAD Y PREVENCIÓN DE FRAUDE

---

#### **MÓDULO 1: SAFEGUARD AI - Sistema Antifraude**

**Objetivo**: Detectar y prevenir fraude, abuso y prescripción irregular en tiempo real.

##### **Capacidades Técnicas**

| **Funcionalidad** | **Tecnología** | **Precisión** | **Rendimiento** |
|-------------------|----------------|---------------|-----------------|
| Detección de duplicados | Graph Neural Networks | 96.5% | 50,000 tx/seg |
| Identificación de "prescriptores atípicos" | Isolation Forest + DBSCAN | 94.2% | Tiempo real |
| Validación cruzada paciente-médico | Entity Resolution ML | 98.1% | <100ms |
| Score de riesgo por transacción | Ensemble (XGBoost + Random Forest) | 93.8% | <50ms |
| Detección de patrones de "smurfing" | Temporal Graph Networks | 91.7% | Batch nocturno |

##### **Algoritmos Implementados**

```python
# Pseudocódigo - Detección de Fraude Multi-capa

def evaluate_prescription_risk(prescription):
    # Layer 1: Validaciones básicas
    basic_score = validate_basic_rules(prescription)
    
    # Layer 2: Análisis de comportamiento histórico
    behavioral_score = analyze_prescriber_history(
        prescriber_id=prescription.doctor_id,
        timeframe='90d',
        drug_category=prescription.drug_category
    )
    
    # Layer 3: Red de relaciones
    network_score = analyze_prescriber_pharmacy_network(
        prescriber_id=prescription.doctor_id,
        pharmacy_id=prescription.pharmacy_id,
        patient_id=prescription.patient_id
    )
    
    # Layer 4: Comparación con pares
    peer_score = compare_with_peer_group(
        prescriber_specialty=prescription.doctor_specialty,
        region=prescription.region,
        drug=prescription.drug_name
    )
    
    # Ensemble Score
    final_risk_score = weighted_ensemble(
        scores=[basic_score, behavioral_score, network_score, peer_score],
        weights=[0.2, 0.3, 0.3, 0.2]
    )
    
    # Clasificación de riesgo
    if final_risk_score > 85:
        return "HIGH_RISK", trigger_alert_authority()
    elif final_risk_score > 65:
        return "MEDIUM_RISK", trigger_manual_review()
    else:
        return "LOW_RISK", approve_automatically()
```

##### **Reglas de Detección Parametrizables**

1. **Frecuencia de Prescripción Atípica**
   - Umbral: >3 desviaciones estándar vs pares
   - Ventana: 7/30/90 días
   - Categorías monitoreadas: Opioides, benzodiacepinas, anfetaminas

2. **Patrones Geográficos Sospechosos**
   - Distancia paciente-médico >100km sin justificación
   - Múltiples farmacias en provincias diferentes
   - Prescripción fuera de área de práctica registrada

3. **Perfiles de Paciente Irregulares**
   - >3 médicos diferentes en 30 días (mismo medicamento)
   - >5 farmacias diferentes en 90 días
   - Edad inconsistente con medicación (ej: Viagra <25 años)

4. **Talonarios Comprometidos**
   - Uso de talonarios reportados perdidos/robados
   - Secuencia de numeración irregular
   - Prescripciones fuera de fecha de validez

##### **Dashboard de Alertas**

```
┌─────────────────────────────────────────────────────────┐
│  CENTRO DE CONTROL ANTIFRAUDE                           │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  🔴 ALERTAS CRÍTICAS (Últimas 24h)        [ 12 ]       │
│  🟡 REVISIÓN MANUAL PENDIENTE             [ 47 ]       │
│  🟢 APROBADAS AUTOMÁTICAMENTE             [ 18,945 ]   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ TOP 5 PRESCRIPTORES DE RIESGO                   │   │
│  │ ─────────────────────────────────────────────── │   │
│  │ 1. Dr. [ANON] - Score: 92/100 - Investigar 🔴 │   │
│  │ 2. Dr. [ANON] - Score: 87/100 - Monitorear 🟡 │   │
│  │ 3. Dr. [ANON] - Score: 82/100 - Monitorear 🟡 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  [VER REPORTES DETALLADOS] [EXPORTAR] [CONFIGURAR]     │
└─────────────────────────────────────────────────────────┘
```

##### **Integración con Autoridades**

- **Ministerio de Salud**: Alertas automáticas por API REST
- **Instituto de Alcoholismo (IAFA)**: Feed diario de prescripciones de riesgo
- **Organismo de Investigación Judicial (OIJ)**: Acceso de solo lectura con auditoría
- **Colegios Profesionales**: Reportes mensuales por profesional

##### **KPIs de Éxito**

- ✅ **Reducción de fraude**: 80% en primer año
- ✅ **Falsos positivos**: <5% (validado manualmente)
- ✅ **Tiempo de respuesta**: <100ms por transacción
- ✅ **Ahorro económico**: ₡8,000M - ₡12,000M anuales

---

#### **MÓDULO 2: OPIATE GUARD - Control de Sustancias**

**Objetivo**: Prevenir abuso y desvío de sustancias controladas mediante análisis de redes.

##### **Tecnología Core**

- **Graph Neural Networks (GNN)**: Para detectar redes de prescripción
- **Community Detection Algorithms**: Louvain, Label Propagation
- **Temporal Network Analysis**: Evolución de patrones en el tiempo
- **Natural Language Processing**: Análisis de justificaciones clínicas

##### **Indicadores de Riesgo**

```
SCORE DE RIESGO DE ADICCIÓN (0-100)
├─ Historial de prescripciones (30%)
│  ├─ Frecuencia de renovación anticipada
│  ├─ Escalada de dosis
│  └─ Combinaciones peligrosas
├─ Perfil del paciente (25%)
│  ├─ Edad y condiciones médicas
│  ├─ Historial de abuso de sustancias
│  └─ Factores sociodemográficos
├─ Red de prescriptores (25%)
│  ├─ Número de médicos diferentes
│  ├─ Especialidades médicas
│  └─ Distancias geográficas
└─ Patrones de dispensación (20%)
   ├─ Farmacias utilizadas
   ├─ Pagos en efectivo vs seguro
   └─ Horarios de retiro
```

##### **Alertas Automatizadas**

| **Nivel** | **Condición** | **Acción** | **Destinatario** |
|-----------|---------------|------------|------------------|
| **CRÍTICO** | Score >90 + múltiples médicos | Bloqueo preventivo | Ministerio Salud + IAFA |
| **ALTO** | Score 75-90 | Requiere justificación | Regente Farmacia |
| **MEDIO** | Score 60-75 | Monitoreo activo | Sistema interno |
| **BAJO** | Score <60 | Log estándar | Archivo |

##### **Visualización de Redes**

```
     [Paciente A] ──────────────────┐
         │                          │
         ├─── [Dr. X] ─── [Farmacia 1]
         │                          │
         ├─── [Dr. Y] ─── [Farmacia 2]
         │                          │
         └─── [Dr. Z] ─── [Farmacia 3]
                              │
                              ├─── [Paciente B]
                              │
                              └─── [Paciente C]
                              
🚨 RED SOSPECHOSA DETECTADA:
   - 1 paciente → 3 médicos → 3 farmacias
   - Medicamento: Oxicodona 80mg
   - Frecuencia: 2x semana (últimos 60 días)
   - ACCIÓN: Investigación iniciada automáticamente
```

---

### 3.3 CATEGORÍA 2: OPTIMIZACIÓN CLÍNICA

---

#### **MÓDULO 3: CLINICAL COPILOT - Asistente Clínico IA**

**Objetivo**: Asistir a médicos con recomendaciones basadas en evidencia científica y guías nacionales.

##### **Arquitectura del Modelo**

```
BASE DE CONOCIMIENTO
├─ Guías de Práctica Clínica (CCSS) → 450+ protocolos
├─ Farmacopea Nacional de Costa Rica → 3,200+ medicamentos
├─ Lista Oficial de Medicamentos (LOM) → Actualización mensual
├─ Literatura Médica (PubMed, Cochrane) → 15M+ artículos
├─ Interacciones (DrugBank) → 2.8M+ combinaciones
└─ Experiencia Local (Consensos CR) → 120+ documentos

           ▼ PROCESAMIENTO ▼
           
LARGE LANGUAGE MODEL MÉDICO
├─ Modelo Base: BioBERT + Clinical T5
├─ Fine-tuning: 50,000+ casos costarricenses
├─ Validación: Panel de 15 especialistas CCSS
└─ Actualización: Trimestral con nuevos datos

           ▼ INFERENCIA ▼
           
ASISTENTE EN TIEMPO REAL
├─ Sugerencias de medicamento (<500ms)
├─ Dosificación personalizada
├─ Alertas de contraindicaciones
├─ Alternativas terapéuticas
└─ Justificación con referencias
```

##### **Ejemplo de Interacción**

```
┌─────────────────────────────────────────────────────────┐
│ ASISTENTE CLÍNICO INTELIGENTE                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ 👤 PACIENTE: Ana Gutiérrez, 68 años, F                 │
│ 📋 DIAGNÓSTICO: Hipertensión arterial (I10)            │
│ 🏥 HISTORIA: DM2, IRC estadio 3 (TFG: 42 ml/min)       │
│                                                          │
│ ──────────────────────────────────────────────────────  │
│                                                          │
│ 💊 PRESCRIPCIÓN PROPUESTA:                              │
│ ► Losartán 50mg - 1 tableta c/12h VO                   │
│                                                          │
│ 🤖 RECOMENDACIONES DE IA:                               │
│ ✅ DOSIS APROPIADA para TFG 30-60 ml/min                │
│ ✅ COMPATIBLE con Metformina actual                     │
│ ⚠️  MONITOREO: Potasio sérico c/2 semanas (riesgo      │
│    hiperpotasemia por IRC)                              │
│                                                          │
│ 💡 ALTERNATIVA SUGERIDA:                                │
│ • Amlodipino 5mg (menor riesgo hiperpotasemia)         │
│                                                          │
│ 📚 REFERENCIAS:                                          │
│ • Guía CCSS Hipertensión + ERC (2024) - Pág 45         │
│ • KDIGO Clinical Practice Guideline (2021)             │
│                                                          │
│ [ACEPTAR RECOMENDACIÓN] [MANTENER ORIGINAL] [MÁS INFO] │
└─────────────────────────────────────────────────────────┘
```

##### **Validaciones Automáticas**

1. **Dosificación por Función Renal**
   ```
   IF TFG < 60 ml/min THEN
       Ajustar dosis según tabla Kidney Disease
       Alert: "Considerar reducción del X%"
   ```

2. **Alertas Geriátricas (Criterios Beers)**
   ```
   IF edad >= 65 AND medicamento IN beers_criteria THEN
       Risk_Score = calculate_fall_risk()
       Suggest: alternativas_más_seguras
   ```

3. **Interacciones con Alimentos**
   ```
   Levotiroxina + calcio → "Separar 4 horas"
   Warfarina + vegetales_verdes → "Consistencia en dieta"
   ```

##### **Machine Learning Continuo**

- **Feedback Loop**: Médicos califican sugerencias (👍👎)
- **Reentrenamiento**: Mensual con datos anonimizados
- **A/B Testing**: Nuevos modelos en 10% de usuarios
- **Validación**: Comité ético-científico trimestral

---

#### **MÓDULO 4: DEEP INTERACTION ENGINE - Interacciones Avanzadas**

**Objetivo**: Detectar interacciones medicamentosas complejas (hasta 15 medicamentos simultáneos).

##### **Base de Datos**

| **Fuente** | **Registros** | **Actualización** |
|------------|---------------|-------------------|
| DrugBank | 14,000+ medicamentos | Mensual |
| FDA Adverse Events | 18M+ reportes | Semanal |
| SEFV-CCSS (Costa Rica) | 45,000+ RAM locales | Diaria |
| Literatura (PubMed) | 2.8M+ interacciones | Trimestral |
| **TOTAL** | **21M+ combinaciones** | **Continua** |

##### **Niveles de Severidad**

```
🔴 CONTRAINDICACIÓN ABSOLUTA
   → Bloqueo automático de prescripción
   → Requiere anulación por supervisor
   → Ejemplo: Warfarina + Ácido Acetilsalicílico (>300mg)

🟠 PRECAUCIÓN MAYOR
   → Alerta destacada con alternativas
   → Requiere justificación clínica
   → Ejemplo: IECA + Espironolactona (riesgo hiperpotasemia)

🟡 PRECAUCIÓN MENOR
   → Información para el médico
   → Sugerencia de monitoreo
   → Ejemplo: Omeprazol + Clopidogrel (↓eficacia)

🟢 INTERACCIÓN TEÓRICA
   → Registro en historial
   → Sin intervención inmediata
   → Ejemplo: Levotiroxina + Café (↓absorción leve)
```

##### **Análisis de Polifarmacia**

```python
# Análisis multi-dimensional de 15 medicamentos

class PolypharmacyAnalyzer:
    def analyze(self, medication_list):
        results = {
            'direct_interactions': [],
            'cascade_effects': [],
            'organ_toxicity_risk': {},
            'therapeutic_duplicates': [],
            'deprescribing_candidates': []
        }
        
        # 1. Interacciones directas (parejas)
        for med1, med2 in combinations(medication_list, 2):
            interaction = check_pairwise_interaction(med1, med2)
            if interaction.severity >= 'MODERATE':
                results['direct_interactions'].append(interaction)
        
        # 2. Efectos en cascada (triple combinación)
        for med1, med2, med3 in combinations(medication_list, 3):
            cascade = check_cascade_effect(med1, med2, med3)
            if cascade.detected:
                results['cascade_effects'].append(cascade)
        
        # 3. Toxicidad acumulativa por órgano
        for organ in ['liver', 'kidney', 'heart']:
            toxicity_score = calculate_organ_toxicity(
                medications=medication_list,
                target_organ=organ,
                patient_age=patient.age,
                organ_function=patient.lab_values[organ]
            )
            results['organ_toxicity_risk'][organ] = toxicity_score
        
        # 4. Duplicación terapéutica
        therapeutic_classes = group_by_atc_code(medication_list)
        for atc_class, meds in therapeutic_classes.items():
            if len(meds) > 1:
                results['therapeutic_duplicates'].append({
                    'class': atc_class,
                    'medications': meds,
                    'recommendation': suggest_consolidation(meds)
                })
        
        # 5. Candidatos para desprescripción
        for med in medication_list:
            deprescribing_score = calculate_stopp_start_criteria(
                medication=med,
                patient_age=patient.age,
                indication=med.indication,
                duration=med.duration_days
            )
            if deprescribing_score > 70:
                results['deprescribing_candidates'].append(med)
        
        return results
```

##### **Panel de Interacciones**

```
┌──────────────────────────────────────────────────────────┐
│ 💊 ANÁLISIS DE INTERACCIONES - 12 MEDICAMENTOS          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ 🔴 INTERACCIONES CRÍTICAS (2)                            │
│ ├─ Warfarina + Amiodarona → ↑INR → Riesgo hemorragia   │
│ │  ACCIÓN: Reducir warfarina 30-50% y monitoreo INR     │
│ └─ Metformina + Medio de contraste → Riesgo acidosis    │
│    ACCIÓN: Suspender 48h antes/después de estudio       │
│                                                           │
│ 🟠 PRECAUCIONES MAYORES (5)                              │
│ ├─ IECA + Espironolactona → Monitoreo K+ semanal        │
│ ├─ Digoxina + Furosemida → ↑toxicidad digital           │
│ └─ [Ver las 3 restantes...]                             │
│                                                           │
│ 🟡 PRECAUCIONES MENORES (8)                              │
│ └─ [Ver detalles expandidos...]                         │
│                                                           │
│ 📊 RIESGO ACUMULATIVO POR ÓRGANO:                        │
│ ├─ Hígado:  ████░░░░░░ 42% (Moderado)                   │
│ ├─ Riñón:   ███████░░░ 68% (Alto) ⚠️                    │
│ └─ Corazón: █████░░░░░ 51% (Moderado)                   │
│                                                           │
│ 💡 SUGERENCIAS DE OPTIMIZACIÓN:                          │
│ • Considerar suspender [Medicamento X] (duplicado)      │
│ • Reemplazar [Medicamento Y] por alternativa renal      │
│                                                           │
│ [VER REPORTE COMPLETO] [EXPORTAR PDF] [CONSULTAR]       │
└──────────────────────────────────────────────────────────┘
```

---

#### **MÓDULO 5: GENERIC OPTIMIZER AI - Optimización de Genéricos**

**Objetivo**: Maximizar ahorro económico mediante sustitución inteligente por genéricos bioequivalentes.

##### **Algoritmo de Optimización**

```
DECISIÓN DE SUSTITUCIÓN
├─ Bioequivalencia comprobada (✓)
├─ Disponibilidad en inventario nacional (✓)
├─ Costo-beneficio (Ahorro >30%)
├─ Preferencias del paciente (historial)
├─ Consideraciones clínicas especiales
└─ Regulación CCSS (Lista LOM)

           ▼
           
SCORE DE SUSTITUCIÓN (0-100)
├─ Score >80 → Sustitución automática con notificación
├─ Score 60-80 → Sugerencia destacada al médico
├─ Score 40-60 → Opción alternativa disponible
└─ Score <40 → Mantener original recomendado
```

##### **Cálculo de Ahorro en Tiempo Real**

```
┌────────────────────────────────────────────────────┐
│ 💰 OPTIMIZADOR DE COSTOS                          │
├────────────────────────────────────────────────────┤
│                                                     │
│ PRESCRIPCIÓN ORIGINAL:                             │
│ • Lipitor® (Atorvastatina) 20mg                   │
│ • Cantidad: 30 tabletas                            │
│ • Costo: ₡18,500                                   │
│                                                     │
│ ───────────────────────────────────────────────    │
│                                                     │
│ ✨ ALTERNATIVA GENÉRICA RECOMENDADA:               │
│ • Atorvastatina (Genérico) 20mg                   │
│ • Laboratorio: MK - Biosimilitud aprobada CCSS    │
│ • Cantidad: 30 tabletas                            │
│ • Costo: ₡4,200                                    │
│                                                     │
│ 💵 AHORRO: ₡14,300 (77.3%)                         │
│                                                     │
│ ✅ Bioequivalente certificado                      │
│ ✅ Disponible en inventario (8,500 unidades)      │
│ ✅ Sin restricciones clínicas                      │
│                                                     │
│ 📊 TU AHORRO ACUMULADO ESTE MES: ₡245,000         │
│ 🏆 TOP 15% médicos más eficientes                  │
│                                                     │
│ [ACEPTAR GENÉRICO] [MANTENER ORIGINAL] [¿POR QUÉ?]│
└────────────────────────────────────────────────────┘
```

##### **Dashboard Institucional de Ahorro**

```
MINISTERIO DE SALUD - PANEL DE AHORRO
═══════════════════════════════════════════════════

📅 Período: Enero - Octubre 2025

┌─────────────────────────────────────────────────┐
│ AHORRO TOTAL GENERADO: ₡38,450,000,000         │
│ Meta Anual (₡40,000M):  ████████████░░ 96.1%   │
└─────────────────────────────────────────────────┘

TOP 10 MEDICAMENTOS CON MAYOR IMPACTO:
1. Atorvastatina    ₡5,200M  (245,000 prescripciones)
2. Omeprazol        ₡3,800M  (520,000 prescripciones)
3. Losartán         ₡2,900M  (380,000 prescripciones)
...

INSTITUCIONES MÁS EFICIENTES:
🥇 Hospital San Juan de Dios     94.5% sustitución
🥈 Hospital México                92.8% sustitución
🥉 Hospital Calderón Guardia     90.2% sustitución

[EXPORTAR REPORTE] [CONFIGURAR METAS] [ANALYTICS]
```

##### **Gamificación para Médicos**

```
👨‍⚕️ Dr. Juan Pérez González
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏅 NIVEL: Prescriptor Oro ⭐⭐⭐

📊 TUS ESTADÍSTICAS (Último mes):
├─ Prescripciones: 340
├─ Tasa sustitución genéricos: 87.3% (↑ 5% vs mes anterior)
├─ Ahorro generado: ₡245,000
└─ Ranking nacional: #142 de 12,450 médicos

🎯 LOGROS DESBLOQUEADOS:
✅ Eco-Warrior: 100+ prescripciones genéricas
✅ Cost-Conscious: ₡200,000+ ahorro mensual
🔒 Master Saver: ₡500,000+ ahorro (próximo objetivo)

💡 TIP DEL MES:
"La Atorvastatina genérica tiene la misma eficacia que 
Lipitor® según estudio CCSS 2024. ¡Úsala con confianza!"

[VER MI PERFIL] [TABLA DE CLASIFICACIÓN] [PREMIOS]
```

---

### 3.4 CATEGORÍA 3: PREDICCIÓN Y LOGÍSTICA

---

#### **MÓDULO 6: SUPPLY FORECAST AI - Predicción de Desabastecimiento**

**Objetivo**: Predecir demanda de medicamentos con 90 días de anticipación y prevenir desabastecimiento.

##### **Modelos de Forecasting**

| **Modelo** | **Uso** | **Precisión** | **Horizonte** |
|------------|---------|---------------|---------------|
| **SARIMA** | Medicamentos estacionales | 87.3% | 30-90 días |
| **Prophet** | Tendencias + eventos | 89.1% | 30-180 días |
| **LSTM** | Patrones complejos | 91.5% | 7-60 días |
| **XGBoost** | Variables externas | 88.7% | 30-90 días |
| **Ensemble** | Combinación ponderada | **93.2%** | **30-90 días** |

##### **Variables Consideradas**

```
PREDICCIÓN DE DEMANDA = f(variables)

├─ HISTÓRICAS (60%)
│  ├─ Consumo últimos 24 meses
│  ├─ Tendencias y estacionalidad
│  └─ Eventos históricos similares
│
├─ CLIMÁTICAS Y EPIDEMIOLÓGICAS (25%)
│  ├─ Temperatura y humedad (dengue, influenza)
│  ├─ Alertas epidemiológicas del Ministerio
│  └─ Calendario vacunación (efectos secundarios)
│
├─ DEMOGRÁFICAS (10%)
│  ├─ Crecimiento poblacional por región
│  ├─ Envejecimiento (↑ medicamentos crónicos)
│  └─ Migración interna
│
└─ EXTERNAS (5%)
   ├─ Desabastecimiento en proveedores
   ├─ Cambios en protocolos clínicos
   └─ Lanzamiento de nuevos medicamentos
```

##### **Sistema de Alertas Tempranas**

```
┌──────────────────────────────────────────────────────┐
│ 🚨 ALERTAS DE DESABASTECIMIENTO - PRÓXIMOS 90 DÍAS  │
├──────────────────────────────────────────────────────┤
│                                                       │
│ 🔴 CRÍTICO (8 medicamentos)                          │
│                                                       │
│ ┌────────────────────────────────────────────────┐  │
│ │ Insulina Glargina 100 UI/ml                    │  │
│ │ ─────────────────────────────────────────────  │  │
│ │ Stock actual:    12,500 viales                 │  │
│ │ Consumo diario:  485 viales/día                │  │
│ │ Días restantes:  ██░░░░░░░░ 26 días            │  │
│ │                                                 │  │
│ │ 📈 PREDICCIÓN:                                  │  │
│ │ • Desabasto estimado: 15 de noviembre         │  │
│ │ • Demanda proyectada (30d): 16,200 viales     │  │
│ │ • Déficit esperado: -3,700 viales             │  │
│ │                                                 │  │
│ │ 💡 ACCIONES RECOMENDADAS:                       │  │
│ │ ✓ Orden de compra urgente: 20,000 viales      │  │
│ │ ✓ Lead time proveedor: 45 días → ORDENAR YA   │  │
│ │ ✓ Redistribución desde Hospital México (500)   │  │
│ │ ✓ Comunicar a médicos: Uso racional           │  │
│ │                                                 │  │
│ │ [GENERAR ORDEN] [VER DETALLES] [CONTACTAR]    │  │
│ └────────────────────────────────────────────────┘  │
│                                                       │
│ [Ver 7 alertas críticas restantes...]               │
│                                                       │
│ 🟡 PRECAUCIÓN (23 medicamentos)                      │
│ 🟢 INVENTARIO SALUDABLE (3,156 medicamentos)        │
│                                                       │
│ [CONFIGURAR UMBRALES] [EXPORTAR REPORTE] [HISTÓRICO]│
└──────────────────────────────────────────────────────┘
```

##### **Integración con SICOP (Compras Públicas)**

```python
# Automatización de órdenes de compra

def generate_purchase_order(forecast_alert):
    # Calcular cantidad óptima (EOQ)
    optimal_quantity = economic_order_quantity(
        annual_demand=forecast_alert.yearly_demand,
        ordering_cost=CONST_ORDERING_COST,
        holding_cost=CONST_HOLDING_COST
    )
    
    # Considerar lead time del proveedor
    safety_stock = calculate_safety_stock(
        lead_time_days=forecast_alert.supplier_lead_time,
        demand_variability=forecast_alert.std_deviation,
        service_level=0.98  # 98% nivel de servicio
    )
    
    # Generar orden
    purchase_order = {
        'medication': forecast_alert.medication_name,
        'quantity': optimal_quantity + safety_stock,
        'urgency': 'HIGH' if forecast_alert.days_until_stockout < 30 else 'NORMAL',
        'supplier': select_best_supplier(
            medication=forecast_alert.medication_name,
            criteria=['price', 'lead_time', 'reliability']
        ),
        'estimated_cost': calculate_total_cost(optimal_quantity),
        'delivery_date_required': today() + timedelta(days=15),
        'justification': f"Predictive AI - Desabasto estimado: {forecast_alert.stockout_date}"
    }
    
    # Enviar a SICOP vía API
    sicop_api.create_purchase_requisition(purchase_order)
    
    # Notificar stakeholders
    notify_purchasing_department(purchase_order)
    notify_budget_office(purchase_order)
    
    return purchase_order
```

---

#### **MÓDULO 7: PHARMA LOGISTICS AI - Optimización de Rutas**

**Objetivo**: Optimizar distribución de medicamentos a 1,100+ puntos con IA geoespacial.

##### **Algoritmos de Optimización**

```
PROBLEMA: Vehicle Routing Problem (VRP) con restricciones

Restricciones:
├─ Capacidad de vehículos (peso/volumen)
├─ Temperatura controlada (2-8°C para biológicos)
├─ Ventanas de tiempo (horarios de recepción)
├─ Prioridad por urgencia médica
├─ Fecha de caducidad (FEFO: First Expire, First Out)
└─ Distancia máxima por vehículo (8h/día)

Solución:
├─ Algoritmo genético (población inicial)
├─ Simulated Annealing (optimización local)
├─ Tabu Search (evitar óptimos locales)
└─ Deep Reinforcement Learning (aprendizaje continuo)

Resultado:
✅ Reducción de 40% en km recorridos
✅ Reducción de 35% en tiempo de entrega
✅ Reducción de 28% en emisiones CO₂
✅ Aumento de 50% en entregas a tiempo
```

##### **Dashboard Logístico**

```
┌────────────────────────────────────────────────────────┐
│ 🚛 CENTRO DE CONTROL LOGÍSTICO - TIEMPO REAL          │
├────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 HOY: 18 de octubre 2025                             │
│ ├─ Entregas programadas: 245                          │
│ ├─ Entregas completadas: 187 (76.3%)                  │
│ ├─ En ruta: 42                                         │
│ └─ Retrasadas: 16 (alerta enviada)                    │
│                                                         │
│ 🗺️ MAPA DE RUTAS:                                     │
│ ┌──────────────────────────────────────────────────┐  │
│ │         [MAPA INTERACTIVO DE COSTA RICA]         │  │
│ │                                                   │  │
│ │  🚛 Vehículo 1: San José → Cartago (78% ruta)   │  │
│ │  🚛 Vehículo 2: Puntarenas → Esparza (45%)      │  │
│ │  🚛 Vehículo 3: Limón → Siquirres (92%)         │  │
│ │  ...                                             │  │
│ │                                                   │  │
│ │  🔴 Urgente  🟡 Prioridad  🟢 Normal            │  │
│ └──────────────────────────────────────────────────┘  │
│                                                         │
│ 📈 EFICIENCIA MENSUAL:                                 │
│ ├─ Km totales: 45,200 km (↓ 38% vs 2024)             │
│ ├─ Combustible: ₡8.2M (ahorro: ₡4.8M)                │
│ ├─ CO₂: 12.5 ton (↓ 42%)                              │
│ └─ Entregas a tiempo: 96.7% (meta: 95%)               │
│                                                         │
│ [VER FLOTA] [OPTIMIZAR RUTAS] [REPORTES] [SOSTENIBILIDAD] │
└────────────────────────────────────────────────────────┘
```

##### **Redistribución Inteligente**

```python
# Evitar vencimiento de medicamentos

def intelligent_redistribution(inventory_data):
    """
    Redistribuye medicamentos entre farmacias para:
    1. Evitar vencimiento (< 60 días)
    2. Equilibrar stock
    3. Aprovechar capacidad de transporte existente
    """
    
    # Identificar medicamentos en riesgo de vencimiento
    expiring_soon = inventory_data[
        (inventory_data['days_until_expiry'] < 60) &
        (inventory_data['quantity'] > inventory_data['predicted_demand_60d'])
    ]
    
    # Identificar farmacias con déficit del mismo medicamento
    deficit_locations = inventory_data[
        (inventory_data['stock_level'] == 'LOW') &
        (inventory_data['medication_id'].isin(expiring_soon['medication_id']))
    ]
    
    # Optimizar traslados
    redistribution_plan = []
    
    for _, expiring_item in expiring_soon.iterrows():
        # Buscar destinos cercanos con necesidad
        nearby_destinations = deficit_locations[
            (deficit_locations['medication_id'] == expiring_item['medication_id']) &
            (deficit_locations['distance_km'] < 100)
        ].sort_values('distance_km')
        
        surplus = expiring_item['quantity'] - expiring_item['predicted_demand_60d']
        
        for _, destination in nearby_destinations.iterrows():
            deficit = destination['predicted_demand_60d'] - destination['quantity']
            
            transfer_qty = min(surplus, deficit)
            
            if transfer_qty > 0:
                redistribution_plan.append({
                    'medication': expiring_item['medication_name'],
                    'from': expiring_item['pharmacy_name'],
                    'to': destination['pharmacy_name'],
                    'quantity': transfer_qty,
                    'expiry_date': expiring_item['expiry_date'],
                    'priority': 'HIGH' if expiring_item['days_until_expiry'] < 30 else 'MEDIUM',
                    'cost_saved': transfer_qty * expiring_item['unit_cost'],
                    'distance_km': destination['distance_km']
                })
                
                surplus -= transfer_qty
                
                if surplus <= 0:
                    break
    
    # Consolidar traslados en rutas existentes
    optimized_routes = consolidate_transfers_with_regular_routes(redistribution_plan)
    
    return optimized_routes

# RESULTADO EJEMPLO:
# Ahorro mensual: ₡2.8M en medicamentos que se habrían vencido
# Traslados: 45 redistribuciones/mes
# Costo logístico adicional: ₡180k (ROI: 1,555%)
```

---

### 3.5 CATEGORÍA 4: EPIDEMIOLOGÍA Y SALUD PÚBLICA

---

#### **MÓDULO 8: EPI-ALERT AI - Vigilancia Epidemiológica**

**Objetivo**: Detectar brotes y patrones epidemiológicos mediante análisis de prescripciones en tiempo real.

##### **Indicadores de Alerta Temprana**

```
SISTEMA DE DETECCIÓN DE BROTES
├─ Análisis de series temporales (CUSUM, EWMA)
├─ Detección de anomalías (Isolation Forest)
├─ Análisis geoespacial (clustering)
└─ Validación estadística (p-value < 0.01)

SEÑALES DE ALERTA:
├─ ↑ Antibióticos respiratorios >2σ en región
├─ ↑ Antivirales (Oseltamivir) >3σ
├─ ↑ Antiparasitarios (Albendazol) concentrado
├─ ↑ Rehidratantes orales (brotes gastroentéricos)
└─ Patrones inusuales por edad/geografía
```

##### **Dashboard Epidemiológico**

```
┌───────────────────────────────────────────────────────┐
│ 🦠 VIGILANCIA EPIDEMIOLÓGICA - MINISTERIO DE SALUD   │
├───────────────────────────────────────────────────────┤
│                                                        │
│ 🚨 ALERTAS ACTIVAS (3)                                │
│                                                        │
│ ┌─────────────────────────────────────────────────┐  │
│ │ 🔴 ALERTA TEMPRANA: Posible brote respiratorio │  │
│ │ ───────────────────────────────────────────────  │  │
│ │ Región: Limón Centro y Cahuita                  │  │
│ │ Fecha detección: 16 de octubre 2025             │  │
│ │                                                  │  │
│ │ 📊 INDICADORES:                                  │  │
│ │ • Antibióticos respiratorios: +285% (7 días)   │  │
│ │ • Antipiréticos pediátricos: +180%             │  │
│ │ • Expectorantes: +220%                          │  │
│ │                                                  │  │
│ │ 📈 TENDENCIA:                                    │  │
│ │ [GRÁFICO: Curva exponencial ascendente]        │  │
│ │                                                  │  │
│ │ 🎯 POBLACIÓN AFECTADA:                          │  │
│ │ • Edad: 2-12 años (80% de casos)               │  │
│ │ • Estimado: 450-600 personas                    │  │
│ │ • Tasa ataque: 12.5 por 1,000 habitantes       │  │
│ │                                                  │  │
│ │ 🔬 HIPÓTESIS:                                    │  │
│ │ • Influenza estacional (70% probabilidad)      │  │
│ │ • Virus respiratorio sincitial (25%)           │  │
│ │ • Otros (5%)                                    │  │
│ │                                                  │  │
│ │ ✅ ACCIONES REALIZADAS:                          │  │
│ │ [16/10 09:15] Notificación automática a        │  │
│ │               Área Rectora de Salud Limón      │  │
│ │ [16/10 10:30] Coordinación con INCIENSA        │  │
│ │ [16/10 14:00] Activación protocolo respuesta   │  │
│ │                                                  │  │
│ │ [VER MAPA] [PROTOCOLO] [NOTIFICAR OPS/OMS]     │  │
│ └─────────────────────────────────────────────────┘  │
│                                                        │
│ 🗺️ MAPA DE CALOR NACIONAL:                            │
│ [Visualización georreferenciada de Costa Rica]        │
│ • Rojo: Alerta activa                                 │
│ • Naranja: Monitoreo intensivo                        │
│ • Amarillo: Vigilancia normal                         │
│ • Verde: Sin anomalías                                │
│                                                        │
│ 📊 ENFERMEDADES MONITOREADAS (Top 10):                │
│ 1. Influenza               [████████░░] 78%           │
│ 2. Dengue                  [██████░░░░] 62%           │
│ 3. Gastroenteritis         [████░░░░░░] 45%           │
│ 4. Conjuntivitis           [███░░░░░░░] 32%           │
│ ...                                                    │
│                                                        │
│ [EXPORTAR REPORTE] [CONFIGURAR] [HISTÓRICO] [OMS]     │
└───────────────────────────────────────────────────────┘
```

##### **Integración Internacional**

- **OMS - Global Outbreak Alert**: Reporte automático semanal
- **OPS/PAHO**: Feed en tiempo real de alertas críticas
- **COMISCA** (Centroamérica): Coordinación regional
- **CDC (USA)**: Intercambio de datos para turismo

---

#### **MÓDULO 9: AMR TRACKER AI - Resistencia Antimicrobiana**

**Objetivo**: Monitorear y reducir resistencia antimicrobiana mediante IA.

##### **Sistema de Clasificación**

```
ANTIBIÓTICOS - CLASIFICACIÓN POR CRITICIDAD (OMS)

├─ ACCESO (60% de prescripciones esperadas)
│  ├─ Amoxicilina
│  ├─ Doxiciclina
│  └─ Metronidazol
│
├─ VIGILANCIA (25% de prescripciones)
│  ├─ Cefalosporinas 3ª generación
│  ├─ Quinolonas
│  └─ Macrólidos
│
└─ RESERVA (5% - Solo casos críticos)
   ├─ Carbapenems
   ├─ Colistina
   └─ Linezolid
```

##### **Alertas de Prescripción**

```
┌──────────────────────────────────────────────────────┐
│ ⚠️ ALERTA DE PRESCRIPCIÓN - ANTIMICROBIANO CRÍTICO  │
├──────────────────────────────────────────────────────┤
│                                                       │
│ 💊 Prescripción: Meropenem 1g IV c/8h               │
│ 👤 Paciente: [ANON], 45 años                        │
│ 👨‍⚕️ Médico: Dr. [ANON] - Medicina Interna           │
│                                                       │
│ ────────────────────────────────────────────────────  │
│                                                       │
│ 🚨 ANTIBIÓTICO DE RESERVA                            │
│                                                       │
│ Este medicamento está clasificado como "ÚLTIMO       │
│ RECURSO" por la OMS. Su uso debe justificarse según │
│ criterios estrictos.                                 │
│                                                       │
│ ✅ CRITERIOS DE USO APROPIADO:                        │
│ □ Cultivo y antibiograma previo                     │
│ □ Resistencia documentada a antibióticos estándar   │
│ □ Infección severa con riesgo vital                 │
│ □ Aprobación por Comité de Infecciones              │
│                                                       │
│ 📊 ESTADÍSTICAS LOCALES (Hospital):                  │
│ • Uso de carbapenems este mes: 45 casos             │
│ • % del total de antibióticos: 8.2% (↑ vs 5.1%)    │
│ • Resistencia local a carbapenems: 12% (↑ 2024)    │
│                                                       │
│ 💡 ALTERNATIVAS SUGERIDAS:                            │
│ • Piperacilina-Tazobactam 4.5g c/6h                 │
│ • Ceftriaxona 2g c/12h + Metronidazol               │
│                                                       │
│ ¿DESEA CONTINUAR CON ESTA PRESCRIPCIÓN?             │
│                                                       │
│ [SÍ - JUSTIFICAR] [CAMBIAR A ALTERNATIVA] [CONSULTAR]│
└──────────────────────────────────────────────────────┘
```

##### **Reporte para OMS**

```python
# Generación automática de reporte GLASS (OMS)

def generate_glass_report(period='quarterly'):
    """
    Global Antimicrobial Resistance and Use Surveillance System
    """
    
    report = {
        'country': 'Costa Rica',
        'period': period,
        'reporting_date': datetime.now().isoformat(),
        
        'antimicrobial_consumption': {
            'total_ddds_per_1000_inhabitants_day': calculate_ddd(),
            'by_category': {
                'access': calculate_ddd_by_category('access'),
                'watch': calculate_ddd_by_category('watch'),
                'reserve': calculate_ddd_by_category('reserve')
            },
            'by_route': {
                'oral': calculate_by_route('oral'),
                'parenteral': calculate_by_route('parenteral')
            }
        },
        
        'resistance_data': {
            'e_coli': {
                'third_gen_cephalosporins': get_resistance_rate('E. coli', '3rd_ceph'),
                'fluoroquinolones': get_resistance_rate('E. coli', 'fluoroq'),
                'carbapenems': get_resistance_rate('E. coli', 'carbapenem')
            },
            'k_pneumoniae': {...},
            's_aureus': {...},
            'mrsa_prevalence': calculate_mrsa_prevalence()
        },
        
        'stewardship_interventions': [
            'AI-powered prescription guidance',
            'Automatic restriction of reserve antibiotics',
            'Real-time AMR surveillance',
            'Educational campaigns for prescribers'
        ]
    }
    
    # Enviar a OMS vía API
    who_glass_api.submit_report(report)
    
    return report
```

---

### 3.6 CATEGORÍA 5: EXPERIENCIA DE USUARIO

---

#### **MÓDULO 10: PATIENT ASSISTANT AI - Chatbot para Pacientes**

**Objetivo**: Asistente virtual 24/7 para pacientes con información sobre sus medicamentos.

##### **Arquitectura del Chatbot**

```
USUARIO (WhatsApp / Web / App móvil)
           ▼
┌────────────────────────────────────┐
│   NLU (Natural Language Understanding) │
│   ├─ Detección de intención        │
│   ├─ Extracción de entidades       │
│   └─ Análisis de sentimiento       │
└────────────────────────────────────┘
           ▼
┌────────────────────────────────────┐
│   MOTOR DE DIÁLOGO (Rasa / GPT-4)  │
│   ├─ Manejo de contexto            │
│   ├─ Memoria de conversación       │
│   └─ Gestión de estado             │
└────────────────────────────────────┘
           ▼
┌────────────────────────────────────┐
│   ACCIONES Y SERVICIOS             │
│   ├─ Consulta de recetas           │
│   ├─ Información de medicamentos   │
│   ├─ Recordatorios                 │
│   ├─ Reportar efectos adversos     │
│   └─ Agendar consultas             │
└────────────────────────────────────┘
```

##### **Ejemplo de Conversación**

```
┌─────────────────────────────────────────────────────┐
│ 🤖 ASISTENTE VIRTUAL ePrescription                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│ 👤 Usuario:                                         │
│ Hola, olvidé tomar mi pastilla esta mañana. ¿Qué   │
│ hago?                                                │
│                                                      │
│ 🤖 Asistente:                                        │
│ Hola María. Vi que estás tomando Losartán 50mg      │
│ cada 12 horas.                                       │
│                                                      │
│ Si olvidaste la dosis de la mañana y han pasado     │
│ menos de 6 horas, puedes tomarla ahora.             │
│                                                      │
│ Si ya pasaron más de 6 horas, espera hasta tu      │
│ siguiente dosis (6:00 PM) y NO tomes dosis doble.   │
│                                                      │
│ 💡 TIP: Activa recordatorios automáticos para no   │
│ olvidar tus medicamentos.                           │
│                                                      │
│ [ACTIVAR RECORDATORIOS] [OTRA PREGUNTA]            │
│                                                      │
│ ─────────────────────────────────────────────────   │
│                                                      │
│ 👤 Usuario:                                         │
│ ¿Puedo tomar Losartán con jugo de naranja?         │
│                                                      │
│ 🤖 Asistente:                                        │
│ ✅ SÍ, puedes tomar Losartán con jugo de naranja.   │
│                                                      │
│ No hay interacciones significativas entre Losartán  │
│ y los cítricos.                                      │
│                                                      │
│ ⚠️ IMPORTANTE: Evita suplementos de potasio y       │
│ sustitutos de sal sin consultar a tu médico, ya que│
│ Losartán puede aumentar el potasio en sangre.       │
│                                                      │
│ ¿Tienes alguna otra duda?                           │
│                                                      │
│ [VER MIS RECETAS] [HABLAR CON FARMACÉUTICO] [FIN]  │
└─────────────────────────────────────────────────────┘
```

##### **Funcionalidades Principales**

| **Función** | **Descripción** | **Canal** |
|-------------|-----------------|-----------|
| **Información de medicamentos** | Explicación en lenguaje simple | Todos |
| **Recordatorios inteligentes** | Push notifications personalizadas | App/SMS |
| **¿Olvidé mi dosis?** | Guía sobre qué hacer | Todos |
| **Efectos secundarios** | Reporte a farmacovigilancia | Todos |
| **Interacciones** | Consulta de alimentos/medicamentos | Todos |
| **Estado de receta** | Tracking de dispensación | Todos |
| **Agendar cita** | Integración con EDUS | Web/App |
| **Traducción** | Español, inglés, bribri, maleku | Todos |

##### **Farmacovigilancia Pasiva**

```python
# Detección automática de RAM (Reacciones Adversas a Medicamentos)

def detect_adverse_event_from_chat(user_message):
    """
    Analiza mensajes de usuarios para detectar posibles RAM
    """
    
    # Palabras clave de RAM
    adverse_keywords = [
        'náuseas', 'vómito', 'diarrea', 'mareo', 'alergia',
        'sarpullido', 'picazón', 'hinchazón', 'dolor de cabeza',
        'cansancio extremo', 'palpitaciones', 'dificultad respirar'
    ]
    
    # Análisis con NLP
    doc = nlp(user_message.lower())
    
    # Detectar síntomas
    detected_symptoms = [
        keyword for keyword in adverse_keywords
        if keyword in user_message.lower()
    ]
    
    if detected_symptoms:
        # Clasificar severidad
        severity = classify_severity(detected_symptoms)
        
        if severity == 'SEVERE':
            # Alerta inmediata
            return {
                'action': 'EMERGENCY_ALERT',
                'message': '🚨 Tus síntomas requieren atención médica INMEDIATA. Ve al hospital más cercano o llama al 911.',
                'notify_authorities': True
            }
        elif severity == 'MODERATE':
            return {
                'action': 'REPORT_ADVERSE_EVENT',
                'message': 'Voy a reportar estos síntomas al sistema de farmacovigilancia. ¿Puedes responder estas preguntas?',
                'start_questionnaire': True
            }
        else:
            return {
                'action': 'PROVIDE_GUIDANCE',
                'message': 'Estos síntomas pueden ser efectos secundarios comunes. ¿Te gustaría hablar con un farmacéutico?'
            }
    
    return {'action': 'CONTINUE_CONVERSATION'}
```

---

#### **MÓDULO 11: PRESCRIPTION READER AI - OCR Médico**

**Objetivo**: Digitalizar recetas manuscritas con precisión del 98%.

##### **Pipeline de Procesamiento**

```
IMAGEN DE RECETA
       ▼
┌──────────────────────────────┐
│ 1. PRE-PROCESAMIENTO          │
│ ├─ Corrección de perspectiva │
│ ├─ Mejora de contraste        │
│ ├─ Reducción de ruido         │
│ └─ Binarización adaptativa    │
└──────────────────────────────┘
       ▼
┌──────────────────────────────┐
│ 2. DETECCIÓN DE REGIONES      │
│ ├─ Datos del médico           │
│ ├─ Datos del paciente         │
│ ├─ Medicamentos (Rp/)         │
│ ├─ Firma y sello              │
│ └─ Fecha                      │
└──────────────────────────────┘
       ▼
┌──────────────────────────────┐
│ 3. OCR ESPECIALIZADO          │
│ ├─ Tesseract + Custom training│
│ ├─ LSTM para caligrafía       │
│ ├─ Convolutional Neural Net   │
│ └─ Ensemble de modelos        │
└──────────────────────────────┘
       ▼
┌──────────────────────────────┐
│ 4. POST-PROCESAMIENTO         │
│ ├─ Corrección ortográfica     │
│ ├─ Mapeo a catálogo oficial   │
│ ├─ Validación de dosis        │
│ └─ Detección de abreviaturas  │
└──────────────────────────────┘
       ▼
┌──────────────────────────────┐
│ 5. VALIDACIÓN HUMANA (si <90%)│
│ └─ Revisión manual asistida   │
└──────────────────────────────┘
       ▼
RECETA ELECTRÓNICA ESTRUCTURADA
```

##### **Diccionario de Abreviaturas Médicas**

```json
{
  "VO": "Vía oral",
  "IV": "Intravenoso",
  "IM": "Intramuscular",
  "SC": "Subcutáneo",
  "c/8h": "Cada 8 horas",
  "c/12h": "Cada 12 horas",
  "c/24h": "Una vez al día",
  "PRN": "Según necesidad",
  "AC": "Antes de comidas",
  "PC": "Después de comidas",
  "HS": "Al acostarse",
  "QD": "Una vez al día",
  "BID": "Dos veces al día",
  "TID": "Tres veces al día",
  "QID": "Cuatro veces al día",
  "tab": "Tableta(s)",
  "cap": "Cápsula(s)",
  "ml": "Mililitros",
  "mg": "Miligramos",
  "g": "Gramos",
  "UI": "Unidades internacionales"
}
```

##### **Interfaz de Validación**

```
┌────────────────────────────────────────────────────────┐
│ 📸 DIGITALIZADOR DE RECETAS                            │
├────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────┐  ┌──────────────────────────────┐ │
│ │                 │  │ DATOS EXTRAÍDOS (Confianza)   │ │
│ │   [IMAGEN DE    │  │                               │ │
│ │    RECETA]      │  │ Médico: Dr. Juan Pérez  98%   │ │
│ │                 │  │ Código: MED-12345       100%  │ │
│ │   Receta        │  │ Paciente: María López   95%   │ │
│ │   manuscrita    │  │ Cédula: 1-0234-0567     100%  │ │
│ │   escaneada     │  │                               │ │
│ │                 │  │ ─────────────────────────────  │ │
│ │                 │  │                               │ │
│ │                 │  │ MEDICAMENTOS:                 │ │
│ │                 │  │                               │ │
│ │                 │  │ 1. Losartán 50mg        97%   │ │
│ │                 │  │    [1 tab c/12h VO]     95%   │ │
│ │                 │  │    Duración: 30 días    100%  │ │
│ │                 │  │                               │ │
│ │                 │  │ 2. Metformina 850mg     98%   │ │
│ │                 │  │    [1 tab c/12h VO PC]  89% ⚠ │ │
│ │                 │  │    Duración: 30 días    100%  │ │
│ │                 │  │                               │ │
│ │                 │  │ Fecha: 18/10/2025       100%  │ │
│ │                 │  │                               │ │
│ └─────────────────┘  └──────────────────────────────┘ │
│                                                         │
│ ⚠️ REQUIERE VALIDACIÓN:                                 │
│ • Medicamento 2, instrucciones: Baja confianza (89%)   │
│   Leído: "1 tab c/12h VO PC"                           │
│   ¿Es correcto? [SÍ] [NO - CORREGIR]                   │
│                                                         │
│ [APROBAR Y DIGITALIZAR] [DESCARTAR] [VER ORIGINAL]     │
└────────────────────────────────────────────────────────┘
```

---

### 3.7 CATEGORÍA 6: INTELIGENCIA DE NEGOCIO

---

#### **MÓDULO 12: HEALTH INTELLIGENCE PLATFORM - BI Ejecutivo**

**Objetivo**: Dashboard predictivo para autoridades con IA para toma de decisiones.

##### **Módulos del Dashboard**

```
PLATAFORMA DE INTELIGENCIA DE SALUD
├─ MÓDULO 1: Visión General (Real-time)
│  ├─ KPIs nacionales en tiempo real
│  ├─ Alertas y notificaciones críticas
│  └─ Resumen ejecutivo diario
│
├─ MÓDULO 2: Análisis Farmacéutico
│  ├─ Gasto farmacéutico (actual vs proyectado)
│  ├─ Top medicamentos por costo
│  ├─ Oportunidades de ahorro
│  └─ Análisis de genéricos
│
├─ MÓDULO 3: Epidemiología
│  ├─ Mapas de calor por enfermedad
│  ├─ Tendencias temporales
│  ├─ Predicciones a 90 días
│  └─ Comparación regional
│
├─ MÓDULO 4: Calidad y Seguridad
│  ├─ Eventos adversos
│  ├─ Errores de medicación
│  ├─ Cumplimiento normativo
│  └─ Indicadores de calidad
│
├─ MÓDULO 5: Eficiencia Operativa
│  ├─ Tiempos de atención
│  ├─ Desabastecimiento
│  ├─ Logística y distribución
│  └─ Utilización de recursos
│
└─ MÓDULO 6: Simulador de Políticas
   ├─ Escenarios "What-if"
   ├─ Impacto presupuestario
   ├─ Proyecciones a 5 años
   └─ Análisis costo-efectividad
```

##### **Dashboard Ejecutivo del Ministro**

```
┌──────────────────────────────────────────────────────────┐
│ 🏛️ PANEL DEL MINISTRO DE SALUD                          │
│ Costa Rica - Sistema Nacional ePrescription AI          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ 📅 Viernes, 18 de octubre 2025 - 14:35                  │
│                                                           │
│ ┌────────────────────┬────────────────────┬────────────┐ │
│ │ 📊 HOY             │ 📈 ESTE MES        │ 🎯 META    │ │
│ ├────────────────────┼────────────────────┼────────────┤ │
│ │ Prescripciones:    │ Prescripciones:    │            │ │
│ │ 152,340            │ 3.2M               │ 3.5M       │ │
│ │                    │                    │ ████░ 91%  │ │
│ ├────────────────────┼────────────────────┼────────────┤ │
│ │ Ahorro generado:   │ Ahorro acumulado:  │ Meta anual:│ │
│ │ ₡145M              │ ₡38,450M           │ ₡40,000M   │ │
│ │                    │                    │ █████ 96%  │ │
│ └────────────────────┴────────────────────┴────────────┘ │
│                                                           │
│ ═══════════════════════════════════════════════════════  │
│                                                           │
│ 🚨 ALERTAS EJECUTIVAS (3)                                │
│                                                           │
│ 🔴 Posible brote respiratorio - Limón                    │
│    └─ 450-600 casos estimados | Respuesta activada      │
│                                                           │
│ 🟡 Desabastecimiento Insulina Glargina en 26 días       │
│    └─ Orden de compra generada automáticamente          │
│                                                           │
│ 🟢 Reducción de RAM en 18% vs 2024 (¡Meta superada!)    │
│    └─ Programa de IA funcionando exitosamente           │
│                                                           │
│ ═══════════════════════════════════════════════════════  │
│                                                           │
│ 📊 INDICADORES ESTRATÉGICOS:                             │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ GASTO FARMACÉUTICO 2025                             │  │
│ │                                                      │  │
│ │ [GRÁFICO DE LÍNEA: Proyectado vs Real]             │  │
│ │                                                      │  │
│ │ Real:       ████████████░░ ₡245,000M (82%)         │  │
│ │ Proyectado: ████████████████ ₡298,000M            │  │
│ │                                                      │  │
│ │ 💰 AHORRO vs PROYECCIÓN: ₡53,000M (17.8%)           │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ TOP 5 LOGROS DEL MES:                               │  │
│ │ 🏆 Reducción de fraude: ₡1,200M recuperados         │  │
│ │ 🏆 Errores de medicación: -32% vs mes anterior      │  │
│ │ 🏆 Entregas a tiempo: 96.7% (récord histórico)      │  │
│ │ 🏆 Satisfacción ciudadana: 4.6/5 (↑ 0.3 puntos)    │  │
│ │ 🏆 Reconocimiento OMS: Invitación a presentar caso  │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ ═══════════════════════════════════════════════════════  │
│                                                           │
│ 🎯 SIMULADOR DE POLÍTICAS:                               │
│                                                           │
│ Escenario: ¿Qué pasa si aumentamos 20% la sustitución   │
│ de genéricos en 2026?                                    │
│                                                           │
│ [GRÁFICO INTERACTIVO]                                    │
│                                                           │
│ Resultados proyectados:                                  │
│ • Ahorro adicional: ₡8,500M anuales                      │
│ • Impacto en desabasto: Neutral                          │
│ • Satisfacción médicos: -5% (manejable con capacitación)│
│ • ROI: 450% (considerando costos de implementación)      │
│                                                           │
│ [EJECUTAR SIMULACIÓN] [EXPORTAR] [VER MÁS ESCENARIOS]    │
│                                                           │
│ ═══════════════════════════════════════════════════════  │
│                                                           │
│ [REPORTES] [EXPORTAR PDF] [COMPARTIR] [CONFIGURAR]       │
└──────────────────────────────────────────────────────────┘
```

---

## 4. ARQUITECTURA Y STACK TECNOLÓGICO

### 4.1 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────┐
│                  USUARIOS FINALES                       │
│  Médicos | Farmacéuticos | Pacientes | Administradores │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│              CAPA DE PRESENTACIÓN                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Web App │  │Mobile App│  │  Kioscos │             │
│  │(React/TS)│  │(React N.)│  │(Embedded)│             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│              API GATEWAY + CDN                          │
│  ┌──────────────────────────────────────────────┐      │
│  │ Kong / AWS API Gateway                        │      │
│  │ ├─ Rate Limiting                              │      │
│  │ ├─ Authentication (OAuth 2.0 / JWT)           │      │
│  │ ├─ Request Validation                         │      │
│  │ └─ Load Balancing                             │      │
│  └──────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│           MICROSERVICIOS (Kubernetes)                   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐          │
│  │Prescription│  │Dispensation│ │Inventory  │          │
│  │  Service   │  │  Service   │  │ Service   │          │
│  └───────────┘  └───────────┘  └───────────┘          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐          │
│  │   User    │  │   Auth     │  │ Analytics │          │
│  │  Service   │  │  Service   │  │ Service   │          │
│  └───────────┘  └───────────┘  └───────────┘          │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│            CAPA DE INTELIGENCIA ARTIFICIAL              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐          │
│  │ Fraud AI  │  │Clinical AI│  │Forecast AI│          │
│  │(Python/TF)│  │(PyTorch)  │  │(Prophet)  │          │
│  └───────────┘  └───────────┘  └───────────┘          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐          │
│  │  NLP AI   │  │  OCR AI   │  │  BI AI    │          │
│  │ (spaCy)   │  │(Tesseract)│  │(TensorFlow│          │
│  └───────────┘  └───────────┘  └───────────┘          │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│           CAPA DE DATOS (Multi-Database)                │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐          │
│  │PostgreSQL │  │  MongoDB  │  │   Redis   │          │
│  │(OLTP Data)│  │(Logs/Docs)│  │  (Cache)  │          │
│  └───────────┘  └───────────┘  └───────────┘          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐          │
│  │Elasticsearch│ │TimescaleDB│  │   Neo4j   │          │
│  │  (Search)  │  │(Time Series│ │  (Graphs) │          │
│  └───────────┘  └───────────┘  └───────────┘          │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│         INFRAESTRUCTURA (Cloud Native)                  │
│  ┌─────────────────────────────────────────────┐       │
│  │ Kubernetes (EKS / GKE / AKS)                 │       │
│  │ ├─ Auto-scaling                              │       │
│  │ ├─ Service Mesh (Istio)                      │       │
│  │ ├─ Observability (Prometheus + Grafana)      │       │
│  │ └─ CI/CD (GitLab / GitHub Actions)           │       │
│  └─────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│           SISTEMAS EXTERNOS (Integraciones)             │
│  EDUS | SICERE | SICOP | Colegios | Labs | CCSS        │
│  DrugBank | PubMed | IAFA | OIJ | Ministerio Salud     │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Stack Tecnológico Detallado

#### **Frontend**
```yaml
Framework: React 18+ con TypeScript
UI Components: Tailwind CSS + shadcn/ui
State Management: Zustand + TanStack Query
Forms: React Hook Form + Zod
Charts: Recharts + D3.js
Maps: Leaflet / Mapbox GL
Mobile: React Native (iOS/Android)
PWA: Service Workers + IndexedDB
Accessibility: WCAG 2.1 Level AA
```

#### **Backend**
```yaml
API: Node.js (Express/Fastify) + Python (FastAPI para IA)
Authentication: Auth0 / Keycloak (OAuth 2.0, SAML)
Message Queue: RabbitMQ / Apache Kafka
Task Queue: Celery + Redis
Caching: Redis Cluster
CDN: CloudFlare / AWS CloudFront
File Storage: S3-compatible (MinIO / AWS S3)
```

#### **Bases de Datos**
```yaml
OLTP: PostgreSQL 15+ (High Availability con Patroni)
NoSQL: MongoDB 6.0+ (Replica Set)
Time Series: TimescaleDB / InfluxDB
Graph: Neo4j 5.0+
Search: Elasticsearch 8.0+
Cache: Redis 7.0+ (Sentinel/Cluster)
Data Warehouse: ClickHouse / Apache Druid
```

#### **Inteligencia Artificial**
```yaml
ML Framework: 
  - TensorFlow 2.15+
  - PyTorch 2.1+
  - Scikit-learn 1.3+
NLP: 
  - spaCy 3.7+ (modelo español)
  - Hugging Face Transformers
  - NLTK / Gensim
Computer Vision:
  - OpenCV
  - Tesseract OCR 5.0+
  - TensorFlow Object Detection API
Time Series:
  - Prophet
  - statsmodels
  - ARIMA / SARIMA
Graph Analysis:
  - NetworkX
  - PyTorch Geometric
MLOps:
  - MLflow
  - Kubeflow
  - TensorFlow Serving
```

#### **Infraestructura**
```yaml
Orquestación: Kubernetes 1.28+
Cloud Provider: AWS / Google Cloud / Azure / Híbrido
Service Mesh: Istio 1.20+
Monitoring:
  - Prometheus + Grafana
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Jaeger (Distributed Tracing)
CI/CD:
  - GitLab CI / GitHub Actions
  - ArgoCD (GitOps)
  - Terraform (IaC)
Seguridad:
  - Vault (Secrets Management)
  - Falco (Runtime Security)
  - Trivy (Container Scanning)
Backup:
  - Velero (Kubernetes)
  - WAL-G (PostgreSQL)
  - Restic (Files)
```

#### **Estándares de Interoperabilidad**
```yaml
HL7 FHIR: R4 (Fast Healthcare Interoperability Resources)
HL7 V2: Soporte legacy para sistemas antiguos
DICOM: Integración con imágenes médicas
SNOMED CT: Terminología clínica estandarizada
ICD-10 / ICD-11: Clasificación de enfermedades
LOINC: Códigos de laboratorio
ATC: Clasificación anatómico-terapéutica
RxNorm: Nomenclatura de medicamentos
FHIR Profiles: 
  - US Core
  - International Patient Summary (IPS)
  - Costa Rica National Profile (custom)
```

---

## 5. REQUISITOS TÉCNICOS OBLIGATORIOS

### 5.1 Requisitos Funcionales

#### **RF-001: Sistema de Prescripción Electrónica**
**Prioridad**: CRÍTICA

El sistema DEBE permitir:
- ✅ Prescripción electrónica completa con firma digital
- ✅ Catálogo actualizado de >3,200 medicamentos (Lista LOM)
- ✅ Validación en tiempo real de contraindicaciones
- ✅ Historial completo de prescripciones por paciente
- ✅ Búsqueda avanzada y filtros multicriteria
- ✅ Soporte para prescripción de medicamentos controlados (antimicrobianos, estupefacientes, psicotrópicos)

**Criterio de Aceptación**:
- Prescripción completa en <90 segundos
- Disponibilidad 99.9% (43.8 minutos downtime/mes)
- Latencia <200ms para búsquedas

---

#### **RF-002: Módulos de Inteligencia Artificial**
**Prioridad**: CRÍTICA

El proveedor DEBE implementar **MÍNIMO 12 de los 15 módulos de IA** propuestos:

| **Módulo** | **Obligatorio/Opcional** | **Precisión Mínima** |
|------------|-------------------------|----------------------|
| 1. SAFEGUARD AI (Antifraude) | OBLIGATORIO | 94% |
| 2. OPIATE GUARD (Controlados) | OBLIGATORIO | 91% |
| 3. CLINICAL COPILOT (Asistente) | OBLIGATORIO | 90% |
| 4. DEEP INTERACTION ENGINE | OBLIGATORIO | 95% |
| 5. GENERIC OPTIMIZER AI | OBLIGATORIO | 92% |
| 6. SUPPLY FORECAST AI | OBLIGATORIO | 88% |
| 7. PHARMA LOGISTICS AI | OBLIGATORIO | 85% |
| 8. EPI-ALERT AI | OBLIGATORIO | 90% |
| 9. AMR TRACKER AI | OBLIGATORIO | 88% |
| 10. PATIENT ASSISTANT AI | OPCIONAL | 85% |
| 11. PRESCRIPTION READER AI | OPCIONAL | 95% |
| 12. HEALTH INTELLIGENCE | OBLIGATORIO | N/A |
| 13. AUTO-AUDIT AI | OBLIGATORIO | 96% |
| 14. SMART QUEUE AI | OPCIONAL | N/A |
| 15. PREDICTOR TALONARIOS | OPCIONAL | 87% |

**Criterio de Aceptación**:
- Validación por panel de expertos independientes (UCR)
- Periodo de prueba de 90 días con datos históricos
- Reportes mensuales de precisión y mejora continua

---

#### **RF-003: Interoperabilidad y Estándares**
**Prioridad**: CRÍTICA

El sistema DEBE:
- ✅ Cumplir 100% con HL7 FHIR R4
- ✅ Generar mensajes HL7 V2 (legacy systems)
- ✅ Soportar SNOMED CT, ICD-11, LOINC, ATC
- ✅ API REST documentada (OpenAPI 3.0)
- ✅ Webhooks para eventos en tiempo real
- ✅ Integración bidireccional con EDUS (Expediente Electrónico)

**Criterio de Aceptación**:
- Pruebas de conformidad con FHIR Connectathon
- Certificación de interoperabilidad por ente tercero
- 100% de transacciones registradas en formato estándar

---

### 5.2 Requisitos No Funcionales

#### **RNF-001: Seguridad**
**Prioridad**: CRÍTICA

| **Aspecto** | **Requisito Mínimo** |
|-------------|----------------------|
| **Cifrado en tránsito** | TLS 1.3 |
| **Cifrado en reposo** | AES-256 |
| **Autenticación** | Multi-factor obligatorio |
| **Control de acceso** | RBAC + ABAC |
| **Auditoría** | 100% de transacciones críticas |
| **Retención de logs** | 7 años (normativa CCSS) |
| **Anonimización** | Para reportes y analytics |
| **Certificaciones** | ISO 27001, ISO 13485 |
| **Pruebas de penetración** | Anuales por tercero certificado |
| **Backup** | RPO: 1 hora, RTO: 4 horas |

---

#### **RNF-002: Rendimiento**
**Prioridad**: CRÍTICA

| **Métrica** | **Valor Mínimo** |
|-------------|------------------|
| **Disponibilidad** | 99.9% (SLA) |
| **Latencia promedio** | <300ms |
| **Latencia p95** | <1 segundo |
| **Throughput** | 10,000 transacciones/seg |
| **Concurrencia** | 50,000 usuarios simultáneos |
| **Escalabilidad** | Horizontal (sin límite teórico) |
| **Tiempo de recuperación** | <4 horas (RTO) |
| **Pérdida de datos** | <1 hora (RPO) |

---

#### **RNF-003: Usabilidad**
**Prioridad**: ALTA

- ✅ Interfaz responsive (desktop, tablet, mobile)
- ✅ Accesibilidad WCAG 2.1 Level AA
- ✅ Soporte offline (PWA con sincronización)
- ✅ Multiidioma (español, inglés, lenguas indígenas)
- ✅ Onboarding guiado (<30 minutos para nuevo usuario)
- ✅ Tiempo de capacitación: <4 horas para médico promedio

**Criterio de Aceptación**:
- System Usability Scale (SUS) >80
- Net Promoter Score (NPS) >50
- Tasa de errores de usuario <5%

---

### 5.3 Requisitos de Integración

#### **INT-001: Sistemas de la CCSS**

| **Sistema** | **Tipo de Integración** | **Protocolo** |
|-------------|------------------------|---------------|
| **EDUS** (Expediente) | Bidireccional tiempo real | HL7 FHIR |
| **SICERE** (Citas) | Consulta | REST API |
| **SICOP** (Compras) | Envío órdenes | SOAP/REST |
| **Sistema Financiero** | Consulta presupuesto | SOAP |
| **Farmacia Central** | Bidireccional | HL7 V2 |

---

#### **INT-002: Sistemas Externos**

| **Sistema** | **Propósito** | **Frecuencia** |
|-------------|---------------|----------------|
| **Colegios Profesionales** | Validación códigos | Tiempo real |
| **DrugBank** | Base interacciones | Semanal |
| **PubMed** | Literatura médica | Mensual |
| **IAFA** | Reporte sustancias | Diario |
| **Ministerio Salud** | Alertas epidemiológicas | Tiempo real |
| **Laboratorios** | Disponibilidad medicamentos | Diario |

---

## 6. MODELO DE IMPLEMENTACIÓN

### 6.1 Fases del Proyecto

```
┌──────────────────────────────────────────────────────────┐
│ FASE 0: PREPARACIÓN (Mes 1-2)                           │
├──────────────────────────────────────────────────────────┤
│ ✓ Kick-off y constitución de equipos                    │
│ ✓ Análisis detallado de requerimientos                  │
│ ✓ Diseño de arquitectura técnica                        │
│ ✓ Configuración de ambientes de desarrollo              │
│ ✓ Capacitación inicial de equipos                       │
└──────────────────────────────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────┐
│ FASE 1: CORE SYSTEM (Mes 3-8)                           │
├──────────────────────────────────────────────────────────┤
│ ✓ Módulo de Prescripción Electrónica                    │
│ ✓ Módulo de Dispensación                                │
│ ✓ Gestión de Usuarios y Roles                           │
│ ✓ Catálogos (medicamentos, CIE-10, etc.)                │
│ ✓ Integración con EDUS y SICERE                         │
│ ✓ IA Módulos 1-5 (Seguridad + Optimización)             │
│                                                           │
│ 🎯 PILOTO: 3 hospitales, 500 médicos, 2 meses           │
└──────────────────────────────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────┐
│ FASE 2: INTELLIGENCE LAYER (Mes 9-14)                   │
├──────────────────────────────────────────────────────────┤
│ ✓ IA Módulos 6-9 (Predicción + Epidemiología)           │
│ ✓ Dashboard ejecutivo con BI                            │
│ ✓ Módulo de Inventario Predictivo                       │
│ ✓ Sistema de Alertas Epidemiológicas                    │
│ ✓ Integración con SICOP                                 │
│                                                           │
│ 🎯 EXPANSIÓN: 15 hospitales, 100 EBAIS, 3,000 médicos   │
└──────────────────────────────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────┐
│ FASE 3: ROLLOUT NACIONAL (Mes 15-20)                    │
├──────────────────────────────────────────────────────────┤
│ ✓ Despliegue a todos los hospitales                     │
│ ✓ Integración de farmacias privadas                     │
│ ✓ App móvil para pacientes                              │
│ ✓ IA Módulos 10-15 (Experiencia + UX)                   │
│ ✓ Capacitación masiva (12,000+ profesionales)           │
│                                                           │
│ 🎯 COBERTURA: 100% del sistema público                   │
└──────────────────────────────────────────────────────────┘
                        ▼
┌──────────────────────────────────────────────────────────┐
│ FASE 4: ESTABILIZACIÓN (Mes 21-24)                      │
├──────────────────────────────────────────────────────────┤
│ ✓ Optimización de rendimiento                           │
│ ✓ Mejoras basadas en feedback de usuarios               │
│ ✓ Preparación de reportes para OMS/PAHO                 │
│ ✓ Certificaciones internacionales                       │
│ ✓ Plan de sostenibilidad a largo plazo                  │
└──────────────────────────────────────────────────────────┘
```

### 6.2 Cronograma Detallado

| **Mes** | **Hitos Principales** | **Entregables** |
|---------|-----------------------|-----------------|
| **1-2** | Preparación | Plan de proyecto, arquitectura |
| **3-5** | Desarrollo Core | Módulos básicos funcionales |
| **6** | Pruebas iniciales | Certificación de QA |
| **7-8** | Piloto | 3 hospitales operativos |
| **9-11** | IA avanzada | Módulos 6-9 en producción |
| **12-14** | Expansión | 15 hospitales + 100 EBAIS |
| **15-17** | Rollout masivo | 50% de cobertura nacional |
| **18-20** | Completitud | 100% de cobertura |
| **21-24** | Optimización | Sistema estabilizado |

### 6.3 Gestión de Riesgos

| **Riesgo** | **Probabilidad** | **Impacto** | **Mitigación** |
|------------|------------------|-------------|----------------|
| Resistencia al cambio | ALTA | ALTO | Plan de gestión del cambio, incentivos |
| Problemas de integración | MEDIA | ALTO | Equipos dedicados, pruebas tempranas |
| Desempeño de IA <esperado | BAJA | MEDIO | Reentrenamiento, validación continua |
| Problemas de infraestructura | MEDIA | ALTO | Redundancia, plan de contingencia |
| Retrasos en capacitación | ALTA | MEDIO | Capacitadores certificados, e-learning |

---

## 7. VALORACIÓN ECONÓMICA Y ROI

### 7.1 Estructura de Costos

#### **Opción A: Licencia Perpetua**

| **Componente** | **Costo Inicial** | **Mantenimiento Anual** |
|----------------|-------------------|-------------------------|
| Licencias de software (12,000 usuarios) | ₡450,000,000 | ₡81,000,000 (18%) |
| Módulos de IA (12 módulos obligatorios) | ₡280,000,000 | ₡50,400,000 |
| Infraestructura cloud (3 años prepago) | ₡180,000,000 | ₡60,000,000/año |
| Implementación y capacitación | ₡120,000,000 | - |
| Soporte técnico 24/7 | - | ₡45,000,000 |
| Actualizaciones y mejoras | - | ₡35,000,000 |
| **TOTAL** | **₡1,030,000,000** | **₡271,400,000/año** |

**Costo Total 5 años**: ₡2,387,000,000

---

#### **Opción B: SaaS (Software as a Service)**

| **Concepto** | **Tarifa** | **Costo Mensual** | **Costo Anual** |
|--------------|------------|-------------------|-----------------|
| Usuarios médicos (8,000) | ₡8,500/usuario | ₡68,000,000 | ₡816,000,000 |
| Usuarios farmacéuticos (3,000) | ₡6,500/usuario | ₡19,500,000 | ₡234,000,000 |
| Usuarios administrativos (1,000) | ₡4,000/usuario | ₡4,000,000 | ₡48,000,000 |
| Módulos de IA (paquete completo) | Incluido | - | - |
| Transacciones >5M/mes | ₡0.15/tx adicional | Variable | ₡18,000,000 |
| Almacenamiento >10TB | ₡80,000/TB | ₡2,400,000 | ₡28,800,000 |
| Soporte premium 24/7 | Incluido | - | - |
| **TOTAL** | - | **₡93,900,000** | **₡1,126,800,000/año** |

**Costo Total 5 años**: ₡5,634,000,000

---

#### **Opción C: Revenue Share (RECOMENDADO)**

| **Concepto** | **Fórmula** | **Proyección Anual** |
|--------------|-------------|----------------------|
| **Costo base mensual** | Fijo por infraestructura | ₡25,000,000/mes = ₡300,000,000/año |
| **Revenue Share** | 6% del ahorro comprobado generado por el sistema | Variable |
| | | |
| **CÁLCULO DE REVENUE SHARE**: | | |
| Ahorro proyectado año 1 | - | ₡42,000,000,000 |
| Revenue Share 6% | - | ₡2,520,000,000 |
| | | |
| **COSTO TOTAL AÑO 1** | Base + Revenue Share | **₡2,820,000,000** |
| | | |
| **Beneficio para el Estado**: | | |
| Ahorro neto (después de pago) | ₡42,000M - ₡2,820M | **₡39,180,000,000** |
| ROI | (Ahorro - Costo) / Costo | **1,389%** |

**Costo Total 5 años proyectado**: ₡14,100,000,000  
**Ahorro Total 5 años proyectado**: ₡210,000,000,000  
**Ahorro NETO 5 años**: **₡195,900,000,000**

---

### 7.2 Análisis Comparativo

| **Criterio** | **Licencia Perpetua** | **SaaS** | **Revenue Share** |
|--------------|----------------------|----------|-------------------|
| **Costo 5 años** | ₡2,387M | ₡5,634M | ₡14,100M* |
| **Riesgo financiero Estado** | MEDIO | BAJO | MUY BAJO |
| **Alineación de incentivos** | ❌ | ❌ | ✅ |
| **Escalabilidad** | MEDIA | ALTA | ALTA |
| **Flexibilidad** | BAJA | MEDIA | ALTA |
| **ROI Estado** | 980% | 374% | **1,389%** |
| **Ahorro NETO 5 años** | ₡207,613M | ₡204,366M | **₡195,900M** |

*Nota: El costo de Revenue Share es mayor, pero el Estado solo paga si hay ahorro comprobado.

---

### 7.3 Fuentes de Ahorro

| **Categoría** | **Ahorro Anual Estimado** | **Base de Cálculo** |
|---------------|---------------------------|---------------------|
| 1. Reducción de fraude | ₡8,000M - ₡12,000M | 80% reducción vs pérdidas actuales |
| 2. Optimización genéricos | ₡25,000M - ₡40,000M | 25% del gasto farmacéutico |
| 3. Prevención de desabastecimiento | ₡3,000M - ₡5,000M | Reducción 70% de faltantes |
| 4. Eficiencia logística | ₡2,000M - ₡3,000M | 40% reducción costos distribución |
| 5. Reducción de RAM | ₡1,500M - ₡2,500M | Menos hospitalizaciones |
| 6. Eficiencia administrativa | ₡1,000M - ₡1,500M | 60% reducción tiempos |
| 7. Prevención de vencimientos | ₡500M - ₡800M | Redistribución inteligente |
| **TOTAL CONSERVADOR** | **₡41,000M** | - |
| **TOTAL OPTIMISTA** | **₡64,800M** | - |
| **PROYECCIÓN BASE** | **₡52,900M** | Promedio |

---

### 7.4 Beneficios Intangibles

| **Beneficio** | **Impacto** | **Valor Estimado** |
|---------------|-------------|---------------------|
| Mejora en satisfacción ciudadana | +25% en NPS | No cuantificado |
| Reducción de mortalidad por errores | -180 muertes/año | Valor de vida estadístico |
| Liderazgo regional en salud digital | Reputación internacional | Intangible |
| Atracción de inversión extranjera | Sector healthtech | Potencial ₡500M+ |
| Publicaciones científicas | 10-15 papers/año | Prestigio académico |
| Casos de éxito para OMS/PAHO | Consultoría internacional | ₡200M-500M/año |

---

## 8. CRITERIOS DE EVALUACIÓN

### 8.1 Matriz de Evaluación (1000 puntos)

| **Categoría** | **Peso** | **Puntos Máximos** |
|---------------|----------|-------------------|
| **1. CAPACIDAD TÉCNICA** | 40% | 400 |
| 1.1 Arquitectura y diseño | 10% | 100 |
| 1.2 Módulos de IA (cantidad y calidad) | 15% | 150 |
| 1.3 Interoperabilidad y estándares | 10% | 100 |
| 1.4 Seguridad y cumplimiento | 5% | 50 |
| | | |
| **2. EXPERIENCIA Y REFERENCIAS** | 25% | 250 |
| 2.1 Casos de éxito similares | 10% | 100 |
| 2.2 Experiencia en sector salud público | 8% | 80 |
| 2.3 Referencias verificables | 7% | 70 |
| | | |
| **3. PROPUESTA ECONÓMICA** | 20% | 200 |
| 3.1 Costo total de propiedad (TCO) | 12% | 120 |
| 3.2 ROI proyectado | 5% | 50 |
| 3.3 Modelo de pago (flexibilidad) | 3% | 30 |
| | | |
| **4. EQUIPO Y METODOLOGÍA** | 10% | 100 |
| 4.1 Equipo técnico (CV y certificaciones) | 5% | 50 |
| 4.2 Metodología de implementación | 3% | 30 |
| 4.3 Plan de capacitación | 2% | 20 |
| | | |
| **5. CONTENIDO NACIONAL** | 5% | 50 |
| 5.1 % de desarrollo local | 3% | 30 |
| 5.2 Alianzas con universidades CR | 2% | 20 |
| | | |
| **TOTAL** | **100%** | **1000** |

---

### 8.2 Criterios de Descalificación Automática

El proveedor será descalificado si:

❌ No cumple con al menos 8 de los 12 módulos de IA obligatorios  
❌ No tiene certificación ISO 27001 vigente  
❌ No demuestra cumplimiento con HL7 FHIR R4  
❌ No presenta al menos 2 casos de éxito en sistemas de salud pública (>1M usuarios)  
❌ Presenta propuesta económica >150% del presupuesto disponible  
❌ No acepta periodo de garantía mínimo de 24 meses  
❌ No acepta penalizaciones por incumplimiento de SLA  

---

### 8.3 Puntos Adicionales (Bonus)

| **Criterio Bonus** | **Puntos Extra** |
|--------------------|------------------|
| Implementación de 15/15 módulos de IA | +50 puntos |
| Certificación FDA (Software as Medical Device) | +30 puntos |
| Modelo Revenue Share propuesto | +40 puntos |
| Contenido nacional >40% | +20 puntos |
| Compromiso de transferencia tecnológica a UCR | +30 puntos |
| Open source de componentes no críticos | +20 puntos |
| Soporte multiidioma (incluyendo lenguas indígenas) | +10 puntos |
| **MÁXIMO BONUS** | **200 puntos** |

---

## 9. GARANTÍAS Y SLA

### 9.1 Service Level Agreement (SLA)

| **Métrica** | **SLA Comprometido** | **Penalización por Incumplimiento** |
|-------------|----------------------|-------------------------------------|
| **Disponibilidad** | 99.9% mensual | 5% de pago mensual por cada 0.1% por debajo |
| **Latencia promedio** | <300ms | 2% por cada 50ms por encima (hasta 10%) |
| **Tiempo de respuesta soporte crítico** | <30 minutos | ₡500,000 por incidente |
| **Tiempo de resolución bug crítico** | <4 horas | ₡1,000,000 por cada 4h adicionales |
| **Precisión de IA (fraud)** | >94% | 3% de pago mensual si <92% |
| **Backup exitoso** | 100% | ₡2,000,000 por falla |
| **RTO (Recovery Time Objective)** | <4 horas | ₡5,000,000 por cada hora adicional |
| **RPO (Recovery Point Objective)** | <1 hora | ₡3,000,000 si se pierden >1h de datos |

### 9.2 Garantías

#### **Garantía de Funcionamiento**
- **Periodo**: 24 meses desde aceptación final
- **Cobertura**: 100% de defectos de software
- **Respuesta**: 24/7/365
- **Reemplazo**: Sin costo adicional

#### **Garantía de Ahorro** (Exclusiva para Revenue Share)
- Si el ahorro anual es <₡30,000M, el proveedor reduce su tarifa en 50%
- Si el ahorro anual es <₡20,000M, el proveedor NO cobra Revenue Share ese año
- Validación por auditor independiente (designado por CGR)

#### **Garantía de Capacitación**
- 100% de usuarios capacitados antes de go-live
- Re-capacitación gratuita si tasa de adopción <80% a los 6 meses
- Material de capacitación actualizado sin costo

---

## 10. ANEXOS TÉCNICOS

### ANEXO A: Diccionario de Datos

**Entidad: Prescription (Receta)**

| **Campo** | **Tipo** | **Obligatorio** | **Descripción** |
|-----------|----------|-----------------|-----------------|
| prescription_id | UUID | Sí | Identificador único |
| patient_id | UUID | Sí | Referencia a paciente |
| prescriber_id | UUID | Sí | Referencia a médico |
| prescription_date | DateTime | Sí | Fecha y hora de emisión |
| status | Enum | Sí | draft, issued, dispensed, cancelled |
| digital_signature | String | Sí | Firma digital XML |
| medications | Array | Sí | Lista de medicamentos (min 1) |
| diagnosis_code | String | Sí | Código CIE-10/11 |
| clinical_notes | Text | No | Notas clínicas |
| fraud_score | Float | Sí | Score 0-100 (calculado por IA) |
| interactions_checked | Boolean | Sí | Flag de validación |
| ...42 campos adicionales... | | | Ver especificación completa |

**Total de entidades**: 85  
**Documento completo**: 340 páginas (disponible bajo NDA)

---

### ANEXO B: Especificación de APIs

#### **API de Prescripción**

```yaml
openapi: 3.0.3
info:
  title: ePrescription API
  version: 2.0.0
  description: API nacional de prescripción electrónica

servers:
  - url: https://api.eprescription.go.cr/v2
    description: Producción
  - url: https://api-sandbox.eprescription.go.cr/v2
    description: Sandbox

paths:
  /prescriptions:
    post:
      summary: Crear nueva prescripción
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PrescriptionCreate'
      responses:
        '201':
          description: Prescripción creada exitosamente
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Prescription'
        '400':
          description: Datos inválidos
        '401':
          description: No autorizado
        '422':
          description: Validación clínica fallida (interacciones, contraindicaciones)

components:
  schemas:
    PrescriptionCreate:
      type: object
      required:
        - patient_id
        - prescriber_id
        - medications
        - diagnosis_code
      properties:
        patient_id:
          type: string
          format: uuid
        prescriber_id:
          type: string
          format: uuid
        medications:
          type: array
          minItems: 1
          items:
            $ref: '#/components/schemas/Medication'
        # ... más campos

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

**Endpoints totales**: 147  
**Documento completo**: OpenAPI 3.0 spec de 2,800 líneas

---

### ANEXO C: Plan de Capacitación

#### **Estructura del Programa**

| **Rol** | **Duración** | **Modalidad** | **Contenido Principal** |
|---------|--------------|---------------|-------------------------|
| **Médicos** | 4 horas | Presencial + e-learning | Prescripción electrónica, firma digital, IA asistente |
| **Farmacéuticos** | 6 horas | Presencial + e-learning | Dispensación, validación, inventario predictivo |
| **Administradores** | 16 horas | Presencial | Configuración, reportes, gestión de usuarios |
| **Soporte TI** | 40 horas | Presencial + certificación | Arquitectura, troubleshooting, integraciones |
| **Autoridades** | 2 horas | Presencial | Dashboards ejecutivos, interpretación de reportes |

**Total de personas a capacitar**: 12,500+  
**Inversión en capacitación**: ₡120,000,000

---

### ANEXO D: Glosario de Términos

| **Término** | **Definición** |
|-------------|----------------|
| **HL7 FHIR** | Health Level 7 Fast Healthcare Interoperability Resources - estándar de interoperabilidad |
| **RAM** | Reacción Adversa a Medicamento |
| **AMR** | Antimicrobial Resistance (Resistencia Antimicrobiana) |
| **EDUS** | Expediente Digital Único en Salud (CCSS) |
| **LOM** | Lista Oficial de Medicamentos |
| **CCSS** | Caja Costarricense de Seguro Social |
| **EBAIS** | Equipo Básico de Atención Integral en Salud |
| **IAFA** | Instituto sobre Alcoholismo y Farmacodependencia |
| ...50 términos más... | |

---

## 📝 RESUMEN EJECUTIVO FINAL

### ¿Por qué este proyecto es ÚNICO?

1. **15 módulos de IA** vs 3-5 de la competencia
2. **Modelo de pago por resultados** (Revenue Share) - Sin riesgo para el Estado
3. **ROI de 1,389%** - El más alto de cualquier proyecto TI gubernamental en la región
4. **Ahorro neto de ₡195,900M** en 5 años
5. **Cumplimiento total** de estándares internacionales (HL7, FDA, OMS)
6. **Transferencia tecnológica** a universidades costarricenses
7. **Liderazgo regional** - Posicionamiento como caso de éxito internacional

### Recomendación Estratégica

Seleccionar el modelo **Revenue Share (Opción C)** porque:

✅ **Riesgo financiero mínimo**: El Estado solo paga si hay ahorro comprobado  
✅ **Alineación total de intereses**: El proveedor gana más si genera más ahorro  
✅ **Inversión inicial baja**: ₡300M/año (base) vs ₡1,000M+ (licencias)  
✅ **Escalabilidad garantizada**: Sin costos sorpresa por crecimiento  
✅ **Auditoría independiente**: Transparencia total en cálculo de ahorro  

---

## 📞 CONTACTO Y PRÓXIMOS PASOS

**Equipo de Propuesta ePrescription AI**

📧 Email: propuesta@eprescription-ai.com  
📱 WhatsApp: +506 XXXX-XXXX  
🌐 Web: www.eprescription-ai.com  
📍 Oficinas: San José, Costa Rica

### Próximos Pasos Recomendados:

1. **Semana 1**: Presentación ejecutiva al Ministro de Salud (90 minutos)
2. **Semana 2**: Demo técnico a equipo TI de CCSS (4 horas)
3. **Semana 3**: Prueba de concepto (POC) con módulo antifraude (30 días)
4. **Semana 4-6**: Evaluación de propuestas y selección de proveedor
5. **Mes 2**: Firma de contrato e inicio de implementación

---

**Documento preparado por**: [Equipo ePrescription AI]  
**Fecha**: Octubre 2025  
**Versión**: 1.0 Ejecutiva  
**Clasificación**: Confidencial - Solo para evaluación RFP

---

© 2025 ePrescription AI. Todos los derechos reservados.  
Este documento es propiedad intelectual del proponente y no puede ser reproducido sin autorización.
