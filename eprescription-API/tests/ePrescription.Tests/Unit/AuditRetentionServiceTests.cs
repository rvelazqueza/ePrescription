using EPrescription.Application.Interfaces;
using EPrescription.Domain.Entities;
using EPrescription.Infrastructure.Persistence;
using EPrescription.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace EPrescription.Tests.Unit;

public class AuditRetentionServiceTests : IDisposable
{
    private readonly EPrescriptionDbContext _context;
    private readonly Mock<ILogger<AuditRetentionService>> _loggerMock;
    private readonly IAuditRetentionService _retentionService;

    public AuditRetentionServiceTests()
    {
        var options = new DbContextOptionsBuilder<EPrescriptionDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new EPrescriptionDbContext(options);
        _loggerMock = new Mock<ILogger<AuditRetentionService>>();
        _retentionService = new AuditRetentionService(_context, _loggerMock.Object);
    }

    [Fact]
    public async Task GetArchivableLogsCountAsync_WithNoOldLogs_ShouldReturnZero()
    {
        // Arrange
        await SeedRecentLogs(5);

        // Act
        var count = await _retentionService.GetArchivableLogsCountAsync(retentionYears: 7);

        // Assert
        Assert.Equal(0, count);
    }

    [Fact]
    public async Task GetArchivableLogsCountAsync_WithOldLogs_ShouldReturnCorrectCount()
    {
        // Arrange
        await SeedOldLogs(3, yearsOld: 8);
        await SeedRecentLogs(5);

        // Act
        var count = await _retentionService.GetArchivableLogsCountAsync(retentionYears: 7);

        // Assert
        Assert.Equal(3, count);
    }

    [Fact]
    public async Task GetArchivableLogsCountAsync_WithCustomRetention_ShouldUseCorrectCutoff()
    {
        // Arrange
        await SeedOldLogs(2, yearsOld: 6);
        await SeedOldLogs(3, yearsOld: 11);

        // Act - 5 year retention
        var count5Years = await _retentionService.GetArchivableLogsCountAsync(retentionYears: 5);
        
        // Act - 10 year retention
        var count10Years = await _retentionService.GetArchivableLogsCountAsync(retentionYears: 10);

        // Assert
        Assert.Equal(5, count5Years); // All logs older than 5 years
        Assert.Equal(3, count10Years); // Only logs older than 10 years
    }

    [Fact]
    public async Task ArchiveOldLogsAsync_WithOldLogs_ShouldReturnCount()
    {
        // Arrange
        await SeedOldLogs(5, yearsOld: 8);
        await SeedRecentLogs(3);

        // Act
        var archivedCount = await _retentionService.ArchiveOldLogsAsync(retentionYears: 7);

        // Assert
        Assert.Equal(5, archivedCount);
        
        // Verify logs are still in database (actual deletion is disabled for safety)
        var totalLogs = await _context.AuditLogs.CountAsync();
        Assert.Equal(8, totalLogs);
    }

    [Fact]
    public async Task ArchiveOldLogsAsync_WithNoOldLogs_ShouldReturnZero()
    {
        // Arrange
        await SeedRecentLogs(5);

        // Act
        var archivedCount = await _retentionService.ArchiveOldLogsAsync(retentionYears: 7);

        // Assert
        Assert.Equal(0, archivedCount);
    }

