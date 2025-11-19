using MediatR;
using ePrescription.Application.DTOs;

namespace ePrescription.Application.Commands.Prescriptions;

public class CreatePrescriptionCommand : IRequest<PrescriptionDto>
{
    public CreatePrescriptionDto PrescriptionDto { get; set; }
    public Guid UserId { get; set; } // For audit purposes
    
    public CreatePrescriptionCommand(CreatePrescriptionDto prescriptionDto, Guid userId)
    {
        PrescriptionDto = prescriptionDto;
        UserId = userId;
    }
}
