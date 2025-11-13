namespace EPrescription.Domain.Entities;

/// <summary>
/// Patient entity - represents a patient in the system
/// Maps to PATIENTS table in Oracle
/// </summary>
public class Patient : BaseEntity
{
    public string IdentificationNumber { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public DateTime DateOfBirth { get; private set; }
    public string Gender { get; private set; } = string.Empty;
    public string? BloodType { get; private set; }

    // Navigation properties
    public virtual ICollection<PatientContact> Contacts { get; private set; } = new List<PatientContact>();
    public virtual ICollection<PatientAllergy> Allergies { get; private set; } = new List<PatientAllergy>();
    public virtual ICollection<Prescription> Prescriptions { get; private set; } = new List<Prescription>();

    private Patient() { } // EF Core

    public Patient(
        string identificationNumber,
        string firstName,
        string lastName,
        DateTime dateOfBirth,
        string gender,
        string? bloodType = null)
    {
        IdentificationNumber = identificationNumber;
        FirstName = firstName;
        LastName = lastName;
        DateOfBirth = dateOfBirth;
        Gender = gender;
        BloodType = bloodType;
    }

    public void UpdatePersonalInfo(string firstName, string lastName, string? bloodType)
    {
        FirstName = firstName;
        LastName = lastName;
        BloodType = bloodType;
        UpdateTimestamp();
    }

    public void AddContact(PatientContact contact)
    {
        Contacts.Add(contact);
        UpdateTimestamp();
    }

    public void AddAllergy(PatientAllergy allergy)
    {
        Allergies.Add(allergy);
        UpdateTimestamp();
    }
}
