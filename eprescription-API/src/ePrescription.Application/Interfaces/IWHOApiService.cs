namespace EPrescription.Application.Interfaces;

/// <summary>
/// Service for integrating with WHO ICD API
/// Allows synchronization and querying of the official ICD-10 catalog
/// </summary>
public interface IWHOApiService
{
    /// <summary>
    /// Authenticate with WHO API using OAuth 2.0
    /// </summary>
    Task<string> AuthenticateAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Synchronize complete ICD-10 catalog from WHO API
    /// </summary>
    Task<WHOSyncResult> SyncICD10CatalogAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Search ICD-10 codes by search term
    /// </summary>
    Task<List<ICD10Code>> SearchICD10CodesAsync(string searchTerm, string language = "es", CancellationToken cancellationToken = default);

    /// <summary>
    /// Get detailed information for a specific ICD-10 code
    /// </summary>
    Task<ICD10CodeDetail?> GetICD10CodeDetailAsync(string code, string language = "es", CancellationToken cancellationToken = default);

    /// <summary>
    /// Validate if an ICD-10 code exists and is active
    /// </summary>
    Task<bool> ValidateICD10CodeAsync(string code, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get the date of the last synchronization
    /// </summary>
    Task<DateTime?> GetLastSyncDateAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Check connectivity status with WHO API
    /// </summary>
    Task<bool> CheckAPIHealthAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// WHO API synchronization result
/// </summary>
public class WHOSyncResult
{
    public bool Success { get; set; }
    public int CodesAdded { get; set; }
    public int CodesUpdated { get; set; }
    public int CodesRemoved { get; set; }
    public DateTime SyncDate { get; set; }
    public TimeSpan Duration { get; set; }
    public List<string> Errors { get; set; } = new();
    public string? ErrorMessage { get; set; }
}

/// <summary>
/// Basic ICD-10 code for searches
/// </summary>
public class ICD10Code
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Language { get; set; } = "es";
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Detailed information for an ICD-10 code
/// </summary>
public class ICD10CodeDetail : ICD10Code
{
    public string? ParentCode { get; set; }
    public List<string> ChildCodes { get; set; } = new();
    public List<string> Synonyms { get; set; } = new();
    public List<string> Exclusions { get; set; } = new();
    public List<string> Inclusions { get; set; } = new();
    public string? CodingHint { get; set; }
    public DateTime LastUpdated { get; set; }
    public string Source { get; set; } = "WHO";
}
