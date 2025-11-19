using MediatR;
using ePrescription.Application.DTOs;

namespace ePrescription.Application.Queries.Prescriptions;

public class GetPrescriptionQuery : IRequest<PrescriptionDto?>
{
    public Guid PrescriptionId { get; set; }
    
    public GetPrescriptionQuery(Guid prescriptionId)
    {
        PrescriptionId = prescriptionId;
    }
}
