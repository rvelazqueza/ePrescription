using AutoMapper;
using MediatR;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Application.Queries.Pharmacies;

public class GetPharmacyQueryHandler : IRequestHandler<GetPharmacyQuery, PharmacyDto?>
{
    private readonly IRepository<Pharmacy> _pharmacyRepository;
    private readonly IMapper _mapper;

    public GetPharmacyQueryHandler(
        IRepository<Pharmacy> pharmacyRepository,
        IMapper mapper)
    {
        _pharmacyRepository = pharmacyRepository;
        _mapper = mapper;
    }

    public async Task<PharmacyDto?> Handle(GetPharmacyQuery request, CancellationToken cancellationToken)
    {
        var pharmacy = await _pharmacyRepository.GetByIdAsync(request.Id, cancellationToken);
        
        return pharmacy == null ? null : _mapper.Map<PharmacyDto>(pharmacy);
    }
}
