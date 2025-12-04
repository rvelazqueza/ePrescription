using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Queries.Inventory;

public class GetExpiringStockAlertsQueryHandler : IRequestHandler<GetExpiringStockAlertsQuery, List<ExpiringStockAlertDto>>
{
    private readonly IInventoryRepository _inventoryRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetExpiringStockAlertsQueryHandler> _logger;

    public GetExpiringStockAlertsQueryHandler(
        IInventoryRepository inventoryRepository,
        IMapper mapper,
        ILogger<GetExpiringStockAlertsQueryHandler> logger)
    {
        _inventoryRepository = inventoryRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<ExpiringStockAlertDto>> Handle(GetExpiringStockAlertsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Retrieving expiring stock alerts for Pharmacy {PharmacyId}, Days: {Days}", 
            request.PharmacyId?.ToString() ?? "All", request.DaysUntilExpiration);

        IEnumerable<Domain.Entities.Inventory> expiringItems;
        
        if (request.PharmacyId.HasValue)
        {
            expiringItems = await _inventoryRepository.GetExpiringSoonAsync(
                request.PharmacyId.Value, 
                request.DaysUntilExpiration, 
                cancellationToken);
        }
        else
        {
            // Get all inventory and filter
            var allInventory = await _inventoryRepository.GetAllAsync(cancellationToken);
            var cutoffDate = DateTime.UtcNow.AddDays(request.DaysUntilExpiration);
            expiringItems = allInventory.Where(i => i.ExpirationDate <= cutoffDate);
        }

        var alerts = expiringItems.Select(inventory => new ExpiringStockAlertDto
        {
            InventoryId = inventory.Id,
            PharmacyId = inventory.PharmacyId,
            PharmacyName = inventory.Pharmacy?.PharmacyName ?? "Unknown",
            MedicationId = inventory.MedicationId,
            MedicationName = inventory.Medication?.CommercialName ?? "Unknown",
            BatchNumber = inventory.BatchNumber,
            QuantityAvailable = inventory.QuantityAvailable,
            ExpirationDate = inventory.ExpirationDate,
            DaysUntilExpiration = (inventory.ExpirationDate - DateTime.UtcNow).Days,
            AlertLevel = GetExpirationAlertLevel(inventory.ExpirationDate)
        }).OrderBy(a => a.DaysUntilExpiration).ToList();

        _logger.LogInformation("Found {Count} expiring stock alerts", alerts.Count);

        return alerts;
    }

    private string GetExpirationAlertLevel(DateTime expirationDate)
    {
        var daysUntilExpiration = (expirationDate - DateTime.UtcNow).Days;
        
        return daysUntilExpiration switch
        {
            < 0 => "expired",
            <= 7 => "critical",
            <= 30 => "warning",
            _ => "info"
        };
    }
}
