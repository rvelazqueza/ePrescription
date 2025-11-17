using ePrescription.Domain.Entities;

namespace ePrescription.Application.Interfaces;

/// <summary>
/// Service for managing ICD-10 (CIE-10) catalog operations
/// Provides search, validation, and retrieval of ICD-10 diagnosis codes
/// Uses local database with WHO API as fallback
/// </summary>
public interface ICIE10CatalogService
{
    /// <summary>
    /// Search for an ICD-10 code by its exact code
    /// </summary>
    /// <param name="code">ICD-10 code (e.g., "A00.0", "J45.9")</param>
    /// <returns>ICD-10 code details or null if not found</returns>
    Task<ICD10Code?> GetByCodeAsync(string code);

    /// <summary>
    /// Search ICD-10 codes by description (partial match)
    /// </summary>
    /// <param name="description">Description to search for</param>
    /// <param name="maxResults">Maximum number of results to return (default: 20)</param>
    /// <returns>List of matching ICD-10 codes</returns>
    Task<List<ICD10Code>> SearchByDescriptionAsync(string description, int maxResults = 20);

    /// <summary>
    /// Search ICD-10 codes by category
    /// </summary>
    /// <param name="category">Category code (e.g., "A00-A09" for intestinal infectious diseases)</param>
    /// <returns>List of ICD-10 codes in the category</returns>
    Task<List<ICD10Code>> SearchByCategoryAsync(string category);

    /// <summary>
    /// Validate if an ICD-10 code exists and is valid
    /// </summary>
    /// <param name="code">ICD-10 code to validate</param>
    /// <returns>True if code exists and is valid, false otherwise</returns>
    Task<bool> ValidateCodeAsync(string code);

    /// <summary>
    /// Get detailed information about an ICD-10 code including related codes
    /// </summary>
    /// <param name="code">ICD-10 code</param>
    /// <returns>Detailed ICD-10 code information or null if not found</returns>
    Task<ICD10CodeDetails?> GetCodeDetailsAsync(string code);

    /// <summary>
    /// Get the most commonly used ICD-10 codes
    /// </summary>
    /// <param name="count">Number of codes to return (default: 50)</param>
    /// <returns>List of most common ICD-10 codes</returns>
    Task<List<ICD10Code>> GetMostCommonCodesAsync(int count = 50);

    /// <summary>
    /// Synchronize local catalog with WHO API
    /// Updates existing codes and adds new ones
    /// </summary>
    /// <returns>Number of codes synchronized</returns>
    Task<int> SyncWithWHOApiAsync();

    /// <summary>
    /// Get statistics about the local ICD-10 catalog
    /// </summary>
    /// <returns>Catalog statistics</returns>
    Task<CatalogStatistics> GetCatalogStatisticsAsync();
}

/// <summary>
/// Represents an ICD-10 diagnosis code
/// </summary>
public class ICD10Code
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? Subcategory { get; set; }
    public bool IsCommon { get; set; }
    public DateTime LastUpdated { get; set; }
}

/// <summary>
/// Detailed information about an ICD-10 code
/// </summary>
public class ICD10CodeDetails : ICD10Code
{
    public string? LongDescription { get; set; }
    public List<string> RelatedCodes { get; set; } = new();
    public List<string> Synonyms { get; set; } = new();
    public string? ClinicalNotes { get; set; }
    public int UsageCount { get; set; }
}

/// <summary>
/// Statistics about the ICD-10 catalog
/// </summary>
public class CatalogStatistics
{
    public int TotalCodes { get; set; }
    public int CommonCodes { get; set; }
    public DateTime LastSyncDate { get; set; }
    public int CodesAddedLastSync { get; set; }
    public int CodesUpdatedLastSync { get; set; }
    public Dictionary<string, int> CodesByCategory { get; set; } = new();
}
