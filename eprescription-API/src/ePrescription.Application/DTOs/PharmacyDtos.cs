namespace EPrescription.Application.DTOs;

/// <summary>
/// DTO for creating a new pharmacy
/// </summary>
public class CreatePharmacyDto
{
    public string LicenseNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

/// <summary>
/// DTO for updating pharmacy information
/// </summary>
public class UpdatePharmacyDto
{
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

/// <summary>
/// DTO for pharmacy response
/// </summary>
public class PharmacyDto
{
    public Guid Id { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Full address formatted
    /// </summary>
    public string FullAddress => $"{Address}, {City}, {State} {ZipCode}";
}

/// <summary>
/// DTO for pharmacy list item (simplified)
/// </summary>
public class PharmacyListDto
{
    public Guid Id { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
