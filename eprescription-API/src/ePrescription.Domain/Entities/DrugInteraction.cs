namespace EPrescription.Domain.Entities;

/// <summary>
/// Drug interaction - defines interactions between two medications
/// Maps to DRUG_INTERACTIONS table in Oracle
/// </summary>
public class DrugInteraction : BaseEntity
{
    public Guid FirstMedicationId { get; private set; }
    public Guid SecondMedicationId { get; private set; }
    public string SeverityLevel { get; private set; } = string.Empty; // mild, moderate, severe
    public string InteractionType { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string? ClinicalEffects { get; private set; }
    public string? Recommendations { get; private set; }

    // Navigation properties
    public virtual Medication FirstMedication { get; private set; } = null!;
    public virtual Medication SecondMedication { get; private set; } = null!;

    private DrugInteraction() { } // EF Core

    public DrugInteraction(
        Guid firstMedicationId,
        Guid secondMedicationId,
        string severityLevel,
        string interactionType,
        string description,
        string? clinicalEffects = null,
        string? recommendations = null)
    {
        FirstMedicationId = firstMedicationId;
        SecondMedicationId = secondMedicationId;
        SeverityLevel = severityLevel;
        InteractionType = interactionType;
        Description = description;
        ClinicalEffects = clinicalEffects;
        Recommendations = recommendations;
    }

    public void UpdateSeverity(string severityLevel, string? recommendations = null)
    {
        SeverityLevel = severityLevel;
        if (recommendations != null) Recommendations = recommendations;
        UpdateTimestamp();
    }
}
