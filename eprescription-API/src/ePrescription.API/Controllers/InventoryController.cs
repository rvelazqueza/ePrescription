using EPrescription.Application.Commands.Inventory;
using EPrescription.Application.DTOs;
using EPrescription.Application.Queries.Inventory;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EPrescription.API.Controllers;

/// <summary>
/// Controller for managing pharmacy inventory
/// </summary>
[ApiController]
[Route("api/[controller]")]
// [Authorize] // TEMPORARILY DISABLED FOR TESTING
public class InventoryController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<InventoryController> _logger;

    public InventoryController(IMediator mediator, ILogger<InventoryController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Add stock to inventory
    /// </summary>
    /// <param name="dto">Stock details to add</param>
    /// <returns>ID of the inventory record</returns>
    [HttpPost("add-stock")]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Guid>> AddStock([FromBody] AddStockDto dto)
    {
        _logger.LogInformation("Adding stock for Medication {MedicationId} at Pharmacy {PharmacyId}", 
            dto.MedicationId, dto.PharmacyId);

        var command = new AddStockCommand
        {
            PharmacyId = dto.PharmacyId,
            MedicationId = dto.MedicationId,
            Quantity = (int)dto.Quantity,
            BatchNumber = dto.BatchNumber,
            ExpirationDate = dto.ExpirationDate,
            UnitCost = dto.UnitCost
        };

        var inventoryId = await _mediator.Send(command);

        return CreatedAtAction(nameof(GetInventory), new { id = inventoryId }, inventoryId);
    }

    /// <summary>
    /// Adjust stock quantity (increase or decrease)
    /// </summary>
    /// <param name="dto">Adjustment details</param>
    /// <returns>Success status</returns>
    [HttpPut("adjust-stock")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> AdjustStock([FromBody] AdjustStockDto dto)
    {
        _logger.LogInformation("Adjusting stock for Inventory {InventoryId} by {Adjustment}", 
            dto.InventoryId, dto.QuantityAdjustment);

        var command = new AdjustStockCommand
        {
            InventoryId = dto.InventoryId,
            QuantityAdjustment = (int)dto.QuantityAdjustment,
            Reason = dto.Reason
        };

        try
        {
            var result = await _mediator.Send(command);

            if (!result)
            {
                return NotFound(new { message = "Inventory not found" });
            }

            return Ok(new { message = "Stock adjusted successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get inventory by ID
    /// </summary>
    /// <param name="id">Inventory ID</param>
    /// <returns>Inventory details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(InventoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<InventoryDto>> GetInventory(Guid id)
    {
        _logger.LogInformation("Getting inventory {InventoryId}", id);

        var query = new GetInventoryQuery(id);
        var inventory = await _mediator.Send(query);

        if (inventory == null)
        {
            return NotFound(new { message = "Inventory not found" });
        }

        return Ok(inventory);
    }

    /// <summary>
    /// Get all inventory for a pharmacy
    /// </summary>
    /// <param name="pharmacyId">Pharmacy ID</param>
    /// <param name="lowStockOnly">Filter for low stock items only</param>
    /// <returns>List of inventory items</returns>
    [HttpGet("pharmacy/{pharmacyId}")]
    [ProducesResponseType(typeof(List<InventoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<InventoryDto>>> GetPharmacyInventory(
        Guid pharmacyId, 
        [FromQuery] bool? lowStockOnly = null)
    {
        _logger.LogInformation("Getting inventory for Pharmacy {PharmacyId}, LowStockOnly: {LowStockOnly}", 
            pharmacyId, lowStockOnly);

        var query = new GetPharmacyInventoryQuery(pharmacyId, lowStockOnly);
        var inventory = await _mediator.Send(query);

        return Ok(inventory);
    }

    /// <summary>
    /// Get low stock alerts
    /// </summary>
    /// <param name="pharmacyId">Optional pharmacy ID to filter alerts</param>
    /// <returns>List of low stock alerts</returns>
    [HttpGet("alerts/low-stock")]
    [ProducesResponseType(typeof(List<LowStockAlertDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<LowStockAlertDto>>> GetLowStockAlerts([FromQuery] Guid? pharmacyId = null)
    {
        _logger.LogInformation("Getting low stock alerts for Pharmacy {PharmacyId}", 
            pharmacyId?.ToString() ?? "All");

        var query = new GetLowStockAlertsQuery(pharmacyId);
        var alerts = await _mediator.Send(query);

        return Ok(alerts);
    }

    /// <summary>
    /// Get expiring stock alerts
    /// </summary>
    /// <param name="pharmacyId">Pharmacy ID</param>
    /// <param name="daysUntilExpiration">Number of days until expiration (default: 30)</param>
    /// <returns>List of expiring stock alerts</returns>
    [HttpGet("alerts/expiring")]
    [ProducesResponseType(typeof(List<ExpiringStockAlertDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<ExpiringStockAlertDto>>> GetExpiringStockAlerts(
        [FromQuery] Guid? pharmacyId = null,
        [FromQuery] int daysUntilExpiration = 30)
    {
        _logger.LogInformation("Getting expiring stock alerts for Pharmacy {PharmacyId}, Days: {Days}", 
            pharmacyId?.ToString() ?? "All", daysUntilExpiration);

        var query = new GetExpiringStockAlertsQuery(pharmacyId, daysUntilExpiration);
        var alerts = await _mediator.Send(query);

        return Ok(alerts);
    }

    /// <summary>
    /// Search inventory with filters
    /// </summary>
    /// <param name="searchDto">Search parameters</param>
    /// <returns>Paginated list of inventory items</returns>
    [HttpPost("search")]
    [ProducesResponseType(typeof(List<InventoryListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<InventoryListDto>>> SearchInventory([FromBody] InventorySearchDto searchDto)
    {
        _logger.LogInformation("Searching inventory with filters");

        // For now, use GetPharmacyInventory if pharmacyId is provided
        if (searchDto.PharmacyId.HasValue)
        {
            var query = new GetPharmacyInventoryQuery(searchDto.PharmacyId.Value, searchDto.IsLowStock);
            var inventory = await _mediator.Send(query);
            
            // Convert to InventoryListDto (simplified mapping)
            var listDto = inventory.Select(i => new InventoryListDto
            {
                Id = i.Id,
                PharmacyId = i.PharmacyId,
                PharmacyName = i.Pharmacy?.PharmacyName ?? string.Empty,
                MedicationId = i.MedicationId,
                MedicationName = i.Medication?.CommercialName ?? string.Empty,
                BatchNumber = i.BatchNumber,
                QuantityAvailable = i.QuantityAvailable,
                ExpirationDate = i.ExpirationDate,
                UnitCost = i.UnitCost,
                IsExpired = i.IsExpired,
                IsLowStock = i.IsLowStock,
                DaysUntilExpiration = i.DaysUntilExpiration,
                CreatedAt = i.CreatedAt
            }).ToList();

            return Ok(listDto);
        }

        // If no pharmacy specified, return empty for now
        return Ok(new List<InventoryListDto>());
    }
}
