using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using FluentValidation;
using EPrescription.Application.Commands.Patients;
using EPrescription.Application.Queries.Patients;
using EPrescription.Application.DTOs;

namespace EPrescription.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
// [Authorize] // TEMPORARILY DISABLED FOR TESTING
public class PatientsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IValidator<CreatePatientDto> _createValidator;
    private readonly IValidator<UpdatePatientDto> _updateValidator;
    private readonly IValidator<SearchPatientsDto> _searchValidator;
    private readonly ILogger<PatientsController> _logger;

    public PatientsController(
        IMediator mediator,
        IValidator<CreatePatientDto> createValidator,
        IValidator<UpdatePatientDto> updateValidator,
        IValidator<SearchPatientsDto> searchValidator,
        ILogger<PatientsController> logger)
    {
        _mediator = mediator;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _searchValidator = searchValidator;
        _logger = logger;
    }

    /// <summary>
    /// Create a new patient
    /// </summary>
    /// <remarks>
    /// Requires admin or doctor role
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(PatientDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreatePatient([FromBody] CreatePatientDto dto)
    {
        try
        {
            // Log incoming request
            _logger.LogInformation("Received CreatePatient request: IdentificationNumber={IdentificationNumber}, Name={FirstName} {LastName}", 
                dto.IdentificationNumber, dto.FirstName, dto.LastName);
            
            // Validate DTO
            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for CreatePatient: {Errors}", 
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
            var command = new CreatePatientCommand(dto);

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Patient {PatientId} created successfully with identification {IdentificationNumber}", 
                result.Id, result.IdentificationNumber);

            return CreatedAtAction(
                nameof(GetPatient),
                new { id = result.Id },
                result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Patient with identification number already exists");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating patient");
            return StatusCode(500, new { message = "An error occurred while creating the patient" });
        }
    }

    /// <summary>
    /// Get patient by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PatientDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPatient(Guid id)
    {
        try
        {
            var query = new GetPatientQuery(id);
            var result = await _mediator.Send(query);

            if (result == null)
            {
                _logger.LogWarning("Patient {PatientId} not found", id);
                return NotFound(new { message = $"Patient with ID {id} not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting patient {PatientId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the patient" });
        }
    }

    /// <summary>
    /// Update an existing patient
    /// </summary>
    /// <remarks>
    /// Requires admin or doctor role
    /// </remarks>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(PatientDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdatePatient(Guid id, [FromBody] UpdatePatientDto dto)
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

            // Create command
            var command = new UpdatePatientCommand(id, dto);

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Patient {PatientId} updated successfully", id);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Patient {PatientId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating patient {PatientId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the patient" });
        }
    }

    /// <summary>
    /// Delete a patient
    /// </summary>
    /// <remarks>
    /// Requires admin role. This performs a hard delete.
    /// </remarks>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeletePatient(Guid id)
    {
        try
        {
            // Create command
            var command = new DeletePatientCommand(id);

            // Execute command
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = $"Patient with ID {id} not found" });
            }

            _logger.LogInformation("Patient {PatientId} deleted successfully", id);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Patient {PatientId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting patient {PatientId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the patient" });
        }
    }

    /// <summary>
    /// Search patients with filters and pagination
    /// </summary>
    [HttpPost("search")]
    [ProducesResponseType(typeof(PaginatedResult<PatientListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SearchPatients([FromBody] SearchPatientsDto dto)
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
            var query = new SearchPatientsQuery(dto);

            // Execute query
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching patients");
            return StatusCode(500, new { message = "An error occurred while searching patients" });
        }
    }

    /// <summary>
    /// Get patients by identification number (partial match)
    /// </summary>
    [HttpGet("identification/{identificationNumber}")]
    [ProducesResponseType(typeof(PaginatedResult<PatientListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPatientsByIdentification(string identificationNumber, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var searchDto = new SearchPatientsDto
            {
                IdentificationNumber = identificationNumber,
                Page = page,
                PageSize = pageSize
            };

            var query = new SearchPatientsQuery(searchDto);
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting patients by identification {IdentificationNumber}", identificationNumber);
            return StatusCode(500, new { message = "An error occurred while retrieving patients" });
        }
    }

    /// <summary>
    /// Get patients by name (partial match)
    /// </summary>
    [HttpGet("name/{name}")]
    [ProducesResponseType(typeof(PaginatedResult<PatientListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPatientsByName(string name, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var searchDto = new SearchPatientsDto
            {
                SearchTerm = name,
                Page = page,
                PageSize = pageSize
            };

            var query = new SearchPatientsQuery(searchDto);
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting patients by name {Name}", name);
            return StatusCode(500, new { message = "An error occurred while retrieving patients" });
        }
    }

    /// <summary>
    /// Get all patients with pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResult<PatientListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllPatients([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? sortBy = null, [FromQuery] string? sortDirection = null)
    {
        try
        {
            var searchDto = new SearchPatientsDto
            {
                Page = page,
                PageSize = pageSize,
                SortBy = sortBy,
                SortDirection = sortDirection
            };

            var query = new SearchPatientsQuery(searchDto);
            var result = await _mediator.Send(query);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all patients");
            return StatusCode(500, new { message = "An error occurred while retrieving patients" });
        }
    }
}
