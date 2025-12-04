using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Queries.Inventory;

public class GetInventoryQueryHandler : IRequestHandler<GetInventoryQuery, InventoryDto?>
{
    private readonly IInventoryRepository _inventoryRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetInventoryQueryHandler> _logger;

    public GetInventoryQueryHandler(
        IInventoryRepository inventoryRepository,
        IMapper mapper,
        ILogger<GetInventoryQueryHandler> logger)
    {
        _inventoryRepository = inventoryRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<InventoryDto?> Handle(GetInventoryQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Retrieving inventory {InventoryId}", request.InventoryId);

        var inventory = await _inventoryRepository.GetByIdAsync(request.InventoryId, cancellationToken);
        
        if (inventory == null)
        {
            _logger.LogWarning("Inventory {InventoryId} not found", request.InventoryId);
            return null;
        }

        return _mapper.Map<InventoryDto>(inventory);
    }
}
