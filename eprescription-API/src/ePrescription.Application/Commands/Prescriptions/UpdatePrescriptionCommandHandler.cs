using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;

namespace EPrescription.Application.Commands.Prescriptions;

public class UpdatePrescriptionCommandHandler : IRequestHandler<UpdatePrescriptionCommand, PrescriptionDto>
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IRepository<EPrescription.Domain.Entities.Cie10Catalog> _cie10Repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdatePrescriptionCommandHandler(
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

    public async Task<PrescriptionDto> Handle(UpdatePrescriptionCommand request, CancellationToken cancellationToken)
    {
        // Get existing prescription with related data
        var prescription = await _prescriptionRepository.GetByIdAsync(request.PrescriptionId);

        if (prescription == null)
        {
            throw new KeyNotFoundException($"Prescription with ID {request.PrescriptionId} not found");
        }

        // Update basic properties
        if (request.PrescriptionDto.ExpirationDate.HasValue)
        {
            prescription.UpdateExpirationDate(request.PrescriptionDto.ExpirationDate.Value);
        }

        if (!string.IsNullOrEmpty(request.PrescriptionDto.Status))
        {
            prescription.UpdateStatus(request.PrescriptionDto.Status);
        }

        if (!string.IsNullOrEmpty(request.PrescriptionDto.Notes))
        {
            prescription.UpdateNotes(request.PrescriptionDto.Notes);
        }

        // Update medications if provided
        if (request.PrescriptionDto.Medications != null && request.PrescriptionDto.Medications.Count > 0)
        {
            // Clear existing medications
            prescription.ClearMedications();

            // Add new medications
            foreach (var medicationDto in request.PrescriptionDto.Medications)
            {
                var prescriptionMedication = new EPrescription.Domain.Entities.PrescriptionMedication(
                    prescription.Id,
                    medicationDto.MedicationId,
                    medicationDto.Dosage,
                    medicationDto.Frequency,
                    medicationDto.DurationDays,
                    medicationDto.AdministrationRouteId,
                    medicationDto.Quantity,
                    medicationDto.Instructions,
                    medicationDto.AiSuggested
                );
                prescription.AddMedication(prescriptionMedication);
            }
        }

        // Update diagnoses if provided
        if (request.PrescriptionDto.Diagnoses != null && request.PrescriptionDto.Diagnoses.Count > 0)
        {
            // Clear existing diagnoses
            prescription.ClearDiagnoses();

            // Add new diagnoses
            foreach (var diagnosisDto in request.PrescriptionDto.Diagnoses)
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
                    prescription.Id,
                    cie10.Id,
                    cie10.Code,
                    cie10.DescriptionEs,
                    diagnosisDto.IsPrimary,
                    diagnosisDto.Notes
                );
                prescription.AddDiagnosis(prescriptionDiagnosis);
            }
        }

        // Update the prescription
        await _prescriptionRepository.UpdateAsync(prescription, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Return updated prescription as DTO
        return _mapper.Map<PrescriptionDto>(prescription);
    }
}
