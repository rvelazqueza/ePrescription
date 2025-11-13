using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Doctor repository interface with specific queries
/// </summary>
public interface IDoctorRepository : IRepository<Doctor>
{
    /// <summary>
    /// Gets a doctor by identification number
    /// </summary>
    Task<Doctor?> GetByIdentificationNumberAsync(
        string identificationNumber,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a doctor by medical license number
    /// </summary>
    Task<Doctor?> GetByLicenseNumberAsync(
        string licenseNumber,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets doctors by specialty
    /// </summary>
    Task<IEnumerable<Doctor>> GetBySpecialtyAsync(
        Guid specialtyId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets doctors assigned to a medical center
    /// </summary>
    Task<IEnumerable<Doctor>> GetByMedicalCenterAsync(
        Guid medicalCenterId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active doctors only
    /// </summary>
    Task<IEnumerable<Doctor>> GetActiveAsync(
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches doctors by name
    /// </summary>
    Task<IEnumerable<Doctor>> SearchByNameAsync(
        string searchTerm,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets doctor with specialty and medical center assignments
    /// </summary>
    Task<Doctor?> GetWithDetailsAsync(
        Guid doctorId,
        CancellationToken cancellationToken = default);
}
