using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.Prescriptions;

public class CreatePrescriptionCommandHandler : IRequestHandler<CreatePrescriptionCommand, PrescriptionDto>
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IPrescriptionPadRepository _padRepository;
    private readonly IPrescriptionSlipRepository _slipRepository;
    private readonly IMedicationRepository _medicationRepository;
    private readonly IRepository<EPrescription.Domain.Entities.Cie10Catalog> _cie10Repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<CreatePrescriptionCommandHandler> _logger;

    public CreatePrescriptionCommandHandler(
        IPrescriptionRepository prescriptionRepository,
        IPrescriptionPadRepository padRepository,
        IPrescriptionSlipRepository slipRepository,
        IMedicationRepository medicationRepository,
        IRepository<EPrescription.Domain.Entities.Cie10Catalog> cie10Repository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<CreatePrescriptionCommandHandler> logger)
    {
        _prescriptionRepository = prescriptionRepository;
        _padRepository = padRepository;
        _slipRepository = slipRepository;
        _medicationRepository = medicationRepository;
        _cie10Repository = cie10Repository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PrescriptionDto> Handle(CreatePrescriptionCommand request, CancellationToken cancellationToken)
    {
        var dto = request.PrescriptionDto;
        
        _logger.LogInformation("Issuing prescription - DoctorId: {DoctorId}, PadId: {PadId}", 
            dto.DoctorId, dto.PadId);
        
        // 1. Validate and decrement prescription pad
        var pad = await _padRepository.GetByIdAsync(dto.PadId, cancellationToken);
        if (pad == null)
        {
            _logger.LogWarning("Prescription pad not found: {PadId}", dto.PadId);
            throw new InvalidOperationException($"Prescription pad not found: {dto.PadId}");
        }

        if (pad.DoctorId != dto.DoctorId)
        {
            _logger.LogWarning("Pad {PadId} does not belong to doctor {DoctorId}", dto.PadId, dto.DoctorId);
            throw new InvalidOperationException($"Prescription pad does not belong to this doctor");
        }

        if (pad.ExpirationDate <= DateTime.UtcNow)
        {
            _logger.LogWarning("Prescription pad expired: {PadId}", dto.PadId);
            throw new InvalidOperationException($"Prescription pad has expired");
        }

        if (pad.AvailableCount <= 0)
        {
            _logger.LogWarning("Prescription pad has no available count: {PadId}", dto.PadId);
            throw new InvalidOperationException($"Prescription pad has no available count");
        }

        // Decrement pad count
        var decrementSuccess = await _padRepository.DecrementAvailableCountAsync(dto.PadId, 1, cancellationToken);
        if (!decrementSuccess)
        {
            _logger.LogError("Failed to decrement pad count: {PadId}", dto.PadId);
            throw new InvalidOperationException($"Failed to decrement prescription pad count");
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 2. Validate medications against pad type
        if (dto.Medications != null && dto.Medications.Count > 0)
        {
            await ValidateMedicationsForPadType(dto.Medications, pad, cancellationToken);
        }
        
        // Create prescription using constructor
        var prescription = new EPrescription.Domain.Entities.Prescription(
            prescriptionNumber: string.Empty, // Will be generated
            patientId: dto.PatientId,
            doctorId: dto.DoctorId,
            medicalCenterId: dto.MedicalCenterId,
            prescriptionDate: dto.PrescriptionDate,
            expirationDate: dto.ExpirationDate,
            notes: dto.Notes
        );
        
        // Generate prescription number
        prescription.GeneratePrescriptionNumber();
        
        // Set status to active (issued)
        prescription.UpdateStatus("active");

        // Add medications
        if (dto.Medications != null && dto.Medications.Count > 0)
        {
            foreach (var medicationDto in dto.Medications)
            {
                var prescriptionMedication = new EPrescription.Domain.Entities.PrescriptionMedication(
                    prescriptionId: Guid.Empty, // Will be set by EF Core
                    medicationId: medicationDto.MedicationId,
                    dosage: medicationDto.Dosage,
                    frequency: medicationDto.Frequency,
                    durationDays: medicationDto.DurationDays,
                    administrationRouteId: medicationDto.AdministrationRouteId,
                    quantity: medicationDto.Quantity,
                    instructions: medicationDto.Instructions,
                    aiSuggested: medicationDto.AiSuggested
                );
                prescription.AddMedication(prescriptionMedication);
            }
        }

        // Add diagnoses
        if (dto.Diagnoses != null && dto.Diagnoses.Count > 0)
        {
            foreach (var diagnosisDto in dto.Diagnoses)
            {
                // Look up CIE-10 catalog entry to get ID and description
                var cie10Entry = await _cie10Repository.FindAsync(
                    c => c.Code == diagnosisDto.Cie10Code && c.IsActive,
                    cancellationToken);
                
                var cie10 = cie10Entry.FirstOrDefault();
                if (cie10 == null)
                {
                    throw new KeyNotFoundException($"CIE-10 code '{diagnosisDto.Cie10Code}' not found in catalog");
                }

                var prescriptionDiagnosis = new EPrescription.Domain.Entities.PrescriptionDiagnosis(
                    prescriptionId: Guid.Empty, // Will be set by EF Core
                    cie10Id: cie10.Id,
                    diagnosisCode: cie10.Code,
                    diagnosisDescription: cie10.DescriptionEs,
                    isPrimary: diagnosisDto.IsPrimary,
                    notes: diagnosisDto.Notes
                );
                prescription.AddDiagnosis(prescriptionDiagnosis);
            }
        }

        // Save to database
        var createdPrescription = await _prescriptionRepository.AddAsync(prescription);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 2. Mark prescription slip as used
        var slips = await _slipRepository.GetSlipsForPrescriptionAsync(createdPrescription.Id, cancellationToken);
        var slip = slips.FirstOrDefault();
        if (slip != null)
        {
            await _slipRepository.MarkAsUsedAsync(slip.Id, createdPrescription.Id, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        _logger.LogInformation("Prescription issued successfully - PrescriptionNumber: {PrescriptionNumber}, PadId: {PadId}",
            createdPrescription.PrescriptionNumber, dto.PadId);

        // Load the created prescription with related data for mapping
        var prescriptionWithIncludes = await _prescriptionRepository.GetByIdAsync(createdPrescription.Id);

        // Map to DTO and return
        return _mapper.Map<PrescriptionDto>(prescriptionWithIncludes);
    }

    /// <summary>
    /// Validates medications against prescription pad type restrictions
    /// </summary>
    private async Task ValidateMedicationsForPadType(
        IEnumerable<CreatePrescriptionMedicationDto> medications,
        EPrescription.Domain.Entities.PrescriptionPad pad,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Validating medications for pad type - PadId: {PadId}, PadType: {PadType}",
            pad.Id, pad.PadType?.PadTypeName);

        if (pad.PadType == null)
        {
            _logger.LogError("Prescription pad type not found - PadId: {PadId}", pad.Id);
            throw new InvalidOperationException($"Prescription pad type not found for pad: {pad.Id}");
        }

        var padTypeName = pad.PadType.PadTypeName?.ToLowerInvariant();
        var isNarcoticPad = padTypeName?.Contains("narcotic") == true || 
                           padTypeName?.Contains("controlled") == true ||
                           padTypeName?.Contains("especial") == true;

        _logger.LogInformation("Pad type analysis - PadType: {PadType}, IsNarcoticPad: {IsNarcoticPad}",
            padTypeName, isNarcoticPad);

        foreach (var medicationDto in medications)
        {
            // Get medication details to check if it's controlled
            var medication = await _medicationRepository.GetByIdAsync(medicationDto.MedicationId, cancellationToken);
            
            if (medication == null)
            {
                _logger.LogError("Medication not found - MedicationId: {MedicationId}", medicationDto.MedicationId);
                throw new InvalidOperationException($"Medication not found: {medicationDto.MedicationId}");
            }

            if (!medication.IsActive)
            {
                _logger.LogError("Medication is not active - MedicationId: {MedicationId}", medicationDto.MedicationId);
                throw new InvalidOperationException($"Medication is not active: {medication.CommercialName}");
            }

            // Determine if medication is controlled based on its PadType
            // A medication is controlled if it has a PadTypeId that matches a narcotic/controlled pad type
            var medicationPadType = medication.PadType;
            var medicationPadTypeName = medicationPadType?.PadTypeName?.ToLowerInvariant();
            var isControlledMedication = medicationPadTypeName?.Contains("narcotic") == true || 
                                        medicationPadTypeName?.Contains("controlled") == true ||
                                        medicationPadTypeName?.Contains("especial") == true;

            _logger.LogInformation("Medication validation - Name: {Name}, MedicationPadType: {MedicationPadType}, IsControlled: {IsControlled}",
                medication.CommercialName, medicationPadTypeName ?? "none", isControlledMedication);

            // Apply business rules
            if (isNarcoticPad && !isControlledMedication)
            {
                _logger.LogError("Non-controlled medication cannot be prescribed with narcotic pad - Medication: {Name}, PadType: {PadType}",
                    medication.CommercialName, padTypeName);
                throw new InvalidOperationException(
                    $"Medication '{medication.CommercialName}' is not controlled and cannot be prescribed with a narcotic/controlled prescription pad.");
            }

            if (!isNarcoticPad && isControlledMedication)
            {
                _logger.LogError("Controlled medication requires narcotic pad - Medication: {Name}, MedicationPadType: {MedicationPadType}",
                    medication.CommercialName, medicationPadTypeName);
                throw new InvalidOperationException(
                    $"Controlled medication '{medication.CommercialName}' requires a narcotic/controlled prescription pad.");
            }

            _logger.LogInformation("Medication validation passed - Name: {Name}", medication.CommercialName);
        }

        _logger.LogInformation("All medications validated successfully for pad type - PadId: {PadId}", pad.Id);
    }
}
