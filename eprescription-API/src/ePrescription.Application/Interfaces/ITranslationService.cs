namespace EPrescription.Application.Interfaces;

/// <summary>
/// Service for translating text between languages using DeepL API
/// </summary>
public interface ITranslationService
{
    /// <summary>
    /// Translate text from Spanish to English
    /// </summary>
    Task<string> TranslateToEnglishAsync(string spanishText, CancellationToken cancellationToken = default);

    /// <summary>
    /// Translate text from English to Spanish
    /// </summary>
    Task<string> TranslateToSpanishAsync(string englishText, CancellationToken cancellationToken = default);

    /// <summary>
    /// Translate text between any supported languages
    /// </summary>
    Task<string> TranslateAsync(string text, string sourceLanguage, string targetLanguage, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get usage statistics for the current month
    /// </summary>
    Task<TranslationUsageStats> GetUsageStatsAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Translation usage statistics
/// </summary>
public class TranslationUsageStats
{
    public long CharacterCount { get; set; }
    public long CharacterLimit { get; set; }
    public double UsagePercentage => CharacterLimit > 0 ? (CharacterCount * 100.0 / CharacterLimit) : 0;
    public bool IsNearLimit => UsagePercentage >= 80;
}
