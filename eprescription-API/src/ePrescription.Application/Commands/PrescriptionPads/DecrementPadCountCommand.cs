using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Commands.PrescriptionPads;

/// <summary>
/// Command to decrement available count for a prescription pad
/// </summary>
public class DecrementPadCountCommand : IRequest<PrescriptionPadDto>
{
    public Guid PadId { get; set; }
    public int Quantity { get; set; } = 1;
    public string? Reason { get; set; }

    public DecrementPadCountCommand(Guid padId, int quantity = 1, string? reason = null)
    {
        PadId = padId;
        Quantity = quantity;
        Reason = reason;
    }
}
