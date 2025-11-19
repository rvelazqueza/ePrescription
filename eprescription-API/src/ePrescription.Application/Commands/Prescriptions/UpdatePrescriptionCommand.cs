using MediatR;
using ePrescription.Application.DTOs;

namespace ePrescription.Application.Commands.Prescriptions;

public class UpdatePrescriptionCommand : IRequest<PrescriptionDto>
{
    public Guid PrescriptionId { get; set; }
    public UpdatePrescriptionDto PrescriptionDto { get; set; }
    public Guid UserId { get; set; } // For audit purposes
    
    public UpdatePrescriptionCommand(Guid prescriptionId, UpdatePrescriptionDto prescriptionDto, Guid userId)
    {
        PrescriptionId = prescriptionId;
        PrescriptionDto = prescriptionDto;
        UserId = userId;
    }
}
