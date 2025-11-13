using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// AI Analysis Log repository interface
/// For tracking AI-assisted medical decisions
/// </summary>
public interface IAIAnalysisLogRepository : IRepository<AIAnalysisLog>
{
    Task<IEnumerable<AIAnalysisLog>> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<AIAnalysisLog>> GetByPrescriptionAsync(Guid prescriptionId, CancellationToken cancellationToken = default);
    Task<IEnumerable<AIAnalysisLog>> GetByAnalysisTypeAsync(string analysisType, CancellationToken cancellationToken = default);
    Task<IEnumerable<AIAnalysisLog>> GetByProviderAsync(string aiProvider, CancellationToken cancellationToken = default);
    Task<IEnumerable<AIAnalysisLog>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task<IEnumerable<AIAnalysisLog>> GetAcceptedSuggestionsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<AIAnalysisLog>> GetRejectedSuggestionsAsync(CancellationToken cancellationToken = default);
    Task<decimal> GetAverageConfidenceScoreAsync(string analysisType, CancellationToken cancellationToken = default);
    Task<int> GetAcceptanceRateAsync(string analysisType, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
}
