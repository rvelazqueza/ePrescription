using System.ComponentModel.DataAnnotations;

namespace EPrescription.Application.DTOs;

/// <summary>
/// DTO for creating a new prescription
/// </summary>
public class CreatePrescriptionDto
{
    [Required(ErrorMessage = "Patient ID is required")]
    public Guid PatientId { get; set; }
    
    [Required(ErrorMessage = "Doctor ID is required")]
    public Guid DoctorId { get; set; }
    
    [Required(ErrorMessage = "Medical Center ID is required")]
    public Guid MedicalCenterId { get; set; }
    
    [Required(ErrorMessage = "Prescription date is required")]
    public DateTime PrescriptionDate { get; set; }
    
    public DateTime? ExpirationDate { get; set; }
    
    [MaxLength(2000, ErrorMessage = "Notes cannot exceed 2000 characters")]
    public string? Notes { get; set; }
    
    [Required(ErrorMessage = "At least one diagnosis is required")]
    [MinLength(1, ErrorMessage = "At least one diagnosis is required")]
    public List<CreatePrescriptionDiagnosisDto> Diagnoses { get; set; } = new();
    
    [Required(ErrorMessage = "At least one medication is required")]
    [MinLength(1, ErrorMessage = "At least one medication is required")]
    public List<CreatePrescriptionMedicationDto> Medications { get; set; } = new();
}

/// <summary>
/// DTO for updating an existing prescription
/// </summary>
public class UpdatePrescriptionDto
{
    public DateTime? ExpirationDate { get; set; }
    
    [MaxLength(20, ErrorMessage = "Status cannot exceed 20 characters")]
    public string? Status { get; set; }
    
    [MaxLength(2000, ErrorMessage = "Notes cannot exceed 2000 characters")]
    public string? Notes { get; set; }
    
    public List<CreatePrescriptionDiagnosisDto>? Diagnoses { get; set; }
    
    public List<CreatePrescriptionMedicationDto>? Medications { get; set; }
}

/// <summary>
/// DTO for prescription response (detailed view)
/// </summary>
public class PrescriptionDto
{
    public Guid Id { get; set; }
    public string PrescriptionNumber { get; set; } = string.Empty;
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid MedicalCenterId { get; set; }
    public DateTime PrescriptionDate { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Related entities
    public PatientSummaryDto Patient { get; set; } = null!;
    public DoctorSummaryDto Doctor { get; set; } = null!;
    public MedicalCenterSummaryDto MedicalCenter { get; set; } = null!;
    public List<PrescriptionDiagnosisDto> Diagnoses { get; set; } = new();
    public List<PrescriptionMedicationDto> Medications { get; set; } = new();
    public List<DispensationSummaryDto> Dispensations { get; set; } = new();
}

/// <summary>
/// DTO for prescription list (summary view)
/// </summary>
public class PrescriptionListDto
{
    public Guid Id { get; set; }
    public string PrescriptionNumber { get; set; } = string.Empty;
    
