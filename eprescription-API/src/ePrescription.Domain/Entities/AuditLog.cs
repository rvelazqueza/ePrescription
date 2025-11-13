namespace EPrescription.Domain.Entities;

/// <summary>
/// Audit log entity - IMMUTABLE audit trail for FDA 21 CFR Part 11 compliance
/// Maps to AUDIT_LOGS table in Oracle
/// WARNING: This entity is IMMUTABLE - no updates or deletes allowed (enforced by DB trigger)
/// </summary>
public class AuditLog : BaseEntity
{
    public DateTime Timestamp { get; private set; }
    public Guid? UserId { get; private set; }
    public string? Username { get; private set; }
    public string? IpAddress { get; private set; }
    public string ActionType { get; private set; } = string.Empty;
    public string EntityType { get; private set; } = string.Empty;
    public string? EntityId { get; private set; }
    public string? BeforeValue { get; private set; } // JSON
    public string? AfterValue { get; private set; } // JSON
    public string? Metadata { get; private set; } // JSON
    public string? SessionId { get; private set; }

    // Navigation property
    public virtual User? User { get; private set; }

    private AuditLog() { } // EF Core

    /// <summary>
    /// Creates a new audit log entry
    /// </summary>
    /// <param name="actionType">Action type (e.g., CREATE_PRESCRIPTION, UPDATE_PATIENT, LOGIN)</param>
    /// <param name="entityType">Entity type affected (e.g., Prescription, Patient)</param>
    /// <param name="userId">User who performed the action</param>
    /// <param name="username">Username (denormalized for immutability)</param>
    /// <param name="ipAddress">IP address of the request</param>
    /// <param name="entityId">ID of the affected entity</param>
    /// <param name="beforeValue">State before change (JSON)</param>
    /// <param name="afterValue">State after change (JSON)</param>
    /// <param name="metadata">Additional metadata (JSON)</param>
    /// <param name="sessionId">Session identifier</param>
    public AuditLog(
        string actionType,
        string entityType,
        Guid? userId = null,
        string? username = null,
        string? ipAddress = null,
        string? entityId = null,
        string? beforeValue = null,
        string? afterValue = null,
        string? metadata = null,
        string? sessionId = null)
    {
        Timestamp = DateTime.UtcNow;
        ActionType = actionType;
        EntityType = entityType;
        UserId = userId;
        Username = username;
        IpAddress = ipAddress;
        EntityId = entityId;
        BeforeValue = beforeValue;
        AfterValue = afterValue;
        Metadata = metadata;
        SessionId = sessionId;
    }

    // NO UPDATE METHODS - This entity is IMMUTABLE by design (FDA 21 CFR Part 11)
}
