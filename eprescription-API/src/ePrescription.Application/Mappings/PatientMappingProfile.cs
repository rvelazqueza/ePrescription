using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;

namespace EPrescription.Application.Mappings;

public class PatientMappingProfile : Profile
{
    public PatientMappingProfile()
    {
        // Patient mappings
        CreateMap<CreatePatientDto, Patient>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Contacts, opt => opt.Ignore())
            .ForMember(dest => dest.Allergies, opt => opt.Ignore());
            
        CreateMap<UpdatePatientDto, Patient>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IdentificationNumber, opt => opt.Ignore())
            .ForMember(dest => dest.DateOfBirth, opt => opt.Ignore())
            .ForMember(dest => dest.Gender, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Contacts, opt => opt.Ignore())
            .ForMember(dest => dest.Allergies, opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            
        CreateMap<Patient, PatientDto>()
            .ForMember(dest => dest.Contacts, opt => opt.MapFrom(src => src.Contacts))
            .ForMember(dest => dest.Allergies, opt => opt.MapFrom(src => src.Allergies));
            
        CreateMap<Patient, PatientListDto>()
            .ForMember(dest => dest.PrimaryEmail, opt => opt.MapFrom(src => 
                src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "email" && c.IsPrimary) != null
                    ? src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "email" && c.IsPrimary)!.ContactValue
                    : src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "email") != null
                        ? src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "email")!.ContactValue
                        : null))
            .ForMember(dest => dest.PrimaryPhone, opt => opt.MapFrom(src => 
                src.Contacts.FirstOrDefault(c => (c.ContactType.ToLower() == "phone" || c.ContactType.ToLower() == "mobile") && c.IsPrimary) != null
                    ? src.Contacts.FirstOrDefault(c => (c.ContactType.ToLower() == "phone" || c.ContactType.ToLower() == "mobile") && c.IsPrimary)!.ContactValue
                    : src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "phone" || c.ContactType.ToLower() == "mobile") != null
                        ? src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "phone" || c.ContactType.ToLower() == "mobile")!.ContactValue
                        : null))
            .ForMember(dest => dest.AllergyCount, opt => opt.MapFrom(src => src.Allergies.Count));
            
        // Patient Contact mappings
        CreateMap<CreatePatientContactDto, PatientContact>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PatientId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Patient, opt => opt.Ignore());
            
        CreateMap<PatientContact, PatientContactDto>();
            
        // Patient Allergy mappings
        CreateMap<CreatePatientAllergyDto, PatientAllergy>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PatientId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Patient, opt => opt.Ignore());
            
        CreateMap<PatientAllergy, PatientAllergyDto>();
        
        // Patient Summary mapping (used in other DTOs)
        CreateMap<Patient, PatientSummaryDto>()
            .ForMember(dest => dest.DocumentNumber, opt => opt.MapFrom(src => src.IdentificationNumber))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => 
                src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "email" && c.IsPrimary) != null
                    ? src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "email" && c.IsPrimary)!.ContactValue
                    : src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "email") != null
                        ? src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "email")!.ContactValue
                        : null))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => 
                src.Contacts.FirstOrDefault(c => (c.ContactType.ToLower() == "phone" || c.ContactType.ToLower() == "mobile") && c.IsPrimary) != null
                    ? src.Contacts.FirstOrDefault(c => (c.ContactType.ToLower() == "phone" || c.ContactType.ToLower() == "mobile") && c.IsPrimary)!.ContactValue
                    : src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "phone" || c.ContactType.ToLower() == "mobile") != null
                        ? src.Contacts.FirstOrDefault(c => c.ContactType.ToLower() == "phone" || c.ContactType.ToLower() == "mobile")!.ContactValue
                        : null));
    }
}
