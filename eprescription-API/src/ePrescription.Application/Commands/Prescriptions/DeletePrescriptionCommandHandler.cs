using MediatR;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.Prescriptions;

public class DeletePrescriptionCommandHandler : IRequestHandler<DeletePrescriptionCommand, bool>
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeletePrescriptionCommandHandler> _logger;

    public DeletePrescriptionCommandHandler(
        IPrescriptionRepository prescriptionRepository,
        IUnitOfWork unitOfWork,
        ILogger<DeletePrescriptionCommandHandler> logger)
    {
        _prescriptionRepository = prescriptionRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(DeletePrescriptionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Deleting prescription {PrescriptionId}", request.PrescriptionId);

            var prescription = await _prescriptionRepository.GetByIdAsync(request.PrescriptionId, cancellationToken);

            if (prescription == null)
            {
                _logger.LogWarning("Prescription {PrescriptionId} not found", request.PrescriptionId);
                throw new KeyNotFoundException($"Prescription with ID {request.PrescriptionId} not found");
            }

            if (prescription.Status == "Dispensed")
            {
                _logger.LogWarning("Cannot delete dispensed prescription {PrescriptionId}", request.PrescriptionId);
                throw new InvalidOperationException("Cannot delete a prescription that has already been dispensed");
            }

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            try
            {
                prescription.Cancel($"Cancelled by user on {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
                await _prescriptionRepository.UpdateAsync(prescription, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                _logger.LogInformation("Prescription {PrescriptionNumber} cancelled successfully", prescription.PrescriptionNumber);
                return true;
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting prescription {PrescriptionId}", request.PrescriptionId);
            throw;
        }
    }
}
