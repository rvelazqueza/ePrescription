namespace EPrescription.Domain.Entities;

/// <summary>
/// Prescription diagnosis - links prescriptions to CIE-10 diagnoses
/// Maps to PRESCRIPTION_DIAGNOSES table in Oracle
/// </summary>
public class PrescriptionDiagnosis : BaseEntity
{
    public Guid PrescriptionId { get; private set; }
    public string Cie10Code { get; private set; } = string.Empty; // FK to CIE10_CATALOG.CODE
    public bool IsPrimary { get; private set; }
    public string? Notes { get; private set; }

    // Navigation properties
    public virtual Prescription Prescription { get; private set; } = null!;
    // Note: Cie10Code must exist in CIE10_CATALOG.CODE (validated at DB level)

    private PrescriptionDiagnosis() { } // EF Core

    public PrescriptionDiagnosis(
        Guid prescriptionId,
        string cie10Code,
        bool isPrimary = false,
        string? notes = null)
    {
        PrescriptionId = prescriptionId;
        Cie10Code = cie10Code;
        IsPrimary = isPrimary;
        Notes = notes;
    }

    public void SetAsPrimary()
    {
        IsPrimary = true;
        UpdateTimestamp();
    }
}
