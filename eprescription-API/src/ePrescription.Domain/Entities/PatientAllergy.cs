namespace EPrescription.Domain.Entities;

/// <summary>
/// PatientAllergy entity - represents a patient allergy or contraindication
/// Maps to PATIENT_ALLERGIES table in Oracle
/// </summary>
public class PatientAllergy : BaseEntity
{
    public Guid PatientId { get; private set; }
    public string AllergenType { get; private set; } = string.Empty; // medication, food, environmental, other
    public string AllergenName { get; private set; } = string.Empty;
    public string Severity { get; private set; } = string.Empty; // mild, moderate, severe, life-threatening
    public string? Notes { get; private set; }

    // Navigation properties
    public virtual Patient Patient { get; private set; } = null!;

    private PatientAllergy() { } // EF Core

    public PatientAllergy(
        Guid patientId,
        string allergenType,
        string allergenName,
        string severity,
        string? notes = null)
    {
        PatientId = patientId;
        AllergenType = allergenType;
        AllergenName = allergenName;
        Severity = severity;
        Notes = notes;
    }

    public void UpdateAllergy(string allergenName, string severity, string? notes)
    {
        AllergenName = allergenName;
        Severity = severity;
        Notes = notes;
        UpdateTimestamp();
    }
}
