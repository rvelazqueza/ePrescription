using AutoMapper;
using MediatR;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Queries.Prescriptions;

public class GetPrescriptionQueryHandler : IRequestHandler<GetPrescriptionQuery, PrescriptionDto?>
{
    private readonly IPrescriptionRepository _prescriptionRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetPrescriptionQueryHandler> _logger;

    public GetPrescriptionQueryHandler(
        IPrescriptionRepository prescriptionRepository,
        IMapper mapper,
        ILogger<GetPrescriptionQueryHandler> logger)
    {
        _prescriptionRepository = prescriptionRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PrescriptionDto?> Handle(GetPrescriptionQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Getting prescription {PrescriptionId}", request.PrescriptionId);

            var prescription = await _prescriptionRepository.GetByIdAsync(request.PrescriptionId, cancellationToken);

            if (prescription == null)
            {
                _logger.LogWarning("Prescription {PrescriptionId} not found", request.PrescriptionId);
                return null;
            }

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
