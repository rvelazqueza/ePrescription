using MediatR;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.Prescriptions;

public class DeleteDraftCommandHandler : IRequestHandler<DeleteDraftCommand, bool>
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeleteDraftCommandHandler> _logger;

    public DeleteDraftCommandHandler(
        IPrescriptionRepository prescriptionRepository,
        IUnitOfWork unitOfWork,
        ILogger<DeleteDraftCommandHandler> logger)
    {
        _prescriptionRepository = prescriptionRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteDraftCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Deleting draft prescription {PrescriptionId}", request.PrescriptionId);

            var prescription = await _prescriptionRepository.GetByIdAsync(request.PrescriptionId, cancellationToken);

            if (prescription == null)
            {
                _logger.LogWarning("Draft prescription {PrescriptionId} not found", request.PrescriptionId);
                throw new KeyNotFoundException($"Draft prescription with ID {request.PrescriptionId} not found");
            }

            // Only allow deletion of draft prescriptions
            if (prescription.Status != "draft")
            {
                _logger.LogWarning("Cannot delete non-draft prescription {PrescriptionId} with status {Status}", 
                    request.PrescriptionId, prescription.Status);
                throw new InvalidOperationException($"Cannot delete a prescription that is not in draft status. Current status: {prescription.Status}");
            }

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            try
            {
                // Permanently delete the draft prescription
                await _prescriptionRepository.DeleteAsync(prescription, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                _logger.LogInformation("Draft prescription {PrescriptionNumber} deleted successfully", prescription.PrescriptionNumber);
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
            _logger.LogError(ex, "Error deleting draft prescription {PrescriptionId}", request.PrescriptionId);
            throw;
        }
    }
}
