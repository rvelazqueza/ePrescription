namespace EPrescription.Domain.Entities;

/// <summary>
/// Permission entity - represents granular permissions in the system
/// Maps to PERMISSIONS table in Oracle
/// </summary>
public class Permission : BaseEntity
{
    public string PermissionName { get; private set; } = string.Empty;
    public string ResourceName { get; private set; } = string.Empty;
    public string Action { get; private set; } = string.Empty; // create, read, update, delete
    public string? Description { get; private set; }

    // Navigation properties
    public virtual ICollection<RolePermission> RolePermissions { get; private set; } = new List<RolePermission>();

    private Permission() { } // EF Core

    public Permission(string permissionName, string resourceName, string action, string? description = null)
    {
        PermissionName = permissionName;
        ResourceName = resourceName;
        Action = action;
        Description = description;
    }

    public void UpdateDescription(string? description)
    {
        Description = description;
        UpdateTimestamp();
    }
}
