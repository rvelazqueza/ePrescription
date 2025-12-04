namespace EPrescription.Domain.Entities;

/// <summary>
/// PrescriptionPadType entity - represents a type of prescription pad (talonario)
/// Maps to PRESCRIPTION_PAD_TYPES table in Oracle
/// Types: Libre/Normal, Antimicrobianos, Psicotrópicos, Estupefacientes
/// </summary>
public class PrescriptionPadType : BaseEntity
{
    public string PadTypeName { get; private set; } = string.Empty;
    public string PadTypeCode { get; private set; } = string.Empty;
    public int DefaultQuantity { get; private set; } = 50;
    public string? Description { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual ICollection<PrescriptionPad> PrescriptionPads { get; private set; } = new List<PrescriptionPad>();
    public virtual ICollection<Medication> Medications { get; private set; } = new List<Medication>();

    private PrescriptionPadType() { } // EF Core

    public PrescriptionPadType(
        string padTypeName,
        string padTypeCode,
        int defaultQuantity = 50,
        string? description = null)
    {
        PadTypeName = padTypeName;
        PadTypeCode = padTypeCode;
        DefaultQuantity = defaultQuantity;
        Description = description;
        IsActive = true;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
