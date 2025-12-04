using MediatR;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.Prescriptions;

public class CancelPrescriptionCommandHandler : IRequestHandler<CancelPrescriptionCommand, bool>
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CancelPrescriptionCommandHandler> _logger;

    public CancelPrescriptionCommandHandler(
        IPrescriptionRepository prescriptionRepository,
        IUnitOfWork unitOfWork,
        ILogger<CancelPrescriptionCommandHandler> logger)
    {
        _prescriptionRepository = prescriptionRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(CancelPrescriptionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Cancelling prescription {PrescriptionId}", request.PrescriptionId);

            var result = await _prescriptionRepository.CancelPrescriptionAsync(
                request.PrescriptionId,
                request.Reason,
                cancellationToken);

            if (!result)
            {
                _logger.LogWarning("Could not cancel prescription {PrescriptionId}", request.PrescriptionId);
                return false;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Prescription {PrescriptionId} cancelled successfully", request.PrescriptionId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling prescription {PrescriptionId}", request.PrescriptionId);
            throw;
        }
    }
}
