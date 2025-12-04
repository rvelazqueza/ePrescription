using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EPrescription.Infrastructure.Persistence;

namespace EPrescription.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class SpecialtiesController : ControllerBase
{
    private readonly EPrescriptionDbContext _context;
    private readonly ILogger<SpecialtiesController> _logger;

    public SpecialtiesController(
        EPrescriptionDbContext context,
        ILogger<SpecialtiesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all specialties (temporary endpoint for testing)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllSpecialties()
    {
        try
        {
            _logger.LogInformation("Received GetAllSpecialties request");

            var specialties = await _context.Set<EPrescription.Domain.Entities.Specialty>()
                .Select(s => new
                {
                    id = s.Id,
                    code = s.SpecialtyCode,
                    name = s.SpecialtyName,
                    description = s.Description
                })
                .ToListAsync();

            _logger.LogInformation("Found {Count} specialties", specialties.Count);

            return Ok(specialties);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting specialties");
            return StatusCode(500, new { message = "An error occurred while retrieving specialties", error = ex.Message });
        }
    }

    /// <summary>
    /// Get specialty by ID (temporary endpoint for testing)
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSpecialty(Guid id)
    {
        try
        {
            _logger.LogInformation("Received GetSpecialty request: {SpecialtyId}", id);

            var specialty = await _context.Set<EPrescription.Domain.Entities.Specialty>()
                .Where(s => s.Id == id)
                .Select(s => new
                {
                    id = s.Id,
                    code = s.SpecialtyCode,
                    name = s.SpecialtyName,
                    description = s.Description
                })
                .FirstOrDefaultAsync();

            if (specialty == null)
            {
                _logger.LogWarning("Specialty not found: {SpecialtyId}", id);
                return NotFound(new { message = $"Specialty with ID {id} not found" });
            }

            return Ok(specialty);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting specialty {SpecialtyId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the specialty", error = ex.Message });
        }
    }
}
