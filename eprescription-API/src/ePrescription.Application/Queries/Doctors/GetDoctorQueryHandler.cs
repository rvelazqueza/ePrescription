using AutoMapper;
using MediatR;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;

namespace EPrescription.Application.Queries.Doctors;

public class GetDoctorQueryHandler : IRequestHandler<GetDoctorQuery, DoctorDto?>
{
    private readonly IRepository<Doctor> _doctorRepository;
    private readonly IMapper _mapper;

    public GetDoctorQueryHandler(
        IRepository<Doctor> doctorRepository,
        IMapper mapper)
    {
        _doctorRepository = doctorRepository;
        _mapper = mapper;
    }

    public async Task<DoctorDto?> Handle(GetDoctorQuery request, CancellationToken cancellationToken)
    {
        // DoctorRepository includes Specialty automatically
        var doctor = await _doctorRepository.GetByIdAsync(request.Id, cancellationToken);
        
        return doctor == null ? null : _mapper.Map<DoctorDto>(doctor);
    }
}
