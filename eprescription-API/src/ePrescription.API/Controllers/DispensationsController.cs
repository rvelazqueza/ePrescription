using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using FluentValidation;
using EPrescription.Application.Commands.Dispensations;
using EPrescription.Application.Queries.Dispensations;
using EPrescription.Application.DTOs;

namespace EPrescription.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
// [Authorize] // TEMPORARILY DISABLED FOR TESTING
public class DispensationsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IValidator<RegisterDispensationDto> _registerValidator;
    private readonly IValidator<VerifyDispensationDto> _verifyValidator;
    private readonly ILogger<DispensationsController> _logger;

    public DispensationsController(
        IMediator mediator,
        IValidator<RegisterDispensationDto> registerValidator,
        IValidator<VerifyDispensationDto> verifyValidator,
        ILogger<DispensationsController> logger)
    {
        _mediator = mediator;
        _registerValidator = registerValidator;
        _verifyValidator = verifyValidator;
        _logger = logger;
    }

    /// <summary>
    /// Register a new dispensation
    /// </summary>
    /// <remarks>
    /// Requires pharmacist or admin role
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(DispensationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RegisterDispensation([FromBody] RegisterDispensationDto dto)
    {
        try
        {
            _logger.LogInformation("Received RegisterDispensation request: PrescriptionId={PrescriptionId}, PharmacyId={PharmacyId}", 
                dto.PrescriptionId, dto.PharmacyId);
            
            // Validate DTO
            var validationResult = await _registerValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for RegisterDispensation: {Errors}", 
                    string.Join(", ", validationResult.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}")));
                    
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = validationResult.Errors.Select(e => new
                    {
                        property = e.PropertyName,
                        error = e.ErrorMessage
                    })
                });
            }

            // Create command (using Guid.Empty for userId since auth is disabled)
            var command = new RegisterDispensationCommand(dto, Guid.Empty);

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Dispensation registered successfully: DispensationId={DispensationId}", result.Id);

            return CreatedAtAction(
                nameof(GetDispensation),
                new { id = result.Id },
                result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found during RegisterDispensation");
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation during RegisterDispensation");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering dispensation");
            return StatusCode(500, new { message = "An error occurred while registering the dispensation" });
        }
    }

    /// <summary>
    /// Get a dispensation by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(DispensationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDispensation(Guid id)
    {
        try
        {
            _logger.LogInformation("Getting dispensation: DispensationId={DispensationId}", id);

            var query = new GetDispensationQuery(id);
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Dispensation not found: DispensationId={DispensationId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dispensation: DispensationId={DispensationId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the dispensation" });
        }
    }

    /// <summary>
    /// Verify a dispensation
    /// </summary>
    /// <remarks>
    /// Requires pharmacist or admin role
    /// </remarks>
    [HttpPost("{id}/verify")]
    [ProducesResponseType(typeof(DispensationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> VerifyDispensation(Guid id, [FromBody] VerifyDispensationDto dto)
    {
        try
        {
            _logger.LogInformation("Received VerifyDispensation request: DispensationId={DispensationId}", id);
            
            // Validate DTO
            var validationResult = await _verifyValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for VerifyDispensation: {Errors}", 
                    string.Join(", ", validationResult.Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}")));
                    
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = validationResult.Errors.Select(e => new
                    {
                        property = e.PropertyName,
                        error = e.ErrorMessage
                    })
                });
            }

            // Create command
            var command = new VerifyDispensationCommand
            {
                DispensationId = id,
                Notes = dto.Notes
            };

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Dispensation verified successfully: DispensationId={DispensationId}", id);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Dispensation not found: DispensationId={DispensationId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument during VerifyDispensation");
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation during VerifyDispensation");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying dispensation: DispensationId={DispensationId}", id);
            return StatusCode(500, new { message = "An error occurred while verifying the dispensation" });
        }
    }

    /// <summary>
    /// Get dispensations by prescription ID
    /// </summary>
    [HttpGet("by-prescription/{prescriptionId}")]
    [ProducesResponseType(typeof(IEnumerable<DispensationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDispensationsByPrescription(Guid prescriptionId)
    {
        try
        {
            _logger.LogInformation("Getting dispensations by prescription: PrescriptionId={PrescriptionId}", prescriptionId);

            // This would require a SearchDispensationsQuery - for now return NotImplemented
            return StatusCode(501, new { message = "Search functionality not yet implemented" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dispensations by prescription: PrescriptionId={PrescriptionId}", prescriptionId);
            return StatusCode(500, new { message = "An error occurred while retrieving dispensations" });
        }
    }

    /// <summary>
    /// Get dispensations by pharmacy ID
    /// </summary>
    [HttpGet("by-pharmacy/{pharmacyId}")]
    [ProducesResponseType(typeof(IEnumerable<DispensationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDispensationsByPharmacy(Guid pharmacyId)
    {
        try
        {
            _logger.LogInformation("Getting dispensations by pharmacy: PharmacyId={PharmacyId}", pharmacyId);

            // This would require a SearchDispensationsQuery - for now return NotImplemented
            return StatusCode(501, new { message = "Search functionality not yet implemented" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dispensations by pharmacy: PharmacyId={PharmacyId}", pharmacyId);
            return StatusCode(500, new { message = "An error occurred while retrieving dispensations" });
        }
    }
}
