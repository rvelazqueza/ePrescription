using MediatR;

namespace ePrescription.Application.Commands.Prescriptions;

public class DeletePrescriptionCommand : IRequest<bool>
{
    public Guid PrescriptionId { get; set; }
    public Guid UserId { get; set; } // For audit purposes
    
    public DeletePrescriptionCommand(Guid prescriptionId, Guid userId)
    {
        PrescriptionId = prescriptionId;
        UserId = userId;
    }
}
