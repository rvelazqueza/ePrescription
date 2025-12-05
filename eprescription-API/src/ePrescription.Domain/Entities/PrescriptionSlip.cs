namespace EPrescription.Domain.Entities;

/// <summary>
/// PrescriptionSlip entity - represents an individual slip/boleta from a prescription pad
/// Maps to PRESCRIPTION_SLIPS table in Oracle
/// </summary>
public class PrescriptionSlip : BaseEntity
{
    public Guid PrescriptionPadId { get; private set; }
    public int SlipNumber { get; private set; }
    public string Status { get; private set; } = "available"; // available, used, cancelled
    public Guid? UsedByPrescriptionId { get; private set; }
    public DateTime? UsedAt { get; private set; }

    // Navigation properties
    public virtual PrescriptionPad? PrescriptionPad { get; private set; }
    public virtual Prescription? UsedByPrescription { get; private set; }

    private PrescriptionSlip() { } // EF Core

    public PrescriptionSlip(
        Guid prescriptionPadId,
        int slipNumber)
    {
        PrescriptionPadId = prescriptionPadId;
        SlipNumber = slipNumber;
        Status = "available";
    }

    /// <summary>
    /// Mark slip as used by a prescription
    /// </summary>
    public void MarkAsUsed(Guid prescriptionId)
    {
        if (Status != "available")
        {
            throw new InvalidOperationException($"Slip {SlipNumber} is not available. Current status: {Status}");
        }

        UsedByPrescriptionId = prescriptionId;
        UsedAt = DateTime.UtcNow;
        Status = "used";
        UpdateTimestamp();
    }

    /// <summary>
    /// Cancel the slip
    /// </summary>
    public void Cancel()
    {
        Status = "cancelled";
        UpdateTimestamp();
    }

    /// <summary>
    /// Check if slip is available
    /// </summary>
    public bool IsAvailable()
    {
        return Status == "available";
    }
}
