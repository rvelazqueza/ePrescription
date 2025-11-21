using System.ComponentModel.DataAnnotations;

namespace EPrescription.Application.DTOs;

/// <summary>
/// DTO for creating a new patient
/// </summary>
public class CreatePatientDto
{
    [Required(ErrorMessage = "Identification number is required")]
    [MaxLength(50, ErrorMessage = "Identification number cannot exceed 50 characters")]
    public string IdentificationNumber { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "First name is required")]
    [MaxLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
    public string FirstName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Last name is required")]
    [MaxLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
    public string LastName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Date of birth is required")]
    public DateTime DateOfBirth { get; set; }
    
    [Required(ErrorMessage = "Gender is required")]
    [MaxLength(20, ErrorMessage = "Gender cannot exceed 20 characters")]
    public string Gender { get; set; } = string.Empty;
    
    [MaxLength(10, ErrorMessage = "Blood type cannot exceed 10 characters")]
    public string? BloodType { get; set; }
    
    public List<CreatePatientContactDto> Contacts { get; set; } = new();
    
    public List<CreatePatientAllergyDto> Allergies { get; set; } = new();
}

/// <summary>
/// DTO for updating an existing patient
/// </summary>
public class UpdatePatientDto
{
    [Required(ErrorMessage = "First name is required")]
    [MaxLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
    public string FirstName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Last name is required")]
    [MaxLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
    public string LastName { get; set; } = string.Empty;
    
    [MaxLength(10, ErrorMessage = "Blood type cannot exceed 10 characters")]
    public string? BloodType { get; set; }
    
    public List<CreatePatientContactDto>? Contacts { get; set; }
    
    public List<CreatePatientAllergyDto>? Allergies { get; set; }
}

/// <summary>
/// DTO for patient response (detailed view)
/// </summary>
public class PatientDto
{
    public Guid Id { get; set; }
    public string IdentificationNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}";
    public DateTime DateOfBirth { get; set; }
    public int Age => DateTime.Now.Year - DateOfBirth.Year - (DateTime.Now.DayOfYear < DateOfBirth.DayOfYear ? 1 : 0);
    public string Gender { get; set; } = string.Empty;
    public string? BloodType { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Related entities
    public List<PatientContactDto> Contacts { get; set; } = new();
    public List<PatientAllergyDto> Allergies { get; set; } = new();
}

/// <summary>
/// DTO for patient list (summary view)
/// </summary>
public class PatientListDto
{
    public Guid Id { get; set; }
    public string IdentificationNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}";
    public DateTime DateOfBirth { get; set; }
    public int Age => DateTime.Now.Year - DateOfBirth.Year - (DateTime.Now.DayOfYear < DateOfBirth.DayOfYear ? 1 : 0);
    public string Gender { get; set; } = string.Empty;
    public string? BloodType { get; set; }
    public string? PrimaryEmail { get; set; }
    public string? PrimaryPhone { get; set; }
    public int AllergyCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO for creating a patient contact
/// </summary>
public class CreatePatientContactDto
{
    [Required(ErrorMessage = "Contact type is required")]
    [MaxLength(50, ErrorMessage = "Contact type cannot exceed 50 characters")]
    public string ContactType { get; set; } = string.Empty; // email, phone, mobile, address
    
    [Required(ErrorMessage = "Contact value is required")]
    [MaxLength(500, ErrorMessage = "Contact value cannot exceed 500 characters")]
    public string ContactValue { get; set; } = string.Empty;
    
    public bool IsPrimary { get; set; } = false;
}

/// <summary>
/// DTO for patient contact response
/// </summary>
public class PatientContactDto
{
    public Guid Id { get; set; }
    public string ContactType { get; set; } = string.Empty;
    public string ContactValue { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}

/// <summary>
/// DTO for creating a patient allergy
/// </summary>
public class CreatePatientAllergyDto
{
    [Required(ErrorMessage = "Allergen type is required")]
    [MaxLength(50, ErrorMessage = "Allergen type cannot exceed 50 characters")]
    public string AllergenType { get; set; } = string.Empty; // medication, food, environmental, other
    
    [Required(ErrorMessage = "Allergen name is required")]
    [MaxLength(200, ErrorMessage = "Allergen name cannot exceed 200 characters")]
    public string AllergenName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Severity is required")]
    [MaxLength(50, ErrorMessage = "Severity cannot exceed 50 characters")]
    public string Severity { get; set; } = string.Empty; // mild, moderate, severe, life-threatening
    
    [MaxLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for patient allergy response
/// </summary>
public class PatientAllergyDto
{
    public Guid Id { get; set; }
    public string AllergenType { get; set; } = string.Empty;
    public string AllergenName { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for search/filter patients
/// </summary>
public class SearchPatientsDto
{
    public string? IdentificationNumber { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Gender { get; set; }
    public DateTime? DateOfBirthFrom { get; set; }
    public DateTime? DateOfBirthTo { get; set; }
    public string? BloodType { get; set; }
    public string? SearchTerm { get; set; } // Search across name, identification number
    
    // Pagination
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    // Sorting
    public string? SortBy { get; set; } = "LastName";
    public string? SortDirection { get; set; } = "asc"; // asc, desc
}
