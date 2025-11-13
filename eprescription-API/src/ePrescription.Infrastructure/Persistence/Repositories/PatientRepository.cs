using Microsoft.EntityFrameworkCore;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Infrastructure.Persistence.Repositories;

public class PatientRepository : Repository<Patient>, IPatientRepository
{
    public PatientRepository(EPrescriptionDbContext context) : base(context)
    {
    }

    public async Task<Patient?> GetByIdentificationNumberAsync(
        string identificationNumber,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(p => p.IdentificationNumber == identificationNumber, cancellationToken);
    }

    public async Task<IEnumerable<Patient>> SearchByNameAsync(
        string searchTerm,
        CancellationToken cancellationToken = default)
    {
        var lowerSearch = searchTerm.ToLower();
        return await _dbSet
            .Where(p => p.FirstName.ToLower().Contains(lowerSearch) ||
                       p.LastName.ToLower().Contains(lowerSearch))
            .ToListAsync(cancellationToken);
    }

    public async Task<Patient?> GetWithDetailsAsync(
        Guid patientId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Contacts)
            .Include(p => p.Allergies)
            .FirstOrDefaultAsync(p => p.Id == patientId, cancellationToken);
    }

    public async Task<IEnumerable<Patient>> GetPatientsWithAllergyAsync(
        string allergenName,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.Allergies)
            .Where(p => p.Allergies.Any(a => a.AllergenName.Contains(allergenName)))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Prescription>> GetPrescriptionHistoryAsync(
        Guid patientId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Prescriptions
            .Where(p => p.PatientId == patientId);

        if (startDate.HasValue)
            query = query.Where(p => p.PrescriptionDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(p => p.PrescriptionDate <= endDate.Value);

        return await query
            .OrderByDescending(p => p.PrescriptionDate)
            .ToListAsync(cancellationToken);
    }
}
