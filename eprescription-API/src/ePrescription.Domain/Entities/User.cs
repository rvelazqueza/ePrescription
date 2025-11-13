namespace EPrescription.Domain.Entities;

/// <summary>
/// User entity - represents system users (doctors, pharmacists, admins, etc.)
/// Maps to USERS table in Oracle
/// Synced with Keycloak
/// </summary>
public class User : BaseEntity
{
    public string KeycloakUserId { get; private set; } = string.Empty;
    public string Username { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; private set; } = new List<UserRole>();
    public virtual ICollection<Dispensation> Dispensations { get; private set; } = new List<Dispensation>();

    private User() { } // EF Core

    public User(
        string keycloakUserId,
        string username,
        string email,
        string firstName,
        string lastName)
    {
        KeycloakUserId = keycloakUserId;
        Username = username;
        Email = email;
        FirstName = firstName;
        LastName = lastName;
        IsActive = true;
    }

    public void UpdateProfile(string email, string firstName, string lastName)
    {
        Email = email;
        FirstName = firstName;
        LastName = lastName;
        UpdateTimestamp();
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
