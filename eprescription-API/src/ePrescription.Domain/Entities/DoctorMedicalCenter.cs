namespace EPrescription.Domain.Entities;

/// <summary>
/// Many-to-many relationship between doctors and medical centers
/// Maps to DOCTOR_MEDICAL_CENTERS table in Oracle
/// </summary>
public class DoctorMedicalCenter : BaseEntity
{
    public Guid DoctorId { get; private set; }
    public Guid MedicalCenterId { get; private set; }
    public DateTime AssignedDate { get; private set; }
    public bool IsActive { get; private set; } = true;

    // Navigation properties
    public virtual Doctor Doctor { get; private set; } = null!;
    public virtual MedicalCenter MedicalCenter { get; private set; } = null!;

    private DoctorMedicalCenter() { } // EF Core

    public DoctorMedicalCenter(Guid doctorId, Guid medicalCenterId)
    {
        DoctorId = doctorId;
        MedicalCenterId = medicalCenterId;
        AssignedDate = DateTime.UtcNow;
        IsActive = true;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
