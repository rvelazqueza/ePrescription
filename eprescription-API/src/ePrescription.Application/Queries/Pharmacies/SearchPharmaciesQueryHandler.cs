using AutoMapper;
using MediatR;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Application.Queries.Pharmacies;

public class SearchPharmaciesQueryHandler : IRequestHandler<SearchPharmaciesQuery, PaginatedResult<PharmacyListDto>>
{
    private readonly IRepository<Pharmacy> _pharmacyRepository;
    private readonly IMapper _mapper;

    public SearchPharmaciesQueryHandler(
        IRepository<Pharmacy> pharmacyRepository,
        IMapper mapper)
    {
        _pharmacyRepository = pharmacyRepository;
        _mapper = mapper;
    }

    public async Task<PaginatedResult<PharmacyListDto>> Handle(SearchPharmaciesQuery request, CancellationToken cancellationToken)
    {
        // Get all pharmacies
        var allPharmacies = await _pharmacyRepository.GetAllAsync(cancellationToken);
        var query = allPharmacies.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchLower = request.SearchTerm.ToLower();
            query = query.Where(p =>
                p.PharmacyName.ToLower().Contains(searchLower) ||
                p.LicenseNumber.ToLower().Contains(searchLower) ||
                (p.Email != null && p.Email.ToLower().Contains(searchLower)));
        }

        if (!string.IsNullOrWhiteSpace(request.City))
        {
            var cityLower = request.City.ToLower();
            query = query.Where(p => p.City != null && p.City.ToLower().Contains(cityLower));
        }

        if (!string.IsNullOrWhiteSpace(request.State))
        {
            // State is not stored in Pharmacy entity, skip this filter for now
            // TODO: Add State field to Pharmacy entity or join with Address
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(p => p.IsActive == request.IsActive.Value);
        }

        // Get total count
        var totalCount = query.Count();

        // Apply pagination
        var pharmacies = query
            .OrderBy(p => p.PharmacyName)
            .ThenBy(p => p.City)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var pharmacyDtos = _mapper.Map<List<PharmacyListDto>>(pharmacies);

        return new PaginatedResult<PharmacyListDto>
        {
            Items = pharmacyDtos,
            TotalCount = totalCount,
            Page = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}
