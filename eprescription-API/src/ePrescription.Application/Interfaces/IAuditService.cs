using EPrescription.Domain.Entities;

namespace EPrescription.Application.Interfaces;

/// <summary>
/// Service for managing audit logs and tracking system operations
/// Implements FDA 21 CFR Part 11 compliance for electronic records
/// </summary>
public interface IAuditService
{
    /// <summary>
    /// Logs a critical operation with full audit trail
    /// </summary>
    Task LogOperationAsync(
        string action,
        string entityType,
        string entityId,
        string? beforeValue = null,
        string? afterValue = null,
        string? additionalInfo = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Logs user authentication events
    /// </summary>
    Task LogAuthenticationAsync(
        string userId,
        string action,
        bool success,
        string? ipAddress = null,
        string? additionalInfo = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Logs AI assistant operations
    /// </summary>
    Task LogAIOperationAsync(
        string userId,
        string operation,
        string inputData,
        string outputData,
        string? modelUsed = null,
        Dictionary<string, object>? metrics = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves audit logs with filtering and pagination
    /// </summary>
    Task<(IEnumerable<AuditLog> Logs, int TotalCount)> GetAuditLogsAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? userId = null,
        string? action = null,
        string? entityType = null,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a specific audit log by ID
    /// </summary>
    Task<AuditLog?> GetAuditLogByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates audit log immutability (for compliance verification)
    /// </summary>
    Task<bool> ValidateAuditIntegrityAsync(
        Guid auditLogId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets audit statistics for a specific period
    /// </summary>
    Task<AuditStatistics> GetAuditStatisticsAsync(
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Statistics for audit operations
/// </summary>
public class AuditStatistics
{
    public int TotalOperations { get; set; }
    public int AuthenticationAttempts { get; set; }
    public int SuccessfulAuthentications { get; set; }
    public int FailedAuthentications { get; set; }
    public int AIOperations { get; set; }
    public Dictionary<string, int> OperationsByType { get; set; } = new();
    public Dictionary<string, int> OperationsByUser { get; set; } = new();
    public List<string> MostActiveUsers { get; set; } = new();
    public List<string> MostCommonOperations { get; set; } = new();
}
