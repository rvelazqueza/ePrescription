using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Queries.Prescriptions;

public class SearchPrescriptionsQuery : IRequest<PaginatedResult<PrescriptionListDto>>
{
    public SearchPrescriptionsDto SearchCriteria { get; set; }
    
    public SearchPrescriptionsQuery(SearchPrescriptionsDto searchCriteria)
    {
        SearchCriteria = searchCriteria;
    }
}
