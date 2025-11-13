namespace EPrescription.Domain.Entities;

/// <summary>
/// Dispensation entity - represents the act of dispensing a prescription
/// Maps to DISPENSATIONS table in Oracle
/// </summary>
public class Dispensation : BaseEntity
{
    public Guid PrescriptionId { get; private set; }
    public Guid PharmacyId { get; private set; }
    public Guid PharmacistUserId { get; private set; }
    public DateTime DispensationDate { get; private set; }
    public string Status { get; private set; } = "completed"; // completed, partial, cancelled
    public string? Notes { get; private set; }

    // Navigation properties
    public virtual Prescription Prescription { get; private set; } = null!;
    public virtual Pharmacy Pharmacy { get; private set; } = null!;
    public virtual User PharmacistUser { get; private set; } = null!;
    public virtual ICollection<DispensationItem> Items { get; private set; } = new List<DispensationItem>();

    private Dispensation() { } // EF Core

    public Dispensation(
        Guid prescriptionId,
        Guid pharmacyId,
        Guid pharmacistUserId,
        string? notes = null)
    {
        PrescriptionId = prescriptionId;
        PharmacyId = pharmacyId;
        PharmacistUserId = pharmacistUserId;
        DispensationDate = DateTime.UtcNow;
        Status = "completed";
        Notes = notes;
    }

    public void AddItem(DispensationItem item)
    {
        Items.Add(item);
        UpdateTimestamp();
    }

    public void Cancel(string reason)
    {
        Status = "cancelled";
        Notes = $"{Notes}\nCancelled: {reason}";
        UpdateTimestamp();
    }
}
