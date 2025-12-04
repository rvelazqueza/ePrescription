using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Queries.Inventory;

public class GetInventoryQuery : IRequest<InventoryDto?>
{
    public Guid InventoryId { get; set; }

    public GetInventoryQuery(Guid inventoryId)
    {
        InventoryId = inventoryId;
    }
}
