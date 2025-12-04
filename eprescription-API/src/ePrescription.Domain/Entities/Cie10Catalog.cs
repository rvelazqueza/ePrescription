namespace EPrescription.Domain.Entities;

/// <summary>
/// CIE-10 (ICD-10) diagnosis catalog from WHO
/// Maps to CIE10_CATALOG table in Oracle
/// </summary>
public class Cie10Catalog : BaseEntity
{
    public string Code { get; private set; } = string.Empty;
    public string DescriptionEs { get; private set; } = string.Empty;
    public string? DescriptionEn { get; private set; }
    public string? Category { get; private set; }
    public string? Chapter { get; private set; }
    public bool IsActive { get; private set; } = true;
    public string Source { get; private set; } = "MANUAL"; // MANUAL or WHO_API
    public DateTime LastUpdated { get; private set; }

    // Note: No navigation to PrescriptionDiagnoses to avoid EF Core shadow properties
    // PrescriptionDiagnosis references Cie10Catalog via string Code, not entity relationship
    // Use repository queries to get diagnoses by Cie10Code instead

    private Cie10Catalog() { } // EF Core

    public Cie10Catalog(
        string code,
        string descriptionEs,
        string? descriptionEn = null,
        string? category = null,
        string? chapter = null,
        string source = "MANUAL")
    {
        Code = code;
        DescriptionEs = descriptionEs;
        DescriptionEn = descriptionEn;
        Category = category;
        Chapter = chapter;
        Source = source;
        IsActive = true;
        LastUpdated = DateTime.UtcNow;
    }

    public void UpdateFromWHO(string descriptionEs, string? descriptionEn, string? category, string? chapter)
    {
        DescriptionEs = descriptionEs;
        DescriptionEn = descriptionEn;
        Category = category;
        Chapter = chapter;
        Source = "WHO_API";
        LastUpdated = DateTime.UtcNow;
        UpdateTimestamp();
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
