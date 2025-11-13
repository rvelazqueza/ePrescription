namespace EPrescription.Domain.Entities;

/// <summary>
/// Administration route for medications (oral, IV, topical, etc.)
/// Maps to ADMINISTRATION_ROUTES table in Oracle
/// </summary>
public class AdministrationRoute : BaseEntity
{
    public string RouteCode { get; private set; } = string.Empty;
    public string RouteName { get; private set; } = string.Empty;
    public string? Description { get; private set; }

    // Navigation properties
    public virtual ICollection<PrescriptionMedication> PrescriptionMedications { get; private set; } = new List<PrescriptionMedication>();

    private AdministrationRoute() { } // EF Core

    public AdministrationRoute(string routeCode, string routeName, string? description = null)
    {
        RouteCode = routeCode;
        RouteName = routeName;
        Description = description;
    }
}
