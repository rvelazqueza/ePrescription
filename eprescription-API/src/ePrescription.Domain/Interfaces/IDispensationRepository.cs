using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Dispensation repository interface
/// Critical for tracking medication dispensing and compliance
/// </summary>
public interface IDispensationRepository : IRepository<Dispensation>
{
    Task<IEnumerable<Dispensation>> GetByPrescriptionAsync(Guid prescriptionId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Dispensation>> GetByPharmacyAsync(Guid pharmacyId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Dispensation>> GetByPharmacistAsync(Guid pharmacistId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Dispensation>> GetByStatusAsync(string status, CancellationToken cancellationToken = default);
    Task<IEnumerable<Dispensation>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task<Dispensation?> GetWithDetailsAsync(Guid dispensationId, CancellationToken cancellationToken = default);
    Task<bool> IsPrescriptionDispensedAsync(Guid prescriptionId, CancellationToken cancellationToken = default);
}
