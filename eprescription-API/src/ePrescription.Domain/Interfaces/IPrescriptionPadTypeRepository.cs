using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Repository interface for PrescriptionPadType entity
/// Handles data access for prescription pad types (Libre, Antimicrobianos, etc.)
/// </summary>
public interface IPrescriptionPadTypeRepository : IRepository<PrescriptionPadType>
{
    /// <summary>
    /// Gets a pad type by its code
    /// </summary>
    Task<PrescriptionPadType?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all active pad types
    /// </summary>
    Task<IEnumerable<PrescriptionPadType>> GetActiveAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets pad types by specialty
    /// </summary>
    Task<IEnumerable<PrescriptionPadType>> GetBySpecialtyAsync(Guid specialtyId, CancellationToken cancellationToken = default);
}
