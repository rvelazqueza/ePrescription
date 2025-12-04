using MediatR;

namespace EPrescription.Application.Commands.Inventory;

public class AddStockCommand : IRequest<Guid>
{
    public Guid PharmacyId { get; set; }
    public Guid MedicationId { get; set; }
    public int Quantity { get; set; }
    public string? BatchNumber { get; set; }
    public DateTime? ExpirationDate { get; set; }
    public decimal? UnitCost { get; set; }
    public string? Supplier { get; set; }
}
