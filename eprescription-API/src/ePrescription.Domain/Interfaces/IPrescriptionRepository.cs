using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Prescription repository interface with specific queries
/// Critical for medical traceability and FDA compliance
/// </summary>
public interface IPrescriptionRepository : IRepository<Prescription>
{
    /// <summary>
    /// Gets a prescription by its unique prescription number
    /// </summary>
    Task<Prescription?> GetByPrescriptionNumberAsync(
        string prescriptionNumber,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets prescription with all related data (diagnoses, medications, patient, doctor)
    /// </summary>
    Task<Prescription?> GetWithDetailsAsync(
        Guid prescriptionId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets prescriptions by patient
    /// </summary>
    Task<IEnumerable<Prescription>> GetByPatientAsync(
        Guid patientId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets prescriptions by doctor
    /// </summary>
    Task<IEnumerable<Prescription>> GetByDoctorAsync(
        Guid doctorId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets prescriptions by medical center
    /// </summary>
    Task<IEnumerable<Prescription>> GetByMedicalCenterAsync(
        Guid medicalCenterId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets prescriptions by status
    /// </summary>
    Task<IEnumerable<Prescription>> GetByStatusAsync(
        string status,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active prescriptions (not expired, not cancelled)
    /// </summary>
    Task<IEnumerable<Prescription>> GetActiveAsync(
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets prescriptions expiring soon (within specified days)
    /// </summary>
    Task<IEnumerable<Prescription>> GetExpiringSoonAsync(
        int daysUntilExpiration,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets prescriptions containing a specific medication
    /// </summary>
    Task<IEnumerable<Prescription>> GetByMedicationAsync(
        Guid medicationId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets prescriptions with a specific CIE-10 diagnosis
    /// </summary>
    Task<IEnumerable<Prescription>> GetByDiagnosisAsync(
        string cie10Code,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets prescriptions created within date range
    /// </summary>
    Task<IEnumerable<Prescription>> GetByDateRangeAsync(
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if prescription can be dispensed (not expired, not already dispensed)
    /// </summary>
    Task<bool> CanBeDispensedAsync(
        Guid prescriptionId,
        CancellationToken cancellationToken = default);
}
