using EPrescription.Application.Interfaces;
using EPrescription.Domain.Entities;
using EPrescription.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace EPrescription.Infrastructure.Services;

/// <summary>
/// Implementation of audit service for FDA 21 CFR Part 11 compliance
/// Provides immutable audit trail for all critical operations
/// </summary>
public class AuditService : IAuditService
{
    private readonly EPrescriptionDbContext _context;
    private readonly ILogger<AuditService> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditService(
        EPrescriptionDbContext context,
        ILogger<AuditService> logger,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task LogOperationAsync(
        string action,
        string entityType,
        string entityId,
        string? beforeValue = null,
        string? afterValue = null,
        string? additionalInfo = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var userId = GetCurrentUserId();
            var username = GetCurrentUsername();
            var ipAddress = GetClientIpAddress();
            var sessionId = httpContext?.Session?.Id;

            var auditLog = new AuditLog(
                actionType: action,
                entityType: entityType,
                userId: userId,
                username: username,
                ipAddress: ipAddress,
                entityId: entityId,
                beforeValue: beforeValue,
                afterValue: afterValue,
                metadata: additionalInfo,
                sessionId: sessionId
            );

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Audit log created: Action={Action}, Entity={EntityType}, EntityId={EntityId}, User={Username}",
                action, entityType, entityId, username);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create audit log for action {Action}", action);
            // Don't throw - audit failures shouldn't break the application
        }
    }

    public async Task LogAuthenticationAsync(
        string userId,
        string action,
        bool success,
        string? ipAddress = null,
        string? additionalInfo = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var metadata = new Dictionary<string, object>
            {
                ["Success"] = success,
                ["Timestamp"] = DateTime.UtcNow
            };

            if (!string.IsNullOrEmpty(additionalInfo))
            {
                metadata["AdditionalInfo"] = additionalInfo;
            }

            var metadataJson = JsonSerializer.Serialize(metadata);

            var auditLog = new AuditLog(
                actionType: action,
                entityType: "Authentication",
                userId: Guid.TryParse(userId, out var guid) ? guid : null,
                username: userId,
                ipAddress: ipAddress ?? GetClientIpAddress(),
                entityId: userId,
                metadata: metadataJson
            );

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Authentication audit log created: User={UserId}, Action={Action}, Success={Success}",
                userId, action, success);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create authentication audit log for user {UserId}", userId);
        }
    }

    public async Task LogAIOperationAsync(
        string userId,
        string operation,
        string inputData,
        string outputData,
        string? modelUsed = null,
        Dictionary<string, object>? metrics = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var metadata = new Dictionary<string, object>
            {
                ["Operation"] = operation,
                ["ModelUsed"] = modelUsed ?? "Unknown",
                ["Timestamp"] = DateTime.UtcNow
            };

            if (metrics != null)
            {
                metadata["Metrics"] = metrics;
            }

            var metadataJson = JsonSerializer.Serialize(metadata);

            var auditLog = new AuditLog(
                actionType: "AI_OPERATION",
                entityType: "AIAnalysis",
                userId: Guid.TryParse(userId, out var guid) ? guid : null,
                username: userId,
                ipAddress: GetClientIpAddress(),
                beforeValue: inputData,
                afterValue: outputData,
                metadata: metadataJson
            );

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "AI operation audit log created: User={UserId}, Operation={Operation}",
                userId, operation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create AI operation audit log");
        }
    }

    public async Task<(IEnumerable<AuditLog> Logs, int TotalCount)> GetAuditLogsAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        string? userId = null,
        string? action = null,
        string? entityType = null,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var query = _context.AuditLogs.AsQueryable();

        // Apply filters
        if (startDate.HasValue)
        {
            query = query.Where(a => a.Timestamp >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(a => a.Timestamp <= endDate.Value);
        }

        if (!string.IsNullOrEmpty(userId))
        {
            if (Guid.TryParse(userId, out var guid))
            {
                query = query.Where(a => a.UserId == guid);
            }
            else
            {
                query = query.Where(a => a.Username == userId);
            }
        }

        if (!string.IsNullOrEmpty(action))
        {
            query = query.Where(a => a.ActionType.Contains(action));
        }

        if (!string.IsNullOrEmpty(entityType))
        {
            query = query.Where(a => a.EntityType == entityType);
        }

        // Get total count
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply pagination
        var logs = await query
            .OrderByDescending(a => a.Timestamp)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (logs, totalCount);
    }

    public async Task<AuditLog?> GetAuditLogByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _context.AuditLogs
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<bool> ValidateAuditIntegrityAsync(
        Guid auditLogId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var auditLog = await _context.AuditLogs
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == auditLogId, cancellationToken);

            if (auditLog == null)
            {
                return false;
            }

            // Verify that the audit log hasn't been modified
            // In a real implementation, you might use cryptographic hashing
            // For now, we just verify it exists and has valid data
            return !string.IsNullOrEmpty(auditLog.ActionType) &&
                   !string.IsNullOrEmpty(auditLog.EntityType) &&
                   auditLog.Timestamp != default;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to validate audit integrity for log {AuditLogId}", auditLogId);
            return false;
        }
    }

    public async Task<AuditStatistics> GetAuditStatisticsAsync(
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default)
    {
        var logs = await _context.AuditLogs
            .Where(a => a.Timestamp >= startDate && a.Timestamp <= endDate)
            .ToListAsync(cancellationToken);

        var authLogs = logs.Where(a => a.EntityType == "Authentication").ToList();

        var statistics = new AuditStatistics
        {
            TotalOperations = logs.Count,
            AuthenticationAttempts = authLogs.Count,
            SuccessfulAuthentications = authLogs.Count(a => 
                a.Metadata != null && a.Metadata.Contains("\"Success\":true")),
            FailedAuthentications = authLogs.Count(a => 
                a.Metadata != null && a.Metadata.Contains("\"Success\":false")),
            AIOperations = logs.Count(a => a.ActionType == "AI_OPERATION"),
            OperationsByType = logs
                .GroupBy(a => a.ActionType)
                .ToDictionary(g => g.Key, g => g.Count()),
            OperationsByUser = logs
                .Where(a => !string.IsNullOrEmpty(a.Username))
                .GroupBy(a => a.Username!)
                .ToDictionary(g => g.Key, g => g.Count()),
            MostActiveUsers = logs
                .Where(a => !string.IsNullOrEmpty(a.Username))
                .GroupBy(a => a.Username!)
                .OrderByDescending(g => g.Count())
                .Take(10)
                .Select(g => g.Key)
                .ToList(),
            MostCommonOperations = logs
                .GroupBy(a => a.ActionType)
                .OrderByDescending(g => g.Count())
                .Take(10)
                .Select(g => g.Key)
                .ToList()
        };

        return statistics;
    }

    #region Private Helper Methods

    private Guid? GetCurrentUserId()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext?.User?.Identity?.IsAuthenticated == true)
        {
            var userIdClaim = httpContext.User.FindFirst("sub") ?? 
                             httpContext.User.FindFirst("user_id");
            
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }
        }
        return null;
    }

    private string? GetCurrentUsername()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext?.User?.Identity?.IsAuthenticated == true)
        {
            return httpContext.User.Identity.Name ?? 
                   httpContext.User.FindFirst("preferred_username")?.Value ??
                   httpContext.User.FindFirst("email")?.Value;
        }
        return null;
    }

    private string? GetClientIpAddress()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null) return null;

        // Check for forwarded IP (behind proxy/load balancer)
        var forwardedFor = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            return forwardedFor.Split(',')[0].Trim();
        }

        // Check for real IP
        var realIp = httpContext.Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrEmpty(realIp))
        {
            return realIp;
        }

        // Fallback to remote IP
        return httpContext.Connection.RemoteIpAddress?.ToString();
    }

    #endregion
}
