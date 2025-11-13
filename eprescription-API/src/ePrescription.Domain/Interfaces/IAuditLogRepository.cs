using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Audit Log repository interface (READ-ONLY for immutability)
/// FDA 21 CFR Part 11 compliance - audit logs are immutable
/// </summary>
public interface IAuditLogRepository : IRepository<AuditLog>
{
    Task<IEnumerable<AuditLog>> GetByUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<AuditLog>> GetByActionTypeAsync(string actionType, CancellationToken cancellationToken = default);
    Task<IEnumerable<AuditLog>> GetByEntityTypeAsync(string entityType, CancellationToken cancellationToken = default);
    Task<IEnumerable<AuditLog>> GetByEntityAsync(string entityType, string entityId, CancellationToken cancellationToken = default);
    Task<IEnumerable<AuditLog>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task<IEnumerable<AuditLog>> GetByIpAddressAsync(string ipAddress, CancellationToken cancellationToken = default);
    Task<IEnumerable<AuditLog>> SearchAsync(
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? userId = null,
        string? actionType = null,
        string? entityType = null,
        string? ipAddress = null,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default);
}
