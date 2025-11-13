namespace EPrescription.Domain.Entities;

/// <summary>
/// Patient contact information (4NF normalization)
/// Maps to PATIENT_CONTACTS table in Oracle
/// </summary>
public class PatientContact : BaseEntity
{
    public Guid PatientId { get; private set; }
    public string ContactType { get; private set; } = string.Empty; // email, phone, address
    public string ContactValue { get; private set; } = string.Empty;
    public bool IsPrimary { get; private set; }

    // Navigation property
    public virtual Patient Patient { get; private set; } = null!;

    private PatientContact() { } // EF Core

    public PatientContact(Guid patientId, string contactType, string contactValue, bool isPrimary = false)
    {
        PatientId = patientId;
        ContactType = contactType;
        ContactValue = contactValue;
        IsPrimary = isPrimary;
    }

    public void SetAsPrimary()
    {
        IsPrimary = true;
        UpdateTimestamp();
    }
}
