using MediatR;
using AutoMapper;
using Microsoft.Extensions.Logging;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using EPrescription.Application.Queries.Dispensations;

namespace EPrescription.Application.Queries.Dispensations;

public class GetDispensationQueryHandler : IRequestHandler<GetDispensationQuery, DispensationDto>
{
    private readonly IDispensationRepository _dispensationRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetDispensationQueryHandler> _logger;

    public GetDispensationQueryHandler(
        IDispensationRepository dispensationRepository,
        IMapper mapper,
        ILogger<GetDispensationQueryHandler> logger)
    {
        _dispensationRepository = dispensationRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<DispensationDto> Handle(GetDispensationQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting dispensation {DispensationId}", request.DispensationId);

        // Get dispensation with all related data
        var dispensation = await _dispensationRepository.GetWithDetailsAsync(request.DispensationId, cancellationToken);

        if (dispensation == null)
        {
            _logger.LogWarning("Dispensation {DispensationId} not found", request.DispensationId);
            throw new KeyNotFoundException($"Dispensation with ID {request.DispensationId} not found");
        }

        // Map to DTO
        var result = _mapper.Map<DispensationDto>(dispensation);

        // Manually set related data
        if (dispensation.Prescription != null)
        {
            result.Prescription = _mapper.Map<PrescriptionSummaryDto>(dispensation.Prescription);
        }

        if (dispensation.Pharmacy != null)
        {
            result.Pharmacy = _mapper.Map<PharmacySummaryDto>(dispensation.Pharmacy);
        }

        if (dispensation.Pharmacist != null)
        {
            result.Pharmacist = _mapper.Map<UserSummaryDto>(dispensation.Pharmacist);
        }

        _logger.LogInformation("Successfully retrieved dispensation {DispensationId}", request.DispensationId);

        return result;
    }
}
