using EPrescription.API.Controllers;
using EPrescription.Application.Interfaces;
using EPrescription.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Security.Claims;
using Xunit;

namespace EPrescription.Tests.Unit;

public class AuditControllerTests
{
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly Mock<IAuditRetentionService> _retentionServiceMock;
    private readonly Mock<ILogger<AuditController>> _loggerMock;
    private readonly AuditController _controller;

    public AuditControllerTests()
    {
        _auditServiceMock = new Mock<IAuditService>();
        _retentionServiceMock = new Mock<IAuditRetentionService>();
        _loggerMock = new Mock<ILogger<AuditController>>();
        
        _controller = new AuditController(
            _auditServiceMock.Object,
            _retentionServiceMock.Object,
            _loggerMock.Object);

        // Setup controller context with authenticated user
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "test-user"),
            new Claim(ClaimTypes.Role, "auditor")
        }, "TestAuth"));

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };
    }

    [Fact]
    public async Task GetAuditLogs_ShouldReturnOk()
    {
        // Arrange
        var logs = new List<AuditLog>
        {
            new AuditLog("CREATE", "Patient", entityId: "1"),
            new AuditLog("UPDATE", "Patient", entityId: "1")
        };
        
        _auditServiceMock
            .Setup(x => x.GetAuditLogsAsync(
                It.IsAny<DateTime?>(),
                It.IsAny<DateTime?>(),
                It.IsAny<string?>(),
                It.IsAny<string?>(),
                It.IsAny<string?>(),
                It.IsAny<int>(),
                It.IsAny<int>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((logs, 2));

        // Act
        var result = await _controller.GetAuditLogs();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuditLogsResponse>(okResult.Value);
        Assert.Equal(2, response.TotalCount);
        Assert.Equal(2, response.Logs.Count);
    }

    [Fact]
    public async Task GetAuditLogs_WithFilters_ShouldPassFiltersToService()
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddDays(-7);
        var endDate = DateTime.UtcNow;
        var userId = "user-123";
        var action = "CREATE";
        var entityType = "Patient";

        _auditServiceMock
            .Setup(x => x.GetAuditLogsAsync(
                startDate,
                endDate,
                userId,
                action,
                entityType,
                1,
                50,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((new List<AuditLog>(), 0));

        // Act
        await _controller.GetAuditLogs(startDate, endDate, userId, action, entityType);

        // Assert
        _auditServiceMock.Verify(
            x => x.GetAuditLogsAsync(
                startDate,
                endDate,
                userId,
                action,
                entityType,
                1,
                50,
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task GetAuditLogs_WithInvalidPageNumber_ShouldReturnBadRequest()
    {
        // Act
        var result = await _controller.GetAuditLogs(pageNumber: 0);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal("Page number must be greater than 0", badRequestResult.Value);
    }

    [Fact]
    public async Task GetAuditLogs_WithInvalidPageSize_ShouldReturnBadRequest()
    {
        // Act
        var result = await _controller.GetAuditLogs(pageSize: 0);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Contains("Page size must be between 1 and 100", badRequestResult.Value?.ToString());
    }

    [Fact]
    public async Task GetAuditLogs_WithPageSizeTooLarge_ShouldReturnBadRequest()
    {
        // Act
        var result = await _controller.GetAuditLogs(pageSize: 101);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Contains("Page size must be between 1 and 100", badRequestResult.Value?.ToString());
    }

    [Fact]
    public async Task GetAuditLogs_WithInvalidDateRange_ShouldReturnBadRequest()
    {
        // Arrange
        var startDate = DateTime.UtcNow;
        var endDate = DateTime.UtcNow.AddDays(-7);

        // Act
        var result = await _controller.GetAuditLogs(startDate: startDate, endDate: endDate);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal("Start date must be before end date", badRequestResult.Value);
    }

    [Fact]
    public async Task GetAuditLogs_WithPagination_ShouldCalculateTotalPages()
    {
        // Arrange
        _auditServiceMock
            .Setup(x => x.GetAuditLogsAsync(
                It.IsAny<DateTime?>(),
                It.IsAny<DateTime?>(),
                It.IsAny<string?>(),
                It.IsAny<string?>(),
                It.IsAny<string?>(),
                1,
                10,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((new List<AuditLog>(), 25));

        // Act
        var result = await _controller.GetAuditLogs(pageNumber: 1, pageSize: 10);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuditLogsResponse>(okResult.Value);
        Assert.Equal(3, response.TotalPages); // 25 logs / 10 per page = 3 pages
    }

    [Fact]
    public async Task GetAuditLogById_WithValidId_ShouldReturnOk()
    {
        // Arrange
        var testId = Guid.NewGuid();
        var log = new AuditLog("CREATE", "Patient", entityId: "1");
        _auditServiceMock
            .Setup(x => x.GetAuditLogByIdAsync(testId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(log);

        // Act
        var result = await _controller.GetAuditLogById(testId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<AuditLogDto>(okResult.Value);
        Assert.Equal("CREATE", dto.ActionType);
        Assert.Equal("Patient", dto.EntityType);
    }

    [Fact]
    public async Task GetAuditLogById_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        var invalidId = Guid.NewGuid();
        _auditServiceMock
            .Setup(x => x.GetAuditLogByIdAsync(invalidId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AuditLog?)null);

        // Act
        var result = await _controller.GetAuditLogById(invalidId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Contains(invalidId.ToString(), notFoundResult.Value?.ToString());
    }

    [Fact]
    public async Task ValidateAuditLog_WithValidLog_ShouldReturnValid()
    {
        // Arrange
        var testId = Guid.NewGuid();
        _auditServiceMock
            .Setup(x => x.ValidateAuditIntegrityAsync(testId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.ValidateAuditLog(testId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuditValidationResponse>(okResult.Value);
        Assert.True(response.IsValid);
        Assert.Equal("Audit log integrity verified", response.Message);
    }

    [Fact]
    public async Task ValidateAuditLog_WithInvalidLog_ShouldReturnInvalid()
    {
        // Arrange
        var testId = Guid.NewGuid();
        _auditServiceMock
            .Setup(x => x.ValidateAuditIntegrityAsync(testId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.ValidateAuditLog(testId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<AuditValidationResponse>(okResult.Value);
        Assert.False(response.IsValid);
        Assert.Equal("Audit log integrity check failed", response.Message);
    }

    [Fact]
    public async Task GetStatistics_WithValidDateRange_ShouldReturnOk()
    {
        // Arrange
        var stats = new AuditStatistics
        {
            TotalOperations = 100,
            AuthenticationAttempts = 20,
            SuccessfulAuthentications = 18,
            FailedAuthentications = 2
        };

        _auditServiceMock
            .Setup(x => x.GetAuditStatisticsAsync(
                It.IsAny<DateTime>(),
                It.IsAny<DateTime>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(stats);

        // Act
        var result = await _controller.GetStatistics(
            DateTime.UtcNow.AddDays(-7),
            DateTime.UtcNow);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedStats = Assert.IsType<AuditStatistics>(okResult.Value);
        Assert.Equal(100, returnedStats.TotalOperations);
    }

    [Fact]
    public async Task GetStatistics_WithInvalidDateRange_ShouldReturnBadRequest()
    {
        // Act
        var result = await _controller.GetStatistics(
            DateTime.UtcNow,
            DateTime.UtcNow.AddDays(-7));

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Equal("Start date must be before end date", badRequestResult.Value);
    }

    [Fact]
    public async Task GetRetentionPolicy_ShouldReturnOk()
    {
        // Arrange
        var policyInfo = new RetentionPolicyInfo
        {
            RetentionYears = 7,
            TotalLogsCount = 1000,
            ActiveLogsCount = 950,
            ArchivableLogsCount = 50
        };

        _retentionServiceMock
            .Setup(x => x.GetRetentionPolicyInfoAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(policyInfo);

        // Act
        var result = await _controller.GetRetentionPolicy();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedInfo = Assert.IsType<RetentionPolicyInfo>(okResult.Value);
        Assert.Equal(7, returnedInfo.RetentionYears);
        Assert.Equal(1000, returnedInfo.TotalLogsCount);
    }

    [Fact]
    public async Task GetArchivableCount_WithValidRetention_ShouldReturnOk()
    {
        // Arrange
        _retentionServiceMock
            .Setup(x => x.GetArchivableLogsCountAsync(7, It.IsAny<CancellationToken>()))
            .ReturnsAsync(50);

        // Act
        var result = await _controller.GetArchivableCount(retentionYears: 7);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<ArchivableCountResponse>(okResult.Value);
        Assert.Equal(50, response.Count);
        Assert.Equal(7, response.RetentionYears);
    }

    [Fact]
    public async Task GetArchivableCount_WithInvalidRetention_ShouldReturnBadRequest()
    {
        // Act
        var result = await _controller.GetArchivableCount(retentionYears: 0);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Contains("Retention years must be between 1 and 50", badRequestResult.Value?.ToString());
    }

    [Fact]
    public async Task ArchiveOldLogs_WithValidRetention_ShouldReturnOk()
    {
        // Arrange
        _retentionServiceMock
            .Setup(x => x.ArchiveOldLogsAsync(7, It.IsAny<CancellationToken>()))
            .ReturnsAsync(50);

        // Act
        var result = await _controller.ArchiveOldLogs(retentionYears: 7);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<ArchiveResponse>(okResult.Value);
        Assert.Equal(50, response.ArchivedCount);
        Assert.Equal(7, response.RetentionYears);
    }

    [Fact]
    public async Task ArchiveOldLogs_WithInvalidRetention_ShouldReturnBadRequest()
    {
        // Act
        var result = await _controller.ArchiveOldLogs(retentionYears: 51);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Contains("Retention years must be between 1 and 50", badRequestResult.Value?.ToString());
    }

    [Fact]
    public async Task ArchiveOldLogs_ShouldLogWarning()
    {
        // Arrange
        _retentionServiceMock
            .Setup(x => x.ArchiveOldLogsAsync(7, It.IsAny<CancellationToken>()))
            .ReturnsAsync(50);

        // Act
        await _controller.ArchiveOldLogs(retentionYears: 7);

        // Assert
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Audit log archival initiated")),
                It.IsAny<Exception>(),
                It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
            Times.Once);
    }

    [Fact]
    public async Task ArchiveOldLogs_WithNoLogs_ShouldReturnAppropriateMessage()
    {
        // Arrange
        _retentionServiceMock
            .Setup(x => x.ArchiveOldLogsAsync(7, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0);

        // Act
        var result = await _controller.ArchiveOldLogs(retentionYears: 7);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<ArchiveResponse>(okResult.Value);
        Assert.Equal(0, response.ArchivedCount);
        Assert.Equal("No logs found for archival", response.Message);
    }
}
