using Microsoft.EntityFrameworkCore;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Infrastructure.Persistence.Repositories;

/// <summary>
/// Pharmacy repository implementation
/// </summary>
public class PharmacyRepository : Repository<Pharmacy>, IPharmacyRepository
{
    public PharmacyRepository(EPrescriptionDbContext context) : base(context)
    {
    }

    public async Task<Pharmacy?> GetByIdWithAddressAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Address)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<Pharmacy?> GetByLicenseNumberAsync(string licenseNumber, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(p => p.LicenseNumber == licenseNumber, cancellationToken);
    }

    public async Task<IEnumerable<Pharmacy>> GetByCityAsync(string city, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.City == city)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Pharmacy>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Pharmacy>> SearchByNameAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.PharmacyName.Contains(searchTerm))
            .ToListAsync(cancellationToken);
    }

    public async Task<Pharmacy?> GetWithInventoryAsync(Guid pharmacyId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Inventory)
            .FirstOrDefaultAsync(p => p.Id == pharmacyId, cancellationToken);
    }
}
