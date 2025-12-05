using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using EPrescription.Application.Commands.PrescriptionPads;
using EPrescription.Application.Queries.PrescriptionPads;
using EPrescription.Application.DTOs;
using System.Security.Claims;

namespace EPrescription.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
// [Authorize] // TEMPORARILY DISABLED FOR TESTING
public class PrescriptionPadsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PrescriptionPadsController> _logger;

    public PrescriptionPadsController(
        IMediator mediator,
        ILogger<PrescriptionPadsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get available prescription pads for a doctor
    /// </summary>
    /// <remarks>
    /// Returns all available prescription pads for the specified doctor.
    /// Includes pad type information and slip statistics.
    /// </remarks>
    [HttpGet("doctor/{doctorId}")]
    [ProducesResponseType(typeof(AvailablePadsResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAvailablePadsForDoctor(
        [FromRoute] Guid doctorId,
        [FromQuery] Guid? padTypeId = null)
    {
        try
        {
            _logger.LogInformation("Getting available pads for doctor - DoctorId: {DoctorId}, PadTypeId: {PadTypeId}",
                doctorId, padTypeId ?? Guid.Empty);

            if (doctorId == Guid.Empty)
            {
                _logger.LogWarning("Invalid doctor ID provided");
                return BadRequest(new { message = "Invalid doctor ID" });
            }

            var query = new GetAvailablePadsForDoctorQuery(doctorId, padTypeId);
            var result = await _mediator.Send(query);

            _logger.LogInformation("Retrieved {PadCount} available pads for doctor {DoctorId}",
                result.Pads.Count, doctorId);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available pads for doctor {DoctorId}", doctorId);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = "An error occurred while retrieving available pads",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Get prescription pad statistics for a doctor
    /// </summary>
    /// <remarks>
    /// Returns comprehensive statistics about prescription pads and slips for the doctor.
    /// Includes information about expiring pads, low availability alerts, and usage percentages.
    /// </remarks>
    [HttpGet("doctor/{doctorId}/statistics")]
    [ProducesResponseType(typeof(PadStatisticsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPadStatistics([FromRoute] Guid doctorId)
    {
        try
        {
            _logger.LogInformation("Getting pad statistics for doctor - DoctorId: {DoctorId}", doctorId);

            if (doctorId == Guid.Empty)
            {
                _logger.LogWarning("Invalid doctor ID provided");
                return BadRequest(new { message = "Invalid doctor ID" });
            }

            var query = new GetPadStatisticsQuery(doctorId);
            var result = await _mediator.Send(query);

            _logger.LogInformation("Retrieved statistics for doctor {DoctorId}: Total={Total}, Active={Active}, Usage={Usage}%",
                doctorId, result.TotalPads, result.ActivePads, result.UsagePercentage);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pad statistics for doctor {DoctorId}", doctorId);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = "An error occurred while retrieving pad statistics",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Decrement the available count for a prescription pad
    /// </summary>
    /// <remarks>
    /// Decrements the available count for a prescription pad when a prescription is issued.
    /// Validates that the pad has sufficient availability and has not expired.
    /// </remarks>
    [HttpPost("{padId}/decrement")]
    [ProducesResponseType(typeof(PrescriptionPadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DecrementPadCount(
        [FromRoute] Guid padId,
        [FromBody] DecrementPadCountRequest request)
    {
        try
        {
            _logger.LogInformation("Decrementing pad count - PadId: {PadId}, Quantity: {Quantity}, Reason: {Reason}",
                padId, request.Quantity, request.Reason ?? "Not specified");

            if (padId == Guid.Empty)
            {
                _logger.LogWarning("Invalid pad ID provided");
                return BadRequest(new { message = "Invalid pad ID" });
            }

            if (request.Quantity <= 0)
            {
                _logger.LogWarning("Invalid quantity provided: {Quantity}", request.Quantity);
                return BadRequest(new { message = "Quantity must be greater than 0" });
            }

            var command = new DecrementPadCountCommand(padId, request.Quantity, request.Reason);
            var result = await _mediator.Send(command);

            _logger.LogInformation("Successfully decremented pad {PadId}, Remaining: {Remaining}",
                padId, result.AvailableCount);

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business logic error decrementing pad {PadId}", padId);
            return Conflict(new
            {
                message = "Cannot decrement pad count",
                error = ex.Message
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error decrementing pad count for pad {PadId}", padId);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = "An error occurred while decrementing pad count",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Health check endpoint for prescription pads service
    /// </summary>
    [HttpGet("health")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "healthy",
            service = "PrescriptionPads",
            timestamp = DateTime.UtcNow
        });
    }
}

/// <summary>
/// Request model for decrementing pad count
/// </summary>
public class DecrementPadCountRequest
{
    /// <summary>
    /// Number of pads to decrement
    /// </summary>
    public int Quantity { get; set; } = 1;

    /// <summary>
    /// Optional reason for decrement
    /// </summary>
    public string? Reason { get; set; }
}
