# Translation Service Guide

## Overview

This document describes the integration with DeepL API for high-quality translation between Spanish and English for medical terminology.

## DeepL API

DeepL provides professional-grade translation with excellent support for medical and technical terminology:
- **Documentation:** https://www.deepl.com/docs-api
- **Registration:** https://www.deepl.com/pro-api
- **Free Tier:** 500,000 characters/month (no credit card required)
- **Base URL:** https://api-free.deepl.com/v2

## Features Implemented

### 1. Spanish ↔ English Translation
- Translate from Spanish to English
- Translate from English to Spanish
- Generic translation between any supported languages
- Character count tracking

### 2. Usage Statistics
- Get current month usage
- Character count and limit
- Usage percentage calculation
- Near-limit warnings (>80%)

### 3. Audit Logging
- All translations are logged
- Character count tracking
- Source and target language tracking
- Integration with audit system

## Configuration

### 1. Get DeepL API Key

1. Visit https://www.deepl.com/pro-api
2. Sign up for free account (no credit card required)
3. Get your API key from the account dashboard
4. Free tier includes 500,000 characters/month

### 2. Configure appsettings.json

```json
{
  "DeepL": {
    "ApiKey": "YOUR_DEEPL_API_KEY",
    "BaseUrl": "https://api-free.deepl.com/v2"
  }
}
```

**Note:** For paid accounts, use `https://api.deepl.com/v2` as BaseUrl.

### 3. Using User Secrets (Recommended for Development)

```bash
cd eprescription-API/src/ePrescription.API

# Set DeepL API key
dotnet user-secrets set "DeepL:ApiKey" "your_api_key_here"
```

### 4. Using Environment Variables

```bash
# Windows
set DEEPL_API_KEY=your_api_key_here

# Linux/Mac
export DEEPL_API_KEY=your_api_key_here
```

## Usage

### Service Interface

```csharp
public interface ITranslationService
{
    Task<string> TranslateToEnglishAsync(string spanishText, CancellationToken cancellationToken = default);
    Task<string> TranslateToSpanishAsync(string englishText, CancellationToken cancellationToken = default);
    Task<string> TranslateAsync(string text, string sourceLanguage, string targetLanguage, CancellationToken cancellationToken = default);
    Task<TranslationUsageStats> GetUsageStatsAsync(CancellationToken cancellationToken = default);
}
```

### Example: Translate Spanish to English

```csharp
// Inject service
private readonly ITranslationService _translationService;

// Translate medical term
var spanishText = "El paciente presenta diabetes mellitus tipo 2";
var englishText = await _translationService.TranslateToEnglishAsync(spanishText);
// Result: "The patient has type 2 diabetes mellitus"
```

### Example: Translate English to Spanish

```csharp
var englishText = "Hypertension with cardiovascular complications";
var spanishText = await _translationService.TranslateToSpanishAsync(englishText);
// Result: "Hipertensión con complicaciones cardiovasculares"
```

### Example: Generic Translation

```csharp
var text = "Dolor abdominal agudo";
var translated = await _translationService.TranslateAsync(text, "ES", "EN");
// Result: "Acute abdominal pain"
```

### Example: Check Usage Statistics

```csharp
var stats = await _translationService.GetUsageStatsAsync();

Console.WriteLine($"Characters used: {stats.CharacterCount:N0}");
Console.WriteLine($"Character limit: {stats.CharacterLimit:N0}");
Console.WriteLine($"Usage: {stats.UsagePercentage:F2}%");

if (stats.IsNearLimit)
{
    Console.WriteLine("⚠️ Warning: Approaching character limit!");
}
```

## Supported Languages

DeepL supports the following languages:
- **ES** - Spanish
- **EN** - English (EN-US, EN-GB)
- **DE** - German
- **FR** - French
- **IT** - Italian
- **PT** - Portuguese
- **RU** - Russian
- **JA** - Japanese
- **ZH** - Chinese
- And many more...

For medical terminology, Spanish ↔ English translation is highly accurate.

## API Limits

### Free Tier
- **500,000 characters/month**
- No credit card required
- Perfect for development and testing
- Resets monthly

### Paid Tiers
- **Pro:** Starting at $5.49/month
- **Advanced:** Custom pricing
- Higher character limits
- Priority support
- Use `https://api.deepl.com/v2` as BaseUrl

## Error Handling

The service includes comprehensive error handling:

1. **Empty Text:** Returns empty string
2. **API Errors:** Throws InvalidOperationException with details
3. **Network Errors:** Logged and re-thrown
4. **Invalid API Key:** Throws InvalidOperationException on startup

