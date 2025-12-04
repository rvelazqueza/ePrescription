using MediatR;

namespace EPrescription.Application.Commands.Prescriptions;

public class CancelPrescriptionCommand : IRequest<bool>
{
    public Guid PrescriptionId { get; set; }
    public string? Reason { get; set; }
    
    public CancelPrescriptionCommand(Guid prescriptionId, string? reason = null)
    {
        PrescriptionId = prescriptionId;
        Reason = reason;
    }
}
