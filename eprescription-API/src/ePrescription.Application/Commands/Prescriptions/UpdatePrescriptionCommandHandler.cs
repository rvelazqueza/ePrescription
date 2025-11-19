using AutoMapper;
using MediatR;
using ePrescription.Application.DTOs;
using ePrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace ePrescription.Application.Commands.Prescriptions;

public class UpdatePrescriptionCommandHandler : IRequestHandler<UpdatePrescriptionCommand, PrescriptionDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdatePrescriptionCommandHandler> _logger;

    public UpdatePrescriptionCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<UpdatePrescriptionCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PrescriptionDto> Handle(UpdatePrescriptionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Updating prescription {PrescriptionId}", request.PrescriptionId);

            // Get existing prescription
            var prescription = await _unitOfWork.Prescriptions.GetWithDetailsAsync(
                request.PrescriptionId, 
                cancellationToken);

            if (prescription == null)
            {
                _logger.LogWarning("Prescription {PrescriptionId} not found", request.PrescriptionId);
                throw new KeyNotFoundException($"Prescription with ID {request.PrescriptionId} not found");
            }

            // Validate pharmacy if provided
            if (request.PrescriptionDto.PharmacyId.HasValue)
            {
                var pharmacy = await _unitOfWork.Pharmacies.GetByIdAsync(
                    request.PrescriptionDto.PharmacyId.Value, 
                    cancellationToken);
                    
                if (pharmacy == null)
                {
                    _logger.LogWarning("Pharmacy {PharmacyId} not found", request.PrescriptionDto.PharmacyId);
                    throw new KeyNotFoundException($"Pharmacy with ID {request.PrescriptionDto.PharmacyId} not found");
                }
            }

            // Validate medications if provided
            if (request.PrescriptionDto.Medications != null)
            {
                foreach (var medicationDto in request.PrescriptionDto.Medications)
                {
                    var medication = await _unitOfWork.Medications.GetByIdAsync(
                        medicationDto.MedicationId, 
                        cancellationToken);
                        
                    if (medication == null)
                    {
                        _logger.LogWarning("Medication {MedicationId} not found", medicationDto.MedicationId);
                        throw new KeyNotFoundException($"Medication with ID {medicationDto.MedicationId} not found");
                    }
                }
            }

            // Validate CIE-10 diagnosis codes if provided
            if (request.PrescriptionDto.Diagnoses != null)
            {
                foreach (var diagnosisDto in request.PrescriptionDto.Diagnoses)
                {
                    var cie10 = await _unitOfWork.Cie10Catalog.GetByCodeAsync(
                        diagnosisDto.DiagnosisCode, 
                        cancellationToken);
                        
                    if (cie10 == null)
                    {
                        _logger.LogWarning("CIE-10 code {DiagnosisCode} not found", diagnosisDto.DiagnosisCode);
                        throw new KeyNotFoundException($"CIE-10 code {diagnosisDto.DiagnosisCode} not found in catalog");
                    }
                }
            }

            // Begin transaction
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            try
            {
                // Update basic properties (only non-null values from DTO)
                if (request.PrescriptionDto.PharmacyId.HasValue)
                    prescription.PharmacyId = request.PrescriptionDto.PharmacyId;

                if (request.PrescriptionDto.ExpirationDate.HasValue)
                    prescription.ExpirationDate = request.PrescriptionDto.ExpirationDate;

                if (!string.IsNullOrEmpty(request.PrescriptionDto.Status))
                    prescription.Status = request.PrescriptionDto.Status;

                if (request.PrescriptionDto.Notes != null)
                    prescription.Notes = request.PrescriptionDto.Notes;

                if (request.PrescriptionDto.Instructions != null)
                    prescription.Instructions = request.PrescriptionDto.Instructions;

                if (request.PrescriptionDto.RequiresAuthorization.HasValue)
                    prescription.RequiresAuthorization = request.PrescriptionDto.RequiresAuthorization.Value;

                if (request.PrescriptionDto.AuthorizedDate.HasValue)
                    prescription.AuthorizedDate = request.PrescriptionDto.AuthorizedDate;

                if (request.PrescriptionDto.AuthorizedBy.HasValue)
                    prescription.AuthorizedBy = request.PrescriptionDto.AuthorizedBy;

                if (request.PrescriptionDto.AuthorizationReason != null)
                    prescription.AuthorizationReason = request.PrescriptionDto.AuthorizationReason;

                // Update medications if provided
                if (request.PrescriptionDto.Medications != null)
                {
                    // Remove existing medications
                    prescription.Medications.Clear();

                    // Add new medications
                    prescription.Medications = request.PrescriptionDto.Medications
                        .Select(m =>
                        {
                            var prescriptionMedication = _mapper.Map<PrescriptionMedication>(m);
                            prescriptionMedication.PrescriptionId = prescription.Id;
                            prescriptionMedication.CreatedAt = DateTime.UtcNow;
                            return prescriptionMedication;
                        })
                        .ToList();
                }

                // Update diagnoses if provided
                if (request.PrescriptionDto.Diagnoses != null)
                {
                    // Remove existing diagnoses
                    prescription.Diagnoses.Clear();

                    // Add new diagnoses
                    prescription.Diagnoses = request.PrescriptionDto.Diagnoses
                        .Select(d =>
                        {
                            var prescriptionDiagnosis = _mapper.Map<PrescriptionDiagnosis>(d);
                            prescriptionDiagnosis.PrescriptionId = prescription.Id;
                            prescriptionDiagnosis.CreatedAt = DateTime.UtcNow;
                            return prescriptionDiagnosis;
                        })
                        .ToList();
                }

                // Update timestamp
                prescription.UpdatedAt = DateTime.UtcNow;

                // Update prescription
                await _unitOfWork.Prescriptions.UpdateAsync(prescription, cancellationToken);

                // Save changes with audit
                await _unitOfWork.SaveChangesAsync(request.UserId, "System", cancellationToken);

                // Commit transaction
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                _logger.LogInformation("Prescription {PrescriptionNumber} updated successfully", prescription.PrescriptionNumber);

                // Load updated prescription with details
                var updatedPrescription = await _unitOfWork.Prescriptions.GetWithDetailsAsync(
                    prescription.Id, 
                    cancellationToken);

                // Map to DTO
                var result = _mapper.Map<PrescriptionDto>(updatedPrescription);

                return result;
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating prescription {PrescriptionId}", request.PrescriptionId);
            throw;
        }
    }
}
