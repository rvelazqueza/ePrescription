using EPrescription.Application.DTOs;
using MediatR;

namespace EPrescription.Application.Queries.Inventory;

public class GetExpiringStockAlertsQuery : IRequest<List<ExpiringStockAlertDto>>
{
    public Guid? PharmacyId { get; set; }
    public int DaysUntilExpiration { get; set; }

    public GetExpiringStockAlertsQuery(Guid? pharmacyId = null, int daysUntilExpiration = 30)
    {
        PharmacyId = pharmacyId;
        DaysUntilExpiration = daysUntilExpiration;
    }
}
