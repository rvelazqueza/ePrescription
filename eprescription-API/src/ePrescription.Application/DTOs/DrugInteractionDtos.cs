namespace EPrescription.Application.DTOs;

/// <summary>
/// DTO for drug interaction information
/// </summary>
public class DrugInteraction
{
    public Guid MedicationId1 { get; set; }
    public Guid MedicationId2 { get; set; }
    public string MedicationName1 { get; set; } = string.Empty;
    public string MedicationName2 { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty; // "mild", "moderate", "severe"
    public string Description { get; set; } = string.Empty;
}

/// <summary>
/// DTO for drug interaction check result
/// </summary>
public class DrugInteractionResult
{
    public bool HasInteractions { get; set; }
    public List<DrugInteraction> Interactions { get; set; } = new();
    public string Severity { get; set; } = "none"; // "none", "mild", "moderate", "severe"
    public string Recommendation { get; set; } = string.Empty;
}

/// <summary>
/// DTO for medication details
/// </summary>
public class MedicationDetailDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ActiveIngredient { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string AdministrationRoute { get; set; } = string.Empty;
    public string Contraindications { get; set; } = string.Empty;
    public string SideEffects { get; set; } = string.Empty;
    public string Interactions { get; set; } = string.Empty;
    public string Precautions { get; set; } = string.Empty;
    public string PadTypeName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
