using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.Patients;

public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, PatientDto>
{
    private readonly IRepository<Patient> _patientRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<CreatePatientCommandHandler> _logger;

    public CreatePatientCommandHandler(
        IRepository<Patient> patientRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<CreatePatientCommandHandler> logger)
    {
        _patientRepository = patientRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PatientDto> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var dto = request.PatientDto;

            _logger.LogInformation("Creating patient with identification number {IdentificationNumber}", dto.IdentificationNumber);

            // Check if patient with same identification number already exists
            var existingPatients = await _patientRepository.FindAsync(
                p => p.IdentificationNumber == dto.IdentificationNumber,
                cancellationToken);

            if (existingPatients.Any())
            {
                throw new InvalidOperationException($"Patient with identification number '{dto.IdentificationNumber}' already exists");
            }

            // Create patient using constructor
            var patient = new Patient(
                identificationNumber: dto.IdentificationNumber,
                firstName: dto.FirstName,
                lastName: dto.LastName,
                dateOfBirth: dto.DateOfBirth,
                gender: dto.Gender,
                bloodType: dto.BloodType
            );

            // Add contacts
            if (dto.Contacts != null && dto.Contacts.Count > 0)
            {
                foreach (var contactDto in dto.Contacts)
                {
                    var contact = new PatientContact(
                        patientId: Guid.Empty, // Will be set by EF Core
                        contactType: contactDto.ContactType,
                        contactValue: contactDto.ContactValue,
                        isPrimary: contactDto.IsPrimary
                    );
                    patient.AddContact(contact);
                }
            }

            // Add allergies
            if (dto.Allergies != null && dto.Allergies.Count > 0)
            {
                foreach (var allergyDto in dto.Allergies)
                {
                    var allergy = new PatientAllergy(
                        patientId: Guid.Empty, // Will be set by EF Core
                        allergenType: allergyDto.AllergenType,
                        allergenName: allergyDto.AllergenName,
                        severity: allergyDto.Severity,
                        notes: allergyDto.Notes
                    );
                    patient.AddAllergy(allergy);
                }
            }

            // Save to database
            var createdPatient = await _patientRepository.AddAsync(patient);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Load the created patient with related data
            var patientWithIncludes = await _patientRepository.GetByIdAsync(createdPatient.Id, cancellationToken);

            _logger.LogInformation("Successfully created patient {PatientId}", createdPatient.Id);

            // Map to DTO and return
            return _mapper.Map<PatientDto>(patientWithIncludes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating patient");
            throw;
        }
    }
}
