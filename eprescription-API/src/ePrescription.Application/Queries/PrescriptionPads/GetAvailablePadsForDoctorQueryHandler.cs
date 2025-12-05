using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Queries.PrescriptionPads;

/// <summary>
/// Handler for GetAvailablePadsForDoctorQuery
/// Retrieves available prescription pads for a specific doctor
/// </summary>
public class GetAvailablePadsForDoctorQueryHandler : IRequestHandler<GetAvailablePadsForDoctorQuery, AvailablePadsResponseDto>
{
    private readonly IPrescriptionPadRepository _padRepository;
    private readonly IPrescriptionSlipRepository _slipRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetAvailablePadsForDoctorQueryHandler> _logger;

    public GetAvailablePadsForDoctorQueryHandler(
        IPrescriptionPadRepository padRepository,
        IPrescriptionSlipRepository slipRepository,
        IMapper mapper,
        ILogger<GetAvailablePadsForDoctorQueryHandler> logger)
    {
        _padRepository = padRepository;
        _slipRepository = slipRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<AvailablePadsResponseDto> Handle(
        GetAvailablePadsForDoctorQuery request,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting available pads for doctor - DoctorId: {DoctorId}, PadTypeId: {PadTypeId}",
            request.DoctorId, request.PadTypeId ?? Guid.Empty);

        // Get available pads
        IEnumerable<EPrescription.Domain.Entities.PrescriptionPad> pads;

        if (request.PadTypeId.HasValue)
        {
            pads = await _padRepository.GetPadsByDoctorAndTypeAsync(
                request.DoctorId,
                request.PadTypeId.Value,
                cancellationToken);
        }
        else
        {
            pads = await _padRepository.GetAvailablePadsForDoctorAsync(
                request.DoctorId,
                cancellationToken);
        }

        // Get slip statistics
        var (totalSlips, usedSlips, availableSlips) = await _slipRepository.GetSlipStatisticsForDoctorAsync(
            request.DoctorId,
            cancellationToken);

        // Map to DTOs
        var padDtos = _mapper.Map<List<PrescriptionPadDto>>(pads);

        var response = new AvailablePadsResponseDto
        {
            DoctorId = request.DoctorId,
            Pads = padDtos,
            TotalAvailable = pads.Sum(p => p.AvailableCount),
            TotalSlips = availableSlips
        };

        _logger.LogInformation("Found {PadCount} available pads for doctor {DoctorId}",
            response.Pads.Count, request.DoctorId);

        return response;
    }
}
