using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;

namespace EPrescription.Application.Mappings;

public class InventoryMappingProfile : Profile
{
    public InventoryMappingProfile()
    {
        // Inventory mappings
        CreateMap<AddStockDto, Inventory>()
            .ConstructUsing(src => new Inventory(
                src.PharmacyId,
                src.MedicationId,
                src.BatchNumber,
                src.Quantity,
                src.ExpirationDate,
                src.UnitCost))
            .ForAllMembers(opt => opt.Ignore()); // Constructor handles all properties
            
        CreateMap<Inventory, InventoryDto>()
            .ForMember(dest => dest.Pharmacy, opt => opt.Ignore()) // Will be loaded separately if needed
            .ForMember(dest => dest.Medication, opt => opt.Ignore()) // Will be loaded separately if needed
            .ForMember(dest => dest.IsExpired, opt => opt.MapFrom(src => src.ExpirationDate < DateTime.UtcNow))
            .ForMember(dest => dest.IsLowStock, opt => opt.MapFrom(src => src.QuantityAvailable < 10))
            .ForMember(dest => dest.DaysUntilExpiration, opt => opt.MapFrom(src => (src.ExpirationDate - DateTime.UtcNow).Days));
            
        CreateMap<Inventory, InventoryListDto>()
            .ForMember(dest => dest.PharmacyName, opt => opt.MapFrom(src => src.Pharmacy != null ? src.Pharmacy.PharmacyName : string.Empty))
            .ForMember(dest => dest.MedicationName, opt => opt.MapFrom(src => src.Medication != null ? src.Medication.CommercialName : string.Empty))
            .ForMember(dest => dest.IsExpired, opt => opt.MapFrom(src => src.ExpirationDate < DateTime.UtcNow))
            .ForMember(dest => dest.IsLowStock, opt => opt.MapFrom(src => src.QuantityAvailable < 10))
            .ForMember(dest => dest.DaysUntilExpiration, opt => opt.MapFrom(src => (src.ExpirationDate - DateTime.UtcNow).Days));
            
        CreateMap<Inventory, LowStockAlertDto>()
            .ForMember(dest => dest.InventoryId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.PharmacyName, opt => opt.MapFrom(src => src.Pharmacy != null ? src.Pharmacy.PharmacyName : string.Empty))
            .ForMember(dest => dest.MedicationName, opt => opt.MapFrom(src => src.Medication != null ? src.Medication.CommercialName : string.Empty))
            .ForMember(dest => dest.CurrentQuantity, opt => opt.MapFrom(src => (int)src.QuantityAvailable))
            .ForMember(dest => dest.MinimumStockLevel, opt => opt.MapFrom(src => 10))
            .ForMember(dest => dest.Deficit, opt => opt.MapFrom(src => 10 - (int)src.QuantityAvailable))
            .ForMember(dest => dest.AlertLevel, opt => opt.MapFrom(src => GetLowStockAlertLevel(src.QuantityAvailable)))
            .ForMember(dest => dest.LastRestockDate, opt => opt.MapFrom(src => src.UpdatedAt));
            
        CreateMap<Inventory, ExpiringStockAlertDto>()
            .ForMember(dest => dest.InventoryId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.PharmacyName, opt => opt.MapFrom(src => src.Pharmacy != null ? src.Pharmacy.PharmacyName : string.Empty))
            .ForMember(dest => dest.MedicationName, opt => opt.MapFrom(src => src.Medication != null ? src.Medication.CommercialName : string.Empty))
            .ForMember(dest => dest.DaysUntilExpiration, opt => opt.MapFrom(src => (src.ExpirationDate - DateTime.UtcNow).Days))
            .ForMember(dest => dest.AlertLevel, opt => opt.MapFrom(src => GetExpirationAlertLevel(src.ExpirationDate)));
            
        // Pharmacy Summary mappings
        CreateMap<Pharmacy, PharmacyInventorySummaryDto>()
            .ForMember(dest => dest.LicenseNumber, opt => opt.MapFrom(src => src.LicenseNumber));
            
        // Medication Summary mappings
        CreateMap<Medication, MedicationInventorySummaryDto>()
            .ForMember(dest => dest.Presentation, opt => opt.MapFrom(src => src.Presentation));
    }
    
    private static decimal CalculateReorderQuantity(decimal currentQuantity)
    {
        // Simple logic: recommend ordering to reach 100 units
        const decimal targetQuantity = 100;
        return Math.Max(0, targetQuantity - currentQuantity);
    }
    
    private static string GetLowStockAlertLevel(decimal quantity)
    {
        return quantity switch
        {
            <= 0 => "critical",
            <= 5 => "critical",
            <= 10 => "warning",
            _ => "info"
        };
    }
    
    private static string GetExpirationAlertLevel(DateTime expirationDate)
    {
        var daysUntilExpiration = (expirationDate - DateTime.UtcNow).Days;
        
        return daysUntilExpiration switch
        {
            < 0 => "expired",
            <= 7 => "critical",
            <= 30 => "warning",
            _ => "info"
        };
    }
}
