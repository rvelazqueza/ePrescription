using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Patient repository interface with specific queries
/// </summary>
public interface IPatientRepository : IRepository<Patient>
{
    /// <summary>
    /// Gets a patient by identification number (cédula, DIMEX, passport)
    /// </summary>
    Task<Patient?> GetByIdentificationNumberAsync(
        string identificationNumber,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches patients by name (first name or last name)
    /// </summary>
    Task<IEnumerable<Patient>> SearchByNameAsync(
        string searchTerm,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets patient with all related data (contacts, allergies)
    /// </summary>
    Task<Patient?> GetWithDetailsAsync(
        Guid patientId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets patients with allergies to specific allergen
    /// </summary>
    Task<IEnumerable<Patient>> GetPatientsWithAllergyAsync(
        string allergenName,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets patient's prescription history
    /// </summary>
    Task<IEnumerable<Prescription>> GetPrescriptionHistoryAsync(
        Guid patientId,
        DateTime? startDate = null,
        DateTime? endDate = null,
        CancellationToken cancellationToken = default);
}
