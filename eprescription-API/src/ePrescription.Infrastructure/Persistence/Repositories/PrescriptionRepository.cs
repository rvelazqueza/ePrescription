using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EPrescription.Infrastructure.Persistence.Repositories;

public class PrescriptionRepository : Repository<Prescription>, IPrescriptionRepository
{
    private readonly ILogger<PrescriptionRepository> _logger;

    public PrescriptionRepository(EPrescriptionDbContext context, ILogger<PrescriptionRepository> logger) : base(context)
    {
        _logger = logger;
    }

    public override async Task<Prescription?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        // Try EF Core first
        var prescription = await _context.Prescriptions
            .Include(p => p.Medications)
            .Include(p => p.Diagnoses)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        // If not found with EF Core, try with SQL using the hex ID
        if (prescription == null)
        {
            var idHex = id.ToString().Replace("-", "").ToUpper();
            var prescSql = $@"SELECT p.prescription_id, p.prescription_number, p.patient_id, p.doctor_id, 
                                    p.medical_center_id, p.prescription_date, p.expiration_date, p.status, 
                                    p.notes, p.created_at, p.updated_at
                             FROM PRESCRIPTIONS p
                             WHERE RAWTOHEX(p.prescription_id) = '{idHex}'";
            
            var prescData = await _context.Database.SqlQueryRaw<dynamic>(prescSql).FirstOrDefaultAsync(cancellationToken);
            if (prescData != null)
            {
                // Found with SQL, now load with EF Core using the correct ID
                prescription = await _context.Prescriptions
                    .Include(p => p.Medications)
                    .Include(p => p.Diagnoses)
                    .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
            }
        }

        if (prescription != null && prescription.Medications.Any())
        {
            var medicationIds = prescription.Medications.Select(m => m.MedicationId).ToList();
            var medications = await _context.Medications
                .Where(m => medicationIds.Contains(m.Id))
                .ToListAsync(cancellationToken);
        }