    [Fact]
    public async Task ArchiveOldLogsAsync_ShouldLogWarningWhenLogsFound()
    {
        // Arrange
        await SeedOldLogs(3, yearsOld: 8);

        // Act
        await _retentionService.ArchiveOldLogsAsync(retentionYears: 7);

        // Assert
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Found 3 audit logs")),
                It.IsAny<Exception>(),
                It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
            Times.Once);
    }

    [Fact]
    public async Task ArchiveOldLogsAsync_ShouldLogInfoWhenNoLogsFound()
    {
        // Arrange
        await SeedRecentLogs(5);

        // Act
        await _retentionService.ArchiveOldLogsAsync(retentionYears: 7);

        // Assert
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("No audit logs found")),
                It.IsAny<Exception>(),
                It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
            Times.Once);
    }

    [Fact]
    public async Task GetRetentionPolicyInfoAsync_ShouldReturnCorrectInfo()
    {
        // Arrange
        await SeedOldLogs(3, yearsOld: 8);
        await SeedRecentLogs(7);

        // Act
        var policyInfo = await _retentionService.GetRetentionPolicyInfoAsync();

        // Assert
        Assert.Equal(7, policyInfo.RetentionYears);
        Assert.Equal(10, policyInfo.TotalLogsCount);
        Assert.Equal(7, policyInfo.ActiveLogsCount);
        Assert.Equal(3, policyInfo.ArchivableLogsCount);
        Assert.True(policyInfo.CutoffDate < DateTime.UtcNow);
        Assert.True(policyInfo.TotalStorageSizeBytes > 0);
    }

    [Fact]
    public async Task GetRetentionPolicyInfoAsync_WithNoLogs_ShouldReturnZeroCounts()
    {
        // Act
        var policyInfo = await _retentionService.GetRetentionPolicyInfoAsync();

        // Assert
        Assert.Equal(0, policyInfo.TotalLogsCount);
        Assert.Equal(0, policyInfo.ActiveLogsCount);
        Assert.Equal(0, policyInfo.ArchivableLogsCount);
    }

    [Fact]
    public async Task GetRetentionPolicyInfoAsync_ShouldCalculateCutoffDateCorrectly()
    {
        // Act
        var policyInfo = await _retentionService.GetRetentionPolicyInfoAsync();

        // Assert
        var expectedCutoff = DateTime.UtcNow.AddYears(-7);
        var timeDifference = Math.Abs((policyInfo.CutoffDate - expectedCutoff).TotalMinutes);
        Assert.True(timeDifference < 1); // Within 1 minute
    }

    [Fact]
    public async Task GetRetentionPolicyInfoAsync_ShouldEstimateStorageSize()
    {
        // Arrange
        await SeedRecentLogs(10);

        // Act
        var policyInfo = await _retentionService.GetRetentionPolicyInfoAsync();

        // Assert
        // Each log is estimated at 2KB, so 10 logs = 20KB
        var expectedSize = 10 * 2048;
        Assert.Equal(expectedSize, policyInfo.TotalStorageSizeBytes);
    }

    [Fact]
    public async Task GetRetentionPolicyInfoAsync_ShouldSetLastArchivalDate()
    {
        // Arrange
        var oldestDate = DateTime.UtcNow.AddYears(-5);
        await SeedLogWithSpecificDate(oldestDate);
        await SeedRecentLogs(3);

        // Act
        var policyInfo = await _retentionService.GetRetentionPolicyInfoAsync();

        // Assert
        var timeDifference = Math.Abs((policyInfo.LastArchivalDate - oldestDate).TotalMinutes);
        Assert.True(timeDifference < 1); // Within 1 minute
    }

    [Fact]
    public async Task ArchiveOldLogsAsync_WithDifferentRetentionPeriods_ShouldArchiveCorrectly()
    {
        // Arrange
        await SeedOldLogs(2, yearsOld: 3);
        await SeedOldLogs(3, yearsOld: 6);
        await SeedOldLogs(4, yearsOld: 9);

        // Act - 5 year retention
        var count5Years = await _retentionService.ArchiveOldLogsAsync(retentionYears: 5);
        
        // Assert
        Assert.Equal(7, count5Years); // 3 + 4 logs older than 5 years
    }

    [Fact]
    public async Task GetArchivableLogsCountAsync_WithBoundaryDate_ShouldHandleCorrectly()
    {
        // Arrange
        var exactCutoffDate = DateTime.UtcNow.AddYears(-7);
        await SeedLogWithSpecificDate(exactCutoffDate.AddDays(-1)); // Just before cutoff
        await SeedLogWithSpecificDate(exactCutoffDate.AddDays(1));  // Just after cutoff

        // Act
        var count = await _retentionService.GetArchivableLogsCountAsync(retentionYears: 7);

        // Assert
        Assert.Equal(1, count); // Only the log before cutoff
    }

    // Helper methods
    private async Task SeedRecentLogs(int count)
    {
        for (int i = 0; i < count; i++)
        {
            var log = new AuditLog(
                $"ACTION_{i}",
                "TestEntity",
                entityId: i.ToString()
            );
            _context.AuditLogs.Add(log);
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedOldLogs(int count, int yearsOld)
    {
        for (int i = 0; i < count; i++)
        {
            var log = new AuditLog(
                $"OLD_ACTION_{i}",
                "TestEntity",
                entityId: $"old_{i}"
            );
            
            // Set timestamp to old date using reflection
            var timestampProperty = typeof(AuditLog).GetProperty("Timestamp");
            timestampProperty?.SetValue(log, DateTime.UtcNow.AddYears(-yearsOld));
            
            _context.AuditLogs.Add(log);
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedLogWithSpecificDate(DateTime date)
    {
        var log = new AuditLog(
            "SPECIFIC_ACTION",
            "TestEntity",
            entityId: "specific"
        );
        
        var timestampProperty = typeof(AuditLog).GetProperty("Timestamp");
        timestampProperty?.SetValue(log, date);
        
        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context?.Dispose();
    }
}
