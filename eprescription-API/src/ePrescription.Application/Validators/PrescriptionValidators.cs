using FluentValidation;
using EPrescription.Application.DTOs;

namespace EPrescription.Application.Validators;

public class CreatePrescriptionValidator : AbstractValidator<CreatePrescriptionDto>
{
    public CreatePrescriptionValidator()
    {
        RuleFor(x => x.PatientId)
            .NotEmpty()
            .WithMessage("Patient ID is required");
            
        RuleFor(x => x.DoctorId)
            .NotEmpty()
            .WithMessage("Doctor ID is required");
            
        RuleFor(x => x.MedicalCenterId)
            .NotEmpty()
            .WithMessage("Medical Center ID is required");
            
        RuleFor(x => x.PrescriptionDate)
            .NotEmpty()
            .WithMessage("Prescription date is required")
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("Prescription date cannot be in the future");
            
        RuleFor(x => x.ExpirationDate)
            .GreaterThan(x => x.PrescriptionDate)
            .WithMessage("Expiration date must be after prescription date")
            .When(x => x.ExpirationDate.HasValue);
            
        RuleFor(x => x.Notes)
            .MaximumLength(2000)
            .WithMessage("Notes cannot exceed 2000 characters");
            
        RuleFor(x => x.Medications)
            .NotEmpty()
            .WithMessage("At least one medication is required")
            .Must(medications => medications != null && medications.Count > 0)
            .WithMessage("At least one medication is required");
            
        RuleForEach(x => x.Medications)
            .SetValidator(new CreatePrescriptionMedicationValidator());
            
        RuleFor(x => x.Diagnoses)
            .NotEmpty()
            .WithMessage("At least one diagnosis is required")
            .Must(diagnoses => diagnoses != null && diagnoses.Count > 0)
            .WithMessage("At least one diagnosis is required");
            
        RuleForEach(x => x.Diagnoses)
            .SetValidator(new CreatePrescriptionDiagnosisValidator());
    }
}

public class UpdatePrescriptionValidator : AbstractValidator<UpdatePrescriptionDto>
{
    public UpdatePrescriptionValidator()
    {
        RuleFor(x => x.ExpirationDate)
            .GreaterThan(DateTime.UtcNow.Date)
            .WithMessage("Expiration date must be in the future")
            .When(x => x.ExpirationDate.HasValue);
            
        RuleFor(x => x.Status)
            .Must(status => string.IsNullOrEmpty(status) || 
                          new[] { "active", "dispensed", "expired", "cancelled" }.Contains(status))
            .WithMessage("Status must be one of: active, dispensed, expired, cancelled");
            
        RuleFor(x => x.Notes)
            .MaximumLength(2000)
            .WithMessage("Notes cannot exceed 2000 characters");
            
        RuleForEach(x => x.Medications)
            .SetValidator(new CreatePrescriptionMedicationValidator())
            .When(x => x.Medications != null);
            
        RuleForEach(x => x.Diagnoses)
            .SetValidator(new CreatePrescriptionDiagnosisValidator())
            .When(x => x.Diagnoses != null);
    }
}

public class CreatePrescriptionMedicationValidator : AbstractValidator<CreatePrescriptionMedicationDto>
{
    public CreatePrescriptionMedicationValidator()
    {
        RuleFor(x => x.MedicationId)
            .NotEmpty()
            .WithMessage("Medication ID is required");
            
        RuleFor(x => x.Dosage)
            .NotEmpty()
            .WithMessage("Dosage is required")
            .MaximumLength(100)
            .WithMessage("Dosage cannot exceed 100 characters");
            
        RuleFor(x => x.Frequency)
            .NotEmpty()
            .WithMessage("Frequency is required")
            .MaximumLength(200)
            .WithMessage("Frequency cannot exceed 200 characters");
            
        RuleFor(x => x.DurationDays)
            .GreaterThan(0)
            .WithMessage("Duration must be greater than 0")
            .LessThanOrEqualTo(365)
            .WithMessage("Duration cannot exceed 365 days");
            
        RuleFor(x => x.AdministrationRouteId)
            .NotEmpty()
            .WithMessage("Administration route is required");
            
        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("Quantity must be greater than 0")
            .LessThanOrEqualTo(10000)
            .WithMessage("Quantity cannot exceed 10000");
            
        RuleFor(x => x.Instructions)
            .MaximumLength(1000)
            .WithMessage("Instructions cannot exceed 1000 characters");
    }
}

public class CreatePrescriptionDiagnosisValidator : AbstractValidator<CreatePrescriptionDiagnosisDto>
{
    public CreatePrescriptionDiagnosisValidator()
    {
        RuleFor(x => x.Cie10Code)
            .NotEmpty()
            .WithMessage("CIE-10 code is required")
            .MaximumLength(10)
            .WithMessage("CIE-10 code cannot exceed 10 characters");
            
        RuleFor(x => x.Notes)
            .MaximumLength(1000)
            .WithMessage("Notes cannot exceed 1000 characters");
    }
}

public class SearchPrescriptionsValidator : AbstractValidator<SearchPrescriptionsDto>
{
    public SearchPrescriptionsValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThan(0)
            .WithMessage("Page must be greater than 0");
            
        RuleFor(x => x.PageSize)
            .GreaterThan(0)
            .WithMessage("Page size must be greater than 0")
            .LessThanOrEqualTo(100)
            .WithMessage("Page size cannot exceed 100");
            
        RuleFor(x => x.Status)
            .Must(status => string.IsNullOrEmpty(status) || 
                          new[] { "active", "dispensed", "expired", "cancelled" }.Contains(status))
            .WithMessage("Status must be one of: active, dispensed, expired, cancelled");
            
        RuleFor(x => x.FromDate)
            .LessThanOrEqualTo(x => x.ToDate)
            .WithMessage("From date must be less than or equal to To date")
            .When(x => x.FromDate.HasValue && x.ToDate.HasValue);
            
        RuleFor(x => x.ToDate)
            .LessThanOrEqualTo(DateTime.UtcNow.Date.AddDays(1))
            .WithMessage("To date cannot be in the future")
            .When(x => x.ToDate.HasValue);
            
        RuleFor(x => x.SortBy)
            .Must(sortBy => string.IsNullOrEmpty(sortBy) || 
                           new[] { "PrescriptionDate", "CreatedAt", "Status" }.Contains(sortBy))
            .WithMessage("SortBy must be one of: PrescriptionDate, CreatedAt, Status");
            
        RuleFor(x => x.SortDirection)
            .Must(sortDirection => string.IsNullOrEmpty(sortDirection) || 
                                  new[] { "asc", "desc" }.Contains(sortDirection.ToLower()))
            .WithMessage("SortDirection must be 'asc' or 'desc'");
            
        RuleFor(x => x.Cie10Code)
            .MaximumLength(10)
            .WithMessage("CIE-10 code cannot exceed 10 characters")
            .When(x => !string.IsNullOrEmpty(x.Cie10Code));
    }
}
