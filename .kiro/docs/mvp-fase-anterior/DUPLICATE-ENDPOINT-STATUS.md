# Estado del Endpoint de Duplicar Receta

## Problema Actual
El endpoint `/api/prescriptions/{id}/duplicate` retorna error 500 cuando intenta insertar una nueva prescripción.

## Causa Raíz
Los ValueConverters que agregamos para mapear RAW(16) a GUID funcionan correctamente para **lectura** de datos, pero hay un problema con la **inserción** usando EF Core.

Cuando EF Core intenta insertar una Prescription con los ValueConverters:
1. Convierte los GUIDs a bytes usando `guid.ToByteArray()`
2. Oracle recibe los bytes pero no puede procesarlos correctamente en la inserción
3. Retorna error ORA-06550 o similar

## Solución Necesaria
Para la inserción de Prescriptions, necesitamos usar SQL directo en lugar de EF Core, porque:
- EF Core + ValueConverters + Oracle RAW(16) = problemas en INSERT
- SQL directo con HEXTORAW() funciona correctamente

## Implementación Recomendada

```csharp
public async Task<Prescription?> DuplicatePrescriptionAsync(Guid id, CancellationToken cancellationToken = default)
{
    // 1. Cargar prescripción original con EF Core (lectura funciona bien)
    var original = await _context.Prescriptions
        .Include(p => p.Medications)
        .Include(p => p.Diagnoses)
        .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    // 2. Insertar nueva prescripción con SQL directo
    var newId = Guid.NewGuid();
    var newNumber = $"RX-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper()}";
    
    var sql = $@"INSERT INTO PRESCRIPTIONS 
        (PRESCRIPTION_ID, PRESCRIPTION_NUMBER, PATIENT_ID, DOCTOR_ID, MEDICAL_CENTER_ID, 
         PRESCRIPTION_DATE, EXPIRATION_DATE, STATUS, NOTES, CREATED_AT, UPDATED_AT)
        VALUES
        (HEXTORAW('{newId.ToString("N").ToUpper()}'), '{newNumber}', 
         HEXTORAW('{original.PatientId.ToString("N").ToUpper()}'),
         HEXTORAW('{original.DoctorId.ToString("N").ToUpper()}'),
         HEXTORAW('{original.MedicalCenterId.ToString("N").ToUpper()}'),
         SYSDATE, NULL, 'draft', '{original.Notes?.Replace("'", "''")}', SYSDATE, SYSDATE)";
    
    await _context.Database.ExecuteSqlRawAsync(sql, cancellationToken: cancellationToken);

    // 3. Copiar medicamentos y diagnósticos con EF Core
    // (después de que la prescripción existe en BD)

    // 4. Recargar con EF Core para retornar
    return await _context.Prescriptions
        .Include(p => p.Medications)
        .Include(p => p.Diagnoses)
        .FirstOrDefaultAsync(p => p.Id == newId, cancellationToken);
}
```

## Notas Importantes
- Los ValueConverters son necesarios para **lectura** de datos (SearchAsync, GetByIdAsync)
- Para **inserción**, debemos usar SQL directo con HEXTORAW()
- Esto es una limitación conocida de EF Core + Oracle + RAW(16)

## Próximos Pasos
1. Implementar la solución con SQL directo para INSERT
2. Mantener EF Core para lectura y relaciones
3. Probar que medicamentos y diagnósticos se copian correctamente
4. Verificar que el frontend puede usar los IDs sin problemas
