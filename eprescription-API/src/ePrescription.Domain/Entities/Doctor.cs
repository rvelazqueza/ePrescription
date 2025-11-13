namespace EPrescription.Domain.Entities;

/// <summary>
/// Doctor entity - represents a medical doctor in the system
/// Maps to DOCTORS table in Oracle
/// </summary>
public class Doctor : BaseEntity
{
    public string IdentificationNumber { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string MedicalLicenseNumber { get; private set; } = string.Empty;
    public Guid SpecialtyId { get; private set; }
    public string Email { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual Specialty Specialty { get; private set; } = null!;
    public virtual ICollection<DoctorMedicalCenter> MedicalCenters { get; private set; } = new List<DoctorMedicalCenter>();
    public virtual ICollection<Prescription> Prescriptions { get; private set; } = new List<Prescription>();

    private Doctor() { } // EF Core

    public Doctor(
        string identificationNumber,
        string firstName,
        string lastName,
        string medicalLicenseNumber,
        Guid specialtyId,
        string email,
        string phone)
    {
        IdentificationNumber = identificationNumber;
        FirstName = firstName;
        LastName = lastName;
        MedicalLicenseNumber = medicalLicenseNumber;
        SpecialtyId = specialtyId;
        Email = email;
        Phone = phone;
        IsActive = true;
    }

    public void UpdateContactInfo(string email, string phone)
    {
        Email = email;
        Phone = phone;
        UpdateTimestamp();
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }

    public void Activate()
    {
        IsActive = true;
        UpdateTimestamp();
    }
}
