using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using EPrescription.Application.Interfaces;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Services;

/// <summary>
/// Implementation of WHO API service for ICD-10/ICD-11 integration
/// Documentation: https://icd.who.int/icdapi
/// </summary>
public class WHOApiService : IWHOApiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WHOApiService> _logger;
    private readonly IAuditService _auditService;
    
    private string? _accessToken;
    private DateTime _tokenExpiry = DateTime.MinValue;
    
    // WHO API Configuration
    private readonly string _baseUrl;
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _tokenUrl;
    
    public WHOApiService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<WHOApiService> logger,
        IAuditService auditService)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        _auditService = auditService;
        
        // Load configuration from appsettings
        _baseUrl = _configuration["WHOApi:BaseUrl"] ?? "https://id.who.int";
        _clientId = _configuration["WHOApi:ClientId"] ?? throw new InvalidOperationException("WHO API Client ID not configured");
        _clientSecret = _configuration["WHOApi:ClientSecret"] ?? throw new InvalidOperationException("WHO API Client Secret not configured");
        _tokenUrl = $"{_baseUrl}/connect/token";
        
        // Configure HttpClient
        _httpClient.BaseAddress = new Uri(_baseUrl);
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "ePrescription-API/1.0");
        _httpClient.DefaultRequestHeaders.Add("API-Version", "v2");
        _httpClient.DefaultRequestHeaders.Add("Accept-Language", "es");
    }

    /// <summary>
    /// Authenticate with WHO API using OAuth 2.0 Client Credentials
    /// </summary>
    public async Task<string> AuthenticateAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if current token is still valid
            if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _tokenExpiry.AddMinutes(-5))
            {
                return _accessToken;
            }

            _logger.LogInformation("Authenticating with WHO API...");

            // Prepare OAuth 2.0 Client Credentials request
            var tokenRequest = new List<KeyValuePair<string, string>>
            {
                new("grant_type", "client_credentials"),
                new("scope", "icdapi_access"),
                new("client_id", _clientId),
                new("client_secret", _clientSecret)
            };

            var content = new FormUrlEncodedContent(tokenRequest);
            
            var response = await _httpClient.PostAsync(_tokenUrl, content, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                var tokenResponse = JsonSerializer.Deserialize<WHOTokenResponse>(responseContent);
                
                if (tokenResponse?.AccessToken != null)
                {
                    _accessToken = tokenResponse.AccessToken;
                    _tokenExpiry = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn - 300); // 5 min buffer
                    
                    _logger.LogInformation("WHO API authentication successful");
                    await _auditService.LogOperationAsync("WHO_API_AUTH", "WHOApi", "Authentication", additionalInfo: "Authentication successful", cancellationToken: cancellationToken);
                    
                    return _accessToken;
                }
            }
            
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("WHO API authentication failed: {StatusCode} - {Content}", response.StatusCode, errorContent);
            await _auditService.LogOperationAsync("WHO_API_AUTH_ERROR", "WHOApi", "Authentication", additionalInfo: $"Authentication failed: {response.StatusCode}", cancellationToken: cancellationToken);
            
            throw new InvalidOperationException($"WHO API authentication failed: {response.StatusCode}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during WHO API authentication");
            await _auditService.LogOperationAsync("WHO_API_AUTH_EXCEPTION", "WHOApi", "Authentication", additionalInfo: ex.Message);
            throw;
        }
    }

    /// <summary>
    /// Synchronize ICD-10 catalog from WHO API
    /// </summary>
    public async Task<WHOSyncResult> SyncICD10CatalogAsync(CancellationToken cancellationToken = default)
    {
        var result = new WHOSyncResult
        {
            SyncDate = DateTime.UtcNow
        };
        
        var startTime = DateTime.UtcNow;
        
        try
        {
            _logger.LogInformation("Starting ICD-10 catalog synchronization from WHO API");
            
            // Authenticate first
            var token = await AuthenticateAsync(cancellationToken);
            
            // Set authorization header
            _httpClient.DefaultRequestHeaders.Authorization = 
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            
            // Get ICD-10 catalog (WHO is migrating to ICD-11, but ICD-10 is still available)
            var catalogUrl = "/icd/release/10/2019";
            
            var response = await _httpClient.GetAsync(catalogUrl, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync(cancellationToken);
                var catalogData = JsonSerializer.Deserialize<WHOCatalogResponse>(content);
                
                if (catalogData?.Entities != null)
                {
                    // Process and save ICD-10 codes
                    // TODO: Implement database persistence
                    result.CodesAdded = catalogData.Entities.Count;
                    result.Success = true;
                    
                    _logger.LogInformation("ICD-10 synchronization completed. {Count} codes processed", result.CodesAdded);
                }
            }
            else
            {
                result.ErrorMessage = $"WHO API returned {response.StatusCode}";
                result.Errors.Add(result.ErrorMessage);
                _logger.LogError("ICD-10 synchronization failed: {StatusCode}", response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            result.Success = false;
            result.ErrorMessage = ex.Message;
            result.Errors.Add(ex.Message);
            _logger.LogError(ex, "Error during ICD-10 synchronization");
        }
        finally
        {
            result.Duration = DateTime.UtcNow - startTime;
            await _auditService.LogOperationAsync(
                "WHO_SYNC_ICD10",
                "WHOApi",
                "Synchronization",
                additionalInfo: $"Sync result: Success={result.Success}, Codes={result.CodesAdded}, Duration={result.Duration}",
                cancellationToken: cancellationToken
            );
        }
        
        return result;
    }

    /// <summary>
    /// Search ICD-10 codes by term
    /// </summary>
    public async Task<List<ICD10Code>> SearchICD10CodesAsync(string searchTerm, string language = "es", CancellationToken cancellationToken = default)
    {
        try
        {
            var token = await AuthenticateAsync(cancellationToken);
            _httpClient.DefaultRequestHeaders.Authorization = 
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            
            var searchUrl = $"/icd/release/10/2019/search?q={Uri.EscapeDataString(searchTerm)}&language={language}";
            
            var response = await _httpClient.GetAsync(searchUrl, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync(cancellationToken);
                var searchResult = JsonSerializer.Deserialize<WHOSearchResponse>(content);
                
                return searchResult?.Results?.Select(r => new ICD10Code
                {
                    Code = r.Code ?? "",
                    Description = r.Description ?? r.Title ?? "",
                    Category = r.Category ?? "",
                    Subcategory = null,
                    IsCommon = false,
                    LastUpdated = DateTime.UtcNow
                }).ToList() ?? new List<ICD10Code>();
            }
            
            _logger.LogWarning("WHO API search failed: {StatusCode}", response.StatusCode);
            return new List<ICD10Code>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching ICD-10 codes for term: {SearchTerm}", searchTerm);
            return new List<ICD10Code>();
        }
    }

    /// <summary>
    /// Get detailed information for a specific ICD-10 code
    /// </summary>
    public async Task<ICD10CodeDetails?> GetICD10CodeDetailAsync(string code, string language = "es", CancellationToken cancellationToken = default)
    {
        try
        {
            var token = await AuthenticateAsync(cancellationToken);
            _httpClient.DefaultRequestHeaders.Authorization = 
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            
            var detailUrl = $"/icd/release/10/2019/{Uri.EscapeDataString(code)}?language={language}";
            
            var response = await _httpClient.GetAsync(detailUrl, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync(cancellationToken);
                var detail = JsonSerializer.Deserialize<WHOCodeDetail>(content);
                
                if (detail != null)
                {
                    return new ICD10CodeDetails
                    {
                        Code = detail.Code ?? code,
                        Description = detail.Title ?? "",
                        Category = detail.Description ?? "",
                        LongDescription = detail.Description,
                        RelatedCodes = detail.Children ?? new List<string>(),
                        Synonyms = detail.Synonyms ?? new List<string>(),
                        ClinicalNotes = detail.CodingHint,
                        LastUpdated = DateTime.UtcNow,
                        IsCommon = false,
                        UsageCount = 0
                    };
                }
            }
            
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting ICD-10 code detail for: {Code}", code);
            return null;
        }
    }

    /// <summary>
    /// Validate if an ICD-10 code exists
    /// </summary>
    public async Task<bool> ValidateICD10CodeAsync(string code, CancellationToken cancellationToken = default)
    {
        var detail = await GetICD10CodeDetailAsync(code, "es", cancellationToken);
        return detail != null;
    }

    /// <summary>
    /// Get last synchronization date
    /// </summary>
    public async Task<DateTime?> GetLastSyncDateAsync(CancellationToken cancellationToken = default)
    {
        // TODO: Implement database query to get last sync date
        await Task.CompletedTask;
        return null;
    }

    /// <summary>
    /// Check WHO API health status
    /// </summary>
    public async Task<bool> CheckAPIHealthAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var token = await AuthenticateAsync(cancellationToken);
            return !string.IsNullOrEmpty(token);
        }
        catch
        {
            return false;
        }
    }
}

// Internal DTOs for WHO API responses
internal class WHOTokenResponse
{
    public string? AccessToken { get; set; }
    public int ExpiresIn { get; set; }
    public string? TokenType { get; set; }
}

internal class WHOCatalogResponse
{
    public List<WHOEntity>? Entities { get; set; }
}

internal class WHOEntity
{
    public string? Code { get; set; }
    public string? Title { get; set; }
}

internal class WHOSearchResponse
{
    public List<WHOSearchResult>? Results { get; set; }
}

internal class WHOSearchResult
{
    public string? Code { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
}

internal class WHOCodeDetail
{
    public string? Code { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Parent { get; set; }
    public List<string>? Children { get; set; }
    public List<string>? Synonyms { get; set; }
    public List<string>? Exclusions { get; set; }
    public List<string>? Inclusions { get; set; }
    public string? CodingHint { get; set; }
}
