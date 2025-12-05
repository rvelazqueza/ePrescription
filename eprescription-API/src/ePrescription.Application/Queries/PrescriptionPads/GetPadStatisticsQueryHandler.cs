using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Queries.PrescriptionPads;

/// <summary>
/// Handler for GetPadStatisticsQuery
/// Retrieves pad and slip statistics for a doctor
/// </summary>
public class GetPadStatisticsQueryHandler : IRequestHandler<GetPadStatisticsQuery, PadStatisticsDto>
{
    private readonly IPrescriptionPadRepository _padRepository;
    private readonly IPrescriptionSlipRepository _slipRepository;
    private readonly ILogger<GetPadStatisticsQueryHandler> _logger;

    public GetPadStatisticsQueryHandler(
        IPrescriptionPadRepository padRepository,
        IPrescriptionSlipRepository slipRepository,
        ILogger<GetPadStatisticsQueryHandler> logger)
    {
        _padRepository = padRepository;
        _slipRepository = slipRepository;
        _logger = logger;
    }

    public async Task<PadStatisticsDto> Handle(
        GetPadStatisticsQuery request,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting pad statistics for doctor - DoctorId: {DoctorId}", request.DoctorId);

        // Get all pads for doctor
        var allPads = await _padRepository.GetPadsForDoctorPagedAsync(
            request.DoctorId,
            pageNumber: 1,
            pageSize: 1000,
            cancellationToken);

        var pads = allPads.Items.ToList();

        // Get expiring pads
        var expiringPads = await _padRepository.GetExpiringPadsAsync(
            daysUntilExpiration: 30,
            cancellationToken);
        var expiringCount = expiringPads.Count(p => p.DoctorId == request.DoctorId);

        // Get low availability pads
        var lowAvailabilityPads = await _padRepository.GetLowAvailabilityPadsAsync(
            threshold: 10,
            cancellationToken);
        var lowAvailabilityCount = lowAvailabilityPads.Count(p => p.DoctorId == request.DoctorId);

        // Get slip statistics
        var (totalSlips, usedSlips, availableSlips) = await _slipRepository.GetSlipStatisticsForDoctorAsync(
            request.DoctorId,
            cancellationToken);

        var usagePercentage = totalSlips > 0 ? (decimal)usedSlips / totalSlips * 100 : 0;

        var statistics = new PadStatisticsDto
        {
            DoctorId = request.DoctorId,
            TotalPads = pads.Count,
            ActivePads = pads.Count(p => p.ExpirationDate > DateTime.UtcNow),
            ExpiringPads = expiringCount,
            LowAvailabilityPads = lowAvailabilityCount,
            TotalSlips = totalSlips,
            UsedSlips = usedSlips,
            AvailableSlips = availableSlips,
            UsagePercentage = usagePercentage
        };

        _logger.LogInformation(
            "Pad statistics for doctor {DoctorId}: Total={Total}, Active={Active}, Expiring={Expiring}, LowAvail={LowAvail}, Usage={Usage}%",
            request.DoctorId, statistics.TotalPads, statistics.ActivePads, statistics.ExpiringPads,
            statistics.LowAvailabilityPads, statistics.UsagePercentage);

        return statistics;
    }
}
