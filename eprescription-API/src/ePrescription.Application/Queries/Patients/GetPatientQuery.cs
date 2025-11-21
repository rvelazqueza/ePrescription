using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Queries.Patients;

public class GetPatientQuery : IRequest<PatientDto?>
{
    public Guid PatientId { get; set; }

    public GetPatientQuery(Guid patientId)
    {
        PatientId = patientId;
    }
}
