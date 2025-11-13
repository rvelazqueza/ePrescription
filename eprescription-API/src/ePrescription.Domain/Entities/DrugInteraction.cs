namespace EPrescription.Domain.Entities;

/// <summary>
/// Drug interaction - defines interactions between two medications
/// Maps to DRUG_INTERACTIONS table in Oracle
/// </summary>
public class DrugInteraction : BaseEntity
{
    public Guid MedicationId1 { get; private set; }
    public Guid MedicationId2 { get; private set; }
    public string InteractionSeverity { get; private set; } = string.Empty; // mild, moderate, severe
    public string InteractionDescription { get; private set; } = string.Empty;
    public string? ClinicalEffects { get; private set; }

    // Navigation properties
    public virtual Medication Medication1 { get; private set; } = null!;
    public virtual Medication Medication2 { get; private set; } = null!;

    private DrugInteraction() { } // EF Core

    public DrugInteraction(
        Guid medicationId1,
        Guid medicationId2,
        string interactionSeverity,
        string interactionDescription,
        string? clinicalEffects = null)
    {
        // Ensure MedicationId1 < MedicationId2 to avoid duplicates
        if (medicationId1.CompareTo(medicationId2) < 0)
        {
            MedicationId1 = medicationId1;
            MedicationId2 = medicationId2;
        }
        else
        {
            MedicationId1 = medicationId2;
            MedicationId2 = medicationId1;
        }
        
        InteractionSeverity = interactionSeverity;
        InteractionDescription = interactionDescription;
        ClinicalEffects = clinicalEffects;
    }

    public void UpdateSeverity(string interactionSeverity, string? clinicalEffects = null)
    {
        InteractionSeverity = interactionSeverity;
        if (clinicalEffects != null) ClinicalEffects = clinicalEffects;
        UpdateTimestamp();
    }
}
