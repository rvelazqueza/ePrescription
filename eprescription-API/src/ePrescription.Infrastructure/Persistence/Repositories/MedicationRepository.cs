using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using EPrescription.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EPrescription.Infrastructure.Persistence.Repositories;

/// <summary>
/// Medication repository implementation
/// </summary>
public class MedicationRepository : Repository<Medication>, IMedicationRepository
{
    private readonly EPrescriptionDbContext _context;

    public MedicationRepository(EPrescriptionDbContext context) : base(context)
    {
        _context = context;
    }

    /// <summary>
    /// Gets a medication by its code
    /// </summary>
    public async Task<Medication?> GetByCodeAsync(string medicationCode, CancellationToken cancellationToken = default)
    {
        return await _context.Medications
            .Include(m => m.AdministrationRoute)
            .Include(m => m.PadType)
            .FirstOrDefaultAsync(m => m.MedicationCode == medicationCode && m.IsActive, cancellationToken);
    }

    /// <summary>
    /// Searches medications by name (commercial or generic)
    /// </summary>
    public async Task<IEnumerable<Medication>> SearchByNameAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        var lowerSearchTerm = searchTerm.ToLowerInvariant();
        return await _context.Medications
            .Include(m => m.AdministrationRoute)
            .Include(m => m.PadType)
            .Where(m => m.IsActive && 
                   (m.CommercialName.ToLower().Contains(lowerSearchTerm) || 
                    m.GenericName.ToLower().Contains(lowerSearchTerm)))
            .OrderBy(m => m.CommercialName)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets all active medications
    /// </summary>
    public async Task<IEnumerable<Medication>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Medications
            .Include(m => m.AdministrationRoute)
            .Include(m => m.PadType)
            .Where(m => m.IsActive)
            .OrderBy(m => m.CommercialName)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets medications by administration route
    /// </summary>
    public async Task<IEnumerable<Medication>> GetByAdministrationRouteAsync(Guid routeId, CancellationToken cancellationToken = default)
    {
        return await _context.Medications
            .Include(m => m.AdministrationRoute)
            .Include(m => m.PadType)
            .Where(m => m.IsActive && m.AdministrationRouteId == routeId)
            .OrderBy(m => m.CommercialName)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets drug interactions for a medication
    /// </summary>
    public async Task<IEnumerable<DrugInteraction>> GetInteractionsAsync(Guid medicationId, CancellationToken cancellationToken = default)
    {
        return await _context.DrugInteractions
            .Where(di => di.MedicationId1 == medicationId || di.MedicationId2 == medicationId)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Checks if two medications have an interaction
    /// </summary>
    public async Task<bool> HasInteractionWithAsync(Guid medicationId1, Guid medicationId2, CancellationToken cancellationToken = default)
    {
        return await _context.DrugInteractions
            .AnyAsync(di => 
                (di.MedicationId1 == medicationId1 && di.MedicationId2 == medicationId2) ||
                (di.MedicationId1 == medicationId2 && di.MedicationId2 == medicationId1),
                cancellationToken);
    }
}
