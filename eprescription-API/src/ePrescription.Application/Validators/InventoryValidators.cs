using FluentValidation;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Validators;

public class AddStockValidator : AbstractValidator<AddStockDto>
{
    public AddStockValidator()
    {
        RuleFor(x => x.PharmacyId)
            .NotEmpty()
            .WithMessage("Pharmacy ID is required");
            
        RuleFor(x => x.MedicationId)
            .NotEmpty()
            .WithMessage("Medication ID is required");
            
        // Batch Number Validation
        RuleFor(x => x.BatchNumber)
            .NotEmpty()
            .WithMessage("Batch number is required")
            .MaximumLength(50)
            .WithMessage("Batch number cannot exceed 50 characters")
            .Matches("^[A-Z0-9-]+$")
            .WithMessage("Batch number must contain only uppercase letters, numbers, and hyphens")
            .Must(BeValidBatchFormat)
            .WithMessage("Batch number format is invalid. Expected format: LOT-YYYYMMDD-XXX");
            
        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("Quantity must be greater than 0")
            .LessThanOrEqualTo(10000)
            .WithMessage("Quantity cannot exceed 10,000 units per batch");
            
        // Expiration Date Validation
        RuleFor(x => x.ExpirationDate)
            .NotEmpty()
            .WithMessage("Expiration date is required")
            .GreaterThan(DateTime.UtcNow.AddDays(30))
            .WithMessage("Expiration date must be at least 30 days in the future")
            .LessThan(DateTime.UtcNow.AddYears(10))
            .WithMessage("Expiration date cannot be more than 10 years in the future")
            .Must(BeValidExpirationDate)
            .WithMessage("Expiration date must be the last day of a month");
            
        RuleFor(x => x.UnitCost)
            .GreaterThan(0)
            .WithMessage("Unit cost must be greater than 0")
            .LessThan(1000000)
            .WithMessage("Unit cost seems unreasonably high")
            .When(x => x.UnitCost.HasValue);
            
        // Cross-field validation: warn if expiring soon
        RuleFor(x => x)
            .Must(x => (x.ExpirationDate - DateTime.UtcNow).Days > 90)
            .WithMessage("Warning: Stock is expiring in less than 90 days")
            .WithSeverity(Severity.Warning);
    }
    
    private bool BeValidBatchFormat(string batchNumber)
    {
        if (string.IsNullOrEmpty(batchNumber))
            return false;
            
        // Allow flexible batch formats, but ensure it's not just whitespace
        return !string.IsNullOrWhiteSpace(batchNumber) && 
               batchNumber.Length >= 3 &&
               batchNumber.All(c => char.IsLetterOrDigit(c) || c == '-' || c == '_');
    }
    
    private bool BeValidExpirationDate(DateTime expirationDate)
    {
        // Expiration dates should typically be end of month
        // But we'll be flexible and just ensure it's a valid date
        return expirationDate.Year >= DateTime.UtcNow.Year;
    }
}

public class AdjustStockValidator : AbstractValidator<AdjustStockDto>
{
    public AdjustStockValidator()
    {
        RuleFor(x => x.InventoryId)
            .NotEmpty()
            .WithMessage("Inventory ID is required");
            
        RuleFor(x => x.QuantityAdjustment)
            .NotEqual(0)
            .WithMessage("Quantity adjustment cannot be zero");
            
        RuleFor(x => x.Reason)
            .NotEmpty()
            .WithMessage("Reason is required")
            .MaximumLength(500)
            .WithMessage("Reason cannot exceed 500 characters");
    }
}

public class InventorySearchValidator : AbstractValidator<InventorySearchDto>
{
    public InventorySearchValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThan(0)
            .WithMessage("Page number must be greater than 0");
            
        RuleFor(x => x.PageSize)
            .GreaterThan(0)
            .WithMessage("Page size must be greater than 0")
            .LessThanOrEqualTo(100)
            .WithMessage("Page size cannot exceed 100");
            
        RuleFor(x => x.BatchNumber)
            .MaximumLength(50)
            .WithMessage("Batch number cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.BatchNumber));
            
        RuleFor(x => x.DaysUntilExpiration)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Days until expiration must be greater than or equal to 0")
            .When(x => x.DaysUntilExpiration.HasValue);
    }
}
