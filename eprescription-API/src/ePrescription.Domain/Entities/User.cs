namespace EPrescription.Domain.Entities;

/// <summary>
/// User entity - represents system users (doctors, pharmacists, admins, etc.)
/// Maps to USERS table in Oracle
/// Synced with Keycloak
/// </summary>
public class User : BaseEntity
{
    public string Username { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string? KeycloakUserId { get; private set; }
    public bool IsActive { get; private set; } = true;
    public DateTime? LastLogin { get; private set; }

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; private set; } = new List<UserRole>();
    public virtual ICollection<Dispensation> Dispensations { get; private set; } = new List<Dispensation>();

    private User() { } // EF Core

    public User(
        string username,
        string email,
        string? keycloakUserId = null)
    {
        Username = username;
        Email = email;
        KeycloakUserId = keycloakUserId;
        IsActive = true;
    }

    public void UpdateProfile(string email)
    {
        Email = email;
        UpdateTimestamp();
    }

    public void RecordLogin()
    {
        LastLogin = DateTime.UtcNow;
        UpdateTimestamp();
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
