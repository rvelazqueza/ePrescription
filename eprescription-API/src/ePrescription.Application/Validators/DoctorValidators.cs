using FluentValidation;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Validators;

public class CreateDoctorDtoValidator : AbstractValidator<CreateDoctorDto>
{
    public CreateDoctorDtoValidator()
    {
        RuleFor(x => x.IdentificationNumber)
            .NotEmpty().WithMessage("Identification number is required")
            .MaximumLength(50).WithMessage("Identification number cannot exceed 50 characters")
            .Matches(@"^[A-Z0-9-]+$").WithMessage("Identification number must contain only uppercase letters, numbers, and hyphens");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters")
            .Matches(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$").WithMessage("First name must contain only letters and spaces");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters")
            .Matches(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$").WithMessage("Last name must contain only letters and spaces");

        RuleFor(x => x.MedicalLicenseNumber)
            .NotEmpty().WithMessage("Medical license number is required")
            .MaximumLength(50).WithMessage("Medical license number cannot exceed 50 characters")
            .Matches(@"^[A-Z0-9-]+$").WithMessage("Medical license number must contain only uppercase letters, numbers, and hyphens");

        RuleFor(x => x.SpecialtyId)
            .NotEmpty().WithMessage("Specialty is required");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(200).WithMessage("Email cannot exceed 200 characters");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .MaximumLength(20).WithMessage("Phone cannot exceed 20 characters")
            .Matches(@"^[\d\s\-\+\(\)]+$").WithMessage("Phone must contain only numbers, spaces, and phone symbols");
    }
}

public class UpdateDoctorDtoValidator : AbstractValidator<UpdateDoctorDto>
{
    public UpdateDoctorDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(200).WithMessage("Email cannot exceed 200 characters");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .MaximumLength(20).WithMessage("Phone cannot exceed 20 characters")
            .Matches(@"^[\d\s\-\+\(\)]+$").WithMessage("Phone must contain only numbers, spaces, and phone symbols");
    }
}
