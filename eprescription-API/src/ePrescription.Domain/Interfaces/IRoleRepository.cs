using EPrescription.Domain.Entities;

namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Role repository interface
/// </summary>
public interface IRoleRepository : IRepository<Role>
{
    Task<Role?> GetByNameAsync(string roleName, CancellationToken cancellationToken = default);
    Task<Role?> GetByKeycloakRoleIdAsync(string keycloakRoleId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Role>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<Role?> GetWithPermissionsAsync(Guid roleId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Permission>> GetRolePermissionsAsync(Guid roleId, CancellationToken cancellationToken = default);
}
