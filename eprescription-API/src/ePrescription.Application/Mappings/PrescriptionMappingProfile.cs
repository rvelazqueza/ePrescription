using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;

namespace EPrescription.Application.Mappings;

public class PrescriptionMappingProfile : Profile
{
    public PrescriptionMappingProfile()
    {
        // Prescription mappings
        CreateMap<CreatePrescriptionDto, Prescription>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PrescriptionNumber, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Draft"))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Medications, opt => opt.Ignore())
            .ForMember(dest => dest.Diagnoses, opt => opt.Ignore());
            
        CreateMap<UpdatePrescriptionDto, Prescription>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PrescriptionNumber, opt => opt.Ignore())
            .ForMember(dest => dest.PatientId, opt => opt.Ignore())
            .ForMember(dest => dest.DoctorId, opt => opt.Ignore())
            .ForMember(dest => dest.PrescriptionDate, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Medications, opt => opt.Ignore())
            .ForMember(dest => dest.Diagnoses, opt => opt.Ignore())
            .ForMember(dest => dest.Dispensations, opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            
        CreateMap<Prescription, PrescriptionDto>()
            .ForMember(dest => dest.Patient, opt => opt.Ignore()) // Will be loaded separately if needed
            .ForMember(dest => dest.Doctor, opt => opt.Ignore()) // Will be loaded separately if needed
            .ForMember(dest => dest.MedicalCenter, opt => opt.Ignore()) // Will be loaded separately if needed
            .ForMember(dest => dest.Medications, opt => opt.MapFrom(src => src.Medications))
            .ForMember(dest => dest.Diagnoses, opt => opt.MapFrom(src => src.Diagnoses))
            .ForMember(dest => dest.Dispensations, opt => opt.MapFrom(src => src.Dispensations));
            
        CreateMap<Prescription, PrescriptionListDto>()
            .ForMember(dest => dest.PatientName, opt => opt.Ignore()) // Will be loaded separately
            .ForMember(dest => dest.DoctorName, opt => opt.Ignore()) // Will be loaded separately
            .ForMember(dest => dest.MedicalCenterName, opt => opt.Ignore()) // Will be loaded separately
            .ForMember(dest => dest.MedicationCount, opt => opt.MapFrom(src => src.Medications.Count))
            .ForMember(dest => dest.DiagnosisCount, opt => opt.MapFrom(src => src.Diagnoses.Count));
            
        // Prescription Medication mappings
        CreateMap<CreatePrescriptionMedicationDto, PrescriptionMedication>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PrescriptionId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Prescription, opt => opt.Ignore())
            .ForMember(dest => dest.Medication, opt => opt.Ignore())
            .ForMember(dest => dest.AdministrationRoute, opt => opt.Ignore())
            .ForMember(dest => dest.DispensationItems, opt => opt.Ignore());
            
        CreateMap<PrescriptionMedication, PrescriptionMedicationDto>()
            .ForMember(dest => dest.Medication, opt => opt.MapFrom(src => src.Medication));
            
        // Prescription Diagnosis mappings
        CreateMap<CreatePrescriptionDiagnosisDto, PrescriptionDiagnosis>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PrescriptionId, opt => opt.Ignore())
            .ForMember(dest => dest.Cie10Id, opt => opt.Ignore()) // Set manually in handler
            .ForMember(dest => dest.DiagnosisCode, opt => opt.Ignore()) // Set manually in handler
            .ForMember(dest => dest.DiagnosisDescription, opt => opt.Ignore()) // Set manually in handler
            .ForMember(dest => dest.AiSuggested, opt => opt.Ignore())
            .ForMember(dest => dest.AiConfidenceScore, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Prescription, opt => opt.Ignore());
            
        CreateMap<PrescriptionDiagnosis, PrescriptionDiagnosisDto>()
            .ForMember(dest => dest.Cie10Code, opt => opt.MapFrom(src => src.DiagnosisCode))
            .ForMember(dest => dest.Cie10Description, opt => opt.MapFrom(src => src.DiagnosisDescription));
        
        // Prescription Dispensation mappings
        CreateMap<Dispensation, DispensationSummaryDto>()
            .ForMember(dest => dest.PharmacyId, opt => opt.MapFrom(src => src.PharmacyId))
            .ForMember(dest => dest.PharmacyName, opt => opt.MapFrom(src => src.Pharmacy != null ? src.Pharmacy.PharmacyName : string.Empty))
            .ForMember(dest => dest.DispensationDate, opt => opt.MapFrom(src => src.DispensationDate))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));
            
        // Patient mappings
        CreateMap<Patient, PatientSummaryDto>();
        
        // Medication mappings
        CreateMap<Medication, MedicationSummaryDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.CommercialName));
    }
}
