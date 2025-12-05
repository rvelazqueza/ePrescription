namespace EPrescription.Domain.Entities;

/// <summary>
/// Medication entity - represents a medication in the catalog
/// Maps to MEDICATIONS table in Oracle
/// </summary>
public class Medication : BaseEntity
{
    public string MedicationCode { get; private set; } = string.Empty;
    public string CommercialName { get; private set; } = string.Empty;
    public string GenericName { get; private set; } = string.Empty;
    public string? ActiveIngredient { get; private set; }
    public string? Presentation { get; private set; }
    public string? Concentration { get; private set; }
    public bool RequiresPrescription { get; private set; } = true;
    public bool IsActive { get; private set; } = true;
    public Guid? AdministrationRouteId { get; private set; }
    public Guid? PadTypeId { get; private set; } // NEW: Link to prescription pad type

    // Navigation properties
    public virtual AdministrationRoute? AdministrationRoute { get; private set; }
    public virtual PrescriptionPadType? PadType { get; private set; } // NEW: Prescription pad type
    public virtual ICollection<PrescriptionMedication> Prescriptions { get; private set; } = new List<PrescriptionMedication>();
    public virtual ICollection<DrugInteraction> InteractionsAsFirst { get; private set; } = new List<DrugInteraction>();
    public virtual ICollection<DrugInteraction> InteractionsAsSecond { get; private set; } = new List<DrugInteraction>();
    public virtual ICollection<Inventory> Inventories { get; private set; } = new List<Inventory>();

    private Medication() { } // EF Core

    public Medication(
        string medicationCode,
        string commercialName,
        string genericName,
        string? activeIngredient = null,
        string? presentation = null,
        string? concentration = null,
        bool requiresPrescription = true,
        Guid? administrationRouteId = null,
        Guid? padTypeId = null) // NEW: Prescription pad type
    {
        MedicationCode = medicationCode;
        CommercialName = commercialName;
        GenericName = genericName;
        ActiveIngredient = activeIngredient;
        Presentation = presentation;
        Concentration = concentration;
        RequiresPrescription = requiresPrescription;
        AdministrationRouteId = administrationRouteId;
        PadTypeId = padTypeId; // NEW
        IsActive = true;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
