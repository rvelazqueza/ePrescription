using EPrescription.Application.Interfaces;
using EPrescription.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EPrescription.Infrastructure.Services;

/// <summary>
/// Implementation of audit retention service for FDA 21 CFR Part 11 compliance
/// Manages 7-year retention policy for audit logs
/// </summary>
public class AuditRetentionService : IAuditRetentionService
{
    private readonly EPrescriptionDbContext _context;
    private readonly ILogger<AuditRetentionService> _logger;
    private const int DEFAULT_RETENTION_YEARS = 7;

    public AuditRetentionService(
        EPrescriptionDbContext context,
        ILogger<AuditRetentionService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> ArchiveOldLogsAsync(
        int retentionYears = DEFAULT_RETENTION_YEARS,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var cutoffDate = DateTime.UtcNow.AddYears(-retentionYears);
            
            _logger.LogInformation(
                "Starting audit log archival process. Retention: {RetentionYears} years, Cutoff date: {CutoffDate}",
                retentionYears, cutoffDate);

            // In a real implementation, you would:
            // 1. Export logs to archive storage (S3, Azure Blob, etc.)
            // 2. Verify the export was successful
            // 3. Only then delete from active database
            
            // For now, we'll just count what would be archived
            // IMPORTANT: Actual deletion should only happen after successful backup
            var archivableCount = await _context.AuditLogs
                .Where(a => a.Timestamp < cutoffDate)
                .CountAsync(cancellationToken);

            if (archivableCount > 0)
            {
                _logger.LogWarning(
                    "Found {Count} audit logs older than {Years} years. " +
                    "These should be archived to external storage before deletion. " +
                    "Actual deletion is disabled for safety.",
                    archivableCount, retentionYears);

                // TODO: Implement actual archival process:
                // 1. Export to archive storage
                // 2. Verify export integrity
                // 3. Delete from active database
                // 
                // Example:
                // var logsToArchive = await _context.AuditLogs
                //     .Where(a => a.Timestamp < cutoffDate)
                //     .ToListAsync(cancellationToken);
                // 
                // await _archiveStorage.ExportAsync(logsToArchive);
                // await _archiveStorage.VerifyAsync(logsToArchive);
                // 
                // _context.AuditLogs.RemoveRange(logsToArchive);
                // await _context.SaveChangesAsync(cancellationToken);
            }
            else
            {
                _logger.LogInformation("No audit logs found for archival");
            }

            return archivableCount;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during audit log archival process");
            throw;
        }
    }

    public async Task<int> GetArchivableLogsCountAsync(
        int retentionYears = DEFAULT_RETENTION_YEARS,
        CancellationToken cancellationToken = default)
    {
        var cutoffDate = DateTime.UtcNow.AddYears(-retentionYears);
        
        return await _context.AuditLogs
            .Where(a => a.Timestamp < cutoffDate)
            .CountAsync(cancellationToken);
    }

    public async Task<RetentionPolicyInfo> GetRetentionPolicyInfoAsync(
        CancellationToken cancellationToken = default)
    {
        var retentionYears = DEFAULT_RETENTION_YEARS;
        var cutoffDate = DateTime.UtcNow.AddYears(-retentionYears);

        var totalCount = await _context.AuditLogs.CountAsync(cancellationToken);
        var archivableCount = await _context.AuditLogs
            .Where(a => a.Timestamp < cutoffDate)
            .CountAsync(cancellationToken);
        var activeCount = totalCount - archivableCount;

        // Get oldest log date (approximation of last archival)
        var oldestLog = await _context.AuditLogs
            .OrderBy(a => a.Timestamp)
            .Select(a => a.Timestamp)
            .FirstOrDefaultAsync(cancellationToken);

        // Estimate storage size (rough calculation)
        // In production, you'd query actual database statistics
        var avgLogSize = 2048; // Average 2KB per log entry
        var totalStorageBytes = (long)totalCount * avgLogSize;

        return new RetentionPolicyInfo
        {
            RetentionYears = retentionYears,
            CutoffDate = cutoffDate,
            TotalLogsCount = totalCount,
            ActiveLogsCount = activeCount,
            ArchivableLogsCount = archivableCount,
            TotalStorageSizeBytes = totalStorageBytes,
            LastArchivalDate = oldestLog != default ? oldestLog : DateTime.MinValue
        };
    }
}
