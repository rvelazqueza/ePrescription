using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EPrescription.Infrastructure.Persistence.Repositories;

public class PrescriptionRepository : Repository<Prescription>, IPrescriptionRepository
{
    public PrescriptionRepository(EPrescriptionDbContext context) : base(context)
    {
    }

    public override async Task<Prescription?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Prescriptions
            .Include(p => p.Medications)
            .Include(p => p.Diagnoses)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    Task<Prescription> IPrescriptionRepository.AddAsync(Prescription prescription, CancellationToken cancellationToken)
    {
        return base.AddAsync(prescription, cancellationToken);
    }

    Task IPrescriptionRepository.UpdateAsync(Prescription prescription, CancellationToken cancellationToken)
    {
        base.Update(prescription);
        return Task.CompletedTask;
    }

    Task IPrescriptionRepository.DeleteAsync(Prescription prescription, CancellationToken cancellationToken)
    {
        base.Remove(prescription);
        return Task.CompletedTask;
    }
}
