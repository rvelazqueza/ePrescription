using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Inventory repository interface
/// </summary>
public interface IInventoryRepository : IRepository<Inventory>
{
    Task<IEnumerable<Inventory>> GetByPharmacyAsync(Guid pharmacyId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Inventory>> GetByMedicationAsync(Guid medicationId, CancellationToken cancellationToken = default);
    Task<Inventory?> GetByBatchNumberAsync(Guid pharmacyId, Guid medicationId, string batchNumber, CancellationToken cancellationToken = default);
    Task<IEnumerable<Inventory>> GetLowStockAsync(Guid pharmacyId, decimal threshold, CancellationToken cancellationToken = default);
    Task<IEnumerable<Inventory>> GetExpiringSoonAsync(Guid pharmacyId, int daysUntilExpiration, CancellationToken cancellationToken = default);
    Task<IEnumerable<Inventory>> GetExpiredAsync(Guid pharmacyId, CancellationToken cancellationToken = default);
    Task<decimal> GetAvailableQuantityAsync(Guid pharmacyId, Guid medicationId, CancellationToken cancellationToken = default);
}
