using ePrescription.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPrescription.API.Controllers;

/// <summary>
/// Controller for WHO API operations and ICD-10 synchronization
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin,doctor")]
public class WHOApiController : ControllerBase
{
    private readonly IWHOApiService _whoApiService;
    private readonly ILogger<WHOApiController> _logger;

    public WHOApiController(
        IWHOApiService whoApiService,
        ILogger<WHOApiController> logger)
    {
        _whoApiService = whoApiService;
        _logger = logger;
    }

    /// <summary>
    /// Manually trigger ICD-10 catalog synchronization with WHO API
    /// </summary>
    /// <returns>Synchronization result</returns>
    [HttpPost("sync")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(SyncResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<SyncResult>> SyncCatalog()
    {
        try
        {
            _logger.LogInformation("Manual ICD-10 catalog synchronization requested by user {User}", User.Identity?.Name);

            var result = await _whoApiService.SyncICD10CatalogAsync();

            return Ok(new SyncResult
            {
                Success = true,
                Message = "Synchronization completed successfully",
                CodesProcessed = result,
                SyncDate = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during manual ICD-10 synchronization");
            return StatusCode(500, new SyncResult
            {
                Success = false,
                Message = $"Synchronization failed: {ex.Message}",
                CodesProcessed = 0,
                SyncDate = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Get ICD-10 code details from WHO API
    /// </summary>
    /// <param name="code">ICD-10 code (e.g., A00.0)</param>
    /// <returns>Code details</returns>
    [HttpGet("code/{code}")]
    [ProducesResponseType(typeof(ICD10CodeDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ICD10CodeDto>> GetCodeDetails(string code)
    {
        try
        {
            _logger.LogInformation("Fetching ICD-10 code {Code} from WHO API", code);

            var result = await _whoApiService.GetICD10CodeDetailsAsync(code);

            if (result == null)
            {
                return NotFound(new { message = $"ICD-10 code '{code}' not found in WHO API" });
            }

            return Ok(new ICD10CodeDto
            {
                Code = result.Code,
                Title = result.Title,
                Definition = result.Definition,
                Chapter = result.Chapter,
                IsValid = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching ICD-10 code {Code} from WHO API", code);
            return StatusCode(500, new { message = "Error fetching code from WHO API", error = ex.Message });
        }
    }

    /// <summary>
    /// Search ICD-10 codes in WHO API
    /// </summary>
    /// <param name="query">Search query</param>
    /// <param name="limit">Maximum results (default: 20)</param>
    /// <returns>List of matching codes</returns>
    [HttpGet("search")]
    [ProducesResponseType(typeof(List<ICD10CodeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<ICD10CodeDto>>> SearchCodes(
        [FromQuery] string query,
        [FromQuery] int limit = 20)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { message = "Search query is required" });
            }

            _logger.LogInformation("Searching ICD-10 codes in WHO API with query: {Query}", query);

            var results = await _whoApiService.SearchICD10CodesAsync(query, limit);

            var dtos = results.Select(r => new ICD10CodeDto
            {
                Code = r.Code,
                Title = r.Title,
                Definition = r.Definition,
                Chapter = r.Chapter,
                IsValid = true
            }).ToList();

            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching ICD-10 codes in WHO API");
            return StatusCode(500, new { message = "Error searching codes in WHO API", error = ex.Message });
        }
    }

    /// <summary>
    /// Validate an ICD-10 code against WHO API
    /// </summary>
    /// <param name="code">ICD-10 code to validate</param>
    /// <returns>Validation result</returns>
    [HttpGet("validate/{code}")]
    [ProducesResponseType(typeof(ValidationResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ValidationResult>> ValidateCode(string code)
    {
        try
        {
            _logger.LogInformation("Validating ICD-10 code {Code} against WHO API", code);

            var isValid = await _whoApiService.ValidateICD10CodeAsync(code);

            return Ok(new ValidationResult
            {
                Code = code,
                IsValid = isValid,
                Message = isValid ? "Code is valid" : "Code not found in WHO API",
                ValidatedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating ICD-10 code {Code}", code);
            return StatusCode(500, new { message = "Error validating code", error = ex.Message });
        }
    }

    /// <summary>
    /// Check WHO API health status
    /// </summary>
    /// <returns>Health status</returns>
    [HttpGet("health")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(HealthStatus), StatusCodes.Status200OK)]
    public async Task<ActionResult<HealthStatus>> CheckHealth()
    {
        try
        {
            var isHealthy = await _whoApiService.CheckHealthAsync();

            return Ok(new HealthStatus
            {
                IsHealthy = isHealthy,
                Service = "WHO API",
                CheckedAt = DateTime.UtcNow,
                Message = isHealthy ? "WHO API is accessible" : "WHO API is not accessible"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking WHO API health");
            return Ok(new HealthStatus
            {
                IsHealthy = false,
                Service = "WHO API",
                CheckedAt = DateTime.UtcNow,
                Message = $"Health check failed: {ex.Message}"
            });
        }
    }
}

// DTOs

public class SyncResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int CodesProcessed { get; set; }
    public DateTime SyncDate { get; set; }
}

public class ICD10CodeDto
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Definition { get; set; }
    public string? Chapter { get; set; }
    public bool IsValid { get; set; }
}

public class ValidationResult
{
    public string Code { get; set; } = string.Empty;
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime ValidatedAt { get; set; }
}

public class HealthStatus
{
    public bool IsHealthy { get; set; }
    public string Service { get; set; } = string.Empty;
    public DateTime CheckedAt { get; set; }
    public string Message { get; set; } = string.Empty;
}
