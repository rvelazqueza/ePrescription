# Task 10 - AI Assistant Testing Guide

## Guía Completa de Testing para Task 10

Esta guía proporciona instrucciones detalladas para probar todos los endpoints implementados en el Task 10.

---

## 📋 Prerequisitos

### 1. Configuración de API Keys

Antes de comenzar, asegúrate de tener configurados los siguientes API keys en `appsettings.Local.json`:

```json
{
  "DeepL": {
    "ApiKey": "342238a3-699d-4696-96e2-70d3c2fb576f:fx",
    "BaseUrl": "https://api-free.deepl.com/v2"
  },
  "WHOApi": {
    "BaseUrl": "https://id.who.int",
    "ClientId": "YOUR_WHO_CLIENT_ID",
    "ClientSecret": "YOUR_WHO_CLIENT_SECRET"
  },
  "HuggingFace": {
    "ApiKey": "YOUR_HUGGINGFACE_API_KEY",
    "BaseUrl": "https://api-inference.huggingface.co",
    "Model": "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext"
  }
}
```

### 2. Iniciar la API

```bash
cd eprescription-API
dotnet run --project src/ePrescription.API
```

La API estará disponible en: `http://localhost:5000`

### 3. Obtener Token de Autenticación

Todos los endpoints requieren autenticación. Primero obtén un token JWT:

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "doctor1",
  "password": "Doctor123!"
}
```

Guarda el token recibido para usarlo en los siguientes requests.

---

## 🧪 Testing de Endpoints

### 1. WHO API Controller

#### 1.1 Health Check (Sin autenticación)
```bash
GET http://localhost:5000/api/whoapi/health
```

**Respuesta esperada:**
```json
{
  "isHealthy": true,
  "service": "WHO API",
  "checkedAt": "2024-11-17T10:00:00Z",
  "message": "WHO API is accessible"
}
```

#### 1.2 Buscar Código en WHO API
```bash
GET http://localhost:5000/api/whoapi/code/A00.0
Authorization: Bearer {tu_token}
```

**Respuesta esperada:**
```json
{
  "code": "A00.0",
  "title": "Cholera due to Vibrio cholerae 01, biovar cholerae",
  "definition": "...",
  "chapter": "Certain infectious and parasitic diseases",
  "isValid": true
}
```

#### 1.3 Buscar Códigos
```bash
GET http://localhost:5000/api/whoapi/search?query=diabetes&limit=5
Authorization: Bearer {tu_token}
```

#### 1.4 Validar Código
```bash
GET http://localhost:5000/api/whoapi/validate/E11.9
Authorization: Bearer {tu_token}
```

**Respuesta esperada:**
```json
{
  "code": "E11.9",
  "isValid": true,
  "message": "Code is valid",
  "validatedAt": "2024-11-17T10:00:00Z"
}
```

#### 1.5 Sincronización Manual (Solo Admin)
```bash
POST http://localhost:5000/api/whoapi/sync
Authorization: Bearer {admin_token}
```

---

### 2. CIE-10 Catalog Controller

#### 2.1 Buscar por Código Exacto
```bash
GET http://localhost:5000/api/cie10/E11.9
Authorization: Bearer {tu_token}
```

**Respuesta esperada:**
```json
{
  "code": "E11.9",
  "description": "Diabetes mellitus tipo 2 sin complicaciones",
  "category": "E10-E14",
  "subcategory": "Diabetes mellitus",
  "isCommon": true,
  "lastUpdated": "2024-11-17T10:00:00Z"
}
```

#### 2.2 Buscar por Descripción
```bash
GET http://localhost:5000/api/cie10/search?description=diabetes&maxResults=10
Authorization: Bearer {tu_token}
```

**Respuesta esperada:**
```json
[
  {
    "code": "E11.9",
    "description": "Diabetes mellitus tipo 2 sin complicaciones",
    "category": "E10-E14",
    "isCommon": true
  },
  {
    "code": "E10.9",
    "description": "Diabetes mellitus tipo 1 sin complicaciones",
    "category": "E10-E14",
    "isCommon": true
  }
]
```

#### 2.3 Buscar por Categoría
```bash
GET http://localhost:5000/api/cie10/category/E10-E14
Authorization: Bearer {tu_token}
```

#### 2.4 Validar Código
```bash
GET http://localhost:5000/api/cie10/validate/J45.9
Authorization: Bearer {tu_token}
```

#### 2.5 Obtener Detalles Completos
```bash
GET http://localhost:5000/api/cie10/A00.0/details
Authorization: Bearer {tu_token}
```

**Respuesta esperada:**
```json
{
  "code": "A00.0",
  "description": "Cólera debido a Vibrio cholerae 01, biotipo cholerae",
  "category": "A00-A09",
  "longDescription": "...",
  "relatedCodes": ["A00.1", "A00.9"],
  "synonyms": [],
  "clinicalNotes": null,
  "usageCount": 5
}
```

#### 2.6 Códigos Más Comunes
```bash
GET http://localhost:5000/api/cie10/common?count=20
Authorization: Bearer {tu_token}
```

#### 2.7 Estadísticas del Catálogo
```bash
GET http://localhost:5000/api/cie10/statistics
Authorization: Bearer {tu_token}
```

**Respuesta esperada:**
```json
{
  "totalCodes": 14000,
  "commonCodes": 500,
  "lastSyncDate": "2024-11-17T02:00:00Z",
  "codesAddedLastSync": 0,
  "codesUpdatedLastSync": 150,
  "codesByCategory": {
    "A00-A09": 45,
    "E10-E14": 30
  }
}
```

#### 2.8 Sincronizar con WHO API (Solo Admin)
```bash
POST http://localhost:5000/api/cie10/sync
Authorization: Bearer {admin_token}
```

---

### 3. AI Assistant Controller

#### 3.1 Analizar Descripción Clínica
```bash
POST http://localhost:5000/api/aiassistant/analyze
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "clinicalDescription": "Paciente masculino de 45 años presenta dolor abdominal agudo en cuadrante superior derecho, fiebre de 38.5°C, náuseas y vómitos. Refiere inicio hace 6 horas.",
  "patientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**Respuesta esperada:**
