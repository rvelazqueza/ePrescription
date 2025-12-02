using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EPrescription.Infrastructure.Persistence.Repositories;

public class PrescriptionRepository : Repository<Prescription>, IPrescriptionRepository
{
    public PrescriptionRepository(EPrescriptionDbContext context) : base(context)
    {
    }

    public override async Task<Prescription?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var prescription = await _context.Prescriptions
            .Include(p => p.Medications)
            .Include(p => p.Diagnoses)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (prescription != null && prescription.Medications.Any())
        {
            var medicationIds = prescription.Medications.Select(m => m.MedicationId).ToList();
            // Load medications to populate the context
            await _context.Medications
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
        var query = _context.Prescriptions.AsQueryable();

        // Apply filters
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

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply pagination and ordering
        var items = await query
            .Include(p => p.Medications)
            .Include(p => p.Diagnoses)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        // Load medications to populate the context
        var medicationIds = items.SelectMany(p => p.Medications).Select(m => m.MedicationId).Distinct().ToList();
        if (medicationIds.Any())
        {
            await _context.Medications
                .Where(m => medicationIds.Contains(m.Id))
                .ToListAsync(cancellationToken);
        }

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
        var originalPrescription = await GetByIdAsync(id, cancellationToken);
        if (originalPrescription == null)
            return null;

        // Create new prescription as draft
        var newPrescription = new Prescription(
            prescriptionNumber: string.Empty,
            patientId: originalPrescription.PatientId,
            doctorId: originalPrescription.DoctorId,
            medicalCenterId: originalPrescription.MedicalCenterId,
            prescriptionDate: DateTime.UtcNow,
            expirationDate: null,
            notes: originalPrescription.Notes
        );

        // Generate prescription number
        newPrescription.GeneratePrescriptionNumber();

        // Set status to draft
        newPrescription.UpdateStatus("draft");

        // Save the new prescription first
        _context.Prescriptions.Add(newPrescription);
        await _context.SaveChangesAsync(cancellationToken);

        // Now copy medications using raw SQL to avoid EF Core issues
        if (originalPrescription.Medications.Any())
        {
            var medicationSql = @"
                INSERT INTO PRESCRIPTION_MEDICATIONS 
                (ID, PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED, CREATED_AT, UPDATED_AT)
                SELECT SYS_GUID(), :newPrescriptionId, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED, SYSDATE, SYSDATE
                FROM PRESCRIPTION_MEDICATIONS
                WHERE PRESCRIPTION_ID = :originalPrescriptionId";

            await _context.Database.ExecuteSqlRawAsync(medicationSql, 
                new Oracle.ManagedDataAccess.Client.OracleParameter(":newPrescriptionId", newPrescription.Id.ToString()),
                new Oracle.ManagedDataAccess.Client.OracleParameter(":originalPrescriptionId", id.ToString()));
        }

        // Copy diagnoses using raw SQL
        if (originalPrescription.Diagnoses.Any())
        {
            var diagnosisSql = @"
                INSERT INTO PRESCRIPTION_DIAGNOSES 
                (ID, PRESCRIPTION_ID, CIE10_ID, DIAGNOSIS_CODE, DIAGNOSIS_DESCRIPTION, IS_PRIMARY, NOTES, CREATED_AT, UPDATED_AT)
                SELECT SYS_GUID(), :newPrescriptionId, CIE10_ID, DIAGNOSIS_CODE, DIAGNOSIS_DESCRIPTION, IS_PRIMARY, NOTES, SYSDATE, SYSDATE
                FROM PRESCRIPTION_DIAGNOSES
                WHERE PRESCRIPTION_ID = :originalPrescriptionId";

            await _context.Database.ExecuteSqlRawAsync(diagnosisSql,
                new Oracle.ManagedDataAccess.Client.OracleParameter(":newPrescriptionId", newPrescription.Id.ToString()),
                new Oracle.ManagedDataAccess.Client.OracleParameter(":originalPrescriptionId", id.ToString()));
        }

        // Reload the prescription with all related data
        return await GetByIdAsync(newPrescription.Id, cancellationToken);
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
