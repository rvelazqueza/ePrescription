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
    public string Manufacturer { get; private set; } = string.Empty;
    public string Presentation { get; private set; } = string.Empty; // tablet, capsule, syrup, etc.
    public string Concentration { get; private set; } = string.Empty;
    public bool RequiresPrescription { get; private set; } = true;
    public bool IsControlled { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual ICollection<PrescriptionMedication> Prescriptions { get; private set; } = new List<PrescriptionMedication>();
    public virtual ICollection<DrugInteraction> InteractionsAsFirst { get; private set; } = new List<DrugInteraction>();
    public virtual ICollection<DrugInteraction> InteractionsAsSecond { get; private set; } = new List<DrugInteraction>();

    private Medication() { } // EF Core

    public Medication(
        string medicationCode,
        string commercialName,
        string genericName,
        string manufacturer,
        string presentation,
        string concentration,
        bool requiresPrescription = true,
        bool isControlled = false)
    {
        MedicationCode = medicationCode;
        CommercialName = commercialName;
        GenericName = genericName;
        Manufacturer = manufacturer;
        Presentation = presentation;
        Concentration = concentration;
        RequiresPrescription = requiresPrescription;
        IsControlled = isControlled;
        IsActive = true;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