        return prescription;
    }

    Task<Prescription> IPrescriptionRepository.AddAsync(Prescription prescription, CancellationToken cancellationToken)
    {
        return base.AddAsync(prescription, cancellationToken);
    }

    Task IPrescriptionRepository.UpdateAsync(Prescription prescription, CancellationToken cancellationToken)
    {
        base.Update(prescription);
        return Task.CompletedTask;
    }

    Task IPrescriptionRepository.DeleteAsync(Prescription prescription, CancellationToken cancellationToken)
    {
        base.Remove(prescription);
        return Task.CompletedTask;
    }

    public async Task<(IEnumerable<Prescription> Items, int TotalCount)> SearchAsync(
        Guid? patientId = null,
        Guid? doctorId = null,
        string? status = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        // Use EF Core - it works for getting the data, just the IDs are wrong
        // But we'll fix the IDs after loading
        var query = _context.Prescriptions.AsQueryable();

        if (patientId.HasValue)
            query = query.Where(p => p.PatientId == patientId.Value);

        if (doctorId.HasValue)
            query = query.Where(p => p.DoctorId == doctorId.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(p => p.Status.ToLower() == status.ToLower());

        if (startDate.HasValue)
            query = query.Where(p => p.PrescriptionDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(p => p.PrescriptionDate <= endDate.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Include(p => p.Medications)
            .Include(p => p.Diagnoses)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<Dictionary<Guid, Medication>> GetMedicationsByIdsAsync(IEnumerable<Guid> medicationIds, CancellationToken cancellationToken = default)
    {
        var medications = await _context.Medications
            .Where(m => medicationIds.Contains(m.Id))
            .ToListAsync(cancellationToken);

        return medications.ToDictionary(m => m.Id);
    }

    public async Task<Dictionary<Guid, Patient>> GetPatientsByIdsAsync(IEnumerable<Guid> patientIds, CancellationToken cancellationToken = default)
    {
        var patients = await _context.Patients
            .Where(p => patientIds.Contains(p.Id))
            .ToListAsync(cancellationToken);

        return patients.ToDictionary(p => p.Id);
    }

    public async Task<Dictionary<Guid, Doctor>> GetDoctorsByIdsAsync(IEnumerable<Guid> doctorIds, CancellationToken cancellationToken = default)
    {
        var doctors = await _context.Doctors
            .Include(d => d.Specialty)
            .Where(d => doctorIds.Contains(d.Id))
            .ToListAsync(cancellationToken);

        return doctors.ToDictionary(d => d.Id);
    }

    public async Task<Prescription?> DuplicatePrescriptionAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            // 1. Get original prescription using EF Core
            var original = await _context.Prescriptions
                .Include(p => p.Medications)
                .Include(p => p.Diagnoses)
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

            if (original == null)
            {
                _logger.LogWarning("Prescription not found with ID: {Id}", id);
                return null;
            }

            _logger.LogInformation("Found original prescription to duplicate");

            // 2. Create new prescription ID and number
            var newPrescriptionId = Guid.NewGuid();
            var newPrescriptionNumber = $"RX-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper()}";
            
            // 3. Insert new prescription using SQL
            var insertPrescSql = @"INSERT INTO PRESCRIPTIONS 
                (PRESCRIPTION_ID, PRESCRIPTION_NUMBER, PATIENT_ID, DOCTOR_ID, MEDICAL_CENTER_ID, PRESCRIPTION_DATE, EXPIRATION_DATE, STATUS, NOTES, CREATED_AT, UPDATED_AT)
                VALUES
                (:newId, :newNumber, :patientId, :doctorId, :medicalCenterId, SYSDATE, SYSDATE + 180, 'draft', :notes, SYSDATE, SYSDATE)";
            
            await _context.Database.ExecuteSqlRawAsync(insertPrescSql, 
                new Oracle.ManagedDataAccess.Client.OracleParameter("newId", newPrescriptionId.ToByteArray()),
                new Oracle.ManagedDataAccess.Client.OracleParameter("newNumber", newPrescriptionNumber),
                new Oracle.ManagedDataAccess.Client.OracleParameter("patientId", original.PatientId.ToByteArray()),
                new Oracle.ManagedDataAccess.Client.OracleParameter("doctorId", original.DoctorId.ToByteArray()),
                new Oracle.ManagedDataAccess.Client.OracleParameter("medicalCenterId", original.MedicalCenterId.ToByteArray()),
                new Oracle.ManagedDataAccess.Client.OracleParameter("notes", original.Notes ?? ""));
            
            _logger.LogInformation("Created new draft prescription {PrescriptionNumber}", newPrescriptionNumber);

            // 4. Copy medications using SQL
            if (original.Medications.Any())
            {
                foreach (var med in original.Medications)
                {
                    var insertMedSql = @"INSERT INTO PRESCRIPTION_MEDICATIONS 
                        (PRESCRIPTION_MEDICATION_ID, PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED, CREATED_AT)
                        VALUES
                        (SYS_GUID(), :newPrescId, :medId, :dosage, :frequency, :duration, :adminRoute, :quantity, :instructions, 0, SYSDATE)";
                    
                    await _context.Database.ExecuteSqlRawAsync(insertMedSql,
                        new Oracle.ManagedDataAccess.Client.OracleParameter("newPrescId", newPrescriptionId.ToByteArray()),
                        new Oracle.ManagedDataAccess.Client.OracleParameter("medId", med.MedicationId.ToByteArray()),
                        new Oracle.ManagedDataAccess.Client.OracleParameter("dosage", med.Dosage),
                        new Oracle.ManagedDataAccess.Client.OracleParameter("frequency", med.Frequency),
                        new Oracle.ManagedDataAccess.Client.OracleParameter("duration", med.DurationDays),
                        new Oracle.ManagedDataAccess.Client.OracleParameter("adminRoute", med.AdministrationRouteId.ToByteArray()),
                        new Oracle.ManagedDataAccess.Client.OracleParameter("quantity", med.Quantity),
                        new Oracle.ManagedDataAccess.Client.OracleParameter("instructions", med.Instructions ?? ""));
                }
                _logger.LogInformation("Copied {MedicationCount} medications", original.Medications.Count);
            }

            // 5. Copy diagnoses using SQL
            if (original.Diagnoses.Any())
            {
                foreach (var diag in original.Diagnoses)
                {
                    // Only copy if diagnosis code is not empty
                    if (!string.IsNullOrEmpty(diag.DiagnosisCode))
                    {
                        var insertDiagSql = @"INSERT INTO PRESCRIPTION_DIAGNOSES 
                            (DIAGNOSIS_ID, PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES, CREATED_AT, UPDATED_AT)
                            VALUES
                            (SYS_GUID(), :newPrescId, :cie10Code, :isPrimary, :notes, SYSDATE, SYSDATE)";
                        
                        await _context.Database.ExecuteSqlRawAsync(insertDiagSql,
                            new Oracle.ManagedDataAccess.Client.OracleParameter("newPrescId", newPrescriptionId.ToByteArray()),
                            new Oracle.ManagedDataAccess.Client.OracleParameter("cie10Code", diag.DiagnosisCode),
                            new Oracle.ManagedDataAccess.Client.OracleParameter("isPrimary", diag.IsPrimary ? 1 : 0),
                            new Oracle.ManagedDataAccess.Client.OracleParameter("notes", diag.Notes ?? ""));
                    }
                }
                _logger.LogInformation("Copied {DiagnosisCount} diagnoses", original.Diagnoses.Count);
            }

            // 6. Create and return the new prescription object
            var newPrescription = new Prescription(
                prescriptionNumber: newPrescriptionNumber,
                patientId: original.PatientId,
                doctorId: original.DoctorId,
                medicalCenterId: original.MedicalCenterId,
                prescriptionDate: DateTime.UtcNow,
                expirationDate: null,
                notes: original.Notes
            );

            // Manually set ID
            var idProperty = typeof(Prescription).GetProperty("Id");
            idProperty?.SetValue(newPrescription, newPrescriptionId);

            _logger.LogInformation("Prescription duplication completed successfully");
            return newPrescription;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error duplicating prescription {PrescriptionId}", id);
            throw;
        }
    }

    public async Task<bool> CancelPrescriptionAsync(Guid id, string? reason = null, CancellationToken cancellationToken = default)
    {
        var prescription = await GetByIdAsync(id, cancellationToken);
        if (prescription == null)
            return false;

        // Only allow cancelling active prescriptions
        if (prescription.Status.ToLower() != "active")
            return false;

        prescription.Cancel(reason ?? "Cancelled by user");
        Update(prescription);
        return true;
    }
}
