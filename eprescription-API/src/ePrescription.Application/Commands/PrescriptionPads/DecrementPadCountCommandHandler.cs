using AutoMapper;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace EPrescription.Application.Commands.PrescriptionPads;

/// <summary>
/// Handler for DecrementPadCountCommand
/// Decrements the available count for a prescription pad
/// </summary>
public class DecrementPadCountCommandHandler : IRequestHandler<DecrementPadCountCommand, PrescriptionPadDto>
{
    private readonly IPrescriptionPadRepository _padRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<DecrementPadCountCommandHandler> _logger;

    public DecrementPadCountCommandHandler(
        IPrescriptionPadRepository padRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<DecrementPadCountCommandHandler> logger)
    {
        _padRepository = padRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PrescriptionPadDto> Handle(DecrementPadCountCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Decrementing pad count - PadId: {PadId}, Quantity: {Quantity}, Reason: {Reason}",
            request.PadId, request.Quantity, request.Reason ?? "Not specified");

        // Get the pad
        var pad = await _padRepository.GetByIdAsync(request.PadId, cancellationToken);
        if (pad == null)
        {
            _logger.LogWarning("Pad not found: {PadId}", request.PadId);
            throw new InvalidOperationException($"Prescription pad not found: {request.PadId}");
        }

        // Validate availability
        if (pad.AvailableCount < request.Quantity)
        {
            _logger.LogWarning("Insufficient pad availability - PadId: {PadId}, Available: {Available}, Requested: {Requested}",
                request.PadId, pad.AvailableCount, request.Quantity);
            throw new InvalidOperationException(
                $"Insufficient pad availability. Available: {pad.AvailableCount}, Requested: {request.Quantity}");
        }

        // Validate expiration
        if (pad.ExpirationDate <= DateTime.UtcNow)
        {
            _logger.LogWarning("Pad expired - PadId: {PadId}, ExpirationDate: {ExpirationDate}",
                request.PadId, pad.ExpirationDate);
            throw new InvalidOperationException($"Prescription pad has expired: {request.PadId}");
        }

        // Decrement count
        var success = await _padRepository.DecrementAvailableCountAsync(
            request.PadId,
            request.Quantity,
            cancellationToken);

        if (!success)
        {
            _logger.LogError("Failed to decrement pad count - PadId: {PadId}", request.PadId);
            throw new InvalidOperationException($"Failed to decrement pad count for: {request.PadId}");
        }

        // Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Get updated pad
        var updatedPad = await _padRepository.GetByIdAsync(request.PadId, cancellationToken);
        if (updatedPad == null)
        {
            throw new InvalidOperationException($"Failed to retrieve updated pad: {request.PadId}");
        }

        _logger.LogInformation("Pad count decremented successfully - PadId: {PadId}, Remaining: {Remaining}",
            request.PadId, updatedPad.AvailableCount);

        return _mapper.Map<PrescriptionPadDto>(updatedPad);
    }
}
