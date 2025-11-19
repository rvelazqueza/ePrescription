using AutoMapper;
using ePrescription.Application.DTOs;
using ePrescription.Domain.Entities;

namespace ePrescription.Application.Mappings;

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
            .ForMember(dest => dest.Patient, opt => opt.Ignore())
            .ForMember(dest => dest.Doctor, opt => opt.Ignore())
            .ForMember(dest => dest.Pharmacy, opt => opt.Ignore())
            .ForMember(dest => dest.Medications, opt => opt.Ignore())
            .ForMember(dest => dest.Diagnoses, opt => opt.Ignore())
            .ForMember(dest => dest.Dispensations, opt => opt.Ignore());
            
        CreateMap<UpdatePrescriptionDto, Prescription>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PrescriptionNumber, opt => opt.Ignore())
            .ForMember(dest => dest.PatientId, opt => opt.Ignore())
            .ForMember(dest => dest.DoctorId, opt => opt.Ignore())
            .ForMember(dest => dest.PrescriptionDate, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Patient, opt => opt.Ignore())
            .ForMember(dest => dest.Doctor, opt => opt.Ignore())
            .ForMember(dest => dest.Pharmacy, opt => opt.Ignore())
            .ForMember(dest => dest.Medications, opt => opt.Ignore())
            .ForMember(dest => dest.Diagnoses, opt => opt.Ignore())
            .ForMember(dest => dest.Dispensations, opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            
        CreateMap<Prescription, PrescriptionDto>()
            .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.Patient))
            .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.Doctor))
            .ForMember(dest => dest.Pharmacy, opt => opt.MapFrom(src => src.Pharmacy))
            .ForMember(dest => dest.Medications, opt => opt.MapFrom(src => src.Medications))
            .ForMember(dest => dest.Diagnoses, opt => opt.MapFrom(src => src.Diagnoses))
            .ForMember(dest => dest.Dispensations, opt => opt.MapFrom(src => src.Dispensations));
            
        CreateMap<Prescription, PrescriptionListDto>()
            .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => $"{src.Patient.FirstName} {src.Patient.LastName}"))
            .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => $"{src.Doctor.FirstName} {src.Doctor.LastName}"))
            .ForMember(dest => dest.PharmacyName, opt => opt.MapFrom(src => src.Pharmacy != null ? src.Pharmacy.Name : null))
            .ForMember(dest => dest.MedicationCount, opt => opt.MapFrom(src => src.Medications.Count));
            
        // Prescription Medication mappings
        CreateMap<CreatePrescriptionMedicationDto, PrescriptionMedication>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PrescriptionId, opt => opt.Ignore())
            .ForMember(dest => dest.IsControlled, opt => opt.Ignore())
            .ForMember(dest => dest.ControlledClass, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Prescription, opt => opt.Ignore())
            .ForMember(dest => dest.Medication, opt => opt.Ignore());
            
        CreateMap<PrescriptionMedication, PrescriptionMedicationDto>()
            .ForMember(dest => dest.Medication, opt => opt.MapFrom(src => src.Medication));
            
        // Prescription Diagnosis mappings
        CreateMap<CreatePrescriptionDiagnosisDto, PrescriptionDiagnosis>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PrescriptionId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Prescription, opt => opt.Ignore());
            
        CreateMap<PrescriptionDiagnosis, PrescriptionDiagnosisDto>();
        
        // Prescription Dispensation mappings
        CreateMap<Dispensation, PrescriptionDispensationDto>()
            .ForMember(dest => dest.Pharmacy, opt => opt.MapFrom(src => src.Pharmacy))
            .ForMember(dest => dest.PharmacistId, opt => opt.MapFrom(src => src.PharmacistId))
            .ForMember(dest => dest.Pharmacist, opt => opt.Ignore()); // Will need to map separately if needed
            
        // Patient mappings
        CreateMap<Patient, PatientSummaryDto>();
        
        // Doctor mappings
        CreateMap<Doctor, DoctorSummaryDto>();
        
        // Pharmacy mappings
        CreateMap<Pharmacy, PharmacySummaryDto>();
        
        // Medication mappings
        CreateMap<Medication, MedicationSummaryDto>();
    }
}
