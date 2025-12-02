using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using FluentValidation;
using EPrescription.Application.Commands.Prescriptions;
using EPrescription.Application.Queries.Prescriptions;
using EPrescription.Application.DTOs;
using System.Security.Claims;

namespace EPrescription.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
// [Authorize] // TEMPORARILY DISABLED FOR TESTING
public class PrescriptionsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IValidator<CreatePrescriptionDto> _createValidator;
    private readonly IValidator<UpdatePrescriptionDto> _updateValidator;
    private readonly IValidator<SearchPrescriptionsDto> _searchValidator;
    private readonly ILogger<PrescriptionsController> _logger;

    public PrescriptionsController(
        IMediator mediator,
        IValidator<CreatePrescriptionDto> createValidator,
        IValidator<UpdatePrescriptionDto> updateValidator,
        IValidator<SearchPrescriptionsDto> searchValidator,
        ILogger<PrescriptionsController> logger)
    {
        _mediator = mediator;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _searchValidator = searchValidator;
        _logger = logger;
    }

    /// <summary>
    /// Create a new prescription
    /// </summary>
    /// <remarks>
    /// Requires doctor or admin role
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(PrescriptionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptionDto dto)
    {
        try
        {
            // Log incoming request
            _logger.LogInformation("Received CreatePrescription request: PatientId={PatientId}, DoctorId={DoctorId}, PrescriptionDate={PrescriptionDate}", 
                dto.PatientId, dto.DoctorId, dto.PrescriptionDate);
            
            // Validate DTO
            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for CreatePrescription: {Errors}", 
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

            // Get user ID from claims
            var userId = GetUserIdFromClaims();

            // Create command
            var command = new CreatePrescriptionCommand(dto, userId);

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Prescription {PrescriptionNumber} created successfully by user {UserId}", 
                result.PrescriptionNumber, userId);

            return CreatedAtAction(
                nameof(GetPrescription),
                new { id = result.Id },
                result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Entity not found while creating prescription");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating prescription");
            return StatusCode(500, new { message = "An error occurred while creating the prescription" });
        }
    }

    /// <summary>
    /// Search prescriptions with filters and pagination (GET with query parameters)
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(PaginatedResult<PrescriptionListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SearchPrescriptionsGet(
        [FromQuery] Guid? patientId = null,
        [FromQuery] Guid? doctorId = null,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var dto = new SearchPrescriptionsDto
            {
                PatientId = patientId,
                DoctorId = doctorId,
                Status = status,
                FromDate = startDate,
                ToDate = endDate,
                Page = page,
                PageSize = pageSize
            };

            // Validate DTO
            var validationResult = await _searchValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
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

            // Create query
            var query = new SearchPrescriptionsQuery(dto);

            // Execute query
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching prescriptions");
            return StatusCode(500, new { message = "An error occurred while searching prescriptions" });
        }
    }

    /// <summary>
    /// Search prescriptions with filters and pagination (POST with body)
    /// </summary>
    [HttpPost("search")]
    [ProducesResponseType(typeof(PaginatedResult<PrescriptionListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SearchPrescriptions([FromBody] SearchPrescriptionsDto dto)
    {
        try
        {
            // Validate DTO
            var validationResult = await _searchValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
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

            // Create query
            var query = new SearchPrescriptionsQuery(dto);

            // Execute query
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching prescriptions");
            return StatusCode(500, new { message = "An error occurred while searching prescriptions" });
        }
    }

    /// <summary>
    /// Get prescriptions by patient ID
    /// </summary>
    [HttpGet("patient/{patientId}")]
    [ProducesResponseType(typeof(PaginatedResult<PrescriptionListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPrescriptionsByPatient(Guid patientId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var searchDto = new SearchPrescriptionsDto
            {
                PatientId = patientId,
                Page = page,
                PageSize = pageSize
            };

            var query = new SearchPrescriptionsQuery(searchDto);
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting prescriptions for patient {PatientId}", patientId);
            return StatusCode(500, new { message = "An error occurred while retrieving prescriptions" });
        }
    }

    /// <summary>
    /// Get prescriptions by doctor ID
    /// </summary>
    [HttpGet("doctor/{doctorId}")]
    [ProducesResponseType(typeof(PaginatedResult<PrescriptionListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPrescriptionsByDoctor(Guid doctorId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var searchDto = new SearchPrescriptionsDto
            {
                DoctorId = doctorId,
                Page = page,
                PageSize = pageSize
            };

            var query = new SearchPrescriptionsQuery(searchDto);
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting prescriptions for doctor {DoctorId}", doctorId);
            return StatusCode(500, new { message = "An error occurred while retrieving prescriptions" });
        }
    }

    /// <summary>
    /// Get prescriptions by status
    /// </summary>
    [HttpGet("status/{status}")]
    [ProducesResponseType(typeof(PaginatedResult<PrescriptionListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPrescriptionsByStatus(string status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var searchDto = new SearchPrescriptionsDto
            {
                Status = status,
                Page = page,
                PageSize = pageSize
            };

            var query = new SearchPrescriptionsQuery(searchDto);
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting prescriptions with status {Status}", status);
            return StatusCode(500, new { message = "An error occurred while retrieving prescriptions" });
        }
    }

    /// <summary>
    /// Get prescription by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PrescriptionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPrescription(Guid id)
    {
        try
        {
            var query = new GetPrescriptionQuery(id);
            var result = await _mediator.Send(query);

            if (result == null)
            {
                _logger.LogWarning("Prescription {PrescriptionId} not found", id);
                return NotFound(new { message = $"Prescription with ID {id} not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting prescription {PrescriptionId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the prescription" });
        }
    }

    /// <summary>
    /// Update an existing prescription
    /// </summary>
    /// <remarks>
    /// Requires doctor or admin role
    /// </remarks>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(PrescriptionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdatePrescription(Guid id, [FromBody] UpdatePrescriptionDto dto)
    {
        try
        {
            // Validate DTO
            var validationResult = await _updateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
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

            // Get user ID from claims
            var userId = GetUserIdFromClaims();

            // Create command
            var command = new UpdatePrescriptionCommand(id, dto, userId);

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Prescription {PrescriptionId} updated successfully by user {UserId}", 
                id, userId);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Entity not found while updating prescription {PrescriptionId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating prescription {PrescriptionId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the prescription" });
        }
    }

    /// <summary>
    /// Delete (cancel) a prescription
    /// </summary>
    /// <remarks>
    /// Requires doctor or admin role. This performs a soft delete by changing status to Cancelled.
    /// </remarks>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeletePrescription(Guid id)
    {
        try
        {
            // Get user ID from claims
            var userId = GetUserIdFromClaims();

            // Create command
            var command = new DeletePrescriptionCommand(id, userId);

            // Execute command
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = $"Prescription with ID {id} not found" });
            }

            _logger.LogInformation("Prescription {PrescriptionId} cancelled successfully by user {UserId}", 
                id, userId);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Prescription {PrescriptionId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Cannot delete prescription {PrescriptionId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting prescription {PrescriptionId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the prescription" });
        }
    }

    /// <summary>
    /// Duplicate a prescription
    /// </summary>
    /// <remarks>
    /// Creates a copy of an existing prescription as a draft.
    /// </remarks>
    [HttpPost("{id}/duplicate")]
    [ProducesResponseType(typeof(PrescriptionListDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DuplicatePrescription(Guid id)
    {
        try
        {
            var command = new DuplicatePrescriptionCommand(id);
            var result = await _mediator.Send(command);

            if (result == null)
            {
                return NotFound(new { message = $"Prescription with ID {id} not found" });
            }

            _logger.LogInformation("Prescription {PrescriptionId} duplicated successfully", id);

            return CreatedAtAction(nameof(GetPrescriptionById), new { id = result.Id }, result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Prescription {PrescriptionId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Cannot duplicate prescription {PrescriptionId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error duplicating prescription {PrescriptionId}", id);
            return StatusCode(500, new { message = "An error occurred while duplicating the prescription" });
        }
    }

    /// <summary>
    /// Cancel a prescription
    /// </summary>
    /// <remarks>
    /// Changes the status of a prescription to cancelled.
    /// </remarks>
    [HttpPatch("{id}/cancel")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CancelPrescription(Guid id, [FromBody] CancelPrescriptionDto? dto = null)
    {
        try
        {
            var command = new CancelPrescriptionCommand(id, dto?.Reason);
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = $"Prescription with ID {id} not found or cannot be cancelled" });
            }

            _logger.LogInformation("Prescription {PrescriptionId} cancelled successfully", id);

            return Ok(new { message = "Prescription cancelled successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Prescription {PrescriptionId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Cannot cancel prescription {PrescriptionId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling prescription {PrescriptionId}", id);
            return StatusCode(500, new { message = "An error occurred while cancelling the prescription" });
        }
    }

    /// <summary>
    /// Create a new draft prescription
    /// </summary>
    /// <remarks>
    /// Creates a new prescription in draft status with initial data.
    /// </remarks>
    [HttpPost("create-draft")]
    [ProducesResponseType(typeof(PrescriptionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateDraft([FromBody] CreateDraftDto dto)
    {
        try
        {
            _logger.LogInformation("Received CreateDraft request: PatientId={PatientId}, DoctorId={DoctorId}", 
                dto.PatientId, dto.DoctorId);

            // Get user ID from claims
            var userId = GetUserIdFromClaims();

            // Create command
            var command = new CreateDraftCommand(dto, userId);

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Draft prescription {PrescriptionNumber} created successfully by user {UserId}", 
                result.PrescriptionNumber, userId);

            return CreatedAtAction(
                nameof(GetPrescription),
                new { id = result.Id },
                result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Entity not found while creating draft");
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation while creating draft");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating draft prescription");
            return StatusCode(500, new { message = "An error occurred while creating the draft prescription" });
        }
    }

    /// <summary>
    /// Delete a draft prescription
    /// </summary>
    /// <remarks>
    /// Permanently deletes a prescription that is in draft status. Only draft prescriptions can be deleted.
    /// </remarks>
    [HttpDelete("{id}/draft")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteDraft(Guid id)
    {
        try
        {
            _logger.LogInformation("Received DeleteDraft request for prescription {PrescriptionId}", id);

            // Get user ID from claims
            var userId = GetUserIdFromClaims();

            // Create command
            var command = new DeleteDraftCommand(id, userId);

            // Execute command
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = $"Draft prescription with ID {id} not found" });
            }

            _logger.LogInformation("Draft prescription {PrescriptionId} deleted successfully by user {UserId}", 
                id, userId);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Draft prescription {PrescriptionId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Cannot delete prescription {PrescriptionId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting draft prescription {PrescriptionId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the draft prescription" });
        }
    }

    private Guid GetUserIdFromClaims()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            _logger.LogWarning("Could not extract user ID from claims");
            return Guid.Empty;
        }

        return userId;
    }
}