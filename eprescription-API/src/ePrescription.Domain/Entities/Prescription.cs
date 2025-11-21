namespace EPrescription.Domain.Entities;

/// <summary>
/// Prescription entity - represents a medical prescription
/// Maps to PRESCRIPTIONS table in Oracle
/// </summary>
public class Prescription : BaseEntity
{
    public string PrescriptionNumber { get; private set; } = string.Empty;
    public Guid PatientId { get; private set; }
    public Guid DoctorId { get; private set; }
    public Guid MedicalCenterId { get; private set; }
    public DateTime PrescriptionDate { get; private set; }
    public DateTime? ExpirationDate { get; private set; }
    public string Status { get; private set; } = "active"; // active, dispensed, expired, cancelled
    public string? Notes { get; private set; }

    // Navigation properties
    public virtual ICollection<PrescriptionDiagnosis> Diagnoses { get; private set; } = new List<PrescriptionDiagnosis>();
    public virtual ICollection<PrescriptionMedication> Medications { get; private set; } = new List<PrescriptionMedication>();
    public virtual ICollection<Dispensation> Dispensations { get; private set; } = new List<Dispensation>();

    private Prescription() { } // EF Core

    public Prescription(
        string prescriptionNumber,
        Guid patientId,
        Guid doctorId,
        Guid medicalCenterId,
        DateTime prescriptionDate,
        DateTime? expirationDate = null,
        string? notes = null)
    {
        PrescriptionNumber = prescriptionNumber;
        PatientId = patientId;
        DoctorId = doctorId;
        MedicalCenterId = medicalCenterId;
        PrescriptionDate = prescriptionDate;
        ExpirationDate = expirationDate ?? prescriptionDate.AddMonths(6);
        Status = "active";
        Notes = notes;
    }

    public void AddDiagnosis(PrescriptionDiagnosis diagnosis)
    {
        Diagnoses.Add(diagnosis);
        UpdateTimestamp();
    }

    public void AddMedication(PrescriptionMedication medication)
    {
        Medications.Add(medication);
        UpdateTimestamp();
    }

    public void Cancel(string reason)
    {
        Status = "cancelled";
        Notes = $"{Notes}\nCancelled: {reason}";
        UpdateTimestamp();
    }

    public void MarkAsDispensed()
    {
        Status = "dispensed";
        UpdateTimestamp();
    }

    public void GeneratePrescriptionNumber()
    {
        PrescriptionNumber = $"RX-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
        UpdateTimestamp();
    }

    public void UpdateStatus(string status)
    {
        Status = status;
        UpdateTimestamp();
    }

    public void UpdateExpirationDate(DateTime expirationDate)
    {
        ExpirationDate = expirationDate;
        UpdateTimestamp();
    }

    public void UpdateNotes(string notes)
    {
        Notes = notes;
        UpdateTimestamp();
    }

    public void ClearMedications()
    {
        Medications.Clear();
        UpdateTimestamp();
    }

    public void ClearDiagnoses()
    {
        Diagnoses.Clear();
        UpdateTimestamp();
    }
}
