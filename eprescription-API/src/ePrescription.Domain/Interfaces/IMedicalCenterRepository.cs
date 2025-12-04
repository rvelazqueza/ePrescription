using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Medical Center repository interface
/// </summary>
public interface IMedicalCenterRepository : IRepository<MedicalCenter>
{
    Task<IEnumerable<MedicalCenter>> SearchByNameAsync(string searchTerm, CancellationToken cancellationToken = default);
    Task<IEnumerable<MedicalCenter>> GetByCityAsync(string city, CancellationToken cancellationToken = default);
    Task<IEnumerable<MedicalCenter>> GetByTypeAsync(string centerType, CancellationToken cancellationToken = default);
    Task<IEnumerable<MedicalCenter>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<MedicalCenter?> GetWithDoctorsAsync(Guid medicalCenterId, CancellationToken cancellationToken = default);
}
