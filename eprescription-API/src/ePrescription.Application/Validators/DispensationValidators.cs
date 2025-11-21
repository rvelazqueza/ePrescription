using FluentValidation;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Validators;

public class RegisterDispensationValidator : AbstractValidator<RegisterDispensationDto>
{
    public RegisterDispensationValidator()
    {
        RuleFor(x => x.PrescriptionId)
            .NotEmpty()
            .WithMessage("Prescription ID is required");
            
        RuleFor(x => x.PharmacyId)
            .NotEmpty()
            .WithMessage("Pharmacy ID is required");
            

            
        RuleFor(x => x.Notes)
            .MaximumLength(2000)
            .WithMessage("Notes cannot exceed 2000 characters");
            
        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("At least one item is required")
            .Must(items => items != null && items.Count > 0)
            .WithMessage("At least one item is required");
            
        RuleForEach(x => x.Items)
            .SetValidator(new RegisterDispensationItemValidator());
    }
}

public class RegisterDispensationItemValidator : AbstractValidator<RegisterDispensationItemDto>
{
    public RegisterDispensationItemValidator()
    {
        RuleFor(x => x.PrescriptionMedicationId)
            .NotEmpty()
            .WithMessage("Prescription Medication ID is required");
            
        RuleFor(x => x.InventoryId)
            .NotEmpty()
            .WithMessage("Inventory ID is required");
            
        RuleFor(x => x.QuantityDispensed)
            .GreaterThan(0)
            .WithMessage("Quantity dispensed must be greater than 0");
            
        RuleFor(x => x.BatchNumber)
            .MaximumLength(50)
            .WithMessage("Batch number cannot exceed 50 characters");
            
        RuleFor(x => x.ExpirationDate)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Expiration date must be in the future")
            .When(x => x.ExpirationDate.HasValue);
    }
}

public class VerifyDispensationValidator : AbstractValidator<VerifyDispensationDto>
{
    private static readonly string[] ValidStatuses = { "pending", "verified", "completed", "rejected" };
    
    public VerifyDispensationValidator()
    {
        RuleFor(x => x.DispensationId)
            .NotEmpty()
            .WithMessage("Dispensation ID is required");
            
        RuleFor(x => x.Status)
            .NotEmpty()
            .WithMessage("Status is required")
            .Must(status => ValidStatuses.Contains(status.ToLower()))
            .WithMessage($"Status must be one of: {string.Join(", ", ValidStatuses)}");
            
        RuleFor(x => x.Notes)
            .MaximumLength(2000)
            .WithMessage("Notes cannot exceed 2000 characters");
    }
}
