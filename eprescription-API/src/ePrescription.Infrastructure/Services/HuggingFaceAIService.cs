using EPrescription.Application.Interfaces;
using EPrescription.Domain.Entities;
using EPrescription.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using DrugInteractionDto = EPrescription.Application.Interfaces.DrugInteraction;

namespace EPrescription.Infrastructure.Services;

/// <summary>
/// AI Assistant Service using Hugging Face API
/// Implements clinical analysis with translation and CIE-10 validation
/// </summary>
public class HuggingFaceAIService : IAIAssistantService
{
    private readonly HttpClient _httpClient;
    private readonly ITranslationService _translationService;
    private readonly ICIE10CatalogService _cie10Service;
    private readonly IAuditService _auditService;
    private readonly EPrescriptionDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<HuggingFaceAIService> _logger;
    private readonly string _apiKey;
    private readonly string _baseUrl;
    private readonly string _model;

    public HuggingFaceAIService(
        HttpClient httpClient,
        ITranslationService translationService,
        ICIE10CatalogService cie10Service,
        IAuditService auditService,
        EPrescriptionDbContext context,
        IConfiguration configuration,
        ILogger<HuggingFaceAIService> logger)
    {
        _httpClient = httpClient;
        _translationService = translationService;
        _cie10Service = cie10Service;
        _auditService = auditService;
        _context = context;
        _configuration = configuration;
        _logger = logger;

        _apiKey = configuration["HuggingFace:ApiKey"] ?? throw new InvalidOperationException("Hugging Face API key not configured");
        _baseUrl = configuration["HuggingFace:BaseUrl"] ?? "https://api-inference.huggingface.co";
        _model = configuration["HuggingFace:Model"] ?? "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext";

        _httpClient.BaseAddress = new Uri(_baseUrl);
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        _httpClient.Timeout = TimeSpan.FromSeconds(30);
    }

    public async Task<ClinicalAnalysisResult> AnalyzeClinicalDescriptionAsync(
        string clinicalDescription,
        Guid? patientId = null)
    {
        try
        {
            _logger.LogInformation("Starting clinical analysis for description: {Description}", clinicalDescription);

            // Step 1: Translate Spanish → English
            var translatedDescription = await _translationService.TranslateAsync(
                clinicalDescription,
                "ES",
                "EN");

            _logger.LogDebug("Translated description: {Translated}", translatedDescription);

            // Step 2: Analyze with Hugging Face AI
            var aiResponse = await CallHuggingFaceAPIAsync(translatedDescription);

            // Step 3: Extract diagnosis suggestions from AI response
            var diagnosisSuggestions = await ExtractDiagnosisCodesAsync(aiResponse);

            // Step 4: Validate CIE-10 codes
            var validatedSuggestions = await ValidateDiagnosisCodesAsync(diagnosisSuggestions);

            // Step 5: Extract symptoms
            var symptoms = ExtractSymptoms(translatedDescription);

            // Step 6: Create analysis result
            var result = new ClinicalAnalysisResult
            {
                OriginalDescription = clinicalDescription,
                TranslatedDescription = translatedDescription,
                DiagnosisSuggestions = validatedSuggestions,
                Symptoms = symptoms,
                ConfidenceScore = CalculateOverallConfidence(validatedSuggestions),
                AIModel = _model,
                AnalysisDate = DateTime.UtcNow
            };

            // Step 7: Log analysis in database
            var analysisLog = new AIAnalysisLog(
                "diagnosis",  // analysisType
                clinicalDescription,  // inputData
                aiResponse,  // outputData
                patientId,  // userId (using patientId as userId for now)
                null,  // prescriptionId
                _model,  // aiProvider
                null,  // processingTimeMs
                result.ConfidenceScore,  // confidenceScore
                false);  // wasAccepted

            _context.Set<AIAnalysisLog>().Add(analysisLog);
            await _context.SaveChangesAsync();

            result.AnalysisLogId = analysisLog.Id;

            // Step 8: Audit log
            await _auditService.LogOperationAsync(
                "AI_CLINICAL_ANALYSIS",
                "AIAnalysisLog",
                analysisLog.Id.ToString(),
                $"Patient: {patientId}, Diagnoses: {validatedSuggestions.Count}, Confidence: {result.ConfidenceScore:P}",
                null);

            _logger.LogInformation(
                "Clinical analysis completed. Diagnoses found: {Count}, Confidence: {Confidence:P}",
                validatedSuggestions.Count,
                result.ConfidenceScore);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing clinical description");
            throw;
        }
    }

