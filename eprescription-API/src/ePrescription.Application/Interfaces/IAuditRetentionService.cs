namespace EPrescription.Application.Interfaces;

/// <summary>
/// Service for managing audit log retention policies
/// Implements FDA 21 CFR Part 11 requirement for 7-year retention
/// </summary>
public interface IAuditRetentionService
{
    /// <summary>
    /// Archives audit logs older than the retention period
    /// FDA 21 CFR Part 11 requires 7 years retention
    /// </summary>
    /// <param name="retentionYears">Number of years to retain (default: 7)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of logs archived</returns>
    Task<int> ArchiveOldLogsAsync(
        int retentionYears = 7,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the count of logs that are eligible for archival
    /// </summary>
    /// <param name="retentionYears">Number of years to retain (default: 7)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of logs eligible for archival</returns>
    Task<int> GetArchivableLogsCountAsync(
        int retentionYears = 7,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets retention policy information
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Retention policy details</returns>
    Task<RetentionPolicyInfo> GetRetentionPolicyInfoAsync(
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Information about the retention policy
/// </summary>
public class RetentionPolicyInfo
{
    public int RetentionYears { get; set; }
    public DateTime CutoffDate { get; set; }
    public int TotalLogsCount { get; set; }
    public int ActiveLogsCount { get; set; }
    public int ArchivableLogsCount { get; set; }
    public long TotalStorageSizeBytes { get; set; }
    public DateTime LastArchivalDate { get; set; }
}
