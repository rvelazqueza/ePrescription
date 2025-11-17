using EPrescription.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Text.Json;

namespace EPrescription.Infrastructure.Persistence.Interceptors;

/// <summary>
/// EF Core interceptor for automatic audit logging
/// Captures all changes to entities and creates audit logs
/// </summary>
public class AuditInterceptor : SaveChangesInterceptor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditInterceptor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        if (eventData.Context != null)
        {
            CreateAuditLogs(eventData.Context);
        }
        return base.SavingChanges(eventData, result);
    }

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context != null)
        {
            CreateAuditLogs(eventData.Context);
        }
        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void CreateAuditLogs(DbContext context)
    {
        var entries = context.ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added ||
                       e.State == EntityState.Modified ||
                       e.State == EntityState.Deleted)
            .Where(e => e.Entity is not AuditLog) // Don't audit the audit logs themselves
            .ToList();

        foreach (var entry in entries)
        {
            var auditLog = CreateAuditLogForEntry(entry);
            if (auditLog != null)
            {
                context.Set<AuditLog>().Add(auditLog);
            }
        }
    }

    private AuditLog? CreateAuditLogForEntry(EntityEntry entry)
    {
        try
        {
            var entityType = entry.Entity.GetType().Name;
            var actionType = GetActionType(entry.State);
            var entityId = GetEntityId(entry);
            var beforeValue = GetBeforeValue(entry);
            var afterValue = GetAfterValue(entry);

            var httpContext = _httpContextAccessor.HttpContext;
            var userId = GetCurrentUserId(httpContext);
            var username = GetCurrentUsername(httpContext);
            var ipAddress = GetClientIpAddress(httpContext);
            var sessionId = httpContext?.Session?.Id;

            return new AuditLog(
                actionType: actionType,
                entityType: entityType,
                userId: userId,
                username: username,
                ipAddress: ipAddress,
                entityId: entityId,
                beforeValue: beforeValue,
                afterValue: afterValue,
                sessionId: sessionId
            );
        }
        catch (Exception)
        {
            // If audit log creation fails, don't break the operation
            return null;
        }
    }

    private string GetActionType(EntityState state)
    {
        return state switch
        {
            EntityState.Added => "CREATE",
            EntityState.Modified => "UPDATE",
            EntityState.Deleted => "DELETE",
            _ => "UNKNOWN"
        };
    }

    private string? GetEntityId(EntityEntry entry)
    {
        try
        {
            // Try to get the Id property
            var idProperty = entry.Properties.FirstOrDefault(p => p.Metadata.Name == "Id");
            if (idProperty != null)
            {
                return idProperty.CurrentValue?.ToString();
            }

            // Try to get primary key
            var keyValues = entry.Properties
                .Where(p => p.Metadata.IsPrimaryKey())
                .Select(p => p.CurrentValue?.ToString())
                .Where(v => v != null);

            return string.Join(",", keyValues);
        }
        catch
        {
            return null;
        }
    }

    private string? GetBeforeValue(EntityEntry entry)
    {
        if (entry.State == EntityState.Added)
        {
            return null; // No before value for new entities
        }

        try
        {
            var beforeValues = new Dictionary<string, object?>();

            foreach (var property in entry.Properties)
            {
                // Skip navigation properties and collections
                if (property.Metadata.IsKey() || !property.Metadata.IsForeignKey())
                {
                    var originalValue = entry.State == EntityState.Modified
                        ? property.OriginalValue
                        : property.CurrentValue;

                    beforeValues[property.Metadata.Name] = originalValue;
                }
            }

            return JsonSerializer.Serialize(beforeValues, new JsonSerializerOptions
            {
                WriteIndented = false,
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            });
        }
        catch
        {
            return null;
        }
    }

    private string? GetAfterValue(EntityEntry entry)
    {
        if (entry.State == EntityState.Deleted)
        {
            return null; // No after value for deleted entities
        }

        try
        {
            var afterValues = new Dictionary<string, object?>();

            foreach (var property in entry.Properties)
            {
                // Skip navigation properties and collections
                if (property.Metadata.IsKey() || !property.Metadata.IsForeignKey())
                {
                    afterValues[property.Metadata.Name] = property.CurrentValue;
                }
            }

            return JsonSerializer.Serialize(afterValues, new JsonSerializerOptions
            {
                WriteIndented = false,
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
            });
        }
        catch
        {
            return null;
        }
    }

    private Guid? GetCurrentUserId(HttpContext? httpContext)
    {
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

    private string? GetCurrentUsername(HttpContext? httpContext)
    {
        if (httpContext?.User?.Identity?.IsAuthenticated == true)
        {
            return httpContext.User.Identity.Name ??
                   httpContext.User.FindFirst("preferred_username")?.Value ??
                   httpContext.User.FindFirst("email")?.Value;
        }
        return "System";
    }

    private string? GetClientIpAddress(HttpContext? httpContext)
    {
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
}