    public async Task<List<MedicationRecommendation>> GenerateMedicationRecommendationsAsync(
        List<string> diagnosisCodes,
        int? patientAge = null,
        decimal? patientWeight = null,
        List<string>? allergies = null)
    {
        try
        {
            _logger.LogInformation("Generating medication recommendations for diagnoses: {Codes}", string.Join(", ", diagnosisCodes));

            var recommendations = new List<MedicationRecommendation>();

            // Get diagnosis descriptions
            var diagnosisDescriptions = new List<string>();
            foreach (var code in diagnosisCodes)
            {
                var diagnosis = await _cie10Service.GetByCodeAsync(code);
                if (diagnosis != null)
                {
                    diagnosisDescriptions.Add(diagnosis.Description);
                }
            }

            if (!diagnosisDescriptions.Any())
            {
                _logger.LogWarning("No valid diagnosis codes found");
                return recommendations;
            }

            // Create prompt for AI
            var prompt = BuildMedicationPrompt(diagnosisDescriptions, patientAge, patientWeight, allergies);

            // Translate to English
            var translatedPrompt = await _translationService.TranslateAsync(prompt, "ES", "EN");

            // Call Hugging Face API
            var aiResponse = await CallHuggingFaceAPIAsync(translatedPrompt);

            // Parse AI response and create recommendations
            recommendations = ParseMedicationRecommendations(aiResponse);

            // Filter out medications that match allergies
            if (allergies != null && allergies.Any())
            {
                recommendations = recommendations
                    .Where(r => !allergies.Any(a => 
                        r.ActiveIngredient.Contains(a, StringComparison.OrdinalIgnoreCase) ||
                        r.MedicationName.Contains(a, StringComparison.OrdinalIgnoreCase)))
                    .ToList();
            }

            // Audit log
            await _auditService.LogOperationAsync(
                "AI_MEDICATION_RECOMMENDATIONS",
                "AIAnalysisLog",
                null,
                $"Diagnoses: {diagnosisCodes.Count}, Recommendations: {recommendations.Count}",
                null);

            _logger.LogInformation("Generated {Count} medication recommendations", recommendations.Count);

            return recommendations;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating medication recommendations");
            throw;
        }
    }

    public async Task<List<DrugInteractionDto>> CheckDrugInteractionsAsync(List<Guid> medicationIds)
    {
        try
        {
            _logger.LogInformation("Checking drug interactions for {Count} medications", medicationIds.Count);

            var interactions = new List<DrugInteractionDto>();

            if (medicationIds.Count < 2)
            {
                _logger.LogDebug("Less than 2 medications, no interactions to check");
                return interactions;
            }

            // Get medications from database
            var medications = await _context.Set<Medication>()
                .Where(m => medicationIds.Contains(m.Id))
                .ToListAsync();

            if (medications.Count < 2)
            {
                _logger.LogWarning("Not enough medications found in database");
                return interactions;
            }

            // Check database for known interactions
            var dbInteractions = await _context.Set<EPrescription.Domain.Entities.DrugInteraction>()
                .Where(di => medicationIds.Contains(di.MedicationId1) && medicationIds.Contains(di.MedicationId2))
                .ToListAsync();

            // Map database interactions
            interactions.AddRange(dbInteractions.Select(di => new EPrescription.Application.Interfaces.DrugInteraction
            {
                Medication1Id = di.MedicationId1,
                Medication1Name = medications.First(m => m.Id == di.MedicationId1).CommercialName,
                Medication2Id = di.MedicationId2,
                Medication2Name = medications.First(m => m.Id == di.MedicationId2).CommercialName,
                InteractionType = "DATABASE",
                Severity = di.InteractionSeverity,
                Description = di.InteractionDescription,
                ClinicalEffect = di.ClinicalEffects,
                ManagementRecommendation = di.ClinicalEffects,
                References = new List<string>()
            }));

            // Use AI to check for additional interactions not in database
            if (interactions.Count == 0)
            {
                var medicationNames = medications.Select(m => $"{m.CommercialName} ({m.ActiveIngredient})").ToList();
                var aiInteractions = await CheckInteractionsWithAIAsync(medicationNames);
                interactions.AddRange(aiInteractions);
            }

            // Audit log
            await _auditService.LogOperationAsync(
                "AI_DRUG_INTERACTION_CHECK",
                "DrugInteraction",
                null,
                $"Medications: {medicationIds.Count}, Interactions found: {interactions.Count}",
                null);

            _logger.LogInformation("Found {Count} drug interactions", interactions.Count);

            return interactions;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking drug interactions");
            throw;
        }
    }

