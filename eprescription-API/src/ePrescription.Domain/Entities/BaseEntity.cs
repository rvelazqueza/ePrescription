namespace EPrescription.Domain.Entities;

/// <summary>
/// Base entity class for all domain entities
/// Provides common properties: Id, CreatedAt, UpdatedAt
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Unique identifier (maps to Oracle RAW(16) with SYS_GUID())
    /// </summary>
    public Guid Id { get; protected set; }

    /// <summary>
    /// Timestamp when the entity was created
    /// </summary>
    public DateTime CreatedAt { get; protected set; }

    /// <summary>
    /// Timestamp when the entity was last updated
    /// </summary>
    public DateTime UpdatedAt { get; protected set; }

    protected BaseEntity()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Updates the UpdatedAt timestamp
    /// Should be called before saving changes
    /// </summary>
    public void UpdateTimestamp()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}
