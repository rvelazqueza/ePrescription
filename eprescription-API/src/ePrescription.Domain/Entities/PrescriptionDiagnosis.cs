namespace EPrescription.Domain.Entities;

/// <summary>
/// Prescription diagnosis - links prescriptions to CIE-10 diagnoses
/// Maps to PRESCRIPTION_DIAGNOSES table in Oracle
/// </summary>
public class PrescriptionDiagnosis : BaseEntity
{
    public Guid PrescriptionId { get; private set; }
    public Guid Cie10Id { get; private set; }
    public bool IsPrimary { get; private set; }
    public string? Notes { get; private set; }

    // Navigation properties
    public virtual Prescription Prescription { get; private set; } = null!;
    public virtual Cie10Catalog Cie10 { get; private set; } = null!;

    private PrescriptionDiagnosis() { } // EF Core

    public PrescriptionDiagnosis(
        Guid prescriptionId,
        Guid cie10Id,
        bool isPrimary = false,
        string? notes = null)
    {
        PrescriptionId = prescriptionId;
        Cie10Id = cie10Id;
        IsPrimary = isPrimary;
        Notes = notes;
    }

    public void SetAsPrimary()
    {
        IsPrimary = true;
        UpdateTimestamp();
    }
}
