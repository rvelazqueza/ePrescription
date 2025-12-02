using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Commands.Prescriptions;

public class DuplicatePrescriptionCommand : IRequest<PrescriptionListDto>
{
    public Guid PrescriptionId { get; set; }
    
    public DuplicatePrescriptionCommand(Guid prescriptionId)
    {
        PrescriptionId = prescriptionId;
    }
}
