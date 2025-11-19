using FluentValidation;
using ePrescription.Application.DTOs;

namespace ePrescription.Application.Validators;

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
            .MaximumLength(1000)
            .WithMessage("Notes cannot exceed 1000 characters");
            
        RuleFor(x => x.Instructions)
            .MaximumLength(500)
            .WithMessage("Instructions cannot exceed 500 characters");
            
        RuleFor(x => x.AuthorizationReason)
            .MaximumLength(200)
            .WithMessage("Authorization reason cannot exceed 200 characters")
            .NotEmpty()
            .WithMessage("Authorization reason is required when authorization is needed")
            .When(x => x.RequiresAuthorization);
            
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
            
        // Business validation: maximum 10 medications per prescription
        RuleFor(x => x.Medications)
            .Must(medications => medications == null || medications.Count <= 10)
            .WithMessage("Maximum 10 medications allowed per prescription");
            
        // Business validation: maximum 5 diagnoses per prescription
        RuleFor(x => x.Diagnoses)
            .Must(diagnoses => diagnoses == null || diagnoses.Count <= 5)
            .WithMessage("Maximum 5 diagnoses allowed per prescription");
            
        // Business validation: at least one primary diagnosis
        RuleFor(x => x.Diagnoses)
            .Must(diagnoses => diagnoses != null && diagnoses.Any(d => d.IsPrimary))
            .WithMessage("At least one primary diagnosis is required")
            .When(x => x.Diagnoses != null && x.Diagnoses.Count > 1);
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
                          new[] { "Draft", "Active", "Dispensed", "Expired", "Cancelled" }.Contains(status))
            .WithMessage("Status must be one of: Draft, Active, Dispensed, Expired, Cancelled");
            
        RuleFor(x => x.Notes)
            .MaximumLength(1000)
            .WithMessage("Notes cannot exceed 1000 characters");
            
        RuleFor(x => x.Instructions)
            .MaximumLength(500)
            .WithMessage("Instructions cannot exceed 500 characters");
            
        RuleFor(x => x.AuthorizationReason)
            .MaximumLength(200)
            .WithMessage("Authorization reason cannot exceed 200 characters")
            .NotEmpty()
            .WithMessage("Authorization reason is required when authorization is needed")
            .When(x => x.RequiresAuthorization == true);
            
        RuleFor(x => x.AuthorizedDate)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("Authorization date cannot be in the future")
            .When(x => x.AuthorizedDate.HasValue);
            
        RuleFor(x => x.AuthorizedBy)
            .NotEmpty()
            .WithMessage("Authorized by is required when authorization date is provided")
            .When(x => x.AuthorizedDate.HasValue);
            
        RuleForEach(x => x.Medications)
            .SetValidator(new CreatePrescriptionMedicationValidator())
            .When(x => x.Medications != null);
            
        RuleForEach(x => x.Diagnoses)
            .SetValidator(new CreatePrescriptionDiagnosisValidator())
            .When(x => x.Diagnoses != null);
            
        // Business validation: maximum 10 medications per prescription
        RuleFor(x => x.Medications)
            .Must(medications => medications == null || medications.Count <= 10)
            .WithMessage("Maximum 10 medications allowed per prescription")
            .When(x => x.Medications != null);
            
        // Business validation: maximum 5 diagnoses per prescription
        RuleFor(x => x.Diagnoses)
            .Must(diagnoses => diagnoses == null || diagnoses.Count <= 5)
            .WithMessage("Maximum 5 diagnoses allowed per prescription")
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
            
        RuleFor(x => x.MedicationName)
            .NotEmpty()
            .WithMessage("Medication name is required")
            .MaximumLength(100)
            .WithMessage("Medication name cannot exceed 100 characters");
            
        RuleFor(x => x.Dosage)
            .NotEmpty()
            .WithMessage("Dosage is required")
            .MaximumLength(50)
            .WithMessage("Dosage cannot exceed 50 characters");
            
        RuleFor(x => x.Frequency)
            .NotEmpty()
            .WithMessage("Frequency is required")
            .MaximumLength(100)
            .WithMessage("Frequency cannot exceed 100 characters");
            
        RuleFor(x => x.Duration)
            .GreaterThan(0)
            .WithMessage("Duration must be greater than 0")
            .LessThanOrEqualTo(365)
            .WithMessage("Duration cannot exceed 365 days");
            
        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("Quantity must be greater than 0")
            .LessThanOrEqualTo(1000)
            .WithMessage("Quantity cannot exceed 1000");
            
        RuleFor(x => x.Unit)
            .MaximumLength(50)
            .WithMessage("Unit cannot exceed 50 characters");
            
        RuleFor(x => x.Instructions)
            .MaximumLength(500)
            .WithMessage("Instructions cannot exceed 500 characters");
    }
}

public class CreatePrescriptionDiagnosisValidator : AbstractValidator<CreatePrescriptionDiagnosisDto>
{
    public CreatePrescriptionDiagnosisValidator()
    {
        RuleFor(x => x.DiagnosisCode)
            .NotEmpty()
            .WithMessage("Diagnosis code is required")
            .MaximumLength(10)
            .WithMessage("Diagnosis code cannot exceed 10 characters")
            .Matches(@"^[A-Z][0-9]{2}(\.[0-9]{1,2})?$")
            .WithMessage("Diagnosis code must be in valid ICD-10 format (e.g., 'A01', 'B15.9', 'C78.1')");
            
        RuleFor(x => x.DiagnosisDescription)
            .NotEmpty()
            .WithMessage("Diagnosis description is required")
            .MaximumLength(500)
            .WithMessage("Diagnosis description cannot exceed 500 characters")
            .MinimumLength(5)
            .WithMessage("Diagnosis description must be at least 5 characters");
            
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
                          new[] { "Draft", "Active", "Dispensed", "Expired", "Cancelled" }.Contains(status))
            .WithMessage("Status must be one of: Draft, Active, Dispensed, Expired, Cancelled");
            
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
                           new[] { "PrescriptionDate", "CreatedAt", "Status", "PatientName", "DoctorName", "ExpirationDate" }.Contains(sortBy))
            .WithMessage("SortBy must be one of: PrescriptionDate, CreatedAt, Status, PatientName, DoctorName, ExpirationDate");
            
        RuleFor(x => x.SortDirection)
            .Must(sortDirection => string.IsNullOrEmpty(sortDirection) || 
                                  new[] { "asc", "desc" }.Contains(sortDirection.ToLower()))
            .WithMessage("SortDirection must be 'asc' or 'desc'");
            
        RuleFor(x => x.MedicationName)
            .MaximumLength(100)
            .WithMessage("Medication name cannot exceed 100 characters");
            
        RuleFor(x => x.DiagnosisCode)
            .MaximumLength(10)
            .WithMessage("Diagnosis code cannot exceed 10 characters")
            .Matches(@"^[A-Z][0-9]{2}(\.[0-9]{1,2})?$")
            .WithMessage("Diagnosis code must be in valid ICD-10 format")
            .When(x => !string.IsNullOrEmpty(x.DiagnosisCode));
    }
}
