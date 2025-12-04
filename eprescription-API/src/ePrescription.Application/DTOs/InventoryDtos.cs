using System.ComponentModel.DataAnnotations;

namespace EPrescription.Application.DTOs;

/// <summary>
/// DTO for adding stock to inventory
/// </summary>
public class AddStockDto
{
    [Required(ErrorMessage = "Pharmacy ID is required")]
    public Guid PharmacyId { get; set; }
    
    [Required(ErrorMessage = "Medication ID is required")]
    public Guid MedicationId { get; set; }
    
    [Required(ErrorMessage = "Batch number is required")]
    [MaxLength(50, ErrorMessage = "Batch number cannot exceed 50 characters")]
    public string BatchNumber { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Quantity is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public decimal Quantity { get; set; }
    
    [Required(ErrorMessage = "Expiration date is required")]
    public DateTime ExpirationDate { get; set; }
    
    [Range(0.01, double.MaxValue, ErrorMessage = "Unit cost must be greater than 0")]
    public decimal? UnitCost { get; set; }
}

/// <summary>
/// DTO for adjusting stock in inventory
/// </summary>
public class AdjustStockDto
{
    [Required(ErrorMessage = "Inventory ID is required")]
    public Guid InventoryId { get; set; }
    
    [Required(ErrorMessage = "Quantity adjustment is required")]
    public decimal QuantityAdjustment { get; set; } // Can be positive (add) or negative (reduce)
    
    [Required(ErrorMessage = "Reason is required")]
    [MaxLength(500, ErrorMessage = "Reason cannot exceed 500 characters")]
    public string Reason { get; set; } = string.Empty;
}

/// <summary>
/// DTO for inventory response (detailed view)
/// </summary>
public class InventoryDto
{
    public Guid Id { get; set; }
    public Guid PharmacyId { get; set; }
    public Guid MedicationId { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public decimal QuantityAvailable { get; set; }
    public DateTime ExpirationDate { get; set; }
    public decimal? UnitCost { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Related entities
    public PharmacyInventorySummaryDto Pharmacy { get; set; } = null!;
    public MedicationInventorySummaryDto Medication { get; set; } = null!;
    
    // Calculated fields
    public bool IsExpired => ExpirationDate < DateTime.UtcNow;
    public bool IsLowStock => QuantityAvailable < 10; // Threshold can be configurable
    public int DaysUntilExpiration => (ExpirationDate - DateTime.UtcNow).Days;
}

/// <summary>
/// DTO for inventory list item (summary view)
/// </summary>
public class InventoryListDto
{
    public Guid Id { get; set; }
    public Guid PharmacyId { get; set; }
    public string PharmacyName { get; set; } = string.Empty;
    public Guid MedicationId { get; set; }
    public string MedicationName { get; set; } = string.Empty;
    public string BatchNumber { get; set; } = string.Empty;
    public decimal QuantityAvailable { get; set; }
    public DateTime ExpirationDate { get; set; }
    public decimal? UnitCost { get; set; }
    public bool IsExpired { get; set; }
    public bool IsLowStock { get; set; }
    public int DaysUntilExpiration { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO for low stock alert
/// </summary>
public class LowStockAlertDto
{
    public Guid InventoryId { get; set; }
    public Guid PharmacyId { get; set; }
    public string PharmacyName { get; set; } = string.Empty;
    public Guid MedicationId { get; set; }
    public string MedicationName { get; set; } = string.Empty;
    public int CurrentQuantity { get; set; }
    public int MinimumStockLevel { get; set; }
    public int Deficit { get; set; }
    public string AlertLevel { get; set; } = string.Empty; // CRITICAL, HIGH, MEDIUM, LOW
    public DateTime? LastRestockDate { get; set; }
}

/// <summary>
/// DTO for expiring stock alert
/// </summary>
public class ExpiringStockAlertDto
{
    public Guid InventoryId { get; set; }
    public Guid PharmacyId { get; set; }
    public string PharmacyName { get; set; } = string.Empty;
    public Guid MedicationId { get; set; }
    public string MedicationName { get; set; } = string.Empty;
    public string BatchNumber { get; set; } = string.Empty;
    public decimal QuantityAvailable { get; set; }
    public DateTime ExpirationDate { get; set; }
    public int DaysUntilExpiration { get; set; }
    public string AlertLevel { get; set; } = string.Empty; // expired, critical, warning
}

/// <summary>
/// DTO for pharmacy summary (used in inventory)
/// </summary>
public class PharmacyInventorySummaryDto
{
    public Guid Id { get; set; }
    public string PharmacyName { get; set; } = string.Empty;
    public string? LicenseNumber { get; set; }
}

/// <summary>
/// DTO for medication summary (used in inventory)
/// </summary>
public class MedicationInventorySummaryDto
{
    public Guid Id { get; set; }
    public string CommercialName { get; set; } = string.Empty;
    public string GenericName { get; set; } = string.Empty;
    public string? Presentation { get; set; }
}

/// <summary>
/// DTO for inventory search/filter parameters
/// </summary>
public class InventorySearchDto
{
    public Guid? PharmacyId { get; set; }
    public Guid? MedicationId { get; set; }
    public string? BatchNumber { get; set; }
    public bool? IsExpired { get; set; }
    public bool? IsLowStock { get; set; }
    public int? DaysUntilExpiration { get; set; } // Filter by items expiring within X days
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
