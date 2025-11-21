using MediatR;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Queries.Prescriptions;

public class GetPrescriptionQuery : IRequest<PrescriptionDto?>
{
    public Guid PrescriptionId { get; set; }
    
    public GetPrescriptionQuery(Guid prescriptionId)
    {
        PrescriptionId = prescriptionId;
    }
}
