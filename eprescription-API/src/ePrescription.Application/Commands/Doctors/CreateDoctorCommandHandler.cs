using AutoMapper;
using MediatR;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Application.Commands.Doctors;

public class CreateDoctorCommandHandler : IRequestHandler<CreateDoctorCommand, DoctorDto>
{
    private readonly IRepository<Doctor> _doctorRepository;
    private readonly IRepository<Specialty> _specialtyRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateDoctorCommandHandler(
        IRepository<Doctor> doctorRepository,
        IRepository<Specialty> specialtyRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _doctorRepository = doctorRepository;
        _specialtyRepository = specialtyRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<DoctorDto> Handle(CreateDoctorCommand request, CancellationToken cancellationToken)
    {
        // Verify specialty exists
        var specialty = await _specialtyRepository.GetByIdAsync(request.SpecialtyId, cancellationToken);
        if (specialty == null)
        {
            throw new KeyNotFoundException($"Specialty with ID {request.SpecialtyId} not found");
        }

        // Check if identification number already exists
        var existingByIdentification = await _doctorRepository.FindAsync(
            d => d.IdentificationNumber == request.IdentificationNumber,
            cancellationToken);
        
        if (existingByIdentification.Any())
        {
            throw new InvalidOperationException($"Doctor with identification number {request.IdentificationNumber} already exists");
        }

        // Check if medical license number already exists
        var existingByLicense = await _doctorRepository.FindAsync(
            d => d.MedicalLicenseNumber == request.MedicalLicenseNumber,
            cancellationToken);
        
        if (existingByLicense.Any())
        {
            throw new InvalidOperationException($"Doctor with medical license number {request.MedicalLicenseNumber} already exists");
        }

        // Create doctor
        var doctor = new Doctor(
            request.IdentificationNumber,
            request.FirstName,
            request.LastName,
            request.MedicalLicenseNumber,
            request.SpecialtyId,
            request.Email,
            request.Phone
        );

        await _doctorRepository.AddAsync(doctor, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Reload with specialty for mapping (DoctorRepository includes Specialty automatically)
        var createdDoctor = await _doctorRepository.GetByIdAsync(doctor.Id, cancellationToken);
        
        return _mapper.Map<DoctorDto>(createdDoctor!);
    }
}
