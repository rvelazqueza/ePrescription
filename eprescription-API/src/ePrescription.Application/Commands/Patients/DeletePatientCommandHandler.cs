using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.Patients;

public class DeletePatientCommandHandler : IRequestHandler<DeletePatientCommand, bool>
{
    private readonly IRepository<Patient> _patientRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeletePatientCommandHandler> _logger;

    public DeletePatientCommandHandler(
        IRepository<Patient> patientRepository,
        IUnitOfWork unitOfWork,
        ILogger<DeletePatientCommandHandler> logger)
    {
        _patientRepository = patientRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(DeletePatientCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Deleting patient {PatientId}", request.PatientId);

            var patient = await _patientRepository.GetByIdAsync(request.PatientId, cancellationToken);

            if (patient == null)
            {
                _logger.LogWarning("Patient {PatientId} not found", request.PatientId);
                return false;
            }

            _patientRepository.Remove(patient);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully deleted patient {PatientId}", request.PatientId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting patient {PatientId}", request.PatientId);
            throw;
        }
    }
}