```json
{
  "originalDescription": "Paciente masculino de 45 años presenta...",
  "translatedDescription": "45-year-old male patient presents...",
  "diagnosisSuggestions": [
    {
      "cie10Code": "K81.0",
      "description": "Colecistitis aguda",
      "confidence": 0.85,
      "isValidated": true,
      "validationMessage": "Valid CIE-10 code",
      "supportingSymptoms": ["dolor abdominal", "fiebre", "náuseas"]
    },
    {
      "cie10Code": "K35.8",
      "description": "Apendicitis aguda",
      "confidence": 0.65,
      "isValidated": true,
      "validationMessage": "Valid CIE-10 code",
      "supportingSymptoms": ["dolor abdominal", "fiebre"]
    }
  ],
  "symptoms": ["dolor abdominal", "fiebre", "náuseas"],
  "confidenceScore": 0.75,
  "aiModel": "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext",
  "analysisDate": "2024-11-17T10:00:00Z",
  "analysisLogId": "guid-here"
}
```

#### 3.2 Generar Recomendaciones de Medicamentos
```bash
POST http://localhost:5000/api/aiassistant/medications/recommend
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "diagnosisCodes": ["K81.0", "R50.9"],
  "patientAge": 45,
  "patientWeight": 75.5,
  "allergies": ["penicilina"]
}
```

**Respuesta esperada:**
```json
[
  {
    "medicationName": "Ciprofloxacino",
    "activeIngredient": "Ciprofloxacin",
    "recommendedDosage": "500mg",
    "frequency": "Cada 12 horas",
    "duration": "7 días",
    "route": "Oral",
    "indications": ["Infección bacteriana", "Colecistitis"],
    "contraindications": ["Embarazo", "Lactancia"],
    "confidenceScore": 0.80,
    "specialInstructions": "Tomar con abundante agua",
    "requiresPrescription": true
  }
]
```

#### 3.3 Verificar Interacciones Medicamentosas
```bash
POST http://localhost:5000/api/aiassistant/medications/check-interactions
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "medicationIds": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "4fa85f64-5717-4562-b3fc-2c963f66afa7"
  ]
}
```

**Respuesta esperada:**
```json
[
  {
    "medication1Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "medication1Name": "Warfarina",
    "medication2Id": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
    "medication2Name": "Aspirina",
    "interactionType": "MAJOR",
    "severity": "HIGH",
    "description": "Riesgo aumentado de sangrado",
    "clinicalEffect": "Puede causar hemorragia grave",
    "managementRecommendation": "Evitar uso concomitante. Considerar alternativas.",
    "references": []
  }
]
```

#### 3.4 Validar Contraindicaciones
```bash
POST http://localhost:5000/api/aiassistant/medications/check-contraindications
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "medicationIds": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  "patientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "diagnosisCodes": ["E11.9"]
}
```

**Respuesta esperada:**
```json
{
  "hasContraindications": true,
  "contraindications": [
    {
      "medicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "medicationName": "Penicilina",
      "contraindicationType": "ALLERGY",
      "reason": "Patient is allergic to penicilina",
      "severity": "ABSOLUTE",
      "alternativeSuggestion": null
    }
  ],
  "warnings": [
    "Patient is elderly. Consider dose adjustments."
  ],
  "isSafeToDispense": false,
  "recommendedAction": "Do not dispense. Consult with prescribing physician."
}
```

#### 3.5 Obtener Historial de Análisis
```bash
GET http://localhost:5000/api/aiassistant/history/3fa85f64-5717-4562-b3fc-2c963f66afa6?limit=10
Authorization: Bearer {tu_token}
```

**Respuesta esperada:**
```json
[
  {
    "id": "guid-here",
    "analysisDate": "2024-11-17T10:00:00Z",
    "clinicalDescription": "Paciente con dolor abdominal...",
    "aiResponse": "Analysis result...",
    "suggestedDiagnoses": ["K81.0", "K35.8"],
    "confidenceScore": 0.75,
    "aiModel": "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext"
  }
]
```

