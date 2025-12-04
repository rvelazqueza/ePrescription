using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Repository interface for PrescriptionSlip entity
/// Handles data access for prescription slips (boletas)
/// </summary>
public interface IPrescriptionSlipRepository : IRepository<PrescriptionSlip>
{
    /// <summary>
    /// Gets slips for a specific prescription
    /// </summary>
    Task<IEnumerable<PrescriptionSlip>> GetSlipsForPrescriptionAsync(
        Guid prescriptionId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets slips for a specific pad
    /// </summary>
    Task<IEnumerable<PrescriptionSlip>> GetSlipsForPadAsync(
        Guid padId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets used slips for a doctor
    /// </summary>
    Task<IEnumerable<PrescriptionSlip>> GetUsedSlipsForDoctorAsync(
        Guid doctorId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets available (unused) slips for a pad
    /// </summary>
    Task<IEnumerable<PrescriptionSlip>> GetAvailableSlipsForPadAsync(
        Guid padId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks a slip as used
    /// </summary>
    Task<bool> MarkAsUsedAsync(
        Guid slipId,
        Guid prescriptionId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets paginated slips for a doctor
    /// </summary>
    Task<(IEnumerable<PrescriptionSlip> Items, int TotalCount)> GetSlipsForDoctorPagedAsync(
        Guid doctorId,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets slip usage statistics for a doctor
    /// </summary>
    Task<(int TotalSlips, int UsedSlips, int AvailableSlips)> GetSlipStatisticsForDoctorAsync(
        Guid doctorId,
        CancellationToken cancellationToken = default);
}
