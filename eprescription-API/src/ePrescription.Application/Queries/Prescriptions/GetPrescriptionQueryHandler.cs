using AutoMapper;
using MediatR;
using ePrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace ePrescription.Application.Queries.Prescriptions;

public class GetPrescriptionQueryHandler : IRequestHandler<GetPrescriptionQuery, PrescriptionDto?>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<GetPrescriptionQueryHandler> _logger;

    public GetPrescriptionQueryHandler(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<GetPrescriptionQueryHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PrescriptionDto?> Handle(GetPrescriptionQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Getting prescription {PrescriptionId}", request.PrescriptionId);

            // Get prescription with all related data
            var prescription = await _unitOfWork.Prescriptions.GetWithDetailsAsync(
                request.PrescriptionId, 
                cancellationToken);

            if (prescription == null)
            {
                _logger.LogWarning("Prescription {PrescriptionId} not found", request.PrescriptionId);
                return null;
            }

            // Map to DTO
            var result = _mapper.Map<PrescriptionDto>(prescription);

            _logger.LogInformation("Successfully retrieved prescription {PrescriptionNumber}", prescription.PrescriptionNumber);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting prescription {PrescriptionId}", request.PrescriptionId);
            throw;
        }
    }
}
