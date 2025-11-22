using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Queries.Inventory;

public class GetLowStockAlertsQueryHandler : IRequestHandler<GetLowStockAlertsQuery, List<LowStockAlertDto>>
{
    private readonly IInventoryRepository _inventoryRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetLowStockAlertsQueryHandler> _logger;

    public GetLowStockAlertsQueryHandler(
        IInventoryRepository inventoryRepository,
        IMapper mapper,
        ILogger<GetLowStockAlertsQueryHandler> logger)
    {
        _inventoryRepository = inventoryRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<LowStockAlertDto>> Handle(GetLowStockAlertsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Retrieving low stock alerts for Pharmacy {PharmacyId}", 
            request.PharmacyId?.ToString() ?? "All");

        // Get low stock items using threshold of 10
        IEnumerable<Domain.Entities.Inventory> lowStockItems;
        
        if (request.PharmacyId.HasValue)
        {
            lowStockItems = await _inventoryRepository.GetLowStockAsync(request.PharmacyId.Value, 10, cancellationToken);
        }
        else
        {
            // Get all inventory and filter
            var allInventory = await _inventoryRepository.GetAllAsync(cancellationToken);
            lowStockItems = allInventory.Where(i => i.QuantityAvailable <= 10);
        }

        var alerts = lowStockItems.Select(inventory => new LowStockAlertDto
        {
            InventoryId = inventory.Id,
            PharmacyId = inventory.PharmacyId,
            PharmacyName = inventory.Pharmacy?.PharmacyName ?? "Unknown",
            MedicationId = inventory.MedicationId,
            MedicationName = inventory.Medication?.CommercialName ?? "Unknown",
            CurrentQuantity = (int)inventory.QuantityAvailable,
            MinimumStockLevel = 10, // Default threshold
            Deficit = 10 - (int)inventory.QuantityAvailable,
            AlertLevel = GetAlertLevel((int)inventory.QuantityAvailable, 10),
            LastRestockDate = inventory.UpdatedAt
        }).ToList();

        _logger.LogInformation("Found {Count} low stock alerts", alerts.Count);

        return alerts;
    }

    private string GetAlertLevel(int currentQuantity, int minimumLevel)
    {
        if (currentQuantity == 0)
            return "CRITICAL";
        
        var percentage = (double)currentQuantity / minimumLevel * 100;
        
        if (percentage <= 25)
            return "CRITICAL";
        else if (percentage <= 50)
            return "HIGH";
        else if (percentage <= 75)
            return "MEDIUM";
        else
            return "LOW";
    }
}
