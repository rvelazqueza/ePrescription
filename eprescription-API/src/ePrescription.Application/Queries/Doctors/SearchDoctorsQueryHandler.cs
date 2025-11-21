using AutoMapper;
using MediatR;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Application.Queries.Doctors;

public class SearchDoctorsQueryHandler : IRequestHandler<SearchDoctorsQuery, PaginatedResult<DoctorListDto>>
{
    private readonly IRepository<Doctor> _doctorRepository;
    private readonly IMapper _mapper;

    public SearchDoctorsQueryHandler(
        IRepository<Doctor> doctorRepository,
        IMapper mapper)
    {
        _doctorRepository = doctorRepository;
        _mapper = mapper;
    }

    public async Task<PaginatedResult<DoctorListDto>> Handle(SearchDoctorsQuery request, CancellationToken cancellationToken)
    {
        // Get all doctors with specialty (DoctorRepository includes Specialty automatically)
        var allDoctors = await _doctorRepository.GetAllAsync(cancellationToken);
        var query = allDoctors.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchLower = request.SearchTerm.ToLower();
            query = query.Where(d =>
                d.FirstName.ToLower().Contains(searchLower) ||
                d.LastName.ToLower().Contains(searchLower) ||
                d.IdentificationNumber.ToLower().Contains(searchLower) ||
                d.MedicalLicenseNumber.ToLower().Contains(searchLower) ||
                d.Email.ToLower().Contains(searchLower));
        }

        if (request.SpecialtyId.HasValue)
        {
            query = query.Where(d => d.SpecialtyId == request.SpecialtyId.Value);
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(d => d.IsActive == request.IsActive.Value);
        }

        // Get total count
        var totalCount = query.Count();

        // Apply pagination
        var doctors = query
            .OrderBy(d => d.LastName)
            .ThenBy(d => d.FirstName)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var doctorDtos = _mapper.Map<List<DoctorListDto>>(doctors);

        return new PaginatedResult<DoctorListDto>
        {
            Items = doctorDtos,
            TotalCount = totalCount,
            Page = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}
