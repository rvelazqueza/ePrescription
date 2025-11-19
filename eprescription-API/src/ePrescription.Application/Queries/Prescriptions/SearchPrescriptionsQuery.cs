using MediatR;
using ePrescription.Application.DTOs;

namespace ePrescription.Application.Queries.Prescriptions;

public class SearchPrescriptionsQuery : IRequest<PaginatedResult<PrescriptionListDto>>
{
    public SearchPrescriptionsDto SearchCriteria { get; set; }
    
    public SearchPrescriptionsQuery(SearchPrescriptionsDto searchCriteria)
    {
        SearchCriteria = searchCriteria;
    }
}
