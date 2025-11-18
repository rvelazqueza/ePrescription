using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using EPrescription.Application.Interfaces;

namespace EPrescription.Infrastructure.Services;

/// <summary>
/// Implementation of translation service using DeepL API
/// Documentation: https://www.deepl.com/docs-api
/// </summary>
public class DeepLTranslationService : ITranslationService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<DeepLTranslationService> _logger;
    private readonly IAuditService _auditService;
    
    private readonly string _apiKey;
    private readonly string _baseUrl;
    
    public DeepLTranslationService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<DeepLTranslationService> logger,
        IAuditService auditService)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        _auditService = auditService;
        
        _apiKey = _configuration["DeepL:ApiKey"] ?? throw new InvalidOperationException("DeepL API Key not configured");
        _baseUrl = _configuration["DeepL:BaseUrl"] ?? "https://api-free.deepl.com/v2";
        
        _httpClient.BaseAddress = new Uri(_baseUrl);
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"DeepL-Auth-Key {_apiKey}");
    }

    /// <summary>
    /// Translate text from Spanish to English
    /// </summary>
    public async Task<string> TranslateToEnglishAsync(string spanishText, CancellationToken cancellationToken = default)
    {
        return await TranslateAsync(spanishText, "ES", "EN", cancellationToken);
    }

    /// <summary>
    /// Translate text from English to Spanish
    /// </summary>
    public async Task<string> TranslateToSpanishAsync(string englishText, CancellationToken cancellationToken = default)
    {
        return await TranslateAsync(englishText, "EN", "ES", cancellationToken);
    }

    /// <summary>
    /// Translate text between any supported languages
    /// </summary>
    public async Task<string> TranslateAsync(
        string text, 
        string sourceLanguage, 
        string targetLanguage, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                return string.Empty;
            }

            _logger.LogInformation("Translating text from {Source} to {Target}", sourceLanguage, targetLanguage);

            var requestData = new Dictionary<string, string>
            {
                { "text", text },
                { "source_lang", sourceLanguage.ToUpper() },
                { "target_lang", targetLanguage.ToUpper() }
            };

            var content = new FormUrlEncodedContent(requestData);
            var response = await _httpClient.PostAsync("/translate", content, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                var translationResponse = JsonSerializer.Deserialize<DeepLTranslationResponse>(responseContent);

                if (translationResponse?.Translations != null && translationResponse.Translations.Count > 0)
                {
                    var translatedText = translationResponse.Translations[0].Text;
                    
                    _logger.LogInformation("Translation successful: {CharCount} characters", translatedText.Length);
                    
                    // Audit log
                    await _auditService.LogOperationAsync(
                        "TRANSLATION",
                        "DeepL",
                        $"{sourceLanguage}->{targetLanguage}",
                        additionalInfo: $"Characters: {text.Length}",
                        cancellationToken: cancellationToken
                    );

                    return translatedText;
                }
            }

            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("DeepL translation failed: {StatusCode} - {Content}", response.StatusCode, errorContent);
            
            throw new InvalidOperationException($"DeepL translation failed: {response.StatusCode}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during translation from {Source} to {Target}", sourceLanguage, targetLanguage);
            throw;
        }
    }

    /// <summary>
    /// Get usage statistics for the current month
    /// </summary>
    public async Task<TranslationUsageStats> GetUsageStatsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync("/usage", cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                var usageResponse = JsonSerializer.Deserialize<DeepLUsageResponse>(responseContent);

                if (usageResponse != null)
                {
                    return new TranslationUsageStats
                    {
                        CharacterCount = usageResponse.CharacterCount,
                        CharacterLimit = usageResponse.CharacterLimit
                    };
                }
            }

            _logger.LogWarning("Failed to get DeepL usage stats: {StatusCode}", response.StatusCode);
            return new TranslationUsageStats();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting DeepL usage statistics");
            return new TranslationUsageStats();
        }
    }
}

// Internal DTOs for DeepL API responses
internal class DeepLTranslationResponse
{
    public List<DeepLTranslation>? Translations { get; set; }
}

internal class DeepLTranslation
{
    public string Text { get; set; } = string.Empty;
    public string? DetectedSourceLanguage { get; set; }
}

internal class DeepLUsageResponse
{
    public long CharacterCount { get; set; }
    public long CharacterLimit { get; set; }
}
