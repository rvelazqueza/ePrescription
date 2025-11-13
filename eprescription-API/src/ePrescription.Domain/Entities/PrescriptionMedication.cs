namespace EPrescription.Domain.Entities;

/// <summary>
/// Prescription medication - links prescriptions to medications with dosage
/// Maps to PRESCRIPTION_MEDICATIONS table in Oracle
/// </summary>
public class PrescriptionMedication : BaseEntity
{
    public Guid PrescriptionId { get; private set; }
    public Guid MedicationId { get; private set; }
    public string Dosage { get; private set; } = string.Empty;
    public string Frequency { get; private set; } = string.Empty;
    public int DurationDays { get; private set; }
    public Guid AdministrationRouteId { get; private set; }
    public decimal Quantity { get; private set; }
    public string? Instructions { get; private set; }
    public bool AiSuggested { get; private set; }

    // Navigation properties
    public virtual Prescription Prescription { get; private set; } = null!;
    public virtual Medication Medication { get; private set; } = null!;
    public virtual AdministrationRoute AdministrationRoute { get; private set; } = null!;
    public virtual ICollection<DispensationItem> DispensationItems { get; private set; } = new List<DispensationItem>();

    private PrescriptionMedication() { } // EF Core

    public PrescriptionMedication(
        Guid prescriptionId,
        Guid medicationId,
        string dosage,
        string frequency,
        int durationDays,
        Guid administrationRouteId,
        decimal quantity,
        string? instructions = null,
        bool aiSuggested = false)
    {
        PrescriptionId = prescriptionId;
        MedicationId = medicationId;
        Dosage = dosage;
        Frequency = frequency;
        DurationDays = durationDays;
        AdministrationRouteId = administrationRouteId;
        Quantity = quantity;
        Instructions = instructions;
        AiSuggested = aiSuggested;
    }

    public void UpdateDosage(string dosage, string frequency, int durationDays, string? instructions = null)
    {
        Dosage = dosage;
        Frequency = frequency;
        DurationDays = durationDays;
        if (instructions != null) Instructions = instructions;
        UpdateTimestamp();
    }
}
