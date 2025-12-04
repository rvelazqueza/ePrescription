using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Queries.Inventory;

public class GetLowStockAlertsQuery : IRequest<List<LowStockAlertDto>>
{
    public Guid? PharmacyId { get; set; }

    public GetLowStockAlertsQuery(Guid? pharmacyId = null)
    {
        PharmacyId = pharmacyId;
    }
}
