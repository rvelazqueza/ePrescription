using AutoMapper;
using MediatR;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Application.Commands.Doctors;

public class UpdateDoctorCommandHandler : IRequestHandler<UpdateDoctorCommand, DoctorDto>
{
    private readonly IRepository<Doctor> _doctorRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateDoctorCommandHandler(
        IRepository<Doctor> doctorRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _doctorRepository = doctorRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<DoctorDto> Handle(UpdateDoctorCommand request, CancellationToken cancellationToken)
    {
        // DoctorRepository includes Specialty automatically
        var doctor = await _doctorRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (doctor == null)
        {
            throw new KeyNotFoundException($"Doctor with ID {request.Id} not found");
        }

        doctor.UpdateContactInfo(request.Email, request.Phone);

        _doctorRepository.Update(doctor);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<DoctorDto>(doctor);
    }
}
