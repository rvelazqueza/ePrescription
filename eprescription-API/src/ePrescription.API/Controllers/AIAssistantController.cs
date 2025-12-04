using EPrescription.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPrescription.API.Controllers;

/// <summary>
/// Controller for AI Assistant operations
/// Provides clinical analysis, medication recommendations, and drug interaction checking
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "doctor,admin")]
public class AIAssistantController : ControllerBase
{
    private readonly IAIAssistantService _aiService;
    private readonly ILogger<AIAssistantController> _logger;

    public AIAssistantController(
        IAIAssistantService aiService,
        ILogger<AIAssistantController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    /// <summary>
    /// Analyze clinical description and suggest diagnoses with CIE-10 codes
    /// Flow: Spanish → English → AI Analysis → Spanish → CIE-10 Validation
    /// </summary>
    /// <param name="request">Clinical analysis request</param>
    /// <returns>Analysis result with validated CIE-10 codes</returns>
    [HttpPost("analyze")]
    [ProducesResponseType(typeof(ClinicalAnalysisResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ClinicalAnalysisResult>> AnalyzeClinicalDescription(
        [FromBody] ClinicalAnalysisRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.ClinicalDescription))
            {
                return BadRequest(new { message = "Clinical description is required" });
            }

            _logger.LogInformation(
                "Analyzing clinical description for patient {PatientId}",
                request.PatientId);

            var result = await _aiService.AnalyzeClinicalDescriptionAsync(
                request.ClinicalDescription,
                request.PatientId);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing clinical description");
            return StatusCode(500, new { message = "Error analyzing clinical description", error = ex.Message });
        }
    }

    /// <summary>
    /// Generate medication recommendations based on diagnoses
    /// </summary>
    /// <param name="request">Medication recommendation request</param>
    /// <returns>List of medication recommendations</returns>
    [HttpPost("medications/recommend")]
    [ProducesResponseType(typeof(List<MedicationRecommendation>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<MedicationRecommendation>>> GenerateMedicationRecommendations(
        [FromBody] MedicationRecommendationRequest request)
    {
        try
        {
            if (request.DiagnosisCodes == null || !request.DiagnosisCodes.Any())
            {
                return BadRequest(new { message = "At least one diagnosis code is required" });
            }

            _logger.LogInformation(
                "Generating medication recommendations for {Count} diagnoses",
                request.DiagnosisCodes.Count);

            var recommendations = await _aiService.GenerateMedicationRecommendationsAsync(
                request.DiagnosisCodes,
                request.PatientAge,
                request.PatientWeight,
                request.Allergies);

            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating medication recommendations");
            return StatusCode(500, new { message = "Error generating recommendations", error = ex.Message });
        }
    }

    /// <summary>
    /// Check for drug interactions between medications
    /// </summary>
    /// <param name="request">Drug interaction check request</param>
    /// <returns>List of detected interactions</returns>
    [HttpPost("medications/check-interactions")]
    [ProducesResponseType(typeof(List<DrugInteraction>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<DrugInteraction>>> CheckDrugInteractions(
        [FromBody] DrugInteractionRequest request)
    {
        try
        {
            if (request.MedicationIds == null || request.MedicationIds.Count < 2)
            {
                return BadRequest(new { message = "At least 2 medications are required to check interactions" });
            }

            _logger.LogInformation(
                "Checking drug interactions for {Count} medications",
                request.MedicationIds.Count);

            var interactions = await _aiService.CheckDrugInteractionsAsync(request.MedicationIds);

            return Ok(interactions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking drug interactions");
            return StatusCode(500, new { message = "Error checking interactions", error = ex.Message });
        }
    }

    /// <summary>
    /// Validate contraindications for a patient
    /// </summary>
    /// <param name="request">Contraindication validation request</param>
    /// <returns>Validation result with contraindications</returns>
    [HttpPost("medications/check-contraindications")]
    [ProducesResponseType(typeof(ContraindicationResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ContraindicationResult>> ValidateContraindications(
        [FromBody] ContraindicationRequest request)
    {
        try
        {
            if (request.MedicationIds == null || !request.MedicationIds.Any())
            {
                return BadRequest(new { message = "At least one medication is required" });
            }

            if (request.PatientId == Guid.Empty)
            {
                return BadRequest(new { message = "Patient ID is required" });
            }

            _logger.LogInformation(
                "Validating contraindications for patient {PatientId} with {Count} medications",
                request.PatientId,
                request.MedicationIds.Count);

            var result = await _aiService.ValidateContraindicationsAsync(
                request.MedicationIds,
                request.PatientId,
                request.DiagnosisCodes ?? new List<string>());

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating contraindications");
            return StatusCode(500, new { message = "Error validating contraindications", error = ex.Message });
        }
    }

    /// <summary>
    /// Get AI analysis history for a patient
    /// </summary>
    /// <param name="patientId">Patient ID</param>
    /// <param name="limit">Maximum number of records (default: 10)</param>
    /// <returns>List of AI analysis logs</returns>
    [HttpGet("history/{patientId}")]
    [ProducesResponseType(typeof(List<AIAnalysisLogDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AIAnalysisLogDto>>> GetAnalysisHistory(
        Guid patientId,
        [FromQuery] int limit = 10)
    {
        try
        {
            _logger.LogInformation("Fetching AI analysis history for patient {PatientId}", patientId);

            var history = await _aiService.GetAnalysisHistoryAsync(patientId, limit);

            return Ok(history);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching analysis history");
            return StatusCode(500, new { message = "Error fetching history", error = ex.Message });
        }
    }

    /// <summary>
    /// Quick diagnosis suggestion based on symptoms
    /// </summary>
    /// <param name="request">Quick diagnosis request</param>
    /// <returns>Quick diagnosis suggestions</returns>
    [HttpPost("quick-diagnosis")]
    [ProducesResponseType(typeof(QuickDiagnosisResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<QuickDiagnosisResult>> QuickDiagnosis(
        [FromBody] QuickDiagnosisRequest request)
    {
        try
        {
            if (request.Symptoms == null || !request.Symptoms.Any())
            {
                return BadRequest(new { message = "At least one symptom is required" });
            }

            _logger.LogInformation("Quick diagnosis for {Count} symptoms", request.Symptoms.Count);

            // Build clinical description from symptoms
            var clinicalDescription = string.Join(", ", request.Symptoms);

            var result = await _aiService.AnalyzeClinicalDescriptionAsync(clinicalDescription);

            return Ok(new QuickDiagnosisResult
            {
                Symptoms = request.Symptoms,
                SuggestedDiagnoses = result.DiagnosisSuggestions.Take(5).ToList(),
                ConfidenceScore = result.ConfidenceScore,
                AnalysisDate = result.AnalysisDate
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in quick diagnosis");
            return StatusCode(500, new { message = "Error in quick diagnosis", error = ex.Message });
        }
    }
}

// Request DTOs

public class ClinicalAnalysisRequest
{
    public string ClinicalDescription { get; set; } = string.Empty;
    public Guid? PatientId { get; set; }
}

public class MedicationRecommendationRequest
{
    public List<string> DiagnosisCodes { get; set; } = new();
    public int? PatientAge { get; set; }
    public decimal? PatientWeight { get; set; }
    public List<string>? Allergies { get; set; }
}

public class DrugInteractionRequest
{
    public List<Guid> MedicationIds { get; set; } = new();
}

public class ContraindicationRequest
{
    public List<Guid> MedicationIds { get; set; } = new();
    public Guid PatientId { get; set; }
    public List<string>? DiagnosisCodes { get; set; }
}

public class QuickDiagnosisRequest
{
    public List<string> Symptoms { get; set; } = new();
}

// Response DTOs

public class QuickDiagnosisResult
{
    public List<string> Symptoms { get; set; } = new();
    public List<DiagnosisSuggestion> SuggestedDiagnoses { get; set; } = new();
    public decimal ConfidenceScore { get; set; }
    public DateTime AnalysisDate { get; set; }
}
