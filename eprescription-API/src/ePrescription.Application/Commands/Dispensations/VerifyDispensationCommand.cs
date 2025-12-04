using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Commands.Dispensations;

public class VerifyDispensationCommand : IRequest<DispensationDto>
{
    public Guid DispensationId { get; set; }
    public string? Notes { get; set; }
}