    // IDs necesarios para el frontend
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    
    // Nombres para mostrar (opcional)
    public string PatientName { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public string MedicalCenterName { get; set; } = string.Empty;
    
    // Datos del paciente
    public string PatientIdNumber { get; set; } = string.Empty;
    public int PatientAge { get; set; }
    public string PatientGender { get; set; } = string.Empty;
    
    // Datos del médico
    public string DoctorSpecialty { get; set; } = string.Empty;
    public string DoctorLicenseNumber { get; set; } = string.Empty;
    
    public DateTime PrescriptionDate { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public string Status { get; set; } = string.Empty;
    
    // Arrays completos de medicamentos y diagnósticos
    public List<PrescriptionMedicationDto> Medications { get; set; } = new();
    public List<PrescriptionDiagnosisDto> Diagnoses { get; set; } = new();
    
    // Contadores (opcional, para compatibilidad)
    public int MedicationCount { get; set; }
    public int DiagnosisCount { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// DTO for creating a prescription diagnosis
/// </summary>
public class CreatePrescriptionDiagnosisDto
{
    [Required(ErrorMessage = "CIE-10 code is required")]
    [MaxLength(10, ErrorMessage = "CIE-10 code cannot exceed 10 characters")]
    public string Cie10Code { get; set; } = string.Empty;
    
    public bool IsPrimary { get; set; } = false;
    
    [MaxLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for prescription diagnosis response
/// </summary>
public class PrescriptionDiagnosisDto
{
    public Guid Id { get; set; }
    public string Cie10Code { get; set; } = string.Empty;
    public string Cie10Description { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for creating a prescription medication
/// </summary>
public class CreatePrescriptionMedicationDto
{
    [Required(ErrorMessage = "Medication ID is required")]
    public Guid MedicationId { get; set; }
    
    [Required(ErrorMessage = "Dosage is required")]
    [MaxLength(100, ErrorMessage = "Dosage cannot exceed 100 characters")]
    public string Dosage { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Frequency is required")]
    [MaxLength(200, ErrorMessage = "Frequency cannot exceed 200 characters")]
    public string Frequency { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Duration in days is required")]
    [Range(1, 365, ErrorMessage = "Duration must be between 1 and 365 days")]
    public int DurationDays { get; set; }
    
    [Required(ErrorMessage = "Administration route ID is required")]
    public Guid AdministrationRouteId { get; set; }
    
    [Required(ErrorMessage = "Quantity is required")]
    [Range(0.01, 10000, ErrorMessage = "Quantity must be between 0.01 and 10000")]
    public decimal Quantity { get; set; }
    
    [MaxLength(1000, ErrorMessage = "Instructions cannot exceed 1000 characters")]
    public string? Instructions { get; set; }
    
    public bool AiSuggested { get; set; } = false;
}

/// <summary>
/// DTO for prescription medication response
/// </summary>
public class PrescriptionMedicationDto
{
    public Guid Id { get; set; }
    public Guid MedicationId { get; set; }
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public int DurationDays { get; set; }
    public Guid AdministrationRouteId { get; set; }
    public decimal Quantity { get; set; }
    public string? Instructions { get; set; }
    public bool AiSuggested { get; set; }
    
    // Related entities
    public MedicationSummaryDto Medication { get; set; } = null!;
    public AdministrationRouteSummaryDto AdministrationRoute { get; set; } = null!;
}

/// <summary>
/// DTO for search/filter prescriptions
/// </summary>
public class SearchPrescriptionsDto
{
    public Guid? PatientId { get; set; }
    public Guid? DoctorId { get; set; }
    public Guid? MedicalCenterId { get; set; }
    public string? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? Cie10Code { get; set; }
    
    // Pagination
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    // Sorting
    public string? SortBy { get; set; } = "PrescriptionDate";
    public string? SortDirection { get; set; } = "desc"; // asc, desc
}

/// <summary>
/// DTO for paginated results
/// </summary>
public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

// Summary DTOs for related entities

public class PatientSummaryDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string DocumentNumber { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
}

public class DoctorSummaryDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string SpecialtyName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
}

public class MedicalCenterSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
}

public class MedicationSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? GenericName { get; set; }
    public string? Presentation { get; set; }
    public string? Concentration { get; set; }
}

public class AdministrationRouteSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class DispensationSummaryDto
{
    public Guid Id { get; set; }
    public Guid PharmacyId { get; set; }
    public string PharmacyName { get; set; } = string.Empty;
    public DateTime DispensationDate { get; set; }
    public string Status { get; set; } = string.Empty;
}

/// <summary>
/// DTO for creating a draft prescription
/// </summary>
public class CreateDraftDto
{
    [Required(ErrorMessage = "Patient ID is required")]
    public Guid PatientId { get; set; }
    
    [Required(ErrorMessage = "Doctor ID is required")]
    public Guid DoctorId { get; set; }
    
    [Required(ErrorMessage = "Medical Center ID is required")]
    public Guid MedicalCenterId { get; set; }
    
    [Required(ErrorMessage = "Prescription Pad ID is required")]
    public Guid PadId { get; set; }
    
    public List<CreatePrescriptionDiagnosisDto>? Diagnoses { get; set; }
    
    public List<CreatePrescriptionMedicationDto>? Medications { get; set; }
    
    [MaxLength(2000, ErrorMessage = "Notes cannot exceed 2000 characters")]
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for cancelling a prescription
/// </summary>
public class CancelPrescriptionDto
{
    [MaxLength(500, ErrorMessage = "Reason cannot exceed 500 characters")]
    public string? Reason { get; set; }
}
