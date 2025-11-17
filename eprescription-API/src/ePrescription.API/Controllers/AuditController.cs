using EPrescription.Application.Interfaces;
using EPrescription.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPrescription.API.Controllers;

/// <summary>
/// Controller for audit log management and compliance reporting
/// Restricted to auditor role for FDA 21 CFR Part 11 compliance
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "auditor,admin")]
public class AuditController : ControllerBase
{
    private readonly IAuditService _auditService;
    private readonly IAuditRetentionService _retentionService;
    private readonly ILogger<AuditController> _logger;

    public AuditController(
        IAuditService auditService,
        IAuditRetentionService retentionService,
        ILogger<AuditController> logger)
    {
        _auditService = auditService;
        _retentionService = retentionService;
        _logger = logger;
    }

    /// <summary>
    /// Get audit logs with filtering and pagination
    /// </summary>
    /// <param name="startDate">Start date for filtering (optional)</param>
    /// <param name="endDate">End date for filtering (optional)</param>
    /// <param name="userId">User ID for filtering (optional)</param>
    /// <param name="action">Action type for filtering (optional)</param>
    /// <param name="entityType">Entity type for filtering (optional)</param>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 50, max: 100)</param>
    /// <returns>Paginated list of audit logs</returns>
    [HttpGet]
    [ProducesResponseType(typeof(AuditLogsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AuditLogsResponse>> GetAuditLogs(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] string? userId = null,
        [FromQuery] string? action = null,
        [FromQuery] string? entityType = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            // Validate pagination
            if (pageNumber < 1)
            {
                return BadRequest("Page number must be greater than 0");
            }

            if (pageSize < 1 || pageSize > 100)
            {
                return BadRequest("Page size must be between 1 and 100");
            }

            // Validate date range
            if (startDate.HasValue && endDate.HasValue && startDate > endDate)
            {
                return BadRequest("Start date must be before end date");
            }

            var (logs, totalCount) = await _auditService.GetAuditLogsAsync(
                startDate,
                endDate,
                userId,
                action,
                entityType,
                pageNumber,
                pageSize);

            var response = new AuditLogsResponse
            {
                Logs = logs.Select(MapToDto).ToList(),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving audit logs");
            return StatusCode(500, "An error occurred while retrieving audit logs");
        }
    }

    /// <summary>
    /// Get a specific audit log by ID
    /// </summary>
    /// <param name="id">Audit log ID</param>
    /// <returns>Audit log details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AuditLogDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AuditLogDto>> GetAuditLogById(Guid id)
    {
        try
        {
            var auditLog = await _auditService.GetAuditLogByIdAsync(id);

            if (auditLog == null)
            {
                return NotFound($"Audit log with ID {id} not found");
            }

            return Ok(MapToDto(auditLog));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving audit log {AuditLogId}", id);
            return StatusCode(500, "An error occurred while retrieving the audit log");
        }
    }

    /// <summary>
    /// Validate audit log integrity
    /// </summary>
    /// <param name="id">Audit log ID</param>
    /// <returns>Validation result</returns>
    [HttpGet("{id}/validate")]
    [ProducesResponseType(typeof(AuditValidationResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AuditValidationResponse>> ValidateAuditLog(Guid id)
    {
        try
        {
            var isValid = await _auditService.ValidateAuditIntegrityAsync(id);

            return Ok(new AuditValidationResponse
            {
                AuditLogId = id,
                IsValid = isValid,
                ValidatedAt = DateTime.UtcNow,
                Message = isValid
                    ? "Audit log integrity verified"
                    : "Audit log integrity check failed"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating audit log {AuditLogId}", id);
            return StatusCode(500, "An error occurred while validating the audit log");
        }
    }

    /// <summary>
    /// Get audit statistics for a specific period
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <returns>Audit statistics</returns>
    [HttpGet("statistics")]
    [ProducesResponseType(typeof(AuditStatistics), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AuditStatistics>> GetStatistics(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            if (startDate > endDate)
            {
                return BadRequest("Start date must be before end date");
            }

            var statistics = await _auditService.GetAuditStatisticsAsync(startDate, endDate);

            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving audit statistics");
            return StatusCode(500, "An error occurred while retrieving audit statistics");
        }
    }

    /// <summary>
    /// Get retention policy information
    /// Shows current retention policy and archival statistics
    /// </summary>
    /// <returns>Retention policy information</returns>
    [HttpGet("retention-policy")]
    [ProducesResponseType(typeof(RetentionPolicyInfo), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<RetentionPolicyInfo>> GetRetentionPolicy()
    {
        try
        {
            var policyInfo = await _retentionService.GetRetentionPolicyInfoAsync();
            return Ok(policyInfo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving retention policy information");
            return StatusCode(500, "An error occurred while retrieving retention policy information");
        }
    }

    /// <summary>
    /// Get count of logs eligible for archival
    /// </summary>
    /// <param name="retentionYears">Retention period in years (default: 7)</param>
    /// <returns>Count of archivable logs</returns>
    [HttpGet("archivable-count")]
    [ProducesResponseType(typeof(ArchivableCountResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ArchivableCountResponse>> GetArchivableCount(
        [FromQuery] int retentionYears = 7)
    {
        try
        {
            if (retentionYears < 1 || retentionYears > 50)
            {
                return BadRequest("Retention years must be between 1 and 50");
            }

            var count = await _retentionService.GetArchivableLogsCountAsync(retentionYears);
            var cutoffDate = DateTime.UtcNow.AddYears(-retentionYears);

            return Ok(new ArchivableCountResponse
            {
                Count = count,
                RetentionYears = retentionYears,
                CutoffDate = cutoffDate
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving archivable logs count");
            return StatusCode(500, "An error occurred while retrieving archivable logs count");
        }
    }

    /// <summary>
    /// Archive old audit logs (admin only)
    /// WARNING: This operation should only be performed after proper backup
    /// </summary>
    /// <param name="retentionYears">Retention period in years (default: 7)</param>
    /// <returns>Number of logs archived</returns>
    [HttpPost("archive")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ArchiveResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ArchiveResponse>> ArchiveOldLogs(
        [FromQuery] int retentionYears = 7)
    {
        try
        {
            if (retentionYears < 1 || retentionYears > 50)
            {
                return BadRequest("Retention years must be between 1 and 50");
            }

            _logger.LogWarning(
                "Audit log archival initiated by user {Username} for logs older than {Years} years",
                User.Identity?.Name, retentionYears);

            var archivedCount = await _retentionService.ArchiveOldLogsAsync(retentionYears);

            return Ok(new ArchiveResponse
            {
                ArchivedCount = archivedCount,
                RetentionYears = retentionYears,
                ArchivedAt = DateTime.UtcNow,
                Message = archivedCount > 0
                    ? $"Found {archivedCount} logs eligible for archival. Actual archival requires external storage configuration."
                    : "No logs found for archival"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during audit log archival");
            return StatusCode(500, "An error occurred during audit log archival");
        }
    }

    #region Private Helper Methods

    private static AuditLogDto MapToDto(AuditLog auditLog)
    {
        return new AuditLogDto
        {
            Id = auditLog.Id,
            Timestamp = auditLog.Timestamp,
            UserId = auditLog.UserId,
            Username = auditLog.Username,
            IpAddress = auditLog.IpAddress,
            ActionType = auditLog.ActionType,
            EntityType = auditLog.EntityType,
            EntityId = auditLog.EntityId,
            BeforeValue = auditLog.BeforeValue,
            AfterValue = auditLog.AfterValue,
            Metadata = auditLog.Metadata,
            SessionId = auditLog.SessionId
        };
    }

    #endregion
}

#region DTOs

public class AuditLogsResponse
{
    public List<AuditLogDto> Logs { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class AuditLogDto
{
    public Guid Id { get; set; }
    public DateTime Timestamp { get; set; }
    public Guid? UserId { get; set; }
    public string? Username { get; set; }
    public string? IpAddress { get; set; }
    public string ActionType { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public string? BeforeValue { get; set; }
    public string? AfterValue { get; set; }
    public string? Metadata { get; set; }
    public string? SessionId { get; set; }
}

public class AuditValidationResponse
{
    public Guid AuditLogId { get; set; }
    public bool IsValid { get; set; }
    public DateTime ValidatedAt { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class ArchivableCountResponse
{
    public int Count { get; set; }
    public int RetentionYears { get; set; }
    public DateTime CutoffDate { get; set; }
}

public class ArchiveResponse
{
    public int ArchivedCount { get; set; }
    public int RetentionYears { get; set; }
    public DateTime ArchivedAt { get; set; }
    public string Message { get; set; } = string.Empty;
}

#endregion
