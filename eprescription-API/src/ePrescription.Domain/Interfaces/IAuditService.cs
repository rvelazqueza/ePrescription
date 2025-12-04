using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Audit service interface for FDA 21 CFR Part 11 compliance
/// Provides immutable audit trail for all critical operations
/// </summary>
public interface IAuditService
{
    /// <summary>
    /// Logs a create operation
    /// </summary>
    Task LogCreateAsync(
        string entityType,
        string entityId,
        object afterValue,
        Guid? userId = null,
        string? username = null,
        string? ipAddress = null,
        Dictionary<string, object>? metadata = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Logs an update operation with before and after values
    /// </summary>
    Task LogUpdateAsync(
        string entityType,
        string entityId,
        object beforeValue,
        object afterValue,
        Guid? userId = null,
        string? username = null,
        string? ipAddress = null,
        Dictionary<string, object>? metadata = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Logs a delete operation
    /// </summary>
    Task LogDeleteAsync(
        string entityType,
        string entityId,
        object beforeValue,
        Guid? userId = null,
        string? username = null,
        string? ipAddress = null,
        Dictionary<string, object>? metadata = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Logs a custom action (login, logout, prescription dispensed, etc.)
    /// </summary>
    Task LogActionAsync(
        string actionType,
        string entityType,
        string? entityId = null,
        object? data = null,
        Guid? userId = null,
        string? username = null,
        string? ipAddress = null,
        Dictionary<string, object>? metadata = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Logs AI analysis operation for medical traceability
    /// </summary>
    Task LogAIAnalysisAsync(
        string analysisType,
        object inputData,
        object outputData,
        string? aiProvider = null,
        int? processingTimeMs = null,
        decimal? confidenceScore = null,
        bool wasAccepted = false,
        Guid? userId = null,
        Guid? prescriptionId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Queries audit logs with filters
    /// </summary>
    Task<IEnumerable<AuditLog>> GetAuditLogsAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? userId = null,
        string? actionType = null,
        string? entityType = null,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets audit trail for a specific entity
    /// </summary>
    Task<IEnumerable<AuditLog>> GetEntityAuditTrailAsync(
        string entityType,
        string entityId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Queries AI analysis logs
    /// </summary>
    Task<IEnumerable<AIAnalysisLog>> GetAIAnalysisLogsAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? analysisType = null,
        Guid? userId = null,
        Guid? prescriptionId = null,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates audit log integrity (for compliance verification)
    /// </summary>
    Task<bool> ValidateAuditIntegrityAsync(
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default);
}
