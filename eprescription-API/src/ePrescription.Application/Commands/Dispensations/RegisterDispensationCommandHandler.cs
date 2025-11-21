using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;

namespace EPrescription.Application.Commands.Dispensations;

public class RegisterDispensationCommandHandler : IRequestHandler<RegisterDispensationCommand, DispensationDto>
{
    private readonly IDispensationRepository _dispensationRepository;
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IInventoryRepository _inventoryRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RegisterDispensationCommandHandler(
        IDispensationRepository dispensationRepository,
        IPrescriptionRepository prescriptionRepository,
        IInventoryRepository inventoryRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _dispensationRepository = dispensationRepository;
        _prescriptionRepository = prescriptionRepository;
        _inventoryRepository = inventoryRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<DispensationDto> Handle(RegisterDispensationCommand request, CancellationToken cancellationToken)
    {
        var dto = request.DispensationDto;
        
        // 1. Validate prescription exists and is active
        var prescription = await _prescriptionRepository.GetByIdAsync(dto.PrescriptionId);
        if (prescription == null)
        {
            throw new KeyNotFoundException($"Prescription with ID '{dto.PrescriptionId}' not found");
        }
        
        if (prescription.Status != "active")
        {
            throw new InvalidOperationException($"Prescription is not active. Current status: {prescription.Status}");
        }
        
        // Check if prescription is expired
        if (prescription.ExpirationDate.HasValue && prescription.ExpirationDate.Value < DateTime.UtcNow)
        {
            throw new InvalidOperationException("Prescription has expired");
        }
        
        // 2. Validate inventory availability for all items
        foreach (var itemDto in dto.Items)
        {
            var inventory = await _inventoryRepository.GetByIdAsync(itemDto.InventoryId);
            if (inventory == null)
            {
                throw new KeyNotFoundException($"Inventory with ID '{itemDto.InventoryId}' not found");
            }
            
            if (inventory.QuantityAvailable < itemDto.QuantityDispensed)
            {
                throw new InvalidOperationException(
                    $"Insufficient stock for inventory ID '{itemDto.InventoryId}'. " +
                    $"Available: {inventory.QuantityAvailable}, Requested: {itemDto.QuantityDispensed}");
            }
            
            // Check if inventory is expired
            if (inventory.ExpirationDate < DateTime.UtcNow.Date)
            {
                throw new InvalidOperationException(
                    $"Inventory ID '{itemDto.InventoryId}' has expired on {inventory.ExpirationDate:yyyy-MM-dd}");
            }
        }
        
        // 3. Create dispensation using constructor
        var dispensation = new EPrescription.Domain.Entities.Dispensation(
            prescriptionId: dto.PrescriptionId,
            pharmacyId: dto.PharmacyId,
            pharmacistId: dto.PharmacistId,
            notes: dto.Notes
        );
        
        // 4. Add dispensation items and reduce inventory
        foreach (var itemDto in dto.Items)
        {
            var inventory = await _inventoryRepository.GetByIdAsync(itemDto.InventoryId);
            
            // Create dispensation item
            var dispensationItem = new EPrescription.Domain.Entities.DispensationItem(
                dispensationId: Guid.Empty, // Will be set by EF Core
                prescriptionMedicationId: itemDto.PrescriptionMedicationId,
                inventoryId: itemDto.InventoryId,
                quantityDispensed: itemDto.QuantityDispensed,
                batchNumber: itemDto.BatchNumber ?? inventory!.BatchNumber,
                expirationDate: itemDto.ExpirationDate ?? inventory.ExpirationDate
            );
            
            dispensation.AddItem(dispensationItem);
            
            // Reduce inventory stock
            inventory!.ReduceStock(itemDto.QuantityDispensed);
            _inventoryRepository.Update(inventory);
        }
        
        // 5. Save dispensation to database
        var createdDispensation = await _dispensationRepository.AddAsync(dispensation);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        // 6. Update prescription status to dispensed
        prescription.MarkAsDispensed();
        await _prescriptionRepository.UpdateAsync(prescription, cancellationToken);
        
        // 7. Load the created dispensation with related data for mapping
        var dispensationWithDetails = await _dispensationRepository.GetWithDetailsAsync(createdDispensation.Id, cancellationToken);
        
        // 8. Map to DTO and return
        return _mapper.Map<DispensationDto>(dispensationWithDetails);
    }
}
