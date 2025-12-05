using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EPrescription.Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository implementation for PrescriptionPadType entity
/// Handles data access for prescription pad types
/// </summary>
public class PrescriptionPadTypeRepository : Repository<PrescriptionPadType>, IPrescriptionPadTypeRepository
{
    private readonly ILogger<PrescriptionPadTypeRepository> _logger;

    public PrescriptionPadTypeRepository(
        EPrescriptionDbContext context,
        ILogger<PrescriptionPadTypeRepository> logger) : base(context)
    {
        _logger = logger;
    }

    /// <summary>
    /// Gets a pad type by its code
    /// </summary>
    public async Task<PrescriptionPadType?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        try
        {
            var padType = await _dbSet
                .FirstOrDefaultAsync(pt => pt.Code == code, cancellationToken);

            return padType;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pad type by code: {Code}", code);
            throw;
        }
    }

    /// <summary>
    /// Gets all active pad types
    /// </summary>
    public async Task<IEnumerable<PrescriptionPadType>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var activePadTypes = await _dbSet
                .Where(pt => pt.IsActive)
                .OrderBy(pt => pt.Name)
                .ToListAsync(cancellationToken);

            return activePadTypes;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting active pad types");
            throw;
        }
    }

    /// <summary>
    /// Gets pad types by specialty
    /// </summary>
    public async Task<IEnumerable<PrescriptionPadType>> GetBySpecialtyAsync(
        Guid specialtyId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var padTypes = await _dbSet
                .Where(pt => pt.SpecialtyId == specialtyId && pt.IsActive)
                .OrderBy(pt => pt.Name)
                .ToListAsync(cancellationToken);

            return padTypes;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pad types by specialty: {SpecialtyId}", specialtyId);
            throw;
        }
    }
}
