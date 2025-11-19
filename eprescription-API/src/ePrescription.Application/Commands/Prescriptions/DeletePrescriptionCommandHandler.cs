using MediatR;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace ePrescription.Application.Commands.Prescriptions;

public class DeletePrescriptionCommandHandler : IRequestHandler<DeletePrescriptionCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeletePrescriptionCommandHandler> _logger;

    public DeletePrescriptionCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<DeletePrescriptionCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<bool> Handle(DeletePrescriptionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Deleting prescription {PrescriptionId}", request.PrescriptionId);

            // Get existing prescription
            var prescription = await _unitOfWork.Prescriptions.GetByIdAsync(
                request.PrescriptionId, 
                cancellationToken);

            if (prescription == null)
            {
                _logger.LogWarning("Prescription {PrescriptionId} not found", request.PrescriptionId);
                throw new KeyNotFoundException($"Prescription with ID {request.PrescriptionId} not found");
            }

            // Check if prescription can be deleted (business rule: cannot delete dispensed prescriptions)
            if (prescription.Status == "Dispensed")
            {
                _logger.LogWarning("Cannot delete dispensed prescription {PrescriptionId}", request.PrescriptionId);
                throw new InvalidOperationException("Cannot delete a prescription that has already been dispensed");
            }

            // Begin transaction
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            try
            {
                // Soft delete: change status to Cancelled instead of hard delete
                // This maintains audit trail and regulatory compliance
                prescription.Status = "Cancelled";
                prescription.UpdatedAt = DateTime.UtcNow;
                prescription.Notes = $"{prescription.Notes}\n[CANCELLED by user on {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC]";

                await _unitOfWork.Prescriptions.UpdateAsync(prescription, cancellationToken);

                // Save changes with audit
                await _unitOfWork.SaveChangesAsync(request.UserId, "System", cancellationToken);

                // Commit transaction
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