#### 3.6 Diagnóstico Rápido por Síntomas
```bash
POST http://localhost:5000/api/aiassistant/quick-diagnosis
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "symptoms": [
    "dolor de cabeza",
    "fiebre",
    "dolor de garganta",
    "tos"
  ]
}
```

**Respuesta esperada:**
```json
{
  "symptoms": ["dolor de cabeza", "fiebre", "dolor de garganta", "tos"],
  "suggestedDiagnoses": [
    {
      "cie10Code": "J06.9",
      "description": "Infección aguda de las vías respiratorias superiores",
      "confidence": 0.80,
      "isValidated": true
    },
    {
      "cie10Code": "J02.9",
      "description": "Faringitis aguda",
      "confidence": 0.70,
      "isValidated": true
    }
  ],
  "confidenceScore": 0.75,
  "analysisDate": "2024-11-17T10:00:00Z"
}
```

---

## 📊 Flujos de Testing Completos

### Flujo 1: Análisis Clínico Completo

1. **Analizar descripción clínica**
   ```
   POST /api/aiassistant/analyze
   ```

2. **Validar códigos CIE-10 sugeridos**
   ```
   GET /api/cie10/{code}
   ```

3. **Generar recomendaciones de medicamentos**
   ```
   POST /api/aiassistant/medications/recommend
   ```

4. **Verificar interacciones**
   ```
   POST /api/aiassistant/medications/check-interactions
   ```

5. **Validar contraindicaciones**
   ```
   POST /api/aiassistant/medications/check-contraindications
   ```

### Flujo 2: Búsqueda y Validación CIE-10

1. **Buscar por descripción**
   ```
   GET /api/cie10/search?description=diabetes
   ```

2. **Obtener detalles del código**
   ```
   GET /api/cie10/{code}/details
   ```

3. **Validar código**
   ```
   GET /api/cie10/validate/{code}
   ```

4. **Ver códigos relacionados**
   ```
   GET /api/cie10/category/{category}
   ```

### Flujo 3: Sincronización WHO API

1. **Verificar salud de WHO API**
   ```
   GET /api/whoapi/health
   ```

2. **Buscar código en WHO API**
   ```
   GET /api/whoapi/code/{code}
   ```

3. **Sincronizar catálogo local**
   ```
   POST /api/cie10/sync
   ```

4. **Verificar estadísticas**
   ```
   GET /api/cie10/statistics
   ```

---

## 🐛 Casos de Prueba de Error

### 1. Sin Autenticación
```bash
GET http://localhost:5000/api/cie10/E11.9
# Sin header Authorization
```

**Respuesta esperada:** `401 Unauthorized`

### 2. Token Inválido
```bash
GET http://localhost:5000/api/cie10/E11.9
Authorization: Bearer invalid_token
```

**Respuesta esperada:** `401 Unauthorized`

### 3. Código CIE-10 No Encontrado
```bash
GET http://localhost:5000/api/cie10/INVALID
Authorization: Bearer {tu_token}
```

**Respuesta esperada:** `404 Not Found`

### 4. Descripción Clínica Vacía
```bash
POST http://localhost:5000/api/aiassistant/analyze
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "clinicalDescription": "",
  "patientId": null
}
```

**Respuesta esperada:** `400 Bad Request`

### 5. Medicamentos Insuficientes para Interacciones
```bash
POST http://localhost:5000/api/aiassistant/medications/check-interactions
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "medicationIds": ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]
}
```

**Respuesta esperada:** `400 Bad Request` - "At least 2 medications are required"

---

## 📝 Notas Importantes

### Limitaciones de API Keys Gratuitas

1. **DeepL Free:**
   - 500,000 caracteres/mes
   - Sin tarjeta de crédito requerida

2. **Hugging Face:**
   - Rate limit: ~30 requests/min
   - Puede tener latencia en primera llamada (cold start)

3. **WHO API:**
   - Verificar límites en documentación oficial
   - Requiere registro previo

### Recomendaciones

1. **Usar datos de prueba consistentes** para facilitar debugging
2. **Guardar tokens** en variables de entorno de Postman
3. **Crear colección de Postman** con todos los endpoints
4. **Documentar casos de prueba** exitosos y fallidos
5. **Probar con diferentes roles** (doctor, admin)

---

## 🔍 Troubleshooting

### Problema: "WHO API is not accessible"
**Solución:** Verificar que las credenciales de WHO API estén configuradas correctamente

### Problema: "Translation service error"
**Solución:** Verificar que el API key de DeepL sea válido y no haya excedido el límite

### Problema: "AI model timeout"
**Solución:** Hugging Face puede tener cold start. Reintentar después de 30 segundos

### Problema: "Patient not found"
**Solución:** Asegurarse de que el patientId exista en la base de datos

### Problema: "Medication not found"
**Solución:** Verificar que los medicationIds sean válidos y existan en la BD

---

**Última Actualización:** 2024-11-17  
**Versión:** 1.0  
**Autor:** Kiro
