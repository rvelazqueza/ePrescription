namespace EPrescription.Domain.Entities;

/// <summary>
/// Prescription diagnosis - links prescriptions to CIE-10 diagnoses
/// Maps to PRESCRIPTION_DIAGNOSES table in Oracle
/// Schema matches Oracle exactly to avoid EF Core shadow properties
/// </summary>
public class PrescriptionDiagnosis : BaseEntity
{
    // Foreign Keys - match Oracle schema exactly
    public Guid PrescriptionId { get; private set; }
    public Guid Cie10Id { get; private set; } // Real FK to CIE10_CATALOG.ID
    
    // Denormalized fields from CIE10_CATALOG (for performance)
    public string DiagnosisCode { get; private set; } = string.Empty; // Denormalized from CIE10_CATALOG.CODE
    public string DiagnosisDescription { get; private set; } = string.Empty; // Denormalized from CIE10_CATALOG.DESCRIPTION_ES
    
    // Diagnosis-specific fields
    public bool IsPrimary { get; private set; }
    public string? Notes { get; private set; }
    
    // AI-assisted diagnosis fields
    public bool AiSuggested { get; private set; }
    public decimal? AiConfidenceScore { get; private set; }

    // Navigation properties
    public virtual Prescription Prescription { get; private set; } = null!;
    // Note: No navigation to Cie10Catalog to avoid shadow properties
    // Use Cie10Id for queries if needed

    private PrescriptionDiagnosis() { } // EF Core

    public PrescriptionDiagnosis(
        Guid prescriptionId,
        Guid cie10Id,
        string diagnosisCode,
        string diagnosisDescription,
        bool isPrimary = false,
        string? notes = null,
        bool aiSuggested = false,
        decimal? aiConfidenceScore = null)
    {
        PrescriptionId = prescriptionId;
        Cie10Id = cie10Id;
        DiagnosisCode = diagnosisCode;
        DiagnosisDescription = diagnosisDescription;
        IsPrimary = isPrimary;
        Notes = notes;
        AiSuggested = aiSuggested;
        AiConfidenceScore = aiConfidenceScore;
    }

    public void SetAsPrimary()
    {
        IsPrimary = true;
        UpdateTimestamp();
    }

    public void UpdateDiagnosisInfo(string diagnosisCode, string diagnosisDescription)
    {
        DiagnosisCode = diagnosisCode;
        DiagnosisDescription = diagnosisDescription;
        UpdateTimestamp();
    }

    public void SetAiSuggestion(decimal confidenceScore)
    {
        AiSuggested = true;
        AiConfidenceScore = confidenceScore;
        UpdateTimestamp();
    }
}
