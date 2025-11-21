namespace EPrescription.Application.DTOs;

/// <summary>
/// DTO for creating a new doctor
/// </summary>
public class CreateDoctorDto
{
    public string IdentificationNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string MedicalLicenseNumber { get; set; } = string.Empty;
    public Guid SpecialtyId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

/// <summary>
/// DTO for updating doctor information
/// </summary>
public class UpdateDoctorDto
{
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

/// <summary>
/// DTO for doctor response
/// </summary>
public class DoctorDto
{
    public Guid Id { get; set; }
    public string IdentificationNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}";
    public string MedicalLicenseNumber { get; set; } = string.Empty;
    public Guid SpecialtyId { get; set; }
    public string SpecialtyName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// DTO for doctor list item (simplified)
/// </summary>
public class DoctorListDto
{
    public Guid Id { get; set; }
    public string IdentificationNumber { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string MedicalLicenseNumber { get; set; } = string.Empty;
    public string SpecialtyName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
