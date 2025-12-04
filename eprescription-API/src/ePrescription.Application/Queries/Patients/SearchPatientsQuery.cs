using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Queries.Patients;

public class SearchPatientsQuery : IRequest<PaginatedResult<PatientListDto>>
{
    public SearchPatientsDto SearchCriteria { get; set; }

    public SearchPatientsQuery(SearchPatientsDto searchCriteria)
    {
        SearchCriteria = searchCriteria;
    }
}
