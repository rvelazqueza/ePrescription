using FluentValidation;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Validators;

public class CreatePharmacyDtoValidator : AbstractValidator<CreatePharmacyDto>
{
    public CreatePharmacyDtoValidator()
    {
        RuleFor(x => x.LicenseNumber)
            .NotEmpty().WithMessage("License number is required")
            .MaximumLength(50).WithMessage("License number cannot exceed 50 characters")
            .Matches(@"^[A-Z0-9-]+$").WithMessage("License number must contain only uppercase letters, numbers, and hyphens");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Pharmacy name is required")
            .MaximumLength(200).WithMessage("Pharmacy name cannot exceed 200 characters")
            .Matches(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\.,&'-]+$").WithMessage("Pharmacy name contains invalid characters");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(300).WithMessage("Address cannot exceed 300 characters");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City cannot exceed 100 characters")
            .Matches(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.-]+$").WithMessage("City must contain only letters, spaces, dots, and hyphens");

        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State is required")
            .MaximumLength(50).WithMessage("State cannot exceed 50 characters")
            .Matches(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.-]+$").WithMessage("State must contain only letters, spaces, dots, and hyphens");

        RuleFor(x => x.ZipCode)
            .NotEmpty().WithMessage("Zip code is required")
            .MaximumLength(20).WithMessage("Zip code cannot exceed 20 characters")
            .Matches(@"^[A-Z0-9\s-]+$").WithMessage("Zip code must contain only letters, numbers, spaces, and hyphens");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .MaximumLength(20).WithMessage("Phone cannot exceed 20 characters")
            .Matches(@"^[\d\s\-\+\(\)]+$").WithMessage("Phone must contain only numbers, spaces, and phone symbols");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(200).WithMessage("Email cannot exceed 200 characters");
    }
}

public class UpdatePharmacyDtoValidator : AbstractValidator<UpdatePharmacyDto>
{
    public UpdatePharmacyDtoValidator()
    {
        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(300).WithMessage("Address cannot exceed 300 characters");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City cannot exceed 100 characters")
            .Matches(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.-]+$").WithMessage("City must contain only letters, spaces, dots, and hyphens");

        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State is required")
            .MaximumLength(50).WithMessage("State cannot exceed 50 characters")
            .Matches(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.-]+$").WithMessage("State must contain only letters, spaces, dots, and hyphens");

        RuleFor(x => x.ZipCode)
            .NotEmpty().WithMessage("Zip code is required")
            .MaximumLength(20).WithMessage("Zip code cannot exceed 20 characters")
            .Matches(@"^[A-Z0-9\s-]+$").WithMessage("Zip code must contain only letters, numbers, spaces, and hyphens");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .MaximumLength(20).WithMessage("Phone cannot exceed 20 characters")
            .Matches(@"^[\d\s\-\+\(\)]+$").WithMessage("Phone must contain only numbers, spaces, and phone symbols");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(200).WithMessage("Email cannot exceed 200 characters");
    }
}
