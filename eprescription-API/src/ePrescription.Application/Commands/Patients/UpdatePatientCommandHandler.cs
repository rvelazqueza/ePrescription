using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.Patients;

public class UpdatePatientCommandHandler : IRequestHandler<UpdatePatientCommand, PatientDto>
{
    private readonly IRepository<Patient> _patientRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdatePatientCommandHandler> _logger;

    public UpdatePatientCommandHandler(
        IRepository<Patient> patientRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<UpdatePatientCommandHandler> logger)
    {
        _patientRepository = patientRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PatientDto> Handle(UpdatePatientCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Updating patient {PatientId}", request.PatientId);

            var patient = await _patientRepository.GetByIdAsync(request.PatientId, cancellationToken);

            if (patient == null)
            {
                throw new KeyNotFoundException($"Patient with ID '{request.PatientId}' not found");
            }

            var dto = request.PatientDto;

            // Update basic info
            patient.UpdatePersonalInfo(dto.FirstName, dto.LastName, dto.BloodType);

            // Update contacts if provided
            if (dto.Contacts != null)
            {
                // Clear existing contacts
                patient.Contacts.Clear();

                // Add new contacts
                foreach (var contactDto in dto.Contacts)
                {
                    var contact = new PatientContact(
                        patientId: patient.Id,
                        contactType: contactDto.ContactType,
                        contactValue: contactDto.ContactValue,
                        isPrimary: contactDto.IsPrimary
                    );
                    patient.AddContact(contact);
                }
            }

            // Update allergies if provided
            if (dto.Allergies != null)
            {
                // Clear existing allergies
                patient.Allergies.Clear();

                // Add new allergies
                foreach (var allergyDto in dto.Allergies)
                {
                    var allergy = new PatientAllergy(
                        patientId: patient.Id,
                        allergenType: allergyDto.AllergenType,
                        allergenName: allergyDto.AllergenName,
                        severity: allergyDto.Severity,
                        notes: allergyDto.Notes
                    );
                    patient.AddAllergy(allergy);
                }
            }

            // Save changes
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Reload with includes
            var updatedPatient = await _patientRepository.GetByIdAsync(patient.Id, cancellationToken);

            _logger.LogInformation("Successfully updated patient {PatientId}", request.PatientId);

            return _mapper.Map<PatientDto>(updatedPatient);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating patient {PatientId}", request.PatientId);
            throw;
        }
    }
}
