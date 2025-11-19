using AutoMapper;
using MediatR;
using ePrescription.Application.DTOs;
using ePrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace ePrescription.Application.Queries.Prescriptions;

public class SearchPrescriptionsQueryHandler : IRequestHandler<SearchPrescriptionsQuery, PaginatedResult<PrescriptionListDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<SearchPrescriptionsQueryHandler> _logger;

    public SearchPrescriptionsQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<SearchPrescriptionsQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PaginatedResult<PrescriptionListDto>> Handle(
        SearchPrescriptionsQuery request, 
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Searching prescriptions with criteria: {@SearchCriteria}", request.SearchCriteria);

            // Start with all prescriptions
            IEnumerable<Prescription> prescriptions = await _unitOfWork.Prescriptions.GetAllAsync(cancellationToken);

            // Apply filters
            if (request.SearchCriteria.PatientId.HasValue)
            {
                prescriptions = await _unitOfWork.Prescriptions.GetByPatientAsync(
                    request.SearchCriteria.PatientId.Value, 
                    cancellationToken);
            }

            if (request.SearchCriteria.DoctorId.HasValue)
            {
                var doctorPrescriptions = await _unitOfWork.Prescriptions.GetByDoctorAsync(
                    request.SearchCriteria.DoctorId.Value, 
                    cancellationToken);
                prescriptions = prescriptions.Intersect(doctorPrescriptions);
            }

            if (request.SearchCriteria.PharmacyId.HasValue)
            {
                prescriptions = prescriptions.Where(p => p.PharmacyId == request.SearchCriteria.PharmacyId.Value);
            }

            if (!string.IsNullOrEmpty(request.SearchCriteria.Status))
            {
                prescriptions = prescriptions.Where(p => p.Status == request.SearchCriteria.Status);
            }

            if (request.SearchCriteria.FromDate.HasValue)
            {
                prescriptions = prescriptions.Where(p => p.PrescriptionDate >= request.SearchCriteria.FromDate.Value);
            }

            if (request.SearchCriteria.ToDate.HasValue)
            {
                prescriptions = prescriptions.Where(p => p.PrescriptionDate <= request.SearchCriteria.ToDate.Value);
            }

            if (request.SearchCriteria.IsEmergency.HasValue)
            {
                prescriptions = prescriptions.Where(p => p.IsEmergency == request.SearchCriteria.IsEmergency.Value);
            }

            if (request.SearchCriteria.RequiresAuthorization.HasValue)
            {
                prescriptions = prescriptions.Where(p => p.RequiresAuthorization == request.SearchCriteria.RequiresAuthorization.Value);
            }

            if (!string.IsNullOrEmpty(request.SearchCriteria.MedicationName))
            {
                prescriptions = prescriptions.Where(p => 
                    p.Medications.Any(m => 
                        m.MedicationName.Contains(request.SearchCriteria.MedicationName, StringComparison.OrdinalIgnoreCase)));
            }

            if (!string.IsNullOrEmpty(request.SearchCriteria.DiagnosisCode))
            {
                prescriptions = prescriptions.Where(p => 
                    p.Diagnoses.Any(d => d.DiagnosisCode == request.SearchCriteria.DiagnosisCode));
            }

            // Get total count before pagination
            var totalCount = prescriptions.Count();

            // Apply sorting
            prescriptions = ApplySorting(prescriptions, request.SearchCriteria.SortBy, request.SearchCriteria.SortDirection);

            // Apply pagination
            var skip = (request.SearchCriteria.Page - 1) * request.SearchCriteria.PageSize;
            var pagedPrescriptions = prescriptions
                .Skip(skip)
                .Take(request.SearchCriteria.PageSize)
                .ToList();

            // Map to DTOs
            var prescriptionDtos = _mapper.Map<List<PrescriptionListDto>>(pagedPrescriptions);

            var result = new PaginatedResult<PrescriptionListDto>
            {
                Items = prescriptionDtos,
                TotalCount = totalCount,
                Page = request.SearchCriteria.Page,
                PageSize = request.SearchCriteria.PageSize
            };

            _logger.LogInformation("Found {TotalCount} prescriptions, returning page {Page} of {TotalPages}", 
                totalCount, result.Page, result.TotalPages);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching prescriptions");
            throw;
        }
    }

    private IEnumerable<Prescription> ApplySorting(
        IEnumerable<Prescription> prescriptions, 
        string? sortBy, 
        string? sortDirection)
    {
        var isDescending = sortDirection?.ToLower() == "desc";

        return sortBy?.ToLower() switch
        {
            "prescriptiondate" => isDescending 
                ? prescriptions.OrderByDescending(p => p.PrescriptionDate)
                : prescriptions.OrderBy(p => p.PrescriptionDate),
            
            "createdat" => isDescending
                ? prescriptions.OrderByDescending(p => p.CreatedAt)
                : prescriptions.OrderBy(p => p.CreatedAt),
            
            "status" => isDescending
                ? prescriptions.OrderByDescending(p => p.Status)
                : prescriptions.OrderBy(p => p.Status),
            
            "patientname" => isDescending
                ? prescriptions.OrderByDescending(p => $"{p.Patient.FirstName} {p.Patient.LastName}")
                : prescriptions.OrderBy(p => $"{p.Patient.FirstName} {p.Patient.LastName}"),
            
            "doctorname" => isDescending
                ? prescriptions.OrderByDescending(p => $"{p.Doctor.FirstName} {p.Doctor.LastName}")
                : prescriptions.OrderBy(p => $"{p.Doctor.FirstName} {p.Doctor.LastName}"),
            
            "expirationdate" => isDescending
                ? prescriptions.OrderByDescending(p => p.ExpirationDate)
                : prescriptions.OrderBy(p => p.ExpirationDate),
            
            _ => isDescending
                ? prescriptions.OrderByDescending(p => p.PrescriptionDate)
                : prescriptions.OrderBy(p => p.PrescriptionDate)
        };
    }
}
