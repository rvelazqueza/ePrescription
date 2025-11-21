using MediatR;

namespace EPrescription.Application.Commands.Patients;

public class DeletePatientCommand : IRequest<bool>
{
    public Guid PatientId { get; set; }

    public DeletePatientCommand(Guid patientId)
    {
        PatientId = patientId;
    }
}
