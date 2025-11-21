using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;

namespace EPrescription.Application.Mappings;

public class DoctorMappingProfile : Profile
{
    public DoctorMappingProfile()
    {
        // Doctor -> DoctorDto
        CreateMap<Doctor, DoctorDto>()
            .ForMember(dest => dest.SpecialtyName, opt => opt.MapFrom(src => src.Specialty.SpecialtyName));

        // Doctor -> DoctorListDto
        CreateMap<Doctor, DoctorListDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.SpecialtyName, opt => opt.MapFrom(src => src.Specialty.SpecialtyName));

        // CreateDoctorDto -> Doctor (handled in command handler with constructor)
        // UpdateDoctorDto -> Doctor (handled in command handler with Update method)
    }
}
