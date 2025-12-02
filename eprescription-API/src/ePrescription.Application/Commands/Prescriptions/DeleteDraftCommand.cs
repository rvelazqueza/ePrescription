using MediatR;

namespace EPrescription.Application.Commands.Prescriptions;

public class DeleteDraftCommand : IRequest<bool>
{
    public Guid PrescriptionId { get; set; }
    public Guid UserId { get; set; } // For audit purposes
    
    public DeleteDraftCommand(Guid prescriptionId, Guid userId)
    {
        PrescriptionId = prescriptionId;
        UserId = userId;
    }
}
