using MediatR;

namespace EPrescription.Application.Commands.Doctors;

public class DeleteDoctorCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}
