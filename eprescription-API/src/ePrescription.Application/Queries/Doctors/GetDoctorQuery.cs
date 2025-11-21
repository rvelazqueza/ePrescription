using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Queries.Doctors;

public class GetDoctorQuery : IRequest<DoctorDto?>
{
    public Guid Id { get; set; }
}
