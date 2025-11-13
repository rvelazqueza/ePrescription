using Microsoft.EntityFrameworkCore;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Infrastructure.Persistence.Repositories;

public class DoctorRepository : Repository<Doctor>, IDoctorRepository
{
    public DoctorRepository(EPrescriptionDbContext context) : base(context) { }

    public async Task<Doctor?> GetByIdentificationNumberAsync(string identificationNumber, CancellationToken cancellationToken = default)
        => await _dbSet.FirstOrDefaultAsync(d => d.IdentificationNumber == identificationNumber, cancellationToken);

    public async Task<Doctor?> GetByLicenseNumberAsync(string licenseNumber, CancellationToken cancellationToken = default)
        => await _dbSet.FirstOrDefaultAsync(d => d.MedicalLicenseNumber == licenseNumber, cancellationToken);

    public async Task<IEnumerable<Doctor>> GetBySpecialtyAsync(Guid specialtyId, CancellationToken cancellationToken = default)
        => await _dbSet.Where(d => d.SpecialtyId == specialtyId).ToListAsync(cancellationToken);

    public async Task<IEnumerable<Doctor>> GetByMedicalCenterAsync(Guid medicalCenterId, CancellationToken cancellationToken = default)
        => await _dbSet.Include(d => d.MedicalCenters).Where(d => d.MedicalCenters.Any(mc => mc.MedicalCenterId == medicalCenterId)).ToListAsync(cancellationToken);

    public async Task<IEnumerable<Doctor>> GetActiveAsync(CancellationToken cancellationToken = default)
        => await _dbSet.Where(d => d.IsActive).ToListAsync(cancellationToken);

    public async Task<IEnumerable<Doctor>> SearchByNameAsync(string searchTerm, CancellationToken cancellationToken = default)
        => await _dbSet.Where(d => d.FirstName.Contains(searchTerm) || d.LastName.Contains(searchTerm)).ToListAsync(cancellationToken);

    public async Task<Doctor?> GetWithDetailsAsync(Guid doctorId, CancellationToken cancellationToken = default)
        => await _dbSet.Include(d => d.Specialty).Include(d => d.MedicalCenters).FirstOrDefaultAsync(d => d.Id == doctorId, cancellationToken);
}
