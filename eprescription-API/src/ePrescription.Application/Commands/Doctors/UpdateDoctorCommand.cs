using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Commands.Doctors;

public class UpdateDoctorCommand : IRequest<DoctorDto>
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}
