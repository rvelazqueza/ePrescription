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
            prescriptionNumber: string.Empty, // Will be generated
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

        // Copy medications
        foreach (var medication in originalPrescription.Medications)
        {
            var newMedication = new PrescriptionMedication(
                prescriptionId: Guid.Empty, // Will be set by EF Core
                medicationId: medication.MedicationId,
                dosage: medication.Dosage,
                frequency: medication.Frequency,
                durationDays: medication.DurationDays,
                administrationRouteId: medication.AdministrationRouteId,
                quantity: medication.Quantity,
                instructions: medication.Instructions,
                aiSuggested: medication.AiSuggested
            );
            newPrescription.AddMedication(newMedication);
        }

        // Copy diagnoses
        foreach (var diagnosis in originalPrescription.Diagnoses)
        {
            var newDiagnosis = new PrescriptionDiagnosis(
                prescriptionId: Guid.Empty, // Will be set by EF Core
                cie10Id: diagnosis.Cie10Id,
                diagnosisCode: diagnosis.DiagnosisCode,
                diagnosisDescription: diagnosis.DiagnosisDescription,
                isPrimary: diagnosis.IsPrimary,
                notes: diagnosis.Notes
            );
            newPrescription.AddDiagnosis(newDiagnosis);
        }

        await AddAsync(newPrescription, cancellationToken);
        return newPrescription;
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
