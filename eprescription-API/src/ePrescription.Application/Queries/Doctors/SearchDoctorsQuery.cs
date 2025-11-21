using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Queries.Doctors;

public class SearchDoctorsQuery : IRequest<PaginatedResult<DoctorListDto>>
{
    public string? SearchTerm { get; set; }
    public Guid? SpecialtyId { get; set; }
    public bool? IsActive { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
