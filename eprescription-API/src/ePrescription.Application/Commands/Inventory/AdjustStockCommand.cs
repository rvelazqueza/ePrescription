using MediatR;

namespace EPrescription.Application.Commands.Inventory;

public class AdjustStockCommand : IRequest<bool>
{
    public Guid InventoryId { get; set; }
    public int QuantityAdjustment { get; set; } // Positive for increase, negative for decrease
    public string? Reason { get; set; }
    public string? AdjustedBy { get; set; }
}
