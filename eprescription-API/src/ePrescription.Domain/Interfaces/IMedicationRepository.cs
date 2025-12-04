using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Medication repository interface
/// </summary>
public interface IMedicationRepository : IRepository<Medication>
{
    Task<Medication?> GetByCodeAsync(string medicationCode, CancellationToken cancellationToken = default);
    Task<IEnumerable<Medication>> SearchByNameAsync(string searchTerm, CancellationToken cancellationToken = default);
    Task<IEnumerable<Medication>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Medication>> GetByAdministrationRouteAsync(Guid routeId, CancellationToken cancellationToken = default);
    Task<IEnumerable<DrugInteraction>> GetInteractionsAsync(Guid medicationId, CancellationToken cancellationToken = default);
    Task<bool> HasInteractionWithAsync(Guid medicationId1, Guid medicationId2, CancellationToken cancellationToken = default);
}
