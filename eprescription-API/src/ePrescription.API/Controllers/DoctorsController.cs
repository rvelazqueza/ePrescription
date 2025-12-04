using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using FluentValidation;
using EPrescription.Application.Commands.Doctors;
using EPrescription.Application.Queries.Doctors;
using EPrescription.Application.DTOs;

namespace EPrescription.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
// [Authorize] // TEMPORARILY DISABLED FOR TESTING
public class DoctorsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IValidator<CreateDoctorDto> _createValidator;
    private readonly IValidator<UpdateDoctorDto> _updateValidator;
    private readonly ILogger<DoctorsController> _logger;

    public DoctorsController(
        IMediator mediator,
        IValidator<CreateDoctorDto> createValidator,
        IValidator<UpdateDoctorDto> updateValidator,
        ILogger<DoctorsController> logger)
    {
        _mediator = mediator;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = logger;
    }

    /// <summary>
    /// Create a new doctor
    /// </summary>
    /// <remarks>
    /// Requires admin role
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(DoctorDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto dto)
    {
        try
        {
            _logger.LogInformation("Received CreateDoctor request: IdentificationNumber={IdentificationNumber}, Name={FirstName} {LastName}, License={License}",
                dto.IdentificationNumber, dto.FirstName, dto.LastName, dto.MedicalLicenseNumber);

            // Validate DTO
            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for CreateDoctor: {Errors}",
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
            var command = new CreateDoctorCommand
            {
                IdentificationNumber = dto.IdentificationNumber,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                MedicalLicenseNumber = dto.MedicalLicenseNumber,
                SpecialtyId = dto.SpecialtyId,
                Email = dto.Email,
                Phone = dto.Phone
            };

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Doctor created successfully: {DoctorId}", result.Id);

            return CreatedAtAction(nameof(GetDoctor), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule violation in CreateDoctor");
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Specialty not found in CreateDoctor");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating doctor");
            return StatusCode(500, new { message = "An error occurred while creating the doctor" });
        }
    }

    /// <summary>
    /// Get doctor by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(DoctorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDoctor(Guid id)
    {
        try
        {
            _logger.LogInformation("Received GetDoctor request: {DoctorId}", id);

            var query = new GetDoctorQuery { Id = id };
            var result = await _mediator.Send(query);

            if (result == null)
            {
                _logger.LogWarning("Doctor not found: {DoctorId}", id);
                return NotFound(new { message = $"Doctor with ID {id} not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting doctor {DoctorId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the doctor" });
        }
    }

    /// <summary>
    /// Update doctor contact information
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(DoctorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateDoctor(Guid id, [FromBody] UpdateDoctorDto dto)
    {
        try
        {
            _logger.LogInformation("Received UpdateDoctor request: {DoctorId}", id);

            // Validate DTO
            var validationResult = await _updateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for UpdateDoctor: {Errors}",
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
            var command = new UpdateDoctorCommand
            {
                Id = id,
                Email = dto.Email,
                Phone = dto.Phone
            };

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Doctor updated successfully: {DoctorId}", id);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Doctor not found in UpdateDoctor: {DoctorId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating doctor {DoctorId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the doctor" });
        }
    }

    /// <summary>
    /// Delete doctor
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteDoctor(Guid id)
    {
        try
        {
            _logger.LogInformation("Received DeleteDoctor request: {DoctorId}", id);

            var command = new DeleteDoctorCommand { Id = id };
            var result = await _mediator.Send(command);

            if (!result)
            {
                _logger.LogWarning("Doctor not found for deletion: {DoctorId}", id);
                return NotFound(new { message = $"Doctor with ID {id} not found" });
            }

            _logger.LogInformation("Doctor deleted successfully: {DoctorId}", id);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Doctor not found in DeleteDoctor: {DoctorId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting doctor {DoctorId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the doctor" });
        }
    }

    /// <summary>
    /// Search doctors with filters and pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResult<DoctorListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SearchDoctors(
        [FromQuery] string? searchTerm,
        [FromQuery] Guid? specialtyId,
        [FromQuery] bool? isActive,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            _logger.LogInformation("Received SearchDoctors request: SearchTerm={SearchTerm}, SpecialtyId={SpecialtyId}, IsActive={IsActive}, Page={Page}, PageSize={PageSize}",
                searchTerm, specialtyId, isActive, pageNumber, pageSize);

            // Validate pagination
            if (pageNumber < 1)
            {
                return BadRequest(new { message = "Page number must be greater than 0" });
            }

            if (pageSize < 1 || pageSize > 100)
            {
                return BadRequest(new { message = "Page size must be between 1 and 100" });
            }

            // Create query
            var query = new SearchDoctorsQuery
            {
                SearchTerm = searchTerm,
                SpecialtyId = specialtyId,
                IsActive = isActive,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            // Execute query
            var result = await _mediator.Send(query);

            _logger.LogInformation("SearchDoctors completed: Found {Count} doctors (Total: {Total})",
                result.Items.Count, result.TotalCount);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching doctors");
            return StatusCode(500, new { message = "An error occurred while searching doctors" });
        }
    }
}
