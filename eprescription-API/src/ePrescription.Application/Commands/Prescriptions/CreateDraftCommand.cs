using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Commands.Prescriptions;

public class CreateDraftCommand : IRequest<PrescriptionDto>
{
    public CreateDraftDto DraftDto { get; set; }
    public Guid UserId { get; set; } // For audit purposes
    
    public CreateDraftCommand(CreateDraftDto draftDto, Guid userId)
    {
        DraftDto = draftDto;
        UserId = userId;
    }
}
