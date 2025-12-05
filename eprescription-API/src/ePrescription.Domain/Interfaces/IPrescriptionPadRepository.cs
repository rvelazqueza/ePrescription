using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Repository interface for PrescriptionPad entity
/// Handles data access for prescription pads assigned to doctors
/// </summary>
public interface IPrescriptionPadRepository : IRepository<PrescriptionPad>
{
    /// <summary>
    /// Gets available pads for a specific doctor
    /// </summary>
    Task<IEnumerable<PrescriptionPad>> GetAvailablePadsForDoctorAsync(
        Guid doctorId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets pads by doctor and pad type
    /// </summary>
    Task<IEnumerable<PrescriptionPad>> GetPadsByDoctorAndTypeAsync(
        Guid doctorId,
        Guid padTypeId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets pads expiring soon (within specified days)
    /// </summary>
    Task<IEnumerable<PrescriptionPad>> GetExpiringPadsAsync(
        int daysUntilExpiration = 30,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets pads with low availability (below threshold)
    /// </summary>
    Task<IEnumerable<PrescriptionPad>> GetLowAvailabilityPadsAsync(
        int threshold = 10,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Decrements available count for a pad
    /// </summary>
    Task<bool> DecrementAvailableCountAsync(
        Guid padId,
        int quantity = 1,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated pads for a doctor
    /// </summary>
    Task<(IEnumerable<PrescriptionPad> Items, int TotalCount)> GetPadsForDoctorPagedAsync(
        Guid doctorId,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);
}
