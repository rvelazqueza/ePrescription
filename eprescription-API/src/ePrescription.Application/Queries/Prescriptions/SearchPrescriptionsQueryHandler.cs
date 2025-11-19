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
            _logger.LogInformation("Searching prescriptions - returning empty result for now");

            // Simplified implementation - return empty result
            var result = new PaginatedResult<PrescriptionListDto>
            {
                Items = new List<PrescriptionListDto>(),
                TotalCount = 0,
                Page = request.SearchCriteria.Page,
                PageSize = request.SearchCriteria.PageSize
            };

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching prescriptions");
            throw;
        }
    }
}
