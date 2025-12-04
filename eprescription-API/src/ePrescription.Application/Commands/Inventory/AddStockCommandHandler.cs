using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.Inventory;

public class AddStockCommandHandler : IRequestHandler<AddStockCommand, Guid>
{
    private readonly IInventoryRepository _inventoryRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AddStockCommandHandler> _logger;

    public AddStockCommandHandler(
        IInventoryRepository inventoryRepository,
        IUnitOfWork unitOfWork,
        ILogger<AddStockCommandHandler> logger)
    {
        _inventoryRepository = inventoryRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Guid> Handle(AddStockCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Adding stock for Medication {MedicationId} at Pharmacy {PharmacyId}", 
            request.MedicationId, request.PharmacyId);

        // Check if inventory record already exists for this batch
        var existingInventory = await _inventoryRepository.GetByBatchNumberAsync(
            request.PharmacyId, 
            request.MedicationId,
            request.BatchNumber ?? string.Empty,
            cancellationToken);

        if (existingInventory != null)
        {
            // Update existing inventory using domain method
            existingInventory.AddStock(request.Quantity);
            
            _inventoryRepository.Update(existingInventory);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Updated existing inventory {InventoryId}, added quantity: {Quantity}", 
                existingInventory.Id, request.Quantity);

            return existingInventory.Id;
        }
        else
        {
            // Create new inventory record
            var inventory = new Domain.Entities.Inventory(
                request.PharmacyId,
                request.MedicationId,
                request.BatchNumber ?? Guid.NewGuid().ToString(),
                request.Quantity,
                request.ExpirationDate ?? DateTime.UtcNow.AddYears(2),
                request.UnitCost
            );

            await _inventoryRepository.AddAsync(inventory, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Created new inventory record {InventoryId} with quantity {Quantity}", 
                inventory.Id, request.Quantity);

            return inventory.Id;
        }
    }
}
