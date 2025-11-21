using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Commands.Prescriptions;

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
