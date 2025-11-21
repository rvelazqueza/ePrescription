using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Commands.Patients;

public class CreatePatientCommand : IRequest<PatientDto>
{
    public CreatePatientDto PatientDto { get; set; }

    public CreatePatientCommand(CreatePatientDto patientDto)
    {
        PatientDto = patientDto;
    }
}
