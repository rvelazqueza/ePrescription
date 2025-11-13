namespace EPrescription.Domain.Entities;

/// <summary>
/// AI Analysis log entity - tracks all AI-assisted medical decisions
/// Maps to AI_ANALYSIS_LOGS table in Oracle
/// Critical for medical liability and traceability
/// </summary>
public class AIAnalysisLog : BaseEntity
{
    public DateTime Timestamp { get; private set; }
    public Guid? UserId { get; private set; }
    public Guid? PrescriptionId { get; private set; }
    public string AnalysisType { get; private set; } = string.Empty; // diagnosis, medication, interaction
    public string InputData { get; private set; } = string.Empty; // JSON
    public string OutputData { get; private set; } = string.Empty; // JSON
    public string? AiProvider { get; private set; } // HuggingFace, OpenAI, etc.
    public int? ProcessingTimeMs { get; private set; }
    public decimal? ConfidenceScore { get; private set; } // 0.0000 to 1.0000
    public bool WasAccepted { get; private set; }

    // Navigation properties
    public virtual User? User { get; private set; }
    public virtual Prescription? Prescription { get; private set; }

    private AIAnalysisLog() { } // EF Core

    /// <summary>
    /// Creates a new AI analysis log entry
    /// </summary>
    /// <param name="analysisType">Type of analysis (diagnosis, medication, interaction)</param>
    /// <param name="inputData">Input data sent to AI (JSON)</param>
    /// <param name="outputData">Output data received from AI (JSON)</param>
    /// <param name="userId">User who requested the analysis</param>
    /// <param name="prescriptionId">Related prescription (if applicable)</param>
    /// <param name="aiProvider">AI provider used (HuggingFace, OpenAI, etc.)</param>
    /// <param name="processingTimeMs">Processing time in milliseconds</param>
    /// <param name="confidenceScore">AI confidence score (0-1)</param>
    /// <param name="wasAccepted">Whether the suggestion was accepted by the user</param>
    public AIAnalysisLog(
        string analysisType,
        string inputData,
        string outputData,
        Guid? userId = null,
        Guid? prescriptionId = null,
        string? aiProvider = null,
        int? processingTimeMs = null,
        decimal? confidenceScore = null,
        bool wasAccepted = false)
    {
        Timestamp = DateTime.UtcNow;
        AnalysisType = analysisType;
        InputData = inputData;
        OutputData = outputData;
        UserId = userId;
        PrescriptionId = prescriptionId;
        AiProvider = aiProvider;
        ProcessingTimeMs = processingTimeMs;
        ConfidenceScore = confidenceScore;
        WasAccepted = wasAccepted;
    }

    /// <summary>
    /// Marks the AI suggestion as accepted by the user
    /// </summary>
    public void MarkAsAccepted()
    {
        WasAccepted = true;
        UpdateTimestamp();
    }
}
