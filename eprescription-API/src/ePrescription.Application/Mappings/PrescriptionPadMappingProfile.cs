using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;

namespace EPrescription.Application.Mappings;

/// <summary>
/// AutoMapper profile for prescription pad entities
/// </summary>
public class PrescriptionPadMappingProfile : Profile
{
    public PrescriptionPadMappingProfile()
    {
        // PrescriptionPadType mappings
        CreateMap<PrescriptionPadType, PrescriptionPadTypeDto>()
            .ReverseMap();

        // PrescriptionPad mappings
        CreateMap<PrescriptionPad, PrescriptionPadDto>()
            .ForMember(dest => dest.PadType, opt => opt.MapFrom(src => src.PadType))
            .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Doctor != null ? src.Doctor.FirstName + " " + src.Doctor.LastName : null))
            .ReverseMap();

        // PrescriptionSlip mappings
        CreateMap<PrescriptionSlip, PrescriptionSlipDto>()
            .ForMember(dest => dest.Pad, opt => opt.MapFrom(src => src.Pad))
            .ReverseMap();
    }
}
