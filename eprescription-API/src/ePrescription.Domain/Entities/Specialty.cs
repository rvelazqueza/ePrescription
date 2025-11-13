namespace EPrescription.Domain.Entities;

/// <summary>
/// Medical specialty entity
/// Maps to SPECIALTIES table in Oracle
/// </summary>
public class Specialty : BaseEntity
{
    public string SpecialtyCode { get; private set; } = string.Empty;
    public string SpecialtyName { get; private set; } = string.Empty;
    public string? Description { get; private set; }

    // Navigation property
    public virtual ICollection<Doctor> Doctors { get; private set; } = new List<Doctor>();

    private Specialty() { } // EF Core

    public Specialty(string specialtyCode, string specialtyName, string? description = null)
    {
        SpecialtyCode = specialtyCode;
        SpecialtyName = specialtyName;
        Description = description;
    }
}
