using MediatR;
using AutoMapper;
using Microsoft.Extensions.Logging;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using EPrescription.Application.Commands.Dispensations;

namespace EPrescription.Application.Commands.Dispensations;

public class VerifyDispensationCommandHandler : IRequestHandler<VerifyDispensationCommand, DispensationDto>
{
    private readonly IDispensationRepository _dispensationRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<VerifyDispensationCommandHandler> _logger;

    public VerifyDispensationCommandHandler(
        IDispensationRepository dispensationRepository,
        IMapper mapper,
        ILogger<VerifyDispensationCommandHandler> logger)
    {
        _dispensationRepository = dispensationRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<DispensationDto> Handle(VerifyDispensationCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Verifying dispensation {DispensationId}", request.DispensationId);

        // 1. Get dispensation with all related data
        var dispensation = await _dispensationRepository.GetWithDetailsAsync(request.DispensationId, cancellationToken);
        
        if (dispensation == null)
        {
            _logger.LogWarning("Dispensation {DispensationId} not found", request.DispensationId);
            throw new ArgumentException($"Dispensation with ID {request.DispensationId} not found");
        }

        // 2. Validate current status
        if (dispensation.Status != "pending")
        {
            _logger.LogWarning("Dispensation {DispensationId} cannot be verified. Current status: {Status}", 
                request.DispensationId, dispensation.Status);
            throw new InvalidOperationException(
                $"Dispensation {request.DispensationId} cannot be verified. Current status: {dispensation.Status}");
        }

        // 3. Verify the dispensation
        dispensation.Verify(request.Notes);

        // 4. Save changes
        _dispensationRepository.Update(dispensation);

        _logger.LogInformation("Dispensation {DispensationId} verified successfully", request.DispensationId);

        // 5. Reload with complete data
        var updatedDispensation = await _dispensationRepository.GetWithDetailsAsync(request.DispensationId, cancellationToken);

        // 6. Map to DTO
        var result = _mapper.Map<DispensationDto>(updatedDispensation);
        
        // 7. Manually set related data
        if (updatedDispensation?.Prescription != null)
        {
            result.Prescription = _mapper.Map<PrescriptionSummaryDto>(updatedDispensation.Prescription);
        }
        
        if (updatedDispensation?.Pharmacy != null)
        {
            result.Pharmacy = _mapper.Map<PharmacySummaryDto>(updatedDispensation.Pharmacy);
        }
        
        if (updatedDispensation?.Pharmacist != null)
        {
            result.Pharmacist = _mapper.Map<UserSummaryDto>(updatedDispensation.Pharmacist);
        }

        return result;
    }
}
