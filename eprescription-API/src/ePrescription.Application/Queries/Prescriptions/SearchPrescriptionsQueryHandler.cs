using AutoMapper;
using MediatR;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Queries.Prescriptions;

public class SearchPrescriptionsQueryHandler : IRequestHandler<SearchPrescriptionsQuery, PaginatedResult<PrescriptionListDto>>
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<SearchPrescriptionsQueryHandler> _logger;

    public SearchPrescriptionsQueryHandler(
        IPrescriptionRepository prescriptionRepository,
        IMapper mapper,
        ILogger<SearchPrescriptionsQueryHandler> logger)
    {
        _prescriptionRepository = prescriptionRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PaginatedResult<PrescriptionListDto>> Handle(
        SearchPrescriptionsQuery request, 
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation(
                "Searching prescriptions - PatientId: {PatientId}, DoctorId: {DoctorId}, Status: {Status}, Page: {Page}, PageSize: {PageSize}",
                request.SearchCriteria.PatientId,
                request.SearchCriteria.DoctorId,
                request.SearchCriteria.Status,
                request.SearchCriteria.Page,
                request.SearchCriteria.PageSize);

            var (items, totalCount) = await _prescriptionRepository.SearchAsync(
                patientId: request.SearchCriteria.PatientId,
                doctorId: request.SearchCriteria.DoctorId,
                status: request.SearchCriteria.Status,
                startDate: request.SearchCriteria.FromDate,
                endDate: request.SearchCriteria.ToDate,
                page: request.SearchCriteria.Page,
                pageSize: request.SearchCriteria.PageSize,
                cancellationToken: cancellationToken);

            var dtos = _mapper.Map<List<PrescriptionListDto>>(items);

            // Load all medications and patients needed for this batch
            var medicationIds = items.SelectMany(p => p.Medications).Select(m => m.MedicationId).Distinct().ToList();
            var medications = medicationIds.Any() 
                ? await _prescriptionRepository.GetMedicationsByIdsAsync(medicationIds, cancellationToken)
                : new Dictionary<Guid, Medication>();

            var patientIds = items.Select(p => p.PatientId).Distinct().ToList();
            var patients = patientIds.Any()
                ? await _prescriptionRepository.GetPatientsByIdsAsync(patientIds, cancellationToken)
                : new Dictionary<Guid, Patient>();

            var doctorIds = items.Select(p => p.DoctorId).Distinct().ToList();
            var doctors = doctorIds.Any()
                ? await _prescriptionRepository.GetDoctorsByIdsAsync(doctorIds, cancellationToken)
                : new Dictionary<Guid, Doctor>();

            // Enrich DTOs with medication and diagnosis details
            foreach (var dto in dtos)
            {
                var prescription = items.FirstOrDefault(p => p.Id == dto.Id);
                if (prescription != null)
                {
                    dto.MedicationCount = prescription.Medications.Count;
                    dto.DiagnosisCount = prescription.Diagnoses.Count;

                    // Set patient data
                    if (patients.ContainsKey(prescription.PatientId))
                    {
                        var patient = patients[prescription.PatientId];
                        dto.PatientName = $"{patient.FirstName} {patient.LastName}".Trim();
                        dto.PatientIdNumber = patient.IdentificationNumber ?? string.Empty;
                        dto.PatientGender = patient.Gender ?? string.Empty;
                        
                        // Calculate age
                        if (patient.DateOfBirth != default)
                        {
                            var today = DateTime.Today;
                            var age = today.Year - patient.DateOfBirth.Year;
                            if (patient.DateOfBirth.Date > today.AddYears(-age))
                                age--;
                            dto.PatientAge = age;
                        }
                    }

                    // Set doctor data
                    if (doctors.ContainsKey(prescription.DoctorId))
                    {
                        var doctor = doctors[prescription.DoctorId];
                        dto.DoctorName = $"{doctor.FirstName} {doctor.LastName}".Trim();
                        dto.DoctorSpecialty = doctor.Specialty?.SpecialtyName ?? string.Empty;
                        dto.DoctorLicenseNumber = doctor.MedicalLicenseNumber ?? string.Empty;
                    }

                    // Map medications with names
                    dto.Medications = prescription.Medications.Select(pm => new PrescriptionMedicationDto
                    {
                        Id = pm.Id,
                        MedicationId = pm.MedicationId,
                        Dosage = pm.Dosage,
                        Frequency = pm.Frequency,
                        DurationDays = pm.DurationDays,
                        AdministrationRouteId = pm.AdministrationRouteId,
                        Quantity = pm.Quantity,
                        Instructions = pm.Instructions,
                        AiSuggested = pm.AiSuggested,
                        Medication = medications.ContainsKey(pm.MedicationId) ? new MedicationSummaryDto
                        {
                            Id = medications[pm.MedicationId].Id,
                            Name = medications[pm.MedicationId].CommercialName,
                            GenericName = medications[pm.MedicationId].GenericName,
                            Presentation = medications[pm.MedicationId].Presentation,
                            Concentration = medications[pm.MedicationId].Concentration
                        } : null,
                        AdministrationRoute = null
                    }).ToList();

                    // Map diagnoses
                    dto.Diagnoses = prescription.Diagnoses.Select(pd => new PrescriptionDiagnosisDto
                    {
                        Id = pd.Id,
                        Cie10Code = pd.DiagnosisCode,
                        Cie10Description = pd.DiagnosisDescription,
                        IsPrimary = pd.IsPrimary,
                        Notes = pd.Notes
                    }).ToList();
                }
            }

            var result = new PaginatedResult<PrescriptionListDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                Page = request.SearchCriteria.Page,
                PageSize = request.SearchCriteria.PageSize
            };

            _logger.LogInformation("Found {Count} prescriptions (Total: {Total})", dtos.Count, totalCount);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching prescriptions");
            throw;
        }
    }
}
