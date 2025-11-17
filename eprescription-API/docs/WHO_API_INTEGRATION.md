# WHO API Integration Guide

## Overview

This document describes the integration with the WHO ICD API for accessing the official ICD-10 (International Classification of Diseases) catalog.

## WHO ICD API

The WHO provides an official API for accessing ICD-10 and ICD-11 classifications:
- **Documentation:** https://icd.who.int/icdapi
- **Registration:** https://icd.who.int/icdapi (requires free account)
- **Base URL:** https://id.who.int

## Features Implemented

### 1. OAuth 2.0 Authentication
- Client Credentials flow
- Automatic token refresh
- Token caching with 5-minute buffer

### 2. ICD-10 Catalog Synchronization
- Full catalog download from WHO API
- Automatic daily sync at 2:00 AM
- Manual sync endpoint available
- Sync result tracking (added/updated/removed codes)

### 3. Code Search
- Search ICD-10 codes by term
- Multi-language support (Spanish/English)
- Fuzzy matching

### 4. Code Validation
- Validate if ICD-10 code exists
- Get detailed code information
- Check code status (active/inactive)

### 5. Background Service
- Automatic daily synchronization
- Configurable sync time
- Error handling and retry logic
- Audit logging

## Configuration

### 1. Get WHO API Credentials

1. Visit https://icd.who.int/icdapi
2. Create a free account
3. Register your application
4. Get your Client ID and Client Secret

### 2. Configure appsettings.json

```json
{
  "WHOApi": {
    "BaseUrl": "https://id.who.int",
    "ClientId": "YOUR_CLIENT_ID",
    "ClientSecret": "YOUR_CLIENT_SECRET"
  }
}
```

### 3. Using User Secrets (Recommended for Development)

```bash
cd eprescription-API/src/ePrescription.API

# Set WHO API credentials
dotnet user-secrets set "WHOApi:ClientId" "your_client_id_here"
dotnet user-secrets set "WHOApi:ClientSecret" "your_client_secret_here"
```

### 4. Using Environment Variables

```bash
# Windows
set WHO_API_CLIENT_ID=your_client_id_here
set WHO_API_CLIENT_SECRET=your_client_secret_here

# Linux/Mac
export WHO_API_CLIENT_ID=your_client_id_here
export WHO_API_CLIENT_SECRET=your_client_secret_here
```

## Usage

### Service Interface

```csharp
public interface IWHOApiService
{
    Task<string> AuthenticateAsync(CancellationToken cancellationToken = default);
    Task<WHOSyncResult> SyncICD10CatalogAsync(CancellationToken cancellationToken = default);
    Task<List<ICD10Code>> SearchICD10CodesAsync(string searchTerm, string language = "es", CancellationToken cancellationToken = default);
    Task<ICD10CodeDetail?> GetICD10CodeDetailAsync(string code, string language = "es", CancellationToken cancellationToken = default);
    Task<bool> ValidateICD10CodeAsync(string code, CancellationToken cancellationToken = default);
    Task<DateTime?> GetLastSyncDateAsync(CancellationToken cancellationToken = default);
    Task<bool> CheckAPIHealthAsync(CancellationToken cancellationToken = default);
}
```

### Example: Search ICD-10 Codes

```csharp
// Inject service
private readonly IWHOApiService _whoApiService;

// Search for codes
var codes = await _whoApiService.SearchICD10CodesAsync("diabetes", "es");

foreach (var code in codes)
{
    Console.WriteLine($"{code.Code}: {code.Title}");
}
```

### Example: Validate Code

```csharp
var isValid = await _whoApiService.ValidateICD10CodeAsync("E11.9");
if (isValid)
{
    var detail = await _whoApiService.GetICD10CodeDetailAsync("E11.9", "es");
    Console.WriteLine($"Code: {detail.Code}");
    Console.WriteLine($"Title: {detail.Title}");
    Console.WriteLine($"Description: {detail.Description}");
}
```

### Example: Manual Sync

```csharp
var result = await _whoApiService.SyncICD10CatalogAsync();

if (result.Success)
{
    Console.WriteLine($"Sync completed successfully");
    Console.WriteLine($"Codes added: {result.CodesAdded}");
    Console.WriteLine($"Codes updated: {result.CodesUpdated}");
    Console.WriteLine($"Duration: {result.Duration}");
}
else
{
    Console.WriteLine($"Sync failed: {result.ErrorMessage}");
}
```

## Background Service

The `WHOSyncBackgroundService` automatically synchronizes the ICD-10 catalog daily at 2:00 AM.

### Configuration

```csharp
// In Program.cs
builder.Services.AddHostedService<WHOSyncBackgroundService>();
```

### Customization

To change the sync time, modify the `_syncTime` field in `WHOSyncBackgroundService.cs`:

```csharp
private readonly TimeSpan _syncTime = new TimeSpan(2, 0, 0); // 2:00 AM
```

## API Endpoints

### Health Check
```
GET /api/who/health
```

### Manual Sync
```
POST /api/who/sync
```

### Search Codes
```
GET /api/who/search?term=diabetes&language=es
```

### Get Code Detail
```
GET /api/who/codes/{code}?language=es
```

### Validate Code
```
GET /api/who/validate/{code}
```

## Error Handling

The service includes comprehensive error handling:

1. **Authentication Errors:** Logged and audited
2. **Network Errors:** Automatic retry with exponential backoff
3. **API Errors:** Detailed error messages in logs
4. **Sync Errors:** Tracked in sync result

## Audit Logging

All WHO API operations are logged to the audit system:

- `WHO_API_AUTH` - Successful authentication
- `WHO_API_AUTH_ERROR` - Authentication failure
- `WHO_SYNC_ICD10` - Sync operation result
- `WHO_AUTO_SYNC_SUCCESS` - Automatic sync success
- `WHO_AUTO_SYNC_ERROR` - Automatic sync error

## Performance Considerations

1. **Token Caching:** Access tokens are cached and reused
2. **Rate Limiting:** WHO API has rate limits (check documentation)
3. **Batch Operations:** Sync operations process codes in batches
4. **Background Sync:** Daily sync runs during low-traffic hours (2:00 AM)

## Troubleshooting

### Authentication Fails

1. Verify credentials in appsettings.json or User Secrets
2. Check WHO API account status
3. Verify network connectivity to https://id.who.int
4. Check logs for detailed error messages

### Sync Fails

1. Check WHO API service status
2. Verify authentication is working
3. Check database connectivity
4. Review audit logs for detailed errors

### Search Returns No Results

1. Verify search term spelling
2. Try different language (es/en)
3. Check if catalog is synchronized
4. Verify code format (e.g., "E11.9" not "E119")

## References

- WHO ICD API Documentation: https://icd.who.int/icdapi
- ICD-10 Classification: https://icd.who.int/browse10/2019/en
- OAuth 2.0 Client Credentials: https://oauth.net/2/grant-types/client-credentials/

## Support

For issues with WHO API integration:
1. Check WHO API status page
2. Review application logs
3. Check audit logs for detailed operation history
4. Contact WHO API support if needed
