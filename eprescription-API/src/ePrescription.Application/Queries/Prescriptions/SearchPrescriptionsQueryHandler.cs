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
