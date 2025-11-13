namespace EPrescription.Domain.Entities;

/// <summary>
/// Patient allergy information (4NF normalization)
/// Maps to PATIENT_ALLERGIES table in Oracle
/// </summary>
public class PatientAllergy : BaseEntity
{
    public Guid PatientId { get; private set; }
    public string AllergenType { get; private set; } = string.Empty;
    public string AllergenName { get; private set; } = string.Empty;
    public string Severity { get; private set; } = string.Empty; // mild, moderate, severe
    public string? Notes { get; private set; }

    // Navigation property
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

    public void UpdateSeverity(string severity, string? notes = null)
    {
        Severity = severity;
        if (notes != null) Notes = notes;
        UpdateTimestamp();
    }
}
