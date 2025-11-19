using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;

namespace EPrescription.Application.Commands.Prescriptions;

public class CreatePrescriptionCommandHandler : IRequestHandler<CreatePrescriptionCommand, PrescriptionDto>
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreatePrescriptionCommandHandler(
        IPrescriptionRepository prescriptionRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _prescriptionRepository = prescriptionRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PrescriptionDto> Handle(CreatePrescriptionCommand request, CancellationToken cancellationToken)
    {
        var dto = request.PrescriptionDto;
        
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
                var prescriptionDiagnosis = new EPrescription.Domain.Entities.PrescriptionDiagnosis(
                    prescriptionId: Guid.Empty, // Will be set by EF Core
                    cie10Code: diagnosisDto.Cie10Code,
                    isPrimary: diagnosisDto.IsPrimary,
                    notes: diagnosisDto.Notes
                );
                prescription.AddDiagnosis(prescriptionDiagnosis);
            }
        }

        // Save to database
        var createdPrescription = await _prescriptionRepository.AddAsync(prescription);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Load the created prescription with related data for mapping
        var prescriptionWithIncludes = await _prescriptionRepository.GetByIdAsync(createdPrescription.Id);

        // Map to DTO and return
        return _mapper.Map<PrescriptionDto>(prescriptionWithIncludes);
    }
}
