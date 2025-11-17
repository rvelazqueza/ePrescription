namespace ePrescription.Application.Interfaces;

/// <summary>
/// Service for AI-powered clinical analysis and medication recommendations
/// Integrates with Hugging Face API, Translation Service, and CIE-10 Catalog
/// </summary>
public interface IAIAssistantService
{
    /// <summary>
    /// Analyze clinical description and suggest diagnoses with CIE-10 codes
    /// Flow: Spanish → English → AI Analysis → Spanish → CIE-10 Validation
    /// </summary>
    /// <param name="clinicalDescription">Clinical description in Spanish</param>
    /// <param name="patientId">Patient ID for context</param>
    /// <returns>Clinical analysis result with validated CIE-10 codes</returns>
    Task<ClinicalAnalysisResult> AnalyzeClinicalDescriptionAsync(
        string clinicalDescription,
        Guid? patientId = null);

    /// <summary>
    /// Generate medication recommendations based on diagnoses
    /// </summary>
    /// <param name="diagnosisCodes">List of CIE-10 diagnosis codes</param>
    /// <param name="patientAge">Patient age for dosage calculation</param>
    /// <param name="patientWeight">Patient weight in kg for dosage calculation</param>
    /// <param name="allergies">List of known allergies</param>
    /// <returns>List of medication recommendations</returns>
    Task<List<MedicationRecommendation>> GenerateMedicationRecommendationsAsync(
        List<string> diagnosisCodes,
        int? patientAge = null,
        decimal? patientWeight = null,
        List<string>? allergies = null);

    /// <summary>
    /// Check for drug interactions between medications
    /// </summary>
    /// <param name="medicationIds">List of medication IDs to check</param>
    /// <returns>List of detected drug interactions</returns>
    Task<List<DrugInteraction>> CheckDrugInteractionsAsync(List<Guid> medicationIds);

    /// <summary>
    /// Validate contraindications for a patient
    /// </summary>
    /// <param name="medicationIds">List of medication IDs</param>
    /// <param name="patientId">Patient ID</param>
    /// <param name="diagnosisCodes">List of diagnosis codes</param>
    /// <returns>Contraindication validation result</returns>
    Task<ContraindicationResult> ValidateContraindicationsAsync(
        List<Guid> medicationIds,
        Guid patientId,
        List<string> diagnosisCodes);

    /// <summary>
    /// Get AI analysis history for a patient
    /// </summary>
    /// <param name="patientId">Patient ID</param>
    /// <param name="limit">Maximum number of records to return</param>
    /// <returns>List of AI analysis logs</returns>
    Task<List<AIAnalysisLogDto>> GetAnalysisHistoryAsync(Guid patientId, int limit = 10);
}

/// <summary>
/// Result of clinical description analysis
/// </summary>
public class ClinicalAnalysisResult
{
    public string OriginalDescription { get; set; } = string.Empty;
    public string TranslatedDescription { get; set; } = string.Empty;
    public List<DiagnosisSuggestion> DiagnosisSuggestions { get; set; } = new();
    public List<string> Symptoms { get; set; } = new();
    public decimal ConfidenceScore { get; set; }
    public string AIModel { get; set; } = string.Empty;
    public DateTime AnalysisDate { get; set; }
    public Guid? AnalysisLogId { get; set; }
}

/// <summary>
/// Diagnosis suggestion with CIE-10 code
/// </summary>
public class DiagnosisSuggestion
{
    public string CIE10Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Confidence { get; set; }
    public bool IsValidated { get; set; }
    public string? ValidationMessage { get; set; }
    public List<string> SupportingSymptoms { get; set; } = new();
}

/// <summary>
/// Medication recommendation from AI
/// </summary>
public class MedicationRecommendation
{
    public string MedicationName { get; set; } = string.Empty;
    public string ActiveIngredient { get; set; } = string.Empty;
    public string RecommendedDosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public List<string> Indications { get; set; } = new();
    public List<string> Contraindications { get; set; } = new();
    public decimal ConfidenceScore { get; set; }
    public string? SpecialInstructions { get; set; }
    public bool RequiresPrescription { get; set; } = true;
}

/// <summary>
/// Drug interaction information
/// </summary>
public class DrugInteraction
{
    public Guid Medication1Id { get; set; }
    public string Medication1Name { get; set; } = string.Empty;
    public Guid Medication2Id { get; set; }
    public string Medication2Name { get; set; } = string.Empty;
    public string InteractionType { get; set; } = string.Empty; // MAJOR, MODERATE, MINOR
    public string Severity { get; set; } = string.Empty; // HIGH, MEDIUM, LOW
    public string Description { get; set; } = string.Empty;
    public string? ClinicalEffect { get; set; }
    public string? ManagementRecommendation { get; set; }
    public List<string> References { get; set; } = new();
}

/// <summary>
/// Contraindication validation result
/// </summary>
public class ContraindicationResult
{
    public bool HasContraindications { get; set; }
    public List<Contraindication> Contraindications { get; set; } = new();
    public List<string> Warnings { get; set; } = new();
    public bool IsSafeToDispense { get; set; }
    public string? RecommendedAction { get; set; }
}

/// <summary>
/// Individual contraindication
/// </summary>
public class Contraindication
{
    public Guid MedicationId { get; set; }
    public string MedicationName { get; set; } = string.Empty;
    public string ContraindicationType { get; set; } = string.Empty; // ALLERGY, CONDITION, AGE, PREGNANCY
    public string Reason { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty; // ABSOLUTE, RELATIVE
    public string? AlternativeSuggestion { get; set; }
}

/// <summary>
/// AI Analysis Log DTO
/// </summary>
public class AIAnalysisLogDto
{
    public Guid Id { get; set; }
    public DateTime AnalysisDate { get; set; }
    public string ClinicalDescription { get; set; } = string.Empty;
    public string AIResponse { get; set; } = string.Empty;
    public List<string> SuggestedDiagnoses { get; set; } = new();
    public decimal ConfidenceScore { get; set; }
    public string AIModel { get; set; } = string.Empty;
}
