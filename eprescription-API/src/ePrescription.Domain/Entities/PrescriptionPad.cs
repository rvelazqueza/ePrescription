namespace EPrescription.Domain.Entities;

/// <summary>
/// PrescriptionPad entity - represents a prescription pad (talonario) assigned to a doctor
/// Maps to PRESCRIPTION_PADS table in Oracle
/// </summary>
public class PrescriptionPad : BaseEntity
{
    public Guid DoctorId { get; private set; }
    public Guid PadTypeId { get; private set; }
    public string PadNumber { get; private set; } = string.Empty;
    public int AvailableCount { get; private set; }
    public int TotalCount { get; private set; }
    public DateTime ExpirationDate { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual Doctor? Doctor { get; private set; }
    public virtual PrescriptionPadType? PadType { get; private set; }
    public virtual ICollection<PrescriptionSlip> PrescriptionSlips { get; private set; } = new List<PrescriptionSlip>();

    private PrescriptionPad() { } // EF Core

    public PrescriptionPad(
        Guid doctorId,
        Guid padTypeId,
        string padNumber,
        int totalCount,
        DateTime expirationDate)
    {
        DoctorId = doctorId;
        PadTypeId = padTypeId;
        PadNumber = padNumber;
        TotalCount = totalCount;
        AvailableCount = totalCount;
        ExpirationDate = expirationDate;
        IsActive = true;
    }

    /// <summary>
    /// Decrement available count when a prescription is issued
    /// </summary>
    public void DecrementAvailableCount()
    {
        if (AvailableCount > 0)
        {
            AvailableCount--;
            UpdateTimestamp();
        }
    }

    /// <summary>
    /// Check if pad has available prescriptions
    /// </summary>
    public bool HasAvailable()
    {
        return AvailableCount > 0 && DateTime.UtcNow <= ExpirationDate && IsActive;
    }

    /// <summary>
    /// Check if pad is expired
    /// </summary>
    public bool IsExpired()
    {
        return DateTime.UtcNow > ExpirationDate;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
