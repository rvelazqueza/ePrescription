namespace EPrescription.Domain.Entities;

/// <summary>
/// Medical center entity
/// Maps to MEDICAL_CENTERS table in Oracle
/// </summary>
public class MedicalCenter : BaseEntity
{
    public string CenterName { get; private set; } = string.Empty;
    public string CenterType { get; private set; } = string.Empty; // hospital, clinic, etc.
    public Guid AddressId { get; private set; }
    public string Phone { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual Address Address { get; private set; } = null!;
    public virtual ICollection<DoctorMedicalCenter> Doctors { get; private set; } = new List<DoctorMedicalCenter>();

    private MedicalCenter() { } // EF Core

    public MedicalCenter(
        string centerName,
        string centerType,
        Guid addressId,
        string phone,
        string email)
    {
        CenterName = centerName;
        CenterType = centerType;
        AddressId = addressId;
        Phone = phone;
        Email = email;
        IsActive = true;
    }

    public void UpdateContactInfo(string phone, string email)
    {
        Phone = phone;
        Email = email;
        UpdateTimestamp();
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
