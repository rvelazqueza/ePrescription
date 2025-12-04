namespace EPrescription.Domain.Entities;

/// <summary>
/// Dispensation item - individual medication dispensed
/// Maps to DISPENSATION_ITEMS table in Oracle
/// </summary>
public class DispensationItem : BaseEntity
{
    public Guid DispensationId { get; private set; }
    public Guid PrescriptionMedicationId { get; private set; }
    public Guid InventoryId { get; private set; }
    public decimal QuantityDispensed { get; private set; }
    public string? BatchNumber { get; private set; }
    public DateTime? ExpirationDate { get; private set; }

    // Navigation properties
    public virtual Dispensation Dispensation { get; private set; } = null!;
    public virtual PrescriptionMedication PrescriptionMedication { get; private set; } = null!;
    public virtual Inventory Inventory { get; private set; } = null!;

    private DispensationItem() { } // EF Core

    public DispensationItem(
        Guid dispensationId,
        Guid prescriptionMedicationId,
        Guid inventoryId,
        decimal quantityDispensed,
        string? batchNumber = null,
        DateTime? expirationDate = null)
    {
        DispensationId = dispensationId;
        PrescriptionMedicationId = prescriptionMedicationId;
        InventoryId = inventoryId;
        QuantityDispensed = quantityDispensed;
        BatchNumber = batchNumber;
        ExpirationDate = expirationDate;
    }
}
