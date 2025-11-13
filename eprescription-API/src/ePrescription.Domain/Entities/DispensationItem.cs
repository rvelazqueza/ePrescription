namespace EPrescription.Domain.Entities;

/// <summary>
/// Dispensation item - individual medication dispensed
/// Maps to DISPENSATION_ITEMS table in Oracle
/// </summary>
public class DispensationItem : BaseEntity
{
    public Guid DispensationId { get; private set; }
    public Guid MedicationId { get; private set; }
    public int QuantityDispensed { get; private set; }
    public string? BatchNumber { get; private set; }

    // Navigation properties
    public virtual Dispensation Dispensation { get; private set; } = null!;
    public virtual Medication Medication { get; private set; } = null!;

    private DispensationItem() { } // EF Core

    public DispensationItem(
        Guid dispensationId,
        Guid medicationId,
        int quantityDispensed,
        string? batchNumber = null)
    {
        DispensationId = dispensationId;
        MedicationId = medicationId;
        QuantityDispensed = quantityDispensed;
        BatchNumber = batchNumber;
    }
}
