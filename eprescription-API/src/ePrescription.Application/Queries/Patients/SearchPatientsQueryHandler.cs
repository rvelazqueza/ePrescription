using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace EPrescription.Application.Queries.Patients;

public class SearchPatientsQueryHandler : IRequestHandler<SearchPatientsQuery, PaginatedResult<PatientListDto>>
{
    private readonly IRepository<Patient> _patientRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<SearchPatientsQueryHandler> _logger;

    public SearchPatientsQueryHandler(
        IRepository<Patient> patientRepository,
        IMapper mapper,
        ILogger<SearchPatientsQueryHandler> logger)
    {
        _patientRepository = patientRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PaginatedResult<PatientListDto>> Handle(
        SearchPatientsQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var criteria = request.SearchCriteria;

            _logger.LogInformation(
                "Searching patients - SearchTerm: {SearchTerm}, Gender: {Gender}, Page: {Page}, PageSize: {PageSize}",
                criteria.SearchTerm,
                criteria.Gender,
                criteria.Page,
                criteria.PageSize);

            // Build filter expression
            Expression<Func<Patient, bool>> filter = p => true;

            if (!string.IsNullOrWhiteSpace(criteria.IdentificationNumber))
            {
                filter = CombineExpressions(filter, p => p.IdentificationNumber.Contains(criteria.IdentificationNumber));
            }

            if (!string.IsNullOrWhiteSpace(criteria.FirstName))
            {
                filter = CombineExpressions(filter, p => p.FirstName.Contains(criteria.FirstName));
            }

            if (!string.IsNullOrWhiteSpace(criteria.LastName))
            {
                filter = CombineExpressions(filter, p => p.LastName.Contains(criteria.LastName));
            }

            if (!string.IsNullOrWhiteSpace(criteria.Gender))
            {
                filter = CombineExpressions(filter, p => p.Gender == criteria.Gender);
            }

            if (!string.IsNullOrWhiteSpace(criteria.BloodType))
            {
                filter = CombineExpressions(filter, p => p.BloodType == criteria.BloodType);
            }

            if (criteria.DateOfBirthFrom.HasValue)
            {
                filter = CombineExpressions(filter, p => p.DateOfBirth >= criteria.DateOfBirthFrom.Value);
            }

            if (criteria.DateOfBirthTo.HasValue)
            {
                filter = CombineExpressions(filter, p => p.DateOfBirth <= criteria.DateOfBirthTo.Value);
            }

            // Search term (searches across name and identification number)
            if (!string.IsNullOrWhiteSpace(criteria.SearchTerm))
            {
                var searchTerm = criteria.SearchTerm.ToLower();
                filter = CombineExpressions(filter, p =>
                    p.FirstName.ToLower().Contains(searchTerm) ||
                    p.LastName.ToLower().Contains(searchTerm) ||
                    p.IdentificationNumber.ToLower().Contains(searchTerm));
            }

            // Get all matching patients
            var allPatients = await _patientRepository.FindAsync(filter, cancellationToken);

            // Apply sorting
            var sortedPatients = ApplySorting(allPatients.AsQueryable(), criteria.SortBy, criteria.SortDirection);

            // Get total count
            var totalCount = sortedPatients.Count();

            // Apply pagination
            var paginatedPatients = sortedPatients
                .Skip((criteria.Page - 1) * criteria.PageSize)
                .Take(criteria.PageSize)
                .ToList();

            // Map to DTOs
            var dtos = _mapper.Map<List<PatientListDto>>(paginatedPatients);

            var result = new PaginatedResult<PatientListDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                Page = criteria.Page,
                PageSize = criteria.PageSize
            };

            _logger.LogInformation("Found {Count} patients (Total: {Total})", dtos.Count, totalCount);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching patients");
            throw;
        }
    }

    private Expression<Func<Patient, bool>> CombineExpressions(
        Expression<Func<Patient, bool>> expr1,
        Expression<Func<Patient, bool>> expr2)
    {
        var parameter = Expression.Parameter(typeof(Patient));
        var combined = Expression.AndAlso(
            Expression.Invoke(expr1, parameter),
            Expression.Invoke(expr2, parameter));
        return Expression.Lambda<Func<Patient, bool>>(combined, parameter);
    }

    private IQueryable<Patient> ApplySorting(IQueryable<Patient> query, string? sortBy, string? sortDirection)
    {
        var isDescending = sortDirection?.ToLower() == "desc";

        return sortBy?.ToLower() switch
        {
            "firstname" => isDescending ? query.OrderByDescending(p => p.FirstName) : query.OrderBy(p => p.FirstName),
            "identificationnumber" => isDescending ? query.OrderByDescending(p => p.IdentificationNumber) : query.OrderBy(p => p.IdentificationNumber),
            "dateofbirth" => isDescending ? query.OrderByDescending(p => p.DateOfBirth) : query.OrderBy(p => p.DateOfBirth),
            "createdat" => isDescending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt),
            _ => isDescending ? query.OrderByDescending(p => p.LastName) : query.OrderBy(p => p.LastName) // Default: LastName
        };
    }
}
