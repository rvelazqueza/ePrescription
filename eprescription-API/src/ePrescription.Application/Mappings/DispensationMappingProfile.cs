using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;

namespace EPrescription.Application.Mappings;

public class DispensationMappingProfile : Profile
{
    public DispensationMappingProfile()
    {
        // Dispensation mappings
        CreateMap<RegisterDispensationDto, Dispensation>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.DispensationDate, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Prescription, opt => opt.Ignore())
            .ForMember(dest => dest.Pharmacy, opt => opt.Ignore())
            .ForMember(dest => dest.Pharmacist, opt => opt.Ignore())
            .ForMember(dest => dest.Items, opt => opt.Ignore());
            
        CreateMap<Dispensation, DispensationDto>()
            .ForMember(dest => dest.Prescription, opt => opt.Ignore()) // Will be loaded separately if needed
            .ForMember(dest => dest.Pharmacy, opt => opt.Ignore()) // Will be loaded separately if needed
            .ForMember(dest => dest.Pharmacist, opt => opt.Ignore()) // Will be loaded separately if needed
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));
            
        CreateMap<Dispensation, DispensationListDto>()
            .ForMember(dest => dest.PrescriptionNumber, opt => opt.Ignore()) // Will be set manually in handler
            .ForMember(dest => dest.PharmacyName, opt => opt.Ignore()) // Will be set manually in handler
            .ForMember(dest => dest.PharmacistUsername, opt => opt.Ignore()) // Will be set manually in handler
            .ForMember(dest => dest.ItemsCount, opt => opt.MapFrom(src => src.Items.Count));
            
        // Dispensation Item mappings
        CreateMap<RegisterDispensationItemDto, DispensationItem>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.DispensationId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Dispensation, opt => opt.Ignore())
            .ForMember(dest => dest.PrescriptionMedication, opt => opt.Ignore())
            .ForMember(dest => dest.Inventory, opt => opt.Ignore());
            
        CreateMap<DispensationItem, DispensationItemDto>()
            .ForMember(dest => dest.PrescriptionMedication, opt => opt.Ignore()) // Will be loaded separately if needed
            .ForMember(dest => dest.Inventory, opt => opt.Ignore()); // Will be loaded separately if needed
            
        // Prescription Medication Summary mappings
        CreateMap<PrescriptionMedication, PrescriptionMedicationSummaryDto>()
            .ForMember(dest => dest.MedicationName, opt => opt.MapFrom(src => src.Medication != null ? src.Medication.CommercialName : string.Empty));
            
        // Inventory Summary mappings
        CreateMap<Inventory, InventorySummaryDto>()
            .ForMember(dest => dest.MedicationName, opt => opt.MapFrom(src => src.Medication != null ? src.Medication.CommercialName : string.Empty));
            
        // User Summary mappings
        CreateMap<User, UserSummaryDto>();
        
        // Prescription Summary mappings
        CreateMap<Prescription, PrescriptionSummaryDto>()
            .ForMember(dest => dest.PatientName, opt => opt.Ignore()) // Will be set manually in handler
            .ForMember(dest => dest.DoctorName, opt => opt.Ignore()); // Will be set manually in handler
            
        // Pharmacy Summary mappings
        CreateMap<Pharmacy, PharmacySummaryDto>()
            .ForMember(dest => dest.LicenseNumber, opt => opt.MapFrom(src => src.LicenseNumber))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone));
    }
}
