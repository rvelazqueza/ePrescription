# Problema Real: Datos de Prueba Incorrectos

## Fecha: 2025-01-XX

## Problema Identificado

❌ **Los scripts de datos de prueba (Tasks 2-3) generaron datos incorrectos:**

### 1. PRESCRIPTIONS tiene PATIENT_IDs que no existen en PATIENTS

**PRESCRIPTIONS contiene:**
```
PATIENT_ID: 4369F7709F0C0E43E063020016AC882B
PATIENT_ID: 4369F7709F100E43E063020016AC882B
PATIENT_ID: 4369F7709F140E43E063020016AC882B
...
```

**PATIENTS contiene:**
```
PATIENT_ID: 5A4D10CAFE184841B55B6878BBF954F8
PATIENT_ID: 019C4A82EE21AA4C8BABB6CF08901785
PATIENT_ID: EFC5D3C48BF2BD49BB61C912AB1AD2A3
...
```

❌ **NO HAY COINCIDENCIA** → Por eso el frontend muestra "Paciente no encontrado"

### 2. Múltiples prescripciones usan el mismo PATIENT_ID

Según el usuario, varias prescripciones tienen el mismo PATIENT_ID (necesitamos verificar cuántas).

### 3. Todos los pacientes en PATIENTS son "Juan Perez Test"

Los 5 pacientes que existen tienen:
- FIRST_NAME: Juan
- LAST_NAME: Perez Test
- DATE_OF_BIRTH: 01-JAN-90
- GENDER: M
- BLOOD_TYPE: O+

Solo cambia el ID_NUMBER (TEST-5708, TEST-9924, etc.)

## Causa Raíz

Los scripts de inserción de datos de prueba en Tasks 2-3 tenían problemas:

1. **Generación de GUIDs inconsistente**: Los PATIENT_ID generados para PRESCRIPTIONS no coinciden con los de PATIENTS
2. **Datos repetidos**: Todos los pacientes tienen el mismo nombre
3. **Posible reutilización de IDs**: Varias prescripciones pueden estar usando el mismo PATIENT_ID

## Impacto

- ✅ El código del API funciona correctamente
- ✅ El código del frontend funciona correctamente  
- ❌ Los datos de prueba están mal relacionados
- ❌ El frontend no puede cargar los nombres de pacientes porque los IDs no coinciden

## Solución Necesaria

Necesitamos **regenerar los datos de prueba** con:

1. **Pacientes diversos** con nombres diferentes (María, Carlos, Ana, José, etc.)
2. **PATIENT_IDs consistentes** entre PATIENTS y PRESCRIPTIONS
3. **Distribución realista**: Algunos pacientes con 1 prescripción, otros con 2-3
4. **Datos completos**: Fechas de nacimiento variadas, diferentes géneros, etc.

## Archivos a Revisar

- Scripts originales en Tasks 2-3 que insertaron los datos
- Necesitamos crear un script de limpieza y reinserción

## Próximo Paso

1. Limpiar datos actuales (DELETE FROM PRESCRIPTIONS, PATIENTS, etc.)
2. Crear script nuevo con datos de prueba correctos
3. Ejecutar y verificar que los IDs coincidan
