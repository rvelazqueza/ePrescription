using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Queries.Dispensations;

public class GetDispensationQuery : IRequest<DispensationDto>
{
    public Guid DispensationId { get; set; }

    public GetDispensationQuery(Guid dispensationId)
    {
        DispensationId = dispensationId;
    }
}
