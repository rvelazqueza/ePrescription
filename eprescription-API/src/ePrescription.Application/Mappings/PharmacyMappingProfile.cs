using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;

namespace EPrescription.Application.Mappings;

public class PharmacyMappingProfile : Profile
{
    public PharmacyMappingProfile()
    {
        // Pharmacy -> PharmacyDto
        CreateMap<Pharmacy, PharmacyDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.PharmacyName))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address != null ? src.Address.StreetAddress : "")) // From Address entity
            .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.Address != null ? src.Address.StateProvince : "")) // From Address entity
            .ForMember(dest => dest.ZipCode, opt => opt.MapFrom(src => src.Address != null ? src.Address.PostalCode ?? "" : "")); // From Address entity

        // Pharmacy -> PharmacyListDto
        CreateMap<Pharmacy, PharmacyListDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.PharmacyName))
            .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.Address != null ? src.Address.StateProvince : "")); // From Address entity

        // CreatePharmacyDto -> Pharmacy (handled in command handler with constructor)
        // UpdatePharmacyDto -> Pharmacy (handled in command handler with Update method)
    }
}