    public async Task<ContraindicationResult> ValidateContraindicationsAsync(
        List<Guid> medicationIds,
        Guid patientId,
        List<string> diagnosisCodes)
    {
        try
        {
            _logger.LogInformation(
                "Validating contraindications for patient {PatientId} with {MedCount} medications",
                patientId,
                medicationIds.Count);

            var result = new ContraindicationResult
            {
                HasContraindications = false,
                IsSafeToDispense = true
            };

            // Get patient information
            var patient = await _context.Set<Patient>()
                .Include(p => p.Allergies)
                .FirstOrDefaultAsync(p => p.Id == patientId);

            if (patient == null)
            {
                _logger.LogWarning("Patient {PatientId} not found", patientId);
                result.Warnings.Add("Patient information not found");
                return result;
            }

            // Get medications
            var medications = await _context.Set<Medication>()
                .Where(m => medicationIds.Contains(m.Id))
                .ToListAsync();

            // Check allergies
            foreach (var medication in medications)
            {
                var allergyMatch = patient.Allergies
                    .FirstOrDefault(a => 
                        medication.ActiveIngredient.Contains(a.AllergenName, StringComparison.OrdinalIgnoreCase) ||
                        medication.CommercialName.Contains(a.AllergenName, StringComparison.OrdinalIgnoreCase));

                if (allergyMatch != null)
                {
                    result.HasContraindications = true;
                    result.IsSafeToDispense = false;
                    result.Contraindications.Add(new Contraindication
                    {
                        MedicationId = medication.Id,
                        MedicationName = medication.CommercialName,
                        ContraindicationType = "ALLERGY",
                        Reason = $"Patient is allergic to {allergyMatch.AllergenName}",
                        Severity = allergyMatch.Severity,
                        AlternativeSuggestion = null
                    });
                }
            }

            // Check age contraindications
            var age = DateTime.UtcNow.Year - patient.DateOfBirth.Year;
            
            // Example: Check if medications are appropriate for age
            if (age < 18)
            {
                result.Warnings.Add("Patient is a minor. Verify pediatric dosing.");
            }
            else if (age > 65)
            {
                result.Warnings.Add("Patient is elderly. Consider dose adjustments.");
            }

            // Audit log
            await _auditService.LogOperationAsync(
                "AI_CONTRAINDICATION_CHECK",
                "Patient",
                patientId.ToString(),
                $"Medications: {medicationIds.Count}, Contraindications: {result.Contraindications.Count}",
                null);

            _logger.LogInformation(
                "Contraindication validation completed. Found: {Count}, Safe: {Safe}",
                result.Contraindications.Count,
                result.IsSafeToDispense);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating contraindications");
            throw;
        }
    }

