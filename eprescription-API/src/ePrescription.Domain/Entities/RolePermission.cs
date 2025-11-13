namespace EPrescription.Domain.Entities;

/// <summary>
/// Role permission - many-to-many relationship between roles and permissions
/// Maps to ROLE_PERMISSIONS table in Oracle
/// </summary>
public class RolePermission : BaseEntity
{
    public Guid RoleId { get; private set; }
    public Guid PermissionId { get; private set; }
    public DateTime GrantedAt { get; private set; }

    // Navigation properties
    public virtual Role Role { get; private set; } = null!;
    public virtual Permission Permission { get; private set; } = null!;

    private RolePermission() { } // EF Core

    public RolePermission(Guid roleId, Guid permissionId)
    {
        RoleId = roleId;
        PermissionId = permissionId;
        GrantedAt = DateTime.UtcNow;
    }
}
