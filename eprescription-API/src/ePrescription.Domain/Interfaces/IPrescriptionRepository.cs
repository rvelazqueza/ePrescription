using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

public interface IPrescriptionRepository
{
    Task<Prescription?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Prescription> AddAsync(Prescription prescription, CancellationToken cancellationToken = default);
    Task UpdateAsync(Prescription prescription, CancellationToken cancellationToken = default);
    Task DeleteAsync(Prescription prescription, CancellationToken cancellationToken = default);
}
