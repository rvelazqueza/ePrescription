using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EPrescription.Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository implementation for PrescriptionPad entity
/// Handles data access for prescription pads assigned to doctors
/// </summary>
public class PrescriptionPadRepository : Repository<PrescriptionPad>, IPrescriptionPadRepository
{
    private readonly ILogger<PrescriptionPadRepository> _logger;

    public PrescriptionPadRepository(
        EPrescriptionDbContext context,
        ILogger<PrescriptionPadRepository> logger) : base(context)
    {
        _logger = logger;
    }

    /// <summary>
    /// Gets available pads for a specific doctor
    /// </summary>
    public async Task<IEnumerable<PrescriptionPad>> GetAvailablePadsForDoctorAsync(
        Guid doctorId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var availablePads = await _dbSet
                .Include(p => p.PadType)
                .Where(p => p.DoctorId == doctorId && 
                           p.AvailableCount > 0 && 
                           p.ExpirationDate > DateTime.UtcNow)
                .OrderBy(p => p.ExpirationDate)
                .ToListAsync(cancellationToken);

            return availablePads;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available pads for doctor: {DoctorId}", doctorId);
            throw;
        }
    }

    /// <summary>
    /// Gets pads by doctor and pad type
    /// </summary>
    public async Task<IEnumerable<PrescriptionPad>> GetPadsByDoctorAndTypeAsync(
        Guid doctorId,
        Guid padTypeId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var pads = await _dbSet
                .Include(p => p.PadType)
                .Where(p => p.DoctorId == doctorId && p.PadTypeId == padTypeId)
                .OrderBy(p => p.ExpirationDate)
                .ToListAsync(cancellationToken);

            return pads;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pads by doctor and type: {DoctorId}, {PadTypeId}", doctorId, padTypeId);
            throw;
        }
    }

    /// <summary>
    /// Gets pads expiring soon (within specified days)
    /// </summary>
    public async Task<IEnumerable<PrescriptionPad>> GetExpiringPadsAsync(
        int daysUntilExpiration = 30,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var expirationThreshold = DateTime.UtcNow.AddDays(daysUntilExpiration);

            var expiringPads = await _dbSet
                .Include(p => p.PadType)
                .Include(p => p.Doctor)
                .Where(p => p.ExpirationDate <= expirationThreshold && 
                           p.ExpirationDate > DateTime.UtcNow)
                .OrderBy(p => p.ExpirationDate)
                .ToListAsync(cancellationToken);

            return expiringPads;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expiring pads");
            throw;
        }
    }

    /// <summary>
    /// Gets pads with low availability (below threshold)
    /// </summary>
    public async Task<IEnumerable<PrescriptionPad>> GetLowAvailabilityPadsAsync(
        int threshold = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var lowAvailabilityPads = await _dbSet
                .Include(p => p.PadType)
                .Include(p => p.Doctor)
                .Where(p => p.AvailableCount <= threshold && 
                           p.AvailableCount > 0 &&
                           p.ExpirationDate > DateTime.UtcNow)
                .OrderBy(p => p.AvailableCount)
                .ToListAsync(cancellationToken);

            return lowAvailabilityPads;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting low availability pads");
            throw;
        }
    }

    /// <summary>
    /// Decrements available count for a pad
    /// </summary>
    public async Task<bool> DecrementAvailableCountAsync(
        Guid padId,
        int quantity = 1,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var pad = await _dbSet.FirstOrDefaultAsync(p => p.Id == padId, cancellationToken);
            
            if (pad == null)
            {
                _logger.LogWarning("Pad not found: {PadId}", padId);
                return false;
            }

            if (pad.AvailableCount < quantity)
            {
                _logger.LogWarning("Insufficient pad availability: {PadId}, Available: {Available}, Requested: {Requested}",
                    padId, pad.AvailableCount, quantity);
                return false;
            }

            pad.DecrementAvailableCount(quantity);
            Update(pad);

            _logger.LogInformation("Decremented pad availability: {PadId}, Quantity: {Quantity}, Remaining: {Remaining}",
                padId, quantity, pad.AvailableCount);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error decrementing pad availability: {PadId}", padId);
            throw;
        }
    }

    /// <summary>
    /// Gets paginated pads for a doctor
    /// </summary>
    public async Task<(IEnumerable<PrescriptionPad> Items, int TotalCount)> GetPadsForDoctorPagedAsync(
        Guid doctorId,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = _dbSet
                .Include(p => p.PadType)
                .Where(p => p.DoctorId == doctorId);

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting paginated pads for doctor: {DoctorId}", doctorId);
            throw;
        }
    }
}
