using Microsoft.EntityFrameworkCore;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Infrastructure.Persistence.Repositories;

/// <summary>
/// Patient-specific repository with eager loading of related entities
/// </summary>
public class PatientRepository : Repository<Patient>, IRepository<Patient>
{
    public PatientRepository(EPrescriptionDbContext context) : base(context)
    {
    }

    /// <summary>
    /// Get patient by ID with related entities (Contacts and Allergies)
    /// </summary>
    public override async Task<Patient?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Contacts)
            .Include(p => p.Allergies)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    /// <summary>
    /// Get all patients with related entities
    /// </summary>
    public override async Task<IEnumerable<Patient>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Contacts)
            .Include(p => p.Allergies)
            .ToListAsync(cancellationToken);
    }
}
