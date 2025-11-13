using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Pharmacy repository interface
/// </summary>
public interface IPharmacyRepository : IRepository<Pharmacy>
{
    Task<Pharmacy?> GetByLicenseNumberAsync(string licenseNumber, CancellationToken cancellationToken = default);
    Task<IEnumerable<Pharmacy>> GetByCityAsync(string city, CancellationToken cancellationToken = default);
    Task<IEnumerable<Pharmacy>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Pharmacy>> SearchByNameAsync(string searchTerm, CancellationToken cancellationToken = default);
    Task<Pharmacy?> GetWithInventoryAsync(Guid pharmacyId, CancellationToken cancellationToken = default);
}
