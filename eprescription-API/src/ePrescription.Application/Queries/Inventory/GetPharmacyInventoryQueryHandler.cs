using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Queries.Inventory;

public class GetPharmacyInventoryQueryHandler : IRequestHandler<GetPharmacyInventoryQuery, List<InventoryDto>>
{
    private readonly IInventoryRepository _inventoryRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetPharmacyInventoryQueryHandler> _logger;

    public GetPharmacyInventoryQueryHandler(
        IInventoryRepository inventoryRepository,
        IMapper mapper,
        ILogger<GetPharmacyInventoryQueryHandler> logger)
    {
        _inventoryRepository = inventoryRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<InventoryDto>> Handle(GetPharmacyInventoryQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Retrieving inventory for Pharmacy {PharmacyId}, LowStockOnly: {LowStockOnly}", 
            request.PharmacyId, request.LowStockOnly);

        var inventoryItems = await _inventoryRepository.GetByPharmacyAsync(request.PharmacyId, cancellationToken);

        if (request.LowStockOnly == true)
        {
            // Filter for low stock items (using a threshold of 10 as default)
            inventoryItems = inventoryItems
                .Where(i => i.QuantityAvailable <= 10)
                .ToList();
            
            _logger.LogInformation("Found {Count} low stock items for Pharmacy {PharmacyId}", 
                inventoryItems.Count(), request.PharmacyId);
        }

        return _mapper.Map<List<InventoryDto>>(inventoryItems);
    }
}
