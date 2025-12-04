using Microsoft.EntityFrameworkCore;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Infrastructure.Persistence.Repositories;

public class InventoryRepository : Repository<Inventory>, IInventoryRepository
{
    public InventoryRepository(EPrescriptionDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Inventory>> GetByPharmacyAsync(Guid pharmacyId, CancellationToken cancellationToken = default)
    {
        return await _context.Inventories
            .Where(i => i.PharmacyId == pharmacyId)
            .Include(i => i.Medication)
            .OrderBy(i => i.Medication!.CommercialName)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Inventory>> GetByMedicationAsync(Guid medicationId, CancellationToken cancellationToken = default)
    {
        return await _context.Inventories
            .Where(i => i.MedicationId == medicationId)
            .Include(i => i.Pharmacy)
            .Include(i => i.Medication)
            .OrderBy(i => i.Pharmacy!.PharmacyName)
            .ToListAsync(cancellationToken);
    }

    public async Task<Inventory?> GetByBatchNumberAsync(Guid pharmacyId, Guid medicationId, string batchNumber, CancellationToken cancellationToken = default)
    {
        return await _context.Inventories
            .Include(i => i.Medication)
            .Include(i => i.Pharmacy)
            .FirstOrDefaultAsync(i => i.PharmacyId == pharmacyId && i.MedicationId == medicationId && i.BatchNumber == batchNumber, cancellationToken);
    }

    public async Task<IEnumerable<Inventory>> GetLowStockAsync(Guid pharmacyId, decimal threshold, CancellationToken cancellationToken = default)
    {
        return await _context.Inventories
            .Where(i => i.PharmacyId == pharmacyId && i.QuantityAvailable < threshold)
            .Include(i => i.Medication)
            .Include(i => i.Pharmacy)
            .OrderBy(i => i.QuantityAvailable)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Inventory>> GetExpiringSoonAsync(Guid pharmacyId, int daysUntilExpiration, CancellationToken cancellationToken = default)
    {
        var expirationDate = DateTime.UtcNow.AddDays(daysUntilExpiration);
        
        return await _context.Inventories
            .Where(i => i.PharmacyId == pharmacyId && i.ExpirationDate <= expirationDate && i.ExpirationDate > DateTime.UtcNow)
            .Include(i => i.Medication)
            .Include(i => i.Pharmacy)
            .OrderBy(i => i.ExpirationDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Inventory>> GetExpiredAsync(Guid pharmacyId, CancellationToken cancellationToken = default)
    {
        return await _context.Inventories
            .Where(i => i.PharmacyId == pharmacyId && i.ExpirationDate <= DateTime.UtcNow)
            .Include(i => i.Medication)
            .Include(i => i.Pharmacy)
            .OrderBy(i => i.ExpirationDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<decimal> GetAvailableQuantityAsync(Guid pharmacyId, Guid medicationId, CancellationToken cancellationToken = default)
    {
        var inventories = await _context.Inventories
            .Where(i => i.PharmacyId == pharmacyId && i.MedicationId == medicationId && i.ExpirationDate > DateTime.UtcNow)
            .ToListAsync(cancellationToken);

        return inventories.Sum(i => i.QuantityAvailable);
    }
}
