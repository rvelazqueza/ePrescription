using ePrescription.Application.Interfaces;
using ePrescription.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace EPrescription.Infrastructure.Services;

/// <summary>
/// Service for managing ICD-10 (CIE-10) catalog operations
/// Implements local database search with WHO API fallback
/// </summary>
public class CIE10CatalogService : ICIE10CatalogService
{
    private readonly DbContext _context;
    private readonly IWHOApiService _whoApiService;
    private readonly IAuditService _auditService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CIE10CatalogService> _logger;
    private const string CACHE_KEY_PREFIX = "CIE10_";
    private static readonly TimeSpan CacheExpiration = TimeSpan.FromHours(24);

    public CIE10CatalogService(
        DbContext context,
        IWHOApiService whoApiService,
        IAuditService auditService,
        IMemoryCache cache,
        ILogger<CIE10CatalogService> logger)
    {
        _context = context;
        _whoApiService = whoApiService;
        _auditService = auditService;
        _cache = cache;
        _logger = logger;
    }

    public async Task<ICD10Code?> GetByCodeAsync(string code)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(code))
                return null;

            code = code.Trim().ToUpperInvariant();

            // Check cache first
            var cacheKey = $"{CACHE_KEY_PREFIX}CODE_{code}";
            if (_cache.TryGetValue<ICD10Code>(cacheKey, out var cachedCode))
            {
                _logger.LogDebug("CIE-10 code {Code} found in cache", code);
                return cachedCode;
            }

            // Search in local database
            var entity = await _context.Set<Cie10Catalog>()
                .Where(c => c.Code == code && c.IsActive)
                .FirstOrDefaultAsync();

            if (entity != null)
            {
                var result = MapToICD10Code(entity);
                _cache.Set(cacheKey, result, CacheExpiration);
                
                await _auditService.LogOperationAsync(
                    "CIE10_SEARCH",
                    "Cie10Catalog",
                    entity.Id,
                    $"Code: {code}",
                    null);

                return result;
            }

            // Fallback to WHO API
            _logger.LogInformation("CIE-10 code {Code} not found locally, trying WHO API", code);
            var whoCode = await _whoApiService.GetICD10CodeDetailsAsync(code);
            
            if (whoCode != null)
            {
                // Save to local database for future use
                var newEntity = new Cie10Catalog(
                    whoCode.Code,
                    whoCode.Title,
                    whoCode.Definition,
                    whoCode.Chapter,
                    whoCode.Chapter,
                    "WHO_API");

                _context.Set<Cie10Catalog>().Add(newEntity);
                await _context.SaveChangesAsync();

                var result = MapToICD10Code(newEntity);
                _cache.Set(cacheKey, result, CacheExpiration);

                await _auditService.LogOperationAsync(
                    "CIE10_ADDED_FROM_WHO",
                    "Cie10Catalog",
                    newEntity.Id,
                    $"Code: {code} added from WHO API",
                    null);

                return result;
            }

            _logger.LogWarning("CIE-10 code {Code} not found in local database or WHO API", code);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting CIE-10 code {Code}", code);
            throw;
        }
    }

    public async Task<List<ICD10Code>> SearchByDescriptionAsync(string description, int maxResults = 20)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(description))
                return new List<ICD10Code>();

            description = description.Trim().ToLowerInvariant();

            // Check cache
            var cacheKey = $"{CACHE_KEY_PREFIX}DESC_{description}_{maxResults}";
            if (_cache.TryGetValue<List<ICD10Code>>(cacheKey, out var cachedResults))
            {
                _logger.LogDebug("CIE-10 search results for '{Description}' found in cache", description);
                return cachedResults;
            }

            // Search in local database
            var entities = await _context.Set<Cie10Catalog>()
                .Where(c => c.IsActive && 
                    (EF.Functions.Like(c.DescriptionEs.ToLower(), $"%{description}%") ||
                     (c.DescriptionEn != null && EF.Functions.Like(c.DescriptionEn.ToLower(), $"%{description}%"))))
                .OrderBy(c => c.Code)
                .Take(maxResults)
                .ToListAsync();

            var results = entities.Select(MapToICD10Code).ToList();
            _cache.Set(cacheKey, results, CacheExpiration);

            await _auditService.LogOperationAsync(
                "CIE10_SEARCH_DESCRIPTION",
                "Cie10Catalog",
                null,
                $"Description: {description}, Results: {results.Count}",
                null);

            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching CIE-10 by description: {Description}", description);
            throw;
        }
    }

    public async Task<List<ICD10Code>> SearchByCategoryAsync(string category)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(category))
                return new List<ICD10Code>();

            category = category.Trim();

            // Check cache
            var cacheKey = $"{CACHE_KEY_PREFIX}CAT_{category}";
            if (_cache.TryGetValue<List<ICD10Code>>(cacheKey, out var cachedResults))
            {
                _logger.LogDebug("CIE-10 category {Category} found in cache", category);
                return cachedResults;
            }

            // Search in local database
            var entities = await _context.Set<Cie10Catalog>()
                .Where(c => c.IsActive && c.Category == category)
                .OrderBy(c => c.Code)
                .ToListAsync();

            var results = entities.Select(MapToICD10Code).ToList();
            _cache.Set(cacheKey, results, CacheExpiration);

            await _auditService.LogOperationAsync(
                "CIE10_SEARCH_CATEGORY",
                "Cie10Catalog",
                null,
                $"Category: {category}, Results: {results.Count}",
                null);

            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching CIE-10 by category: {Category}", category);
            throw;
        }
    }

    public async Task<bool> ValidateCodeAsync(string code)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(code))
                return false;

            code = code.Trim().ToUpperInvariant();

            // Check cache
            var cacheKey = $"{CACHE_KEY_PREFIX}VALID_{code}";
            if (_cache.TryGetValue<bool>(cacheKey, out var cachedResult))
            {
                return cachedResult;
            }

            // Check local database
            var exists = await _context.Set<Cie10Catalog>()
                .AnyAsync(c => c.Code == code && c.IsActive);

            if (exists)
            {
                _cache.Set(cacheKey, true, CacheExpiration);
                return true;
            }

            // Fallback to WHO API
            var whoCode = await _whoApiService.ValidateICD10CodeAsync(code);
            _cache.Set(cacheKey, whoCode, CacheExpiration);

            return whoCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating CIE-10 code: {Code}", code);
            return false;
        }
    }

    public async Task<ICD10CodeDetails?> GetCodeDetailsAsync(string code)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(code))
                return null;

            code = code.Trim().ToUpperInvariant();

            // Check cache
            var cacheKey = $"{CACHE_KEY_PREFIX}DETAILS_{code}";
            if (_cache.TryGetValue<ICD10CodeDetails>(cacheKey, out var cachedDetails))
            {
                _logger.LogDebug("CIE-10 code details for {Code} found in cache", code);
                return cachedDetails;
            }

            // Get from local database
            var entity = await _context.Set<Cie10Catalog>()
                .Where(c => c.Code == code && c.IsActive)
                .FirstOrDefaultAsync();

            if (entity == null)
            {
                // Try WHO API
                var whoCode = await _whoApiService.GetICD10CodeDetailsAsync(code);
                if (whoCode == null)
                    return null;

                // Save to database
                entity = new Cie10Catalog(
                    whoCode.Code,
                    whoCode.Title,
                    whoCode.Definition,
                    whoCode.Chapter,
                    whoCode.Chapter,
                    "WHO_API");

                _context.Set<Cie10Catalog>().Add(entity);
                await _context.SaveChangesAsync();
            }

            // Get usage count
            var usageCount = await _context.Set<PrescriptionDiagnosis>()
                .CountAsync(pd => pd.Cie10CatalogId == entity.Id);

            // Get related codes (same category)
            var relatedCodes = await _context.Set<Cie10Catalog>()
                .Where(c => c.IsActive && 
                    c.Category == entity.Category && 
                    c.Code != entity.Code)
                .OrderBy(c => c.Code)
                .Take(10)
                .Select(c => c.Code)
                .ToListAsync();

            var details = new ICD10CodeDetails
            {
                Code = entity.Code,
                Description = entity.DescriptionEs,
                Category = entity.Category ?? string.Empty,
                Subcategory = entity.Chapter,
                IsCommon = usageCount > 10,
                LastUpdated = entity.LastUpdated,
                LongDescription = entity.DescriptionEn,
                RelatedCodes = relatedCodes,
                Synonyms = new List<string>(),
                ClinicalNotes = null,
                UsageCount = usageCount
            };

            _cache.Set(cacheKey, details, CacheExpiration);

            await _auditService.LogOperationAsync(
                "CIE10_GET_DETAILS",
                "Cie10Catalog",
                entity.Id,
                $"Code: {code}",
                null);

            return details;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting CIE-10 code details: {Code}", code);
            throw;
        }
    }

    public async Task<List<ICD10Code>> GetMostCommonCodesAsync(int count = 50)
    {
        try
        {
            // Check cache
            var cacheKey = $"{CACHE_KEY_PREFIX}COMMON_{count}";
            if (_cache.TryGetValue<List<ICD10Code>>(cacheKey, out var cachedResults))
            {
                _logger.LogDebug("Most common CIE-10 codes found in cache");
                return cachedResults;
            }

            // Get most used codes from prescriptions
            var mostUsedIds = await _context.Set<PrescriptionDiagnosis>()
                .GroupBy(pd => pd.Cie10CatalogId)
                .OrderByDescending(g => g.Count())
                .Take(count)
                .Select(g => g.Key)
                .ToListAsync();

            var entities = await _context.Set<Cie10Catalog>()
                .Where(c => mostUsedIds.Contains(c.Id) && c.IsActive)
                .ToListAsync();

            var results = entities.Select(MapToICD10Code).ToList();
            _cache.Set(cacheKey, results, TimeSpan.FromHours(6)); // Shorter cache for common codes

            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting most common CIE-10 codes");
            throw;
        }
    }

    public async Task<int> SyncWithWHOApiAsync()
    {
        try
        {
            _logger.LogInformation("Starting CIE-10 catalog synchronization with WHO API");

            var syncedCount = 0;
            var addedCount = 0;
            var updatedCount = 0;

            // Get all local codes
            var localCodes = await _context.Set<Cie10Catalog>()
                .Where(c => c.IsActive)
                .ToListAsync();

            // Sync each code with WHO API
            foreach (var localCode in localCodes)
            {
                try
                {
                    var whoCode = await _whoApiService.GetICD10CodeDetailsAsync(localCode.Code);
                    if (whoCode != null)
                    {
                        localCode.UpdateFromWHO(
                            whoCode.Title,
                            whoCode.Definition,
                            whoCode.Chapter,
                            whoCode.Chapter);
                        updatedCount++;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error syncing code {Code} with WHO API", localCode.Code);
                }

                syncedCount++;
            }

            await _context.SaveChangesAsync();

            // Clear cache after sync
            _cache.Remove($"{CACHE_KEY_PREFIX}STATS");

            await _auditService.LogOperationAsync(
                "CIE10_SYNC_WHO",
                "Cie10Catalog",
                null,
                $"Synced: {syncedCount}, Added: {addedCount}, Updated: {updatedCount}",
                null);

            _logger.LogInformation(
                "CIE-10 catalog synchronization completed. Synced: {Synced}, Added: {Added}, Updated: {Updated}",
                syncedCount, addedCount, updatedCount);

            return syncedCount;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error synchronizing CIE-10 catalog with WHO API");
            throw;
        }
    }

    public async Task<CatalogStatistics> GetCatalogStatisticsAsync()
    {
        try
        {
            // Check cache
            var cacheKey = $"{CACHE_KEY_PREFIX}STATS";
            if (_cache.TryGetValue<CatalogStatistics>(cacheKey, out var cachedStats))
            {
                _logger.LogDebug("CIE-10 catalog statistics found in cache");
                return cachedStats;
            }

            var totalCodes = await _context.Set<Cie10Catalog>()
                .CountAsync(c => c.IsActive);

            var commonCodes = await _context.Set<PrescriptionDiagnosis>()
                .Select(pd => pd.Cie10CatalogId)
                .Distinct()
                .CountAsync();

            var lastSync = await _context.Set<Cie10Catalog>()
                .Where(c => c.Source == "WHO_API")
                .MaxAsync(c => (DateTime?)c.LastUpdated) ?? DateTime.MinValue;

            var codesByCategory = await _context.Set<Cie10Catalog>()
                .Where(c => c.IsActive && c.Category != null)
                .GroupBy(c => c.Category!)
                .Select(g => new { Category = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Category, x => x.Count);

            var stats = new CatalogStatistics
            {
                TotalCodes = totalCodes,
                CommonCodes = commonCodes,
                LastSyncDate = lastSync,
                CodesAddedLastSync = 0,
                CodesUpdatedLastSync = 0,
                CodesByCategory = codesByCategory
            };

            _cache.Set(cacheKey, stats, TimeSpan.FromHours(1));

            return stats;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting CIE-10 catalog statistics");
            throw;
        }
    }

    private static ICD10Code MapToICD10Code(Cie10Catalog entity)
    {
        return new ICD10Code
        {
            Code = entity.Code,
            Description = entity.DescriptionEs,
            Category = entity.Category ?? string.Empty,
            Subcategory = entity.Chapter,
            IsCommon = true, // Could be calculated based on usage
            LastUpdated = entity.LastUpdated
        };
    }
}
