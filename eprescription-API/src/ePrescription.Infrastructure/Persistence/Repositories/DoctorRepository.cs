using Microsoft.EntityFrameworkCore;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Infrastructure.Persistence.Repositories;

/// <summary>
/// Doctor-specific repository with eager loading of related entities
/// </summary>
public class DoctorRepository : Repository<Doctor>, IRepository<Doctor>
{
    public DoctorRepository(EPrescriptionDbContext context) : base(context)
    {
    }

    /// <summary>
    /// Get doctor by ID with related entities (Specialty)
    /// </summary>
    public override async Task<Doctor?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(d => d.Specialty)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }

    /// <summary>
    /// Get all doctors with related entities
    /// </summary>
    public override async Task<IEnumerable<Doctor>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(d => d.Specialty)
            .ToListAsync(cancellationToken);
    }
}
