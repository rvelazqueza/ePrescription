using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// CIE-10 Catalog repository interface
/// For WHO ICD-10 diagnosis codes
/// </summary>
public interface ICie10CatalogRepository : IRepository<Cie10Catalog>
{
    Task<Cie10Catalog?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<IEnumerable<Cie10Catalog>> SearchByDescriptionAsync(string searchTerm, string language = "es", CancellationToken cancellationToken = default);
    Task<IEnumerable<Cie10Catalog>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default);
    Task<IEnumerable<Cie10Catalog>> GetByChapterAsync(string chapter, CancellationToken cancellationToken = default);
    Task<IEnumerable<Cie10Catalog>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Cie10Catalog>> GetBySourceAsync(string source, CancellationToken cancellationToken = default);
    Task<bool> CodeExistsAsync(string code, CancellationToken cancellationToken = default);
}
