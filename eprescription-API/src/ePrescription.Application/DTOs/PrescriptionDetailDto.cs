namespace EPrescription.Application.DTOs;

public class PrescriptionDetailDto
{
    public string Id { get; set; }
    public string PrescriptionNumber { get; set; }
    public string PatientId { get; set; }
    public string DoctorId { get; set; }
    public string PrescriptionDate { get; set; }
    public string ExpirationDate { get; set; }
    public string Status { get; set; }
    
    // Patient info
    public string PatientFirstName { get; set; }
    public string PatientLastName { get; set; }
    public string PatientIdentificationNumber { get; set; }
    public int PatientAge { get; set; }
    public string PatientGender { get; set; }
    
    // Medications
    public List<PrescriptionMedicationDetailDto> Medications { get; set; } = new();
    
    // Diagnoses
    public List<DiagnosisDetailDto> Diagnoses { get; set; } = new();
    
    public string Notes { get; set; }
    public string CreatedAt { get; set; }
}

public class PrescriptionMedicationDetailDto
{
    public string Id { get; set; }
    public string MedicationId { get; set; }
    public string MedicationName { get; set; }
    public string Dosage { get; set; }
    public string Frequency { get; set; }
    public int DurationDays { get; set; }
    public decimal Quantity { get; set; }
    public string Instructions { get; set; }
    public bool AiSuggested { get; set; }
}

public class DiagnosisDetailDto
{
    public string Cie10Code { get; set; }
    public string Description { get; set; }
    public bool IsPrimary { get; set; }
}
