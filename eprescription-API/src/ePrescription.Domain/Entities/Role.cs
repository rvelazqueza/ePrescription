namespace EPrescription.Domain.Entities;

/// <summary>
/// Role entity - represents user roles in the system
/// Maps to ROLES table in Oracle
/// Synced with Keycloak roles
/// </summary>
public class Role : BaseEntity
{
    public string RoleName { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; private set; } = new List<UserRole>();
    public virtual ICollection<RolePermission> RolePermissions { get; private set; } = new List<RolePermission>();

    private Role() { } // EF Core

    public Role(string roleName, string description)
    {
        RoleName = roleName;
        Description = description;
        IsActive = true;
    }

    public void UpdateDescription(string description)
    {
        Description = description;
        UpdateTimestamp();
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
