namespace EPrescription.Domain.Entities;

/// <summary>
/// User role - many-to-many relationship between users and roles
/// Maps to USER_ROLES table in Oracle
/// </summary>
public class UserRole : BaseEntity
{
    public Guid UserId { get; private set; }
    public Guid RoleId { get; private set; }
    public DateTime AssignedAt { get; private set; }
    public Guid? AssignedBy { get; private set; }

    // Navigation properties
    public virtual User User { get; private set; } = null!;
    public virtual Role Role { get; private set; } = null!;
    public virtual User? AssignedByUser { get; private set; }

    private UserRole() { } // EF Core

    public UserRole(Guid userId, Guid roleId, Guid? assignedBy = null)
    {
        UserId = userId;
        RoleId = roleId;
        AssignedAt = DateTime.UtcNow;
        AssignedBy = assignedBy;
    }
}
