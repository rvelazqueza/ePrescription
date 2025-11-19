using AutoMapper;
using MediatR;
using ePrescription.Application.DTOs;
using ePrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace ePrescription.Application.Commands.Prescriptions;

public class CreatePrescriptionCommandHandler : IRequestHandler<CreatePrescriptionCommand, PrescriptionDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<CreatePrescriptionCommandHandler> _logger;

    public CreatePrescriptionCommandHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<CreatePrescriptionCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PrescriptionDto> Handle(CreatePrescriptionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Creating prescription for patient {PatientId} by doctor {DoctorId}", 
                request.PrescriptionDto.PatientId, request.PrescriptionDto.DoctorId);

            // Validate patient exists
            var patient = await _unitOfWork.Patients.GetByIdAsync(request.PrescriptionDto.PatientId, cancellationToken);
            if (patient == null)
            {
                _logger.LogWarning("Patient {PatientId} not found", request.PrescriptionDto.PatientId);
                throw new KeyNotFoundException($"Patient with ID {request.PrescriptionDto.PatientId} not found");
            }

            // Validate doctor exists
            var doctor = await _unitOfWork.Doctors.GetByIdAsync(request.PrescriptionDto.DoctorId, cancellationToken);
            if (doctor == null)
            {
                _logger.LogWarning("Doctor {DoctorId} not found", request.PrescriptionDto.DoctorId);
                throw new KeyNotFoundException($"Doctor with ID {request.PrescriptionDto.DoctorId} not found");
            }

            // Validate pharmacy if provided
            if (request.PrescriptionDto.PharmacyId.HasValue)
            {
                var pharmacy = await _unitOfWork.Pharmacies.GetByIdAsync(request.PrescriptionDto.PharmacyId.Value, cancellationToken);
                if (pharmacy == null)
                {
                    _logger.LogWarning("Pharmacy {PharmacyId} not found", request.PrescriptionDto.PharmacyId);
                    throw new KeyNotFoundException($"Pharmacy with ID {request.PrescriptionDto.PharmacyId} not found");
                }
            }

            // Validate medications exist
            foreach (var medicationDto in request.PrescriptionDto.Medications)
            {
                var medication = await _unitOfWork.Medications.GetByIdAsync(medicationDto.MedicationId, cancellationToken);
                if (medication == null)
                {
                    _logger.LogWarning("Medication {MedicationId} not found", medicationDto.MedicationId);
                    throw new KeyNotFoundException($"Medication with ID {medicationDto.MedicationId} not found");
                }
            }

            // Validate CIE-10 diagnosis codes
            foreach (var diagnosisDto in request.PrescriptionDto.Diagnoses)
            {
                var cie10 = await _unitOfWork.Cie10Catalog.GetByCodeAsync(diagnosisDto.DiagnosisCode, cancellationToken);
                if (cie10 == null)
                {
                    _logger.LogWarning("CIE-10 code {DiagnosisCode} not found", diagnosisDto.DiagnosisCode);
                    throw new KeyNotFoundException($"CIE-10 code {diagnosisDto.DiagnosisCode} not found in catalog");
                }
            }

            // Begin transaction
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            try
            {
                // Map DTO to entity
                var prescription = _mapper.Map<Prescription>(request.PrescriptionDto);
                
                // Generate prescription number (format: RX-YYYYMMDD-XXXXX)
                prescription.PrescriptionNumber = await GeneratePrescriptionNumberAsync(cancellationToken);
                
                // Set initial status
                prescription.Status = "Draft";
                
                // Set timestamps
                prescription.CreatedAt = DateTime.UtcNow;
                
                // Map medications
                prescription.Medications = request.PrescriptionDto.Medications
                    .Select(m =>
                    {
                        var prescriptionMedication = _mapper.Map<PrescriptionMedication>(m);
                        prescriptionMedication.CreatedAt = DateTime.UtcNow;
                        return prescriptionMedication;
                    })
                    .ToList();

                // Map diagnoses
                prescription.Diagnoses = request.PrescriptionDto.Diagnoses
                    .Select(d =>
                    {
                        var prescriptionDiagnosis = _mapper.Map<PrescriptionDiagnosis>(d);
                        prescriptionDiagnosis.CreatedAt = DateTime.UtcNow;
                        return prescriptionDiagnosis;
                    })
                    .ToList();

                // Add prescription to repository
                await _unitOfWork.Prescriptions.AddAsync(prescription, cancellationToken);

                // Save changes with audit
                await _unitOfWork.SaveChangesAsync(request.UserId, "System", cancellationToken);

                // Commit transaction
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                _logger.LogInformation("Prescription {PrescriptionNumber} created successfully", prescription.PrescriptionNumber);

                // Load full prescription with details for response
                var createdPrescription = await _unitOfWork.Prescriptions.GetWithDetailsAsync(prescription.Id, cancellationToken);
                
                // Map to DTO
                var result = _mapper.Map<PrescriptionDto>(createdPrescription);
                
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
            _logger.LogError(ex, "Error creating prescription for patient {PatientId}", request.PrescriptionDto.PatientId);
            throw;
        }
    }

    private async Task<string> GeneratePrescriptionNumberAsync(CancellationToken cancellationToken)
    {
        // Generate unique prescription number: RX-YYYYMMDD-XXXXX
        var date = DateTime.UtcNow;
        var datePrefix = date.ToString("yyyyMMdd");
        
        // Get count of prescriptions created today to generate sequence number
        var todayStart = date.Date;
        var todayEnd = todayStart.AddDays(1);
        var todayPrescriptions = await _unitOfWork.Prescriptions.GetByDateRangeAsync(todayStart, todayEnd, cancellationToken);
        var sequence = todayPrescriptions.Count() + 1;
        
        return $"RX-{datePrefix}-{sequence:D5}";
    }
}
