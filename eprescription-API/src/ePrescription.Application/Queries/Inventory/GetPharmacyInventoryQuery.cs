using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Queries.Inventory;

public class GetPharmacyInventoryQuery : IRequest<List<InventoryDto>>
{
    public Guid PharmacyId { get; set; }
    public bool? LowStockOnly { get; set; }

    public GetPharmacyInventoryQuery(Guid pharmacyId, bool? lowStockOnly = null)
    {
        PharmacyId = pharmacyId;
        LowStockOnly = lowStockOnly;
    }
}
