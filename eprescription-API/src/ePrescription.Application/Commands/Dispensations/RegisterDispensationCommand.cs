using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Commands.Dispensations;

public class RegisterDispensationCommand : IRequest<DispensationDto>
{
    public RegisterDispensationDto DispensationDto { get; set; }
    public Guid UserId { get; set; } // For audit purposes
    
    public RegisterDispensationCommand(RegisterDispensationDto dispensationDto, Guid userId)
    {
        DispensationDto = dispensationDto;
        UserId = userId;
    }
}
