using EPrescription.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPrescription.API.Controllers;

/// <summary>
/// Controller for CIE-10 (ICD-10) catalog operations
/// Provides search, validation, and catalog management
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CIE10Controller : ControllerBase
{
    private readonly ICIE10CatalogService _cie10Service;
    private readonly ILogger<CIE10Controller> _logger;

    public CIE10Controller(
        ICIE10CatalogService cie10Service,
        ILogger<CIE10Controller> logger)
    {
        _cie10Service = cie10Service;
        _logger = logger;
    }

    /// <summary>
    /// Get CIE-10 code by exact code
    /// </summary>
    /// <param name="code">CIE-10 code (e.g., A00.0, J45.9)</param>
    /// <returns>Code details or 404 if not found</returns>
    [HttpGet("{code}")]
    [ProducesResponseType(typeof(ICD10Code), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ICD10Code>> GetByCode(string code)
    {
        try
        {
            _logger.LogInformation("Fetching CIE-10 code: {Code}", code);

            var result = await _cie10Service.GetByCodeAsync(code);

            if (result == null)
            {
                return NotFound(new { message = $"CIE-10 code '{code}' not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching CIE-10 code: {Code}", code);
            return StatusCode(500, new { message = "Error fetching code", error = ex.Message });
        }
    }

    /// <summary>
    /// Search CIE-10 codes by description
    /// </summary>
    /// <param name="description">Description to search for</param>
    /// <param name="maxResults">Maximum number of results (default: 20)</param>
    /// <returns>List of matching codes</returns>
    [HttpGet("search")]
    [ProducesResponseType(typeof(List<ICD10Code>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ICD10Code>>> SearchByDescription(
        [FromQuery] string description,
        [FromQuery] int maxResults = 20)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(description))
            {
                return BadRequest(new { message = "Description parameter is required" });
            }

            _logger.LogInformation("Searching CIE-10 codes by description: {Description}", description);

            var results = await _cie10Service.SearchByDescriptionAsync(description, maxResults);

            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching CIE-10 codes by description");
            return StatusCode(500, new { message = "Error searching codes", error = ex.Message });
        }
    }

    /// <summary>
    /// Search CIE-10 codes by category
    /// </summary>
    /// <param name="category">Category code (e.g., A00-A09)</param>
    /// <returns>List of codes in the category</returns>
    [HttpGet("category/{category}")]
    [ProducesResponseType(typeof(List<ICD10Code>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ICD10Code>>> SearchByCategory(string category)
    {
        try
        {
            _logger.LogInformation("Searching CIE-10 codes by category: {Category}", category);

            var results = await _cie10Service.SearchByCategoryAsync(category);

            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching CIE-10 codes by category");
            return StatusCode(500, new { message = "Error searching codes", error = ex.Message });
        }
    }

    /// <summary>
    /// Validate a CIE-10 code
    /// </summary>
    /// <param name="code">Code to validate</param>
    /// <returns>Validation result</returns>
    [HttpGet("validate/{code}")]
    [ProducesResponseType(typeof(CodeValidationResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<CodeValidationResult>> ValidateCode(string code)
    {
        try
        {
            _logger.LogInformation("Validating CIE-10 code: {Code}", code);

            var isValid = await _cie10Service.ValidateCodeAsync(code);

            return Ok(new CodeValidationResult
            {
                Code = code,
                IsValid = isValid,
                Message = isValid ? "Code is valid" : "Code not found in catalog",
                ValidatedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating CIE-10 code");
            return StatusCode(500, new { message = "Error validating code", error = ex.Message });
        }
    }

    /// <summary>
    /// Get detailed information about a CIE-10 code
    /// </summary>
    /// <param name="code">CIE-10 code</param>
    /// <returns>Detailed code information</returns>
    [HttpGet("{code}/details")]
    [ProducesResponseType(typeof(ICD10CodeDetails), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ICD10CodeDetails>> GetCodeDetails(string code)
    {
        try
        {
            _logger.LogInformation("Fetching detailed information for CIE-10 code: {Code}", code);

            var result = await _cie10Service.GetCodeDetailsAsync(code);

            if (result == null)
            {
                return NotFound(new { message = $"CIE-10 code '{code}' not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching CIE-10 code details");
            return StatusCode(500, new { message = "Error fetching code details", error = ex.Message });
        }
    }

    /// <summary>
    /// Get the most commonly used CIE-10 codes
    /// </summary>
    /// <param name="count">Number of codes to return (default: 50)</param>
    /// <returns>List of most common codes</returns>
    [HttpGet("common")]
    [ProducesResponseType(typeof(List<ICD10Code>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ICD10Code>>> GetMostCommonCodes([FromQuery] int count = 50)
    {
        try
        {
            _logger.LogInformation("Fetching {Count} most common CIE-10 codes", count);

            var results = await _cie10Service.GetMostCommonCodesAsync(count);

            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching most common CIE-10 codes");
            return StatusCode(500, new { message = "Error fetching common codes", error = ex.Message });
        }
    }

    /// <summary>
    /// Synchronize local catalog with WHO API
    /// </summary>
    /// <returns>Synchronization result</returns>
    [HttpPost("sync")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(CatalogSyncResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<CatalogSyncResult>> SyncCatalog()
    {
        try
        {
            _logger.LogInformation("Starting CIE-10 catalog synchronization");

            var syncedCount = await _cie10Service.SyncWithWHOApiAsync();

            return Ok(new CatalogSyncResult
            {
                Success = true,
                CodesSynchronized = syncedCount,
                Message = "Catalog synchronized successfully",
                SyncDate = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error synchronizing CIE-10 catalog");
            return StatusCode(500, new CatalogSyncResult
            {
                Success = false,
                CodesSynchronized = 0,
                Message = $"Synchronization failed: {ex.Message}",
                SyncDate = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Get catalog statistics
    /// </summary>
    /// <returns>Catalog statistics</returns>
    [HttpGet("statistics")]
    [ProducesResponseType(typeof(CatalogStatistics), StatusCodes.Status200OK)]
    public async Task<ActionResult<CatalogStatistics>> GetStatistics()
    {
        try
        {
            _logger.LogInformation("Fetching CIE-10 catalog statistics");

            var stats = await _cie10Service.GetCatalogStatisticsAsync();

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching catalog statistics");
            return StatusCode(500, new { message = "Error fetching statistics", error = ex.Message });
        }
    }
}

// DTOs

public class CodeValidationResult
{
    public string Code { get; set; } = string.Empty;
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime ValidatedAt { get; set; }
}

public class CatalogSyncResult
{
    public bool Success { get; set; }
    public int CodesSynchronized { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime SyncDate { get; set; }
}
