using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EPrescription.Infrastructure.Persistence.Repositories;

/// <summary>
/// Repository implementation for PrescriptionSlip entity
/// Handles data access for prescription slips (boletas)
/// </summary>
public class PrescriptionSlipRepository : Repository<PrescriptionSlip>, IPrescriptionSlipRepository
{
    private readonly ILogger<PrescriptionSlipRepository> _logger;

    public PrescriptionSlipRepository(
        EPrescriptionDbContext context,
        ILogger<PrescriptionSlipRepository> logger) : base(context)
    {
        _logger = logger;
    }

    /// <summary>
    /// Gets slips for a specific prescription
    /// </summary>
    public async Task<IEnumerable<PrescriptionSlip>> GetSlipsForPrescriptionAsync(
        Guid prescriptionId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var slips = await _dbSet
                .Where(s => s.PrescriptionId == prescriptionId)
                .OrderBy(s => s.CreatedAt)
                .ToListAsync(cancellationToken);

            return slips;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting slips for prescription: {PrescriptionId}", prescriptionId);
            throw;
        }
    }

    /// <summary>
    /// Gets slips for a specific pad
    /// </summary>
    public async Task<IEnumerable<PrescriptionSlip>> GetSlipsForPadAsync(
        Guid padId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var slips = await _dbSet
                .Include(s => s.Pad)
                .Where(s => s.PadId == padId)
                .OrderBy(s => s.CreatedAt)
                .ToListAsync(cancellationToken);

            return slips;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting slips for pad: {PadId}", padId);
            throw;
        }
    }

    /// <summary>
    /// Gets used slips for a doctor
    /// </summary>
    public async Task<IEnumerable<PrescriptionSlip>> GetUsedSlipsForDoctorAsync(
        Guid doctorId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = _dbSet
                .Include(s => s.Pad)
                .Include(s => s.Prescription)
                .Where(s => s.Pad.DoctorId == doctorId && s.PrescriptionId != null);

            if (startDate.HasValue)
                query = query.Where(s => s.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(s => s.CreatedAt <= endDate.Value);

            var slips = await query
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync(cancellationToken);

            return slips;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting used slips for doctor: {DoctorId}", doctorId);
            throw;
        }
    }

    /// <summary>
    /// Gets available (unused) slips for a pad
    /// </summary>
    public async Task<IEnumerable<PrescriptionSlip>> GetAvailableSlipsForPadAsync(
        Guid padId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var availableSlips = await _dbSet
                .Where(s => s.PadId == padId && s.PrescriptionId == null)
                .OrderBy(s => s.CreatedAt)
                .ToListAsync(cancellationToken);

            return availableSlips;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available slips for pad: {PadId}", padId);
            throw;
        }
    }

    /// <summary>
    /// Marks a slip as used
    /// </summary>
    public async Task<bool> MarkAsUsedAsync(
        Guid slipId,
        Guid prescriptionId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var slip = await _dbSet.FirstOrDefaultAsync(s => s.Id == slipId, cancellationToken);

            if (slip == null)
            {
                _logger.LogWarning("Slip not found: {SlipId}", slipId);
                return false;
            }

            if (slip.PrescriptionId != null)
            {
                _logger.LogWarning("Slip already used: {SlipId}", slipId);
                return false;
            }

            slip.MarkAsUsed(prescriptionId);
            Update(slip);

            _logger.LogInformation("Marked slip as used: {SlipId}, PrescriptionId: {PrescriptionId}",
                slipId, prescriptionId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking slip as used: {SlipId}", slipId);
            throw;
        }
    }

    /// <summary>
    /// Gets paginated slips for a doctor
    /// </summary>
    public async Task<(IEnumerable<PrescriptionSlip> Items, int TotalCount)> GetSlipsForDoctorPagedAsync(
        Guid doctorId,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var query = _dbSet
                .Include(s => s.Pad)
                .Include(s => s.Prescription)
                .Where(s => s.Pad.DoctorId == doctorId);

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(s => s.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (items, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting paginated slips for doctor: {DoctorId}", doctorId);
            throw;
        }
    }

    /// <summary>
    /// Gets slip usage statistics for a doctor
    /// </summary>
    public async Task<(int TotalSlips, int UsedSlips, int AvailableSlips)> GetSlipStatisticsForDoctorAsync(
        Guid doctorId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var slips = await _dbSet
                .Include(s => s.Pad)
                .Where(s => s.Pad.DoctorId == doctorId)
                .ToListAsync(cancellationToken);

            var totalSlips = slips.Count;
            var usedSlips = slips.Count(s => s.PrescriptionId != null);
            var availableSlips = totalSlips - usedSlips;

            _logger.LogInformation("Slip statistics for doctor {DoctorId}: Total={Total}, Used={Used}, Available={Available}",
                doctorId, totalSlips, usedSlips, availableSlips);

            return (totalSlips, usedSlips, availableSlips);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting slip statistics for doctor: {DoctorId}", doctorId);
            throw;
        }
    }
}
