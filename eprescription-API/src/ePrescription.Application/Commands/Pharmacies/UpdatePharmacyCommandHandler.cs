using AutoMapper;
using MediatR;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Application.Commands.Pharmacies;

public class UpdatePharmacyCommandHandler : IRequestHandler<UpdatePharmacyCommand, PharmacyDto>
{
    private readonly IPharmacyRepository _pharmacyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdatePharmacyCommandHandler(
        IPharmacyRepository pharmacyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _pharmacyRepository = pharmacyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PharmacyDto> Handle(UpdatePharmacyCommand request, CancellationToken cancellationToken)
    {
        // Load pharmacy with Address relationship
        var pharmacy = await _pharmacyRepository.GetByIdWithAddressAsync(request.Id, cancellationToken);
        
        if (pharmacy == null)
        {
            throw new KeyNotFoundException($"Pharmacy with ID {request.Id} not found");
        }

        // Update pharmacy contact info
        pharmacy.UpdateContactInfo(request.Phone, request.Email, request.City);

        // Update address if it exists
        if (pharmacy.Address != null)
        {
            pharmacy.Address.UpdateAddress(
                request.Address,
                request.City,
                request.State,
                request.ZipCode
            );
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PharmacyDto>(pharmacy);
    }
}
