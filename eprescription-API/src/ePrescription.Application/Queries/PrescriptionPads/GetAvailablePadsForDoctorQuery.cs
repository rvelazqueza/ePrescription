using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Queries.PrescriptionPads;

/// <summary>
/// Query to get available prescription pads for a doctor
/// </summary>
public class GetAvailablePadsForDoctorQuery : IRequest<AvailablePadsResponseDto>
{
    public Guid DoctorId { get; set; }
    public Guid? PadTypeId { get; set; }

    public GetAvailablePadsForDoctorQuery(Guid doctorId, Guid? padTypeId = null)
    {
        DoctorId = doctorId;
        PadTypeId = padTypeId;
    }
}
