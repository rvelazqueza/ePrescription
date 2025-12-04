using EPrescription.Application.DTOs;
using FluentValidation;

namespace EPrescription.Application.Validators;

/// <summary>
/// Validator for CreatePatientDto
/// </summary>
public class CreatePatientDtoValidator : AbstractValidator<CreatePatientDto>
{
    public CreatePatientDtoValidator()
    {
        RuleFor(x => x.IdentificationNumber)
            .NotEmpty().WithMessage("Identification number is required")
            .MaximumLength(50).WithMessage("Identification number cannot exceed 50 characters")
            .Matches(@"^[A-Za-z0-9\-]+$").WithMessage("Identification number can only contain letters, numbers, and hyphens");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters")
            .Matches(@"^[A-Za-zÀ-ÿ\s]+$").WithMessage("First name can only contain letters and spaces");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters")
            .Matches(@"^[A-Za-zÀ-ÿ\s]+$").WithMessage("Last name can only contain letters and spaces");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth is required")
            .LessThan(DateTime.Now).WithMessage("Date of birth must be in the past")
            .GreaterThan(DateTime.Now.AddYears(-150)).WithMessage("Date of birth is not valid");

        RuleFor(x => x.Gender)
            .NotEmpty().WithMessage("Gender is required")
            .MaximumLength(10).WithMessage("Gender cannot exceed 10 characters")
            .Must(g => new[] { "M", "F", "Otro" }.Contains(g))
            .WithMessage("Gender must be M, F, or Otro");

        RuleFor(x => x.BloodType)
            .MaximumLength(10).WithMessage("Blood type cannot exceed 10 characters")
            .Must(bt => bt == null || new[] { "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" }.Contains(bt))
            .WithMessage("Blood type must be A+, A-, B+, B-, AB+, AB-, O+, or O-")
            .When(x => !string.IsNullOrWhiteSpace(x.BloodType));

        RuleForEach(x => x.Contacts)
            .SetValidator(new CreatePatientContactDtoValidator());

        RuleForEach(x => x.Allergies)
            .SetValidator(new CreatePatientAllergyDtoValidator());
    }
}

/// <summary>
/// Validator for UpdatePatientDto
/// </summary>
public class UpdatePatientDtoValidator : AbstractValidator<UpdatePatientDto>
{
    public UpdatePatientDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters")
            .Matches(@"^[A-Za-zÀ-ÿ\s]+$").WithMessage("First name can only contain letters and spaces");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters")
            .Matches(@"^[A-Za-zÀ-ÿ\s]+$").WithMessage("Last name can only contain letters and spaces");

        RuleFor(x => x.BloodType)
            .MaximumLength(10).WithMessage("Blood type cannot exceed 10 characters")
            .Must(bt => bt == null || new[] { "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" }.Contains(bt))
            .WithMessage("Blood type must be A+, A-, B+, B-, AB+, AB-, O+, or O-")
            .When(x => !string.IsNullOrWhiteSpace(x.BloodType));

        RuleForEach(x => x.Contacts)
            .SetValidator(new CreatePatientContactDtoValidator())
            .When(x => x.Contacts != null);

        RuleForEach(x => x.Allergies)
            .SetValidator(new CreatePatientAllergyDtoValidator())
            .When(x => x.Allergies != null);
    }
}

/// <summary>
/// Validator for CreatePatientContactDto
/// </summary>
public class CreatePatientContactDtoValidator : AbstractValidator<CreatePatientContactDto>
{
    public CreatePatientContactDtoValidator()
    {
        RuleFor(x => x.ContactType)
            .NotEmpty().WithMessage("Contact type is required")
            .MaximumLength(50).WithMessage("Contact type cannot exceed 50 characters")
            .Must(ct => new[] { "email", "phone", "mobile", "address" }.Contains(ct.ToLower()))
            .WithMessage("Contact type must be email, phone, mobile, or address");

        RuleFor(x => x.ContactValue)
            .NotEmpty().WithMessage("Contact value is required")
            .MaximumLength(500).WithMessage("Contact value cannot exceed 500 characters");

        // Email validation
        RuleFor(x => x.ContactValue)
            .EmailAddress().WithMessage("Invalid email format")
            .When(x => x.ContactType.ToLower() == "email");

        // Phone validation (basic pattern for international numbers)
        RuleFor(x => x.ContactValue)
            .Matches(@"^[\d\s\-\+\(\)]+$").WithMessage("Invalid phone number format")
            .When(x => x.ContactType.ToLower() == "phone" || x.ContactType.ToLower() == "mobile");
    }
}

/// <summary>
/// Validator for CreatePatientAllergyDto
/// </summary>
public class CreatePatientAllergyDtoValidator : AbstractValidator<CreatePatientAllergyDto>
{
    public CreatePatientAllergyDtoValidator()
    {
        RuleFor(x => x.AllergenType)
            .NotEmpty().WithMessage("Allergen type is required")
            .MaximumLength(50).WithMessage("Allergen type cannot exceed 50 characters")
            .Must(at => new[] { "medication", "food", "environmental", "other" }.Contains(at.ToLower()))
            .WithMessage("Allergen type must be medication, food, environmental, or other");

        RuleFor(x => x.AllergenName)
            .NotEmpty().WithMessage("Allergen name is required")
            .MaximumLength(200).WithMessage("Allergen name cannot exceed 200 characters");

        RuleFor(x => x.Severity)
            .NotEmpty().WithMessage("Severity is required")
            .MaximumLength(50).WithMessage("Severity cannot exceed 50 characters")
            .Must(s => new[] { "mild", "moderate", "severe", "life-threatening" }.Contains(s.ToLower()))
            .WithMessage("Severity must be mild, moderate, severe, or life-threatening");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes cannot exceed 1000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));
    }
}

/// <summary>
/// Validator for SearchPatientsDto
/// </summary>
public class SearchPatientsDtoValidator : AbstractValidator<SearchPatientsDto>
{
    public SearchPatientsDtoValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThan(0).WithMessage("Page must be greater than 0");

        RuleFor(x => x.PageSize)
            .GreaterThan(0).WithMessage("Page size must be greater than 0")
            .LessThanOrEqualTo(100).WithMessage("Page size cannot exceed 100");

        RuleFor(x => x.SortBy)
            .Must(sb => sb == null || new[] { "LastName", "FirstName", "IdentificationNumber", "DateOfBirth", "CreatedAt" }.Contains(sb))
            .WithMessage("Sort by must be LastName, FirstName, IdentificationNumber, DateOfBirth, or CreatedAt")
            .When(x => !string.IsNullOrWhiteSpace(x.SortBy));

        RuleFor(x => x.SortDirection)
            .Must(sd => sd == null || new[] { "asc", "desc" }.Contains(sd.ToLower()))
            .WithMessage("Sort direction must be asc or desc")
            .When(x => !string.IsNullOrWhiteSpace(x.SortDirection));

        RuleFor(x => x.DateOfBirthFrom)
            .LessThan(x => x.DateOfBirthTo)
            .WithMessage("Date of birth from must be before date of birth to")
            .When(x => x.DateOfBirthFrom.HasValue && x.DateOfBirthTo.HasValue);
    }
}
