using AutoMapper;
using MediatR;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Application.Commands.Pharmacies;

public class CreatePharmacyCommandHandler : IRequestHandler<CreatePharmacyCommand, PharmacyDto>
{
    private readonly IPharmacyRepository _pharmacyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreatePharmacyCommandHandler(
        IPharmacyRepository pharmacyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _pharmacyRepository = pharmacyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PharmacyDto> Handle(CreatePharmacyCommand request, CancellationToken cancellationToken)
    {
        // Check if license number already exists
        var existingByLicense = await _pharmacyRepository.FindAsync(
            p => p.LicenseNumber == request.LicenseNumber,
            cancellationToken);
        
        if (existingByLicense.Any())
        {
            throw new InvalidOperationException($"Pharmacy with license number {request.LicenseNumber} already exists");
        }

        // Create address first
        var address = new Address(
            request.Address,
            request.City,
            request.State,
            request.ZipCode
        );

        // Create pharmacy
        var pharmacy = new Pharmacy(
            request.Name,
            request.LicenseNumber,
            null, // addressId will be set when we set the address
            request.Phone,
            request.Email,
            request.City
        );

        // Set the address
        pharmacy.SetAddress(address);

        await _pharmacyRepository.AddAsync(pharmacy, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Reload with Address relationship for mapping
        var createdPharmacy = await _pharmacyRepository.GetByIdWithAddressAsync(pharmacy.Id, cancellationToken);
        
        return _mapper.Map<PharmacyDto>(createdPharmacy!);
    }
}
