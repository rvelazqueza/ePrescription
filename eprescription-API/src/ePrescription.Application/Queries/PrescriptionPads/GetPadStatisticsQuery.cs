using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Queries.PrescriptionPads;

/// <summary>
/// Query to get pad statistics for a doctor
/// </summary>
public class GetPadStatisticsQuery : IRequest<PadStatisticsDto>
{
    public Guid DoctorId { get; set; }

    public GetPadStatisticsQuery(Guid doctorId)
    {
        DoctorId = doctorId;
    }
}
