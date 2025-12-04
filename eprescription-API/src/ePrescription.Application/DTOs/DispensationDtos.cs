using System.ComponentModel.DataAnnotations;

namespace EPrescription.Application.DTOs;

/// <summary>
/// DTO for registering a new dispensation
/// </summary>
public class RegisterDispensationDto
{
    [Required(ErrorMessage = "Prescription ID is required")]
    public Guid PrescriptionId { get; set; }
    
    [Required(ErrorMessage = "Pharmacy ID is required")]
    public Guid PharmacyId { get; set; }
    
    public Guid? PharmacistId { get; set; }
    
    [MaxLength(2000, ErrorMessage = "Notes cannot exceed 2000 characters")]
    public string? Notes { get; set; }
    
    [Required(ErrorMessage = "At least one item is required")]
    [MinLength(1, ErrorMessage = "At least one item is required")]
    public List<RegisterDispensationItemDto> Items { get; set; } = new();
}

/// <summary>
/// DTO for dispensation item when registering
/// </summary>
public class RegisterDispensationItemDto
{
    [Required(ErrorMessage = "Prescription Medication ID is required")]
    public Guid PrescriptionMedicationId { get; set; }
    
    [Required(ErrorMessage = "Inventory ID is required")]
    public Guid InventoryId { get; set; }
    
    [Required(ErrorMessage = "Quantity dispensed is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public decimal QuantityDispensed { get; set; }
    
    [MaxLength(50, ErrorMessage = "Batch number cannot exceed 50 characters")]
    public string? BatchNumber { get; set; }
    
    public DateTime? ExpirationDate { get; set; }
}

/// <summary>
/// DTO for verifying a dispensation
/// </summary>
public class VerifyDispensationDto
{
    [Required(ErrorMessage = "Dispensation ID is required")]
    public Guid DispensationId { get; set; }
    
    [Required(ErrorMessage = "Verification status is required")]
    [MaxLength(20, ErrorMessage = "Status cannot exceed 20 characters")]
    public string Status { get; set; } = string.Empty; // pending, verified, completed, rejected
    
    [MaxLength(2000, ErrorMessage = "Notes cannot exceed 2000 characters")]
    public string? Notes { get; set; }
}

/// <summary>
/// DTO for dispensation response (detailed view)
/// </summary>
public class DispensationDto
{
    public Guid Id { get; set; }
    public Guid PrescriptionId { get; set; }
    public Guid PharmacyId { get; set; }
    public Guid? PharmacistId { get; set; }
    public DateTime DispensationDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Related entities
    public PrescriptionSummaryDto Prescription { get; set; } = null!;
    public PharmacySummaryDto Pharmacy { get; set; } = null!;
    public UserSummaryDto? Pharmacist { get; set; }
    public List<DispensationItemDto> Items { get; set; } = new();
}

/// <summary>
/// DTO for dispensation item response
/// </summary>
public class DispensationItemDto
{
    public Guid Id { get; set; }
    public Guid DispensationId { get; set; }
    public Guid PrescriptionMedicationId { get; set; }
    public Guid InventoryId { get; set; }
    public decimal QuantityDispensed { get; set; }
    public string? BatchNumber { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Related entities
    public PrescriptionMedicationSummaryDto PrescriptionMedication { get; set; } = null!;
    public InventorySummaryDto Inventory { get; set; } = null!;
}

/// <summary>
/// DTO for dispensation list item (summary view)
/// </summary>
public class DispensationListDto
{
    public Guid Id { get; set; }
    public Guid PrescriptionId { get; set; }
    public string PrescriptionNumber { get; set; } = string.Empty;
    public Guid PharmacyId { get; set; }
    public string PharmacyName { get; set; } = string.Empty;
    public Guid? PharmacistId { get; set; }
    public string? PharmacistUsername { get; set; }
    public DateTime DispensationDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public int ItemsCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO for prescription summary (used in dispensations)
/// </summary>
public class PrescriptionSummaryDto
{
    public Guid Id { get; set; }
    public string PrescriptionNumber { get; set; } = string.Empty;
    public DateTime PrescriptionDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? PatientName { get; set; }
    public string? DoctorName { get; set; }
}

/// <summary>
/// DTO for pharmacy summary (used in dispensations)
/// </summary>
public class PharmacySummaryDto
{
    public Guid Id { get; set; }
    public string PharmacyName { get; set; } = string.Empty;
    public string? LicenseNumber { get; set; }
    public string? Phone { get; set; }
}

/// <summary>
/// DTO for prescription medication summary (used in dispensation items)
/// </summary>
public class PrescriptionMedicationSummaryDto
{
    public Guid Id { get; set; }
    public Guid MedicationId { get; set; }
    public string MedicationName { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
}

/// <summary>
/// DTO for inventory summary (used in dispensation items)
/// </summary>
public class InventorySummaryDto
{
    public Guid Id { get; set; }
    public Guid MedicationId { get; set; }
    public string MedicationName { get; set; } = string.Empty;
    public string BatchNumber { get; set; } = string.Empty;
    public decimal QuantityAvailable { get; set; }
    public DateTime ExpirationDate { get; set; }
}

/// <summary>
/// DTO for user summary (used in dispensations)
/// </summary>
public class UserSummaryDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
