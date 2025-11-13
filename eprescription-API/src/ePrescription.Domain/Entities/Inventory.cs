namespace EPrescription.Domain.Entities;

/// <summary>
/// Inventory entity - represents medication stock in a pharmacy
/// Maps to INVENTORY table in Oracle
/// </summary>
public class Inventory : BaseEntity
{
    public Guid PharmacyId { get; private set; }
    public Guid MedicationId { get; private set; }
    public int QuantityAvailable { get; private set; }
    public int MinimumStock { get; private set; }
    public string? BatchNumber { get; private set; }
    public DateTime? ExpirationDate { get; private set; }

    // Navigation properties
    public virtual Pharmacy Pharmacy { get; private set; } = null!;
    public virtual Medication Medication { get; private set; } = null!;

    private Inventory() { } // EF Core

    public Inventory(
        Guid pharmacyId,
        Guid medicationId,
        int quantityAvailable,
        int minimumStock,
        string? batchNumber = null,
        DateTime? expirationDate = null)
    {
        PharmacyId = pharmacyId;
        MedicationId = medicationId;
        QuantityAvailable = quantityAvailable;
        MinimumStock = minimumStock;
        BatchNumber = batchNumber;
        ExpirationDate = expirationDate;
    }

    public void AddStock(int quantity)
    {
        QuantityAvailable += quantity;
        UpdateTimestamp();
    }

    public void ReduceStock(int quantity)
    {
        if (quantity > QuantityAvailable)
            throw new InvalidOperationException("Insufficient stock");
        
        QuantityAvailable -= quantity;
        UpdateTimestamp();
    }

    public bool IsLowStock() => QuantityAvailable <= MinimumStock;
}
