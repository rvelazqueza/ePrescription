using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Commands.Patients;

public class UpdatePatientCommand : IRequest<PatientDto>
{
    public Guid PatientId { get; set; }
    public UpdatePatientDto PatientDto { get; set; }

    public UpdatePatientCommand(Guid patientId, UpdatePatientDto patientDto)
    {
        PatientId = patientId;
        PatientDto = patientDto;
    }
}