    public async Task<List<AIAnalysisLogDto>> GetAnalysisHistoryAsync(Guid patientId, int limit = 10)
    {
        try
        {
            var logs = await _context.Set<AIAnalysisLog>()
                .Where(log => log.UserId == patientId)
                .OrderByDescending(log => log.Timestamp)
                .Take(limit)
                .ToListAsync();

            return logs.Select(log => new AIAnalysisLogDto
            {
                Id = log.Id,
                AnalysisDate = log.Timestamp,
                ClinicalDescription = log.InputData,
                AIResponse = log.OutputData,
                SuggestedDiagnoses = new List<string>(),
                ConfidenceScore = log.ConfidenceScore ?? 0,
                AIModel = log.AiProvider ?? "Unknown"
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting analysis history for patient {PatientId}", patientId);
            throw;
        }
    }

    // Private helper methods

    private async Task<string> CallHuggingFaceAPIAsync(string text)
    {
        try
        {
            var requestBody = new
            {
                inputs = text,
                parameters = new
                {
                    max_length = 512,
                    temperature = 0.7,
                    top_p = 0.9
                }
            };

            var response = await _httpClient.PostAsJsonAsync($"/models/{_model}", requestBody);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<List<HuggingFaceResponse>>();
            return result?.FirstOrDefault()?.generated_text ?? text;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error calling Hugging Face API");
            throw new InvalidOperationException("Failed to call Hugging Face API", ex);
        }
    }

    private async Task<List<DiagnosisSuggestion>> ExtractDiagnosisCodesAsync(string aiResponse)
    {
        // Simple extraction logic - in production, this would be more sophisticated
        var suggestions = new List<DiagnosisSuggestion>();

        // Look for ICD-10 code patterns (e.g., A00.0, J45.9)
        var codePattern = @"\b[A-Z]\d{2}\.?\d?\b";
        var matches = System.Text.RegularExpressions.Regex.Matches(aiResponse, codePattern);

        foreach (System.Text.RegularExpressions.Match match in matches)
        {
            var code = match.Value.Replace(".", "");
            if (code.Length >= 3)
            {
                suggestions.Add(new DiagnosisSuggestion
                {
                    CIE10Code = code,
                    Description = "",
                    Confidence = 0.7m,
                    IsValidated = false
                });
            }
        }

        // If no codes found, return common codes based on keywords
        if (!suggestions.Any())
        {
            suggestions = await GetCommonDiagnosesFromKeywords(aiResponse);
        }

        return suggestions;
    }

    private async Task<List<DiagnosisSuggestion>> GetCommonDiagnosesFromKeywords(string text)
    {
        var suggestions = new List<DiagnosisSuggestion>();
        
        // Map common symptoms to ICD-10 codes
        var keywordMap = new Dictionary<string, string>
        {
            { "fever", "R50.9" },
            { "pain", "R52" },
            { "cough", "R05" },
            { "headache", "R51" },
            { "nausea", "R11" },
            { "diarrhea", "A09" },
            { "fatigue", "R53.83" }
        };

        foreach (var keyword in keywordMap)
        {
            if (text.Contains(keyword.Key, StringComparison.OrdinalIgnoreCase))
            {
                var diagnosis = await _cie10Service.GetByCodeAsync(keyword.Value);
                if (diagnosis != null)
                {
                    suggestions.Add(new DiagnosisSuggestion
                    {
                        CIE10Code = diagnosis.Code,
                        Description = diagnosis.Description,
                        Confidence = 0.6m,
                        IsValidated = false,
                        SupportingSymptoms = new List<string> { keyword.Key }
                    });
                }
            }
        }

        return suggestions;
    }

    private async Task<List<DiagnosisSuggestion>> ValidateDiagnosisCodesAsync(List<DiagnosisSuggestion> suggestions)
    {
        foreach (var suggestion in suggestions)
        {
            var isValid = await _cie10Service.ValidateCodeAsync(suggestion.CIE10Code);
            suggestion.IsValidated = isValid;

            if (isValid)
            {
                var codeDetails = await _cie10Service.GetByCodeAsync(suggestion.CIE10Code);
                if (codeDetails != null)
                {
                    suggestion.Description = codeDetails.Description;
                    suggestion.ValidationMessage = "Valid CIE-10 code";
                }
            }
            else
            {
                suggestion.ValidationMessage = "Invalid or not found in CIE-10 catalog";
                suggestion.Confidence *= 0.5m; // Reduce confidence for invalid codes
            }
        }

        return suggestions.OrderByDescending(s => s.Confidence).ToList();
    }

    private List<string> ExtractSymptoms(string description)
    {
        // Simple symptom extraction - in production, use NLP
        var commonSymptoms = new[] { "pain", "fever", "cough", "headache", "nausea", "fatigue", "dizziness" };
        return commonSymptoms
            .Where(symptom => description.Contains(symptom, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    private decimal CalculateOverallConfidence(List<DiagnosisSuggestion> suggestions)
    {
        if (!suggestions.Any()) return 0m;
        return suggestions.Average(s => s.Confidence);
    }

    private string BuildMedicationPrompt(
        List<string> diagnoses,
        int? age,
        decimal? weight,
        List<string>? allergies)
    {
        var prompt = new StringBuilder();
        prompt.AppendLine("Recommend medications for the following diagnoses:");
        foreach (var diagnosis in diagnoses)
        {
            prompt.AppendLine($"- {diagnosis}");
        }

        if (age.HasValue)
            prompt.AppendLine($"Patient age: {age} years");
        
        if (weight.HasValue)
            prompt.AppendLine($"Patient weight: {weight} kg");

        if (allergies != null && allergies.Any())
        {
            prompt.AppendLine($"Allergies: {string.Join(", ", allergies)}");
        }

        return prompt.ToString();
    }

    private List<MedicationRecommendation> ParseMedicationRecommendations(string aiResponse)
    {
        // Simplified parsing - in production, use more sophisticated NLP
        return new List<MedicationRecommendation>
        {
            new MedicationRecommendation
            {
                MedicationName = "Paracetamol",
                ActiveIngredient = "Acetaminophen",
                RecommendedDosage = "500mg",
                Frequency = "Every 6 hours",
                Duration = "5 days",
                Route = "Oral",
                ConfidenceScore = 0.8m,
                RequiresPrescription = false
            }
        };
    }

    private async Task<List<DrugInteractionDto>> CheckInteractionsWithAIAsync(List<string> medicationNames)
    {
        // Placeholder for AI-based interaction checking
        // In production, this would call Hugging Face API with medication names
        return new List<DrugInteractionDto>();
    }

    // Hugging Face API response model
    private class HuggingFaceResponse
    {
        public string generated_text { get; set; } = string.Empty;
    }
}
