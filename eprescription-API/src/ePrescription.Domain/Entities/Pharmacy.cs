namespace EPrescription.Domain.Entities;

/// <summary>
/// Pharmacy entity - represents a pharmacy in the system
/// Maps to PHARMACIES table in Oracle
/// </summary>
public class Pharmacy : BaseEntity
{
    public string PharmacyName { get; private set; } = string.Empty;
    public string LicenseNumber { get; private set; } = string.Empty;
    public Guid AddressId { get; private set; }
    public string Phone { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string? OperatingHours { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual Address Address { get; private set; } = null!;
    public virtual ICollection<Inventory> Inventory { get; private set; } = new List<Inventory>();
    public virtual ICollection<Dispensation> Dispensations { get; private set; } = new List<Dispensation>();

    private Pharmacy() { } // EF Core

    public Pharmacy(
        string pharmacyName,
        string licenseNumber,
        Guid addressId,
        string phone,
        string email,
        string? operatingHours = null)
    {
        PharmacyName = pharmacyName;
        LicenseNumber = licenseNumber;
        AddressId = addressId;
        Phone = phone;
        Email = email;
        OperatingHours = operatingHours;
        IsActive = true;
    }

    public void UpdateContactInfo(string phone, string email, string? operatingHours = null)
    {
        Phone = phone;
        Email = email;
        if (operatingHours != null) OperatingHours = operatingHours;
        UpdateTimestamp();
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
