# Tarea 1.4: Crear AIAssistantService - INICIO

## Fecha: 2025-12-05
## Estado: 🚀 INICIANDO

---

## Descripción de la Tarea

**Objetivo:** Integrar asistente de IA para sugerencias de medicamentos y análisis clínico.

**Contexto:** El sistema necesita un servicio de IA que:
- Analice descripciones clínicas en español
- Sugiera diagnósticos con códigos CIE-10
- Genere recomendaciones de medicamentos
- Verifique interacciones medicamentosas
- Valide contraindicaciones

---

## Estado Actual

### ✅ Ya Implementado

1. **IAIAssistantService.cs** (Interfaz)
   - ✅ Ubicación: `eprescription-API/src/ePrescription.Application/Interfaces/IAIAssistantService.cs`
   - ✅ Métodos definidos:
     - `AnalyzeClinicalDescriptionAsync()`
     - `GenerateMedicationRecommendationsAsync()`
     - `CheckDrugInteractionsAsync()`
     - `ValidateContraindicationsAsync()`
     - `GetAnalysisHistoryAsync()`
   - ✅ DTOs definidos:
     - `ClinicalAnalysisResult`
     - `DiagnosisSuggestion`
     - `MedicationRecommendation`
     - `DrugInteraction`
     - `ContraindicationResult`
     - `AIAnalysisLogDto`

2. **HuggingFaceAIService.cs** (Implementación)
   - ✅ Ubicación: `eprescription-API/src/ePrescription.Infrastructure/Services/HuggingFaceAIService.cs`
   - ✅ Métodos implementados:
     - `AnalyzeClinicalDescriptionAsync()` - Análisis clínico con traducción
     - `GenerateMedicationRecommendationsAsync()` - Recomendaciones de medicamentos
     - `CheckDrugInteractionsAsync()` - Verificación de interacciones
     - `ValidateContraindicationsAsync()` - Validación de contraindicaciones
     - `GetAnalysisHistoryAsync()` - Historial de análisis
   - ✅ Métodos privados:
     - `CallHuggingFaceAPIAsync()` - Llamada a API
     - `ExtractDiagnosisCodesAsync()` - Extracción de códigos
     - `ValidateDiagnosisCodesAsync()` - Validación de códigos
     - `ExtractSymptoms()` - Extracción de síntomas
     - `BuildMedicationPrompt()` - Construcción de prompts
     - `ParseMedicationRecommendations()` - Parsing de recomendaciones

3. **Registro en DI** (Program.cs)
   - ✅ Servicio registrado: `builder.Services.AddHttpClient<IAIAssistantService, HuggingFaceAIService>()`

4. **AIAssistantController.cs**
   - ✅ Ubicación: `eprescription-API/src/ePrescription.API/Controllers/AIAssistantController.cs`
   - ✅ Endpoints implementados

---

## Tareas Pendientes

### 1. ✅ Verificar Integración en CreateDraftCommandHandler
- [ ] Integrar llamada a `IAIAssistantService` para análisis clínico
- [ ] Usar sugerencias de IA para medicamentos
- [ ] Guardar análisis en BD

### 2. ✅ Verificar Integración en CreatePrescriptionCommandHandler
- [ ] Verificar interacciones medicamentosas
- [ ] Validar contraindicaciones
- [ ] Registrar análisis

### 3. ✅ Configurar Variables de Entorno
- [ ] `HuggingFace:ApiKey` - API key de Hugging Face
- [ ] `HuggingFace:BaseUrl` - URL base de API
- [ ] `HuggingFace:Model` - Modelo a usar

### 4. ✅ Crear Tabla AIAnalysisLog
- [ ] Verificar que la tabla existe en BD
- [ ] Verificar que la entidad está mapeada

### 5. ✅ Crear Tests
- [ ] Tests unitarios para HuggingFaceAIService
- [ ] Property-based tests para análisis clínico
- [ ] Tests de integración

---

## Configuración Requerida

### appsettings.json

```json
{
  "HuggingFace": {
    "ApiKey": "hf_YOUR_API_KEY_HERE",
    "BaseUrl": "https://api-inference.huggingface.co",
    "Model": "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext"
  }
}
```

### appsettings.Development.json

```json
{
  "HuggingFace": {
    "ApiKey": "hf_YOUR_DEV_API_KEY",
    "BaseUrl": "https://api-inference.huggingface.co",
    "Model": "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext"
  }
}
```

---

## Flujo de Análisis Clínico

```
1. Usuario ingresa descripción clínica en español
   ↓
2. CreateDraftCommandHandler recibe la solicitud
   ↓
3. Llama a IAIAssistantService.AnalyzeClinicalDescriptionAsync()
   ↓
4. Servicio traduce español → inglés
   ↓
5. Llama a Hugging Face API para análisis
   ↓
6. Extrae códigos CIE-10 de la respuesta
   ↓
7. Valida códigos contra catálogo CIE-10
   ↓
8. Traduce resultados inglés → español
   ↓
9. Guarda análisis en BD (AIAnalysisLog)
   ↓
10. Retorna sugerencias de diagnósticos
   ↓
11. Genera recomendaciones de medicamentos
   ↓
12. Verifica interacciones medicamentosas
   ↓
13. Valida contraindicaciones
   ↓
14. Retorna prescripción con análisis de IA
```

---

## Métodos Principales

### AnalyzeClinicalDescriptionAsync()
- **Entrada:** Descripción clínica en español
- **Proceso:**
  1. Traducir a inglés
  2. Analizar con IA
  3. Extraer códigos CIE-10
  4. Validar códigos
  5. Extraer síntomas
  6. Guardar en BD
- **Salida:** `ClinicalAnalysisResult` con diagnósticos sugeridos

### GenerateMedicationRecommendationsAsync()
- **Entrada:** Códigos CIE-10, edad, peso, alergias
- **Proceso:**
  1. Obtener descripciones de diagnósticos
  2. Construir prompt para IA
  3. Traducir a inglés
  4. Llamar a IA
  5. Parsear recomendaciones
  6. Filtrar por alergias
- **Salida:** Lista de `MedicationRecommendation`

### CheckDrugInteractionsAsync()
- **Entrada:** Lista de IDs de medicamentos
- **Proceso:**
  1. Obtener medicamentos de BD
  2. Buscar interacciones en BD
  3. Si no hay, consultar IA
  4. Registrar en auditoría
- **Salida:** Lista de `DrugInteraction`

### ValidateContraindicationsAsync()
- **Entrada:** IDs de medicamentos, ID de paciente, códigos CIE-10
- **Proceso:**
  1. Obtener información del paciente
  2. Verificar alergias
  3. Verificar edad
  4. Verificar condiciones
- **Salida:** `ContraindicationResult`

---

## Próximos Pasos

1. ✅ Verificar que la tabla `AIAnalysisLog` existe
2. ✅ Configurar variables de entorno
3. ✅ Integrar en CreateDraftCommandHandler
4. ✅ Integrar en CreatePrescriptionCommandHandler
5. ✅ Crear tests
6. ✅ Validar compilación
7. ✅ Hacer push a rama

---

## Notas Importantes

- El servicio requiere API key de Hugging Face
- La traducción se realiza automáticamente (ES → EN → ES)
- Los análisis se guardan en BD para auditoría
- Las interacciones se cachean en BD
- El servicio es tolerante a fallos (fallback a datos locales)

---

## Estimación

**Tiempo:** 4 horas
**Complejidad:** Alta
**Riesgos:** Integración con API externa, traducción, parsing de IA

