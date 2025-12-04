namespace EPrescription.Domain.Entities;

/// <summary>
/// Dispensation entity - represents the act of dispensing a prescription
/// Maps to DISPENSATIONS table in Oracle
/// </summary>
public class Dispensation : BaseEntity
{
    public Guid PrescriptionId { get; private set; }
    public Guid PharmacyId { get; private set; }
    public Guid? PharmacistId { get; private set; }
    public DateTime DispensationDate { get; private set; }
    public string Status { get; private set; } = "pending"; // pending, verified, completed, rejected
    public string? Notes { get; private set; }

    // Navigation properties
    public virtual Prescription Prescription { get; private set; } = null!;
    public virtual Pharmacy Pharmacy { get; private set; } = null!;
    public virtual User? Pharmacist { get; private set; }
    public virtual ICollection<DispensationItem> Items { get; private set; } = new List<DispensationItem>();

    private Dispensation() { } // EF Core

    public Dispensation(
        Guid prescriptionId,
        Guid pharmacyId,
        Guid? pharmacistId = null,
        string? notes = null)
    {
        PrescriptionId = prescriptionId;
        PharmacyId = pharmacyId;
        PharmacistId = pharmacistId;
        DispensationDate = DateTime.UtcNow;
        Status = "pending";
        Notes = notes;
    }
    
    public void Verify(string? notes = null)
    {
        Status = "verified";
        if (!string.IsNullOrEmpty(notes))
            Notes = $"{Notes}\n{notes}";
        UpdateTimestamp();
    }
    
    public void Complete(string? notes = null)
    {
        Status = "completed";
        if (!string.IsNullOrEmpty(notes))
            Notes = $"{Notes}\n{notes}";
        UpdateTimestamp();
    }
    
    public void Reject(string reason)
    {
        Status = "rejected";
        Notes = $"{Notes}\nRejected: {reason}";
        UpdateTimestamp();
    }

    public void AddItem(DispensationItem item)
    {
        Items.Add(item);
        UpdateTimestamp();
    }


}
