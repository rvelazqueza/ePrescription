using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Permission repository interface
/// </summary>
public interface IPermissionRepository : IRepository<Permission>
{
    Task<Permission?> GetByNameAsync(string permissionName, CancellationToken cancellationToken = default);
    Task<IEnumerable<Permission>> GetByResourceAsync(string resourceName, CancellationToken cancellationToken = default);
    Task<IEnumerable<Permission>> GetByActionAsync(string action, CancellationToken cancellationToken = default);
}