## Audit Logging

All translations are automatically logged to the audit system:

```
Action: TRANSLATION
EntityType: DeepL
EntityId: ES->EN
AdditionalInfo: Characters: 45
```

This allows tracking of:
- Translation volume
- Language pairs used
- Character consumption
- Usage patterns

## Performance Considerations

1. **Response Time:** Typically 200-500ms per translation
2. **Character Limits:** 
   - Single request: Up to 50,000 characters
   - Recommended: Keep requests under 5,000 characters
3. **Rate Limiting:** DeepL has rate limits (check documentation)
4. **Caching:** Consider caching common translations

## Best Practices

### 1. Batch Translations
For multiple texts, consider batching:

```csharp
var texts = new[] { "text1", "text2", "text3" };
var translations = await Task.WhenAll(
    texts.Select(t => _translationService.TranslateToEnglishAsync(t))
);
```

### 2. Error Handling
Always wrap translations in try-catch:

```csharp
try
{
    var translated = await _translationService.TranslateToEnglishAsync(text);
    return translated;
}
catch (Exception ex)
{
    _logger.LogError(ex, "Translation failed for text: {Text}", text);
    return text; // Return original text as fallback
}
```

### 3. Monitor Usage
Check usage regularly to avoid hitting limits:

```csharp
var stats = await _translationService.GetUsageStatsAsync();
if (stats.UsagePercentage > 80)
{
    // Send alert or switch to fallback
    _logger.LogWarning("DeepL usage at {Percentage}%", stats.UsagePercentage);
}
```

### 4. Medical Terminology
DeepL handles medical terminology well, but always validate critical translations:

```csharp
var diagnosis = "Diabetes mellitus tipo 2 con complicaciones";
var translated = await _translationService.TranslateToEnglishAsync(diagnosis);
// Always validate medical terms in production
```

## Integration with AI Assistant

The translation service is designed to work with the AI Assistant workflow:

1. **User Input (Spanish)** → Translate to English
2. **AI Processing (English)** → Get AI response
3. **AI Response (English)** → Translate to Spanish
4. **User Output (Spanish)** → Display to user

Example workflow:

```csharp
// 1. Translate user input to English
var userInputSpanish = "Paciente con dolor de cabeza severo";
var userInputEnglish = await _translationService.TranslateToEnglishAsync(userInputSpanish);

// 2. Process with AI (in English)
var aiResponse = await _aiService.AnalyzeAsync(userInputEnglish);

// 3. Translate AI response back to Spanish
var aiResponseSpanish = await _translationService.TranslateToSpanishAsync(aiResponse);

// 4. Return to user
return aiResponseSpanish;
```

## Troubleshooting

### Translation Fails

1. Verify API key in configuration
2. Check DeepL service status
3. Verify network connectivity
4. Check character limits
5. Review audit logs for details

### Poor Translation Quality

1. Ensure correct source language specified
2. Check for typos in source text
3. Consider context for ambiguous terms
4. Validate medical terminology
5. Use glossary feature (Pro accounts)

### Usage Limit Reached

1. Check current usage with GetUsageStatsAsync()
2. Wait for monthly reset
3. Upgrade to paid tier
4. Implement caching for common translations
5. Use fallback translation service

## Testing

### Unit Tests
Test with mock translations:

```csharp
var mockTranslation = new Mock<ITranslationService>();
mockTranslation
    .Setup(x => x.TranslateToEnglishAsync(It.IsAny<string>(), default))
    .ReturnsAsync("Translated text");
```

### Integration Tests
Test with real DeepL API (use test account):

```csharp
[Fact]
public async Task TranslateToEnglish_ValidSpanishText_ReturnsEnglishTranslation()
{
    // Arrange
    var service = new DeepLTranslationService(/* dependencies */);
    var spanishText = "Hola mundo";
    
    // Act
    var result = await service.TranslateToEnglishAsync(spanishText);
    
    // Assert
    Assert.Equal("Hello world", result);
}
```

## References

- DeepL API Documentation: https://www.deepl.com/docs-api
- DeepL Pro API: https://www.deepl.com/pro-api
- Supported Languages: https://www.deepl.com/docs-api/translating-text/
- API Status: https://status.deepl.com/

## Support

For issues with DeepL API integration:
1. Check DeepL API status
2. Review application logs
3. Check audit logs for translation history
4. Verify API key configuration
5. Contact DeepL support if needed
