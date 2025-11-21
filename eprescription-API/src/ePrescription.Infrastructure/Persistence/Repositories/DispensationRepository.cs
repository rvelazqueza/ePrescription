using Microsoft.EntityFrameworkCore;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Infrastructure.Persistence.Repositories;

public class DispensationRepository : Repository<Dispensation>, IDispensationRepository
{
    public DispensationRepository(EPrescriptionDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Dispensation>> GetByPrescriptionAsync(Guid prescriptionId, CancellationToken cancellationToken = default)
    {
        return await _context.Dispensations
            .Where(d => d.PrescriptionId == prescriptionId)
            .Include(d => d.Items)
            .OrderByDescending(d => d.DispensationDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Dispensation>> GetByPharmacyAsync(Guid pharmacyId, CancellationToken cancellationToken = default)
    {
        return await _context.Dispensations
            .Where(d => d.PharmacyId == pharmacyId)
            .Include(d => d.Items)
            .OrderByDescending(d => d.DispensationDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Dispensation>> GetByPharmacistAsync(Guid pharmacistId, CancellationToken cancellationToken = default)
    {
        return await _context.Dispensations
            .Where(d => d.PharmacistId == pharmacistId)
            .Include(d => d.Items)
            .OrderByDescending(d => d.DispensationDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Dispensation>> GetByStatusAsync(string status, CancellationToken cancellationToken = default)
    {
        return await _context.Dispensations
            .Where(d => d.Status == status)
            .Include(d => d.Items)
            .OrderByDescending(d => d.DispensationDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Dispensation>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Dispensations
            .Where(d => d.DispensationDate >= startDate && d.DispensationDate <= endDate)
            .Include(d => d.Items)
            .OrderByDescending(d => d.DispensationDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Dispensation?> GetWithDetailsAsync(Guid dispensationId, CancellationToken cancellationToken = default)
    {
        return await _context.Dispensations
            .Include(d => d.Items)
            .Include(d => d.Prescription)
            .Include(d => d.Pharmacy)
            .Include(d => d.Pharmacist)
            .FirstOrDefaultAsync(d => d.Id == dispensationId, cancellationToken);
    }

    public async Task<bool> IsPrescriptionDispensedAsync(Guid prescriptionId, CancellationToken cancellationToken = default)
    {
        return await _context.Dispensations
            .AnyAsync(d => d.PrescriptionId == prescriptionId && d.Status == "completed", cancellationToken);
    }
}
