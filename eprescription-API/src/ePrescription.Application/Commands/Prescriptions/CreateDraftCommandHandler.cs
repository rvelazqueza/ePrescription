using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;

namespace EPrescription.Application.Commands.Prescriptions;

public class CreateDraftCommandHandler : IRequestHandler<CreateDraftCommand, PrescriptionDto>
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IRepository<EPrescription.Domain.Entities.Cie10Catalog> _cie10Repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateDraftCommandHandler(
        IPrescriptionRepository prescriptionRepository,
        IRepository<EPrescription.Domain.Entities.Cie10Catalog> cie10Repository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _prescriptionRepository = prescriptionRepository;
        _cie10Repository = cie10Repository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PrescriptionDto> Handle(CreateDraftCommand request, CancellationToken cancellationToken)
    {
        var dto = request.DraftDto;
        
        // Create prescription in draft status
        var prescription = new EPrescription.Domain.Entities.Prescription(
            prescriptionNumber: string.Empty, // Will be generated
            patientId: dto.PatientId,
            doctorId: dto.DoctorId,
            medicalCenterId: dto.MedicalCenterId,
            prescriptionDate: DateTime.UtcNow,
            expirationDate: null,
            notes: dto.Notes
        );
        
        // Set status to draft
        prescription.SetStatus("draft");
        
        // Generate prescription number
        prescription.GeneratePrescriptionNumber();

        // Add medications if provided
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

        // Add diagnoses if provided
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

        // Load the created prescription with related data for mapping
        var prescriptionWithIncludes = await _prescriptionRepository.GetByIdAsync(createdPrescription.Id);

        // Map to DTO and return
        return _mapper.Map<PrescriptionDto>(prescriptionWithIncludes);
    }
}
