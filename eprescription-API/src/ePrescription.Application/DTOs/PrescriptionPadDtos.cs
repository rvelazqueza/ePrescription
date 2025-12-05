namespace EPrescription.Application.DTOs;

/// <summary>
/// DTO for PrescriptionPadType
/// </summary>
public class PrescriptionPadTypeDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? SpecialtyId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// DTO for PrescriptionPad
/// </summary>
public class PrescriptionPadDto
{
    public Guid Id { get; set; }
    public Guid DoctorId { get; set; }
    public Guid PadTypeId { get; set; }
    public int TotalCount { get; set; }
    public int AvailableCount { get; set; }
    public DateTime ExpirationDate { get; set; }
    public string Status { get; set; } = "active";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Related data
    public PrescriptionPadTypeDto? PadType { get; set; }
    public string? DoctorName { get; set; }
}

/// <summary>
/// DTO for PrescriptionSlip
/// </summary>
public class PrescriptionSlipDto
{
    public Guid Id { get; set; }
    public Guid PrescriptionPadId { get; set; }
    public int SlipNumber { get; set; }
    public Guid? UsedByPrescriptionId { get; set; }
    public DateTime? UsedAt { get; set; }
    public string Status { get; set; } = "available";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Related data
    public PrescriptionPadDto? PrescriptionPad { get; set; }
}

/// <summary>
/// DTO for available pads response
/// </summary>
public class AvailablePadsResponseDto
{
    public Guid DoctorId { get; set; }
    public List<PrescriptionPadDto> Pads { get; set; } = new();
    public int TotalAvailable { get; set; }
    public int TotalSlips { get; set; }
}

/// <summary>
/// DTO for pad statistics
/// </summary>
public class PadStatisticsDto
{
    public Guid DoctorId { get; set; }
    public int TotalPads { get; set; }
    public int ActivePads { get; set; }
    public int ExpiringPads { get; set; }
    public int LowAvailabilityPads { get; set; }
    public int TotalSlips { get; set; }
    public int UsedSlips { get; set; }
    public int AvailableSlips { get; set; }
    public decimal UsagePercentage { get; set; }
}

/// <summary>
/// DTO for slip statistics
/// </summary>
public class SlipStatisticsDto
{
    public Guid DoctorId { get; set; }
    public int TotalSlips { get; set; }
    public int UsedSlips { get; set; }
    public int AvailableSlips { get; set; }
    public decimal UsagePercentage { get; set; }
    public DateTime? LastUsedDate { get; set; }
}
