namespace EPrescription.Domain.Entities;

/// <summary>
/// Inventory entity - represents medication stock in a pharmacy
/// Maps to INVENTORY table in Oracle
/// </summary>
public class Inventory : BaseEntity
{
    public Guid PharmacyId { get; private set; }
    public Guid MedicationId { get; private set; }
    public string BatchNumber { get; private set; } = string.Empty;
    public decimal QuantityAvailable { get; private set; }
    public DateTime ExpirationDate { get; private set; }
    public decimal? UnitCost { get; private set; }

    // Navigation properties
    public virtual Pharmacy Pharmacy { get; private set; } = null!;
    public virtual Medication Medication { get; private set; } = null!;
    public virtual ICollection<DispensationItem> DispensationItems { get; private set; } = new List<DispensationItem>();

    private Inventory() { } // EF Core

    public Inventory(
        Guid pharmacyId,
        Guid medicationId,
        string batchNumber,
        decimal quantityAvailable,
        DateTime expirationDate,
        decimal? unitCost = null)
    {
        PharmacyId = pharmacyId;
        MedicationId = medicationId;
        BatchNumber = batchNumber;
        QuantityAvailable = quantityAvailable;
        ExpirationDate = expirationDate;
        UnitCost = unitCost;
    }

    public void AddStock(decimal quantity)
    {
        QuantityAvailable += quantity;
        UpdateTimestamp();
    }

    public void ReduceStock(decimal quantity)
    {
        if (quantity > QuantityAvailable)
            throw new InvalidOperationException("Insufficient stock");
        
        QuantityAvailable -= quantity;
        UpdateTimestamp();
    }
}
