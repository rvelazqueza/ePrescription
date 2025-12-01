using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

public interface IPrescriptionRepository
{
    Task<Prescription?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Prescription> AddAsync(Prescription prescription, CancellationToken cancellationToken = default);
    Task UpdateAsync(Prescription prescription, CancellationToken cancellationToken = default);
    Task DeleteAsync(Prescription prescription, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Prescription> Items, int TotalCount)> SearchAsync(
        Guid? patientId = null,
        Guid? doctorId = null,
        string? status = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        int page = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);

    Task<Dictionary<Guid, Medication>> GetMedicationsByIdsAsync(IEnumerable<Guid> medicationIds, CancellationToken cancellationToken = default);
    Task<Dictionary<Guid, Patient>> GetPatientsByIdsAsync(IEnumerable<Guid> patientIds, CancellationToken cancellationToken = default);
    Task<Dictionary<Guid, Doctor>> GetDoctorsByIdsAsync(IEnumerable<Guid> doctorIds, CancellationToken cancellationToken = default);
}
