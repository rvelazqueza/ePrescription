namespace EPrescription.Domain.Entities;

/// <summary>
/// Prescription medication - links prescriptions to medications with dosage
/// Maps to PRESCRIPTION_MEDICATIONS table in Oracle
/// </summary>
public class PrescriptionMedication : BaseEntity
{
    public Guid PrescriptionId { get; private set; }
    public Guid MedicationId { get; private set; }
    public Guid RouteId { get; private set; }
    public string Dosage { get; private set; } = string.Empty;
    public string Frequency { get; private set; } = string.Empty;
    public int DurationDays { get; private set; }
    public int Quantity { get; private set; }
    public string? Instructions { get; private set; }

    // Navigation properties
    public virtual Prescription Prescription { get; private set; } = null!;
    public virtual Medication Medication { get; private set; } = null!;
    public virtual AdministrationRoute Route { get; private set; } = null!;

    private PrescriptionMedication() { } // EF Core

    public PrescriptionMedication(
        Guid prescriptionId,
        Guid medicationId,
        Guid routeId,
        string dosage,
        string frequency,
        int durationDays,
        int quantity,
        string? instructions = null)
    {
        PrescriptionId = prescriptionId;
        MedicationId = medicationId;
        RouteId = routeId;
        Dosage = dosage;
        Frequency = frequency;
        DurationDays = durationDays;
        Quantity = quantity;
        Instructions = instructions;
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
