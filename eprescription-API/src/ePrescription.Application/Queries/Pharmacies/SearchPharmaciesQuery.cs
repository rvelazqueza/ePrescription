using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Queries.Pharmacies;

public class SearchPharmaciesQuery : IRequest<PaginatedResult<PharmacyListDto>>
{
    public string? SearchTerm { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public bool? IsActive { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
