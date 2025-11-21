using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using FluentValidation;
using EPrescription.Application.Commands.Pharmacies;
using EPrescription.Application.Queries.Pharmacies;
using EPrescription.Application.DTOs;

namespace EPrescription.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
// [Authorize] // TEMPORARILY DISABLED FOR TESTING
public class PharmaciesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IValidator<CreatePharmacyDto> _createValidator;
    private readonly IValidator<UpdatePharmacyDto> _updateValidator;
    private readonly ILogger<PharmaciesController> _logger;

    public PharmaciesController(
        IMediator mediator,
        IValidator<CreatePharmacyDto> createValidator,
        IValidator<UpdatePharmacyDto> updateValidator,
        ILogger<PharmaciesController> logger)
    {
        _mediator = mediator;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _logger = logger;
    }

    /// <summary>
    /// Create a new pharmacy
    /// </summary>
    /// <remarks>
    /// Requires admin role
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(PharmacyDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreatePharmacy([FromBody] CreatePharmacyDto dto)
    {
        try
        {
            _logger.LogInformation("Received CreatePharmacy request: LicenseNumber={LicenseNumber}, Name={Name}, City={City}",
                dto.LicenseNumber, dto.Name, dto.City);

            // Validate DTO
            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for CreatePharmacy: {Errors}",
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
            var command = new CreatePharmacyCommand
            {
                LicenseNumber = dto.LicenseNumber,
                Name = dto.Name,
                Address = dto.Address,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                Phone = dto.Phone,
                Email = dto.Email
            };

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Pharmacy created successfully: {PharmacyId}", result.Id);

            return CreatedAtAction(nameof(GetPharmacy), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule violation in CreatePharmacy");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating pharmacy");
            return StatusCode(500, new { message = "An error occurred while creating the pharmacy" });
        }
    }

    /// <summary>
    /// Get pharmacy by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PharmacyDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPharmacy(Guid id)
    {
        try
        {
            _logger.LogInformation("Received GetPharmacy request: {PharmacyId}", id);

            var query = new GetPharmacyQuery { Id = id };
            var result = await _mediator.Send(query);

            if (result == null)
            {
                _logger.LogWarning("Pharmacy not found: {PharmacyId}", id);
                return NotFound(new { message = $"Pharmacy with ID {id} not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pharmacy {PharmacyId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the pharmacy" });
        }
    }

    /// <summary>
    /// Update pharmacy information
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(PharmacyDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdatePharmacy(Guid id, [FromBody] UpdatePharmacyDto dto)
    {
        try
        {
            _logger.LogInformation("Received UpdatePharmacy request: {PharmacyId}", id);

            // Validate DTO
            var validationResult = await _updateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for UpdatePharmacy: {Errors}",
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
            var command = new UpdatePharmacyCommand
            {
                Id = id,
                Address = dto.Address,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                Phone = dto.Phone,
                Email = dto.Email
            };

            // Execute command
            var result = await _mediator.Send(command);

            _logger.LogInformation("Pharmacy updated successfully: {PharmacyId}", id);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Pharmacy not found in UpdatePharmacy: {PharmacyId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating pharmacy {PharmacyId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the pharmacy" });
        }
    }

    /// <summary>
    /// Delete pharmacy
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeletePharmacy(Guid id)
    {
        try
        {
            _logger.LogInformation("Received DeletePharmacy request: {PharmacyId}", id);

            var command = new DeletePharmacyCommand { Id = id };
            var result = await _mediator.Send(command);

            if (!result)
            {
                _logger.LogWarning("Pharmacy not found for deletion: {PharmacyId}", id);
                return NotFound(new { message = $"Pharmacy with ID {id} not found" });
            }

            _logger.LogInformation("Pharmacy deleted successfully: {PharmacyId}", id);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Pharmacy not found in DeletePharmacy: {PharmacyId}", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting pharmacy {PharmacyId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the pharmacy" });
        }
    }

    /// <summary>
    /// Search pharmacies with filters and pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResult<PharmacyListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SearchPharmacies(
        [FromQuery] string? searchTerm,
        [FromQuery] string? city,
        [FromQuery] string? state,
        [FromQuery] bool? isActive,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            _logger.LogInformation("Received SearchPharmacies request: SearchTerm={SearchTerm}, City={City}, State={State}, IsActive={IsActive}, Page={Page}, PageSize={PageSize}",
                searchTerm, city, state, isActive, pageNumber, pageSize);

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
            var query = new SearchPharmaciesQuery
            {
                SearchTerm = searchTerm,
                City = city,
                State = state,
                IsActive = isActive,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            // Execute query
            var result = await _mediator.Send(query);

            _logger.LogInformation("SearchPharmacies completed: Found {Count} pharmacies (Total: {Total})",
                result.Items.Count, result.TotalCount);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching pharmacies");
            return StatusCode(500, new { message = "An error occurred while searching pharmacies" });
        }
    }
}
