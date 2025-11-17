using EPrescription.Application.Interfaces;
using EPrescription.Domain.Entities;
using EPrescription.Infrastructure.Persistence;
using EPrescription.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System.Security.Claims;
using Xunit;

namespace EPrescription.Tests.Unit;

public class AuditServiceTests : IDisposable
{
    private readonly EPrescriptionDbContext _context;
    private readonly Mock<ILogger<AuditService>> _loggerMock;
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
    private readonly IAuditService _auditService;

    public AuditServiceTests()
    {
        // Setup in-memory database
        var options = new DbContextOptionsBuilder<EPrescriptionDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new EPrescriptionDbContext(options);
        _loggerMock = new Mock<ILogger<AuditService>>();
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

        // Setup default HTTP context
        SetupHttpContext("test-user", "test-user-id", "127.0.0.1");

        _auditService = new AuditService(_context, _loggerMock.Object, _httpContextAccessorMock.Object);
    }

    private void SetupHttpContext(string username, string userId, string ipAddress)
    {
        var claims = new List<Claim>
        {
            new Claim("sub", userId),
            new Claim("preferred_username", username),
            new Claim(ClaimTypes.Name, username)
        };

        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext
        {
            User = claimsPrincipal,
            Connection = { RemoteIpAddress = System.Net.IPAddress.Parse(ipAddress) }
        };

        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);
    }

    [Fact]
    public async Task LogOperationAsync_ShouldCreateAuditLog()
    {
        // Arrange
        var action = "CREATE_PATIENT";
        var entityType = "Patient";
        var entityId = "patient-123";
        var afterValue = "{\"name\":\"John Doe\"}";

        // Act
        await _auditService.LogOperationAsync(
            action, entityType, entityId,
            afterValue: afterValue);

        // Assert
        var log = await _context.AuditLogs.FirstOrDefaultAsync();
        Assert.NotNull(log);
        Assert.Equal(action, log.ActionType);
        Assert.Equal(entityType, log.EntityType);
        Assert.Equal(entityId, log.EntityId);
        Assert.Equal(afterValue, log.AfterValue);
        Assert.Equal("test-user", log.Username);
        Assert.Equal("127.0.0.1", log.IpAddress);
    }

    [Fact]
    public async Task LogOperationAsync_ShouldCaptureUserId()
    {
        // Arrange
        var userId = Guid.NewGuid();
        SetupHttpContext("admin", userId.ToString(), "192.168.1.1");

        // Act
        await _auditService.LogOperationAsync("TEST_ACTION", "TestEntity", "123");

        // Assert
        var log = await _context.AuditLogs.FirstOrDefaultAsync();
        Assert.NotNull(log);
        Assert.Equal(userId, log.UserId);
    }

    [Fact]
    public async Task LogOperationAsync_ShouldCaptureIpAddress()
    {
        // Arrange
        var ipAddress = "10.0.0.1";
        SetupHttpContext("user", "user-id", ipAddress);

        // Act
        await _auditService.LogOperationAsync("TEST_ACTION", "TestEntity", "123");

        // Assert
        var log = await _context.AuditLogs.FirstOrDefaultAsync();
        Assert.NotNull(log);
        Assert.Equal(ipAddress, log.IpAddress);
    }

    [Fact]
    public async Task LogOperationAsync_WithBeforeAndAfterValues_ShouldStoreChanges()
    {
        // Arrange
        var beforeValue = "{\"status\":\"draft\"}";
        var afterValue = "{\"status\":\"published\"}";

        // Act
        await _auditService.LogOperationAsync(
            "UPDATE_PRESCRIPTION",
            "Prescription",
            "rx-123",
            beforeValue: beforeValue,
            afterValue: afterValue);

        // Assert
        var log = await _context.AuditLogs.FirstOrDefaultAsync();
        Assert.NotNull(log);
        Assert.Equal(beforeValue, log.BeforeValue);
        Assert.Equal(afterValue, log.AfterValue);
    }

    [Fact]
    public async Task LogAuthenticationAsync_ShouldCreateAuthLog()
    {
        // Arrange
        var userId = "auth-user-123";
        var action = "LOGIN";
        var success = true;
        var ipAddress = "192.168.1.100";

        // Act
        await _auditService.LogAuthenticationAsync(userId, action, success, ipAddress);

        // Assert
        var log = await _context.AuditLogs.FirstOrDefaultAsync();
        Assert.NotNull(log);
        Assert.Equal(action, log.ActionType);
        Assert.Equal("Authentication", log.EntityType);
        Assert.Contains("\"Success\":true", log.Metadata);
    }

    [Fact]
    public async Task LogAuthenticationAsync_WithFailure_ShouldLogFailedAttempt()
    {
        // Arrange
        var userId = "user-456";
        var action = "LOGIN";
        var success = false;

        // Act
        await _auditService.LogAuthenticationAsync(userId, action, success);

        // Assert
        var log = await _context.AuditLogs.FirstOrDefaultAsync();
        Assert.NotNull(log);
        Assert.Contains("\"Success\":false", log.Metadata);
    }

    [Fact]
    public async Task LogAIOperationAsync_ShouldCreateAILog()
    {
        // Arrange
        var userId = "doctor-123";
        var operation = "DIAGNOSIS_ANALYSIS";
        var inputData = "{\"symptoms\":\"fever, cough\"}";
        var outputData = "{\"diagnosis\":\"Common Cold\"}";
        var modelUsed = "GPT-4";

        // Act
        await _auditService.LogAIOperationAsync(
            userId, operation, inputData, outputData, modelUsed);

        // Assert
        var log = await _context.AuditLogs.FirstOrDefaultAsync();
        Assert.NotNull(log);
        Assert.Equal("AI_OPERATION", log.ActionType);
        Assert.Equal("AIAnalysis", log.EntityType);
        Assert.Equal(inputData, log.BeforeValue);
        Assert.Equal(outputData, log.AfterValue);
        Assert.Contains(modelUsed, log.Metadata);
    }

    [Fact]
    public async Task GetAuditLogsAsync_ShouldReturnAllLogs()
    {
        // Arrange
        await SeedTestLogs(5);

        // Act
        var (logs, totalCount) = await _auditService.GetAuditLogsAsync();

        // Assert
        Assert.Equal(5, totalCount);
        Assert.Equal(5, logs.Count());
    }

    [Fact]
    public async Task GetAuditLogsAsync_WithDateFilter_ShouldReturnFilteredLogs()
    {
        // Arrange
        await SeedTestLogsWithDates();
        var startDate = DateTime.UtcNow.AddDays(-5);
        var endDate = DateTime.UtcNow.AddDays(-2);

        // Act
        var (logs, totalCount) = await _auditService.GetAuditLogsAsync(
            startDate: startDate,
            endDate: endDate);

        // Assert
        Assert.True(totalCount > 0);
        Assert.All(logs, log =>
        {
            Assert.True(log.Timestamp >= startDate);
            Assert.True(log.Timestamp <= endDate);
        });
    }

    [Fact]
    public async Task GetAuditLogsAsync_WithActionFilter_ShouldReturnMatchingLogs()
    {
        // Arrange
        await _auditService.LogOperationAsync("CREATE", "Patient", "1");
        await _auditService.LogOperationAsync("UPDATE", "Patient", "1");
        await _auditService.LogOperationAsync("CREATE", "Doctor", "2");

        // Act
        var (logs, totalCount) = await _auditService.GetAuditLogsAsync(action: "CREATE");

        // Assert
        Assert.Equal(2, totalCount);
        Assert.All(logs, log => Assert.Contains("CREATE", log.ActionType));
    }

    [Fact]
    public async Task GetAuditLogsAsync_WithEntityTypeFilter_ShouldReturnMatchingLogs()
    {
        // Arrange
        await _auditService.LogOperationAsync("CREATE", "Patient", "1");
        await _auditService.LogOperationAsync("CREATE", "Patient", "2");
        await _auditService.LogOperationAsync("CREATE", "Doctor", "3");

        // Act
        var (logs, totalCount) = await _auditService.GetAuditLogsAsync(entityType: "Patient");

        // Assert
        Assert.Equal(2, totalCount);
        Assert.All(logs, log => Assert.Equal("Patient", log.EntityType));
    }

    [Fact]
    public async Task GetAuditLogsAsync_WithUserIdFilter_ShouldReturnMatchingLogs()
    {
        // Arrange
        var userId = Guid.NewGuid();
        SetupHttpContext("user1", userId.ToString(), "127.0.0.1");
        await _auditService.LogOperationAsync("ACTION1", "Entity1", "1");

        SetupHttpContext("user2", Guid.NewGuid().ToString(), "127.0.0.1");
        await _auditService.LogOperationAsync("ACTION2", "Entity2", "2");

        // Act
        var (logs, totalCount) = await _auditService.GetAuditLogsAsync(userId: userId.ToString());

        // Assert
        Assert.Equal(1, totalCount);
        Assert.All(logs, log => Assert.Equal(userId, log.UserId));
    }

    [Fact]
    public async Task GetAuditLogsAsync_WithPagination_ShouldReturnCorrectPage()
    {
        // Arrange
        await SeedTestLogs(20);

        // Act - Get page 2 with 5 items per page
        var (logs, totalCount) = await _auditService.GetAuditLogsAsync(
            pageNumber: 2,
            pageSize: 5);

        // Assert
        Assert.Equal(20, totalCount);
        Assert.Equal(5, logs.Count());
    }

    [Fact]
    public async Task GetAuditLogsAsync_WithCombinedFilters_ShouldReturnMatchingLogs()
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddDays(-1);
        await _auditService.LogOperationAsync("CREATE", "Patient", "1");
        await _auditService.LogOperationAsync("UPDATE", "Patient", "1");
        await _auditService.LogOperationAsync("CREATE", "Doctor", "2");

        // Act
        var (logs, totalCount) = await _auditService.GetAuditLogsAsync(
            startDate: startDate,
            action: "CREATE",
            entityType: "Patient");

        // Assert
        Assert.Equal(1, totalCount);
        var log = logs.First();
        Assert.Equal("CREATE", log.ActionType);
        Assert.Equal("Patient", log.EntityType);
    }

    [Fact]
    public async Task GetAuditLogByIdAsync_WithValidId_ShouldReturnLog()
    {
        // Arrange
        await _auditService.LogOperationAsync("TEST", "Entity", "1");
        var allLogs = await _context.AuditLogs.ToListAsync();
        var logId = allLogs.First().Id;

        // Act
        var log = await _auditService.GetAuditLogByIdAsync(logId);

        // Assert
        Assert.NotNull(log);
        Assert.Equal(logId, log.Id);
    }

    [Fact]
    public async Task GetAuditLogByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Act
        var log = await _auditService.GetAuditLogByIdAsync(Guid.NewGuid());

        // Assert
        Assert.Null(log);
    }

    [Fact]
    public async Task ValidateAuditIntegrityAsync_WithValidLog_ShouldReturnTrue()
    {
        // Arrange
        await _auditService.LogOperationAsync("TEST", "Entity", "1");
        var allLogs = await _context.AuditLogs.ToListAsync();
        var logId = allLogs.First().Id;

        // Act
        var isValid = await _auditService.ValidateAuditIntegrityAsync(logId);

        // Assert
        Assert.True(isValid);
    }

    [Fact]
    public async Task ValidateAuditIntegrityAsync_WithInvalidId_ShouldReturnFalse()
    {
        // Act
        var isValid = await _auditService.ValidateAuditIntegrityAsync(Guid.NewGuid());

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public async Task GetAuditStatisticsAsync_ShouldReturnCorrectStatistics()
    {
        // Arrange
        await _auditService.LogAuthenticationAsync("user1", "LOGIN", true);
        await _auditService.LogAuthenticationAsync("user2", "LOGIN", false);
        await _auditService.LogOperationAsync("CREATE", "Patient", "1");
        await _auditService.LogAIOperationAsync("user1", "DIAGNOSIS", "{}", "{}");

        var startDate = DateTime.UtcNow.AddDays(-1);
        var endDate = DateTime.UtcNow.AddDays(1);

        // Act
        var stats = await _auditService.GetAuditStatisticsAsync(startDate, endDate);

        // Assert
        Assert.Equal(4, stats.TotalOperations);
        Assert.Equal(2, stats.AuthenticationAttempts);
        Assert.Equal(1, stats.SuccessfulAuthentications);
        Assert.Equal(1, stats.FailedAuthentications);
        Assert.Equal(1, stats.AIOperations);
        Assert.True(stats.OperationsByType.Count > 0);
    }

    [Fact]
    public async Task GetAuditStatisticsAsync_ShouldIncludeMostActiveUsers()
    {
        // Arrange
        SetupHttpContext("user1", "user1-id", "127.0.0.1");
        await _auditService.LogOperationAsync("ACTION1", "Entity", "1");
        await _auditService.LogOperationAsync("ACTION2", "Entity", "2");

        SetupHttpContext("user2", "user2-id", "127.0.0.1");
        await _auditService.LogOperationAsync("ACTION3", "Entity", "3");

        var startDate = DateTime.UtcNow.AddDays(-1);
        var endDate = DateTime.UtcNow.AddDays(1);

        // Act
        var stats = await _auditService.GetAuditStatisticsAsync(startDate, endDate);

        // Assert
        Assert.Contains("user1", stats.MostActiveUsers);
        Assert.Contains("user2", stats.MostActiveUsers);
        Assert.Equal("user1", stats.MostActiveUsers.First()); // user1 should be first (2 operations)
    }

    [Fact]
    public async Task LogOperationAsync_ShouldNotThrowOnError()
    {
        // Arrange - Dispose context to cause an error
        _context.Dispose();

        // Act & Assert - Should not throw
        await _auditService.LogOperationAsync("TEST", "Entity", "1");

        // Verify error was logged
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => true),
                It.IsAny<Exception>(),
                It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
            Times.Once);
    }

    // Helper methods
    private async Task SeedTestLogs(int count)
    {
        for (int i = 0; i < count; i++)
        {
            await _auditService.LogOperationAsync($"ACTION_{i}", "TestEntity", i.ToString());
        }
    }

    private async Task SeedTestLogsWithDates()
    {
        for (int i = 0; i < 10; i++)
        {
            var log = new AuditLog(
                $"ACTION_{i}",
                "TestEntity",
                entityId: i.ToString()
            );
            
            // Use reflection to set timestamp (since it's private set)
            var timestampProperty = typeof(AuditLog).GetProperty("Timestamp");
            timestampProperty?.SetValue(log, DateTime.UtcNow.AddDays(-i));
            
            _context.AuditLogs.Add(log);
        }
        await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context?.Dispose();
    }
}
