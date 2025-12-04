using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.Inventory;

public class AdjustStockCommandHandler : IRequestHandler<AdjustStockCommand, bool>
{
    private readonly IInventoryRepository _inventoryRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AdjustStockCommandHandler> _logger;

    public AdjustStockCommandHandler(
        IInventoryRepository inventoryRepository,
        IUnitOfWork unitOfWork,
        ILogger<AdjustStockCommandHandler> logger)
    {
        _inventoryRepository = inventoryRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(AdjustStockCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Adjusting stock for Inventory {InventoryId} by {Adjustment}", 
            request.InventoryId, request.QuantityAdjustment);

        var inventory = await _inventoryRepository.GetByIdAsync(request.InventoryId, cancellationToken);
        
        if (inventory == null)
        {
            _logger.LogWarning("Inventory {InventoryId} not found", request.InventoryId);
            return false;
        }

        try
        {
            // Use domain methods to adjust stock
            if (request.QuantityAdjustment > 0)
            {
                inventory.AddStock(request.QuantityAdjustment);
            }
            else if (request.QuantityAdjustment < 0)
            {
                inventory.ReduceStock(Math.Abs(request.QuantityAdjustment));
            }
            
            _inventoryRepository.Update(inventory);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully adjusted inventory {InventoryId} by {Adjustment}. Reason: {Reason}", 
                request.InventoryId, request.QuantityAdjustment, request.Reason ?? "Not specified");

            return true;
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Cannot adjust inventory {InventoryId}: {Error}", 
                request.InventoryId, ex.Message);
            throw;
        }
    }
}
