using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using EPrescription.Domain.Entities;
using EPrescription.Infrastructure.Persistence;
using EPrescription.Infrastructure.Persistence.Repositories;
using Microsoft.Extensions.Logging;

namespace EPrescription.Tests.Unit.PrescriptionPads;

public class PrescriptionPadRepositoryTests
{
    private readonly Mock<EPrescriptionDbContext> _mockContext;
    private readonly Mock<DbSet<PrescriptionPad>> _mockDbSet;
    private readonly Mock<ILogger<PrescriptionPadRepository>> _mockLogger;
    private readonly PrescriptionPadRepository _repository;

    public PrescriptionPadRepositoryTests()
    {
        _mockContext = new Mock<EPrescriptionDbContext>();
        _mockDbSet = new Mock<DbSet<PrescriptionPad>>();
        _mockLogger = new Mock<ILogger<PrescriptionPadRepository>>();

        _mockContext.Setup(c => c.Set<PrescriptionPad>())
            .Returns(_mockDbSet.Object);

        _repository = new PrescriptionPadRepository(_mockContext.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetAvailablePadsForDoctorAsync_WithValidDoctor_ReturnAvailablePads()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var padTypeId = Guid.NewGuid();

        var pad1 = new PrescriptionPad(
            doctorId: doctorId,
            padTypeId: padTypeId,
            totalCount: 100,
            expirationDate: DateTime.UtcNow.AddDays(30));

        var pad2 = new PrescriptionPad(
            doctorId: doctorId,
            padTypeId: padTypeId,
            totalCount: 50,
            expirationDate: DateTime.UtcNow.AddDays(60));

        var pads = new List<PrescriptionPad> { pad1, pad2 }.AsQueryable();

        _mockDbSet.As<IQueryable<PrescriptionPad>>()
            .Setup(m => m.Provider)
            .Returns(pads.Provider);

        _mockDbSet.As<IQueryable<PrescriptionPad>>()
            .Setup(m => m.Expression)
            .Returns(pads.Expression);

        _mockDbSet.As<IQueryable<PrescriptionPad>>()
            .Setup(m => m.ElementType)
            .Returns(pads.ElementType);

        _mockDbSet.As<IQueryable<PrescriptionPad>>()
            .Setup(m => m.GetEnumerator())
            .Returns(pads.GetEnumerator());

        // Act
        var result = await _repository.GetAvailablePadsForDoctorAsync(doctorId, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task DecrementAvailableCountAsync_WithValidPad_DecrementSuccessfully()
    {
        // Arrange
        var padId = Guid.NewGuid();
        var doctorId = Guid.NewGuid();
        var padTypeId = Guid.NewGuid();

        var pad = new PrescriptionPad(
            doctorId: doctorId,
            padTypeId: padTypeId,
            totalCount: 100,
            expirationDate: DateTime.UtcNow.AddDays(30));

        _mockDbSet.Setup(d => d.FindAsync(new object[] { padId }, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pad);

        // Act
        var result = await _repository.DecrementAvailableCountAsync(padId, 1, CancellationToken.None);

        // Assert
        Assert.True(result);
        _mockDbSet.Verify(d => d.Update(It.IsAny<PrescriptionPad>()), Times.Once);
    }

    [Fact]
    public async Task DecrementAvailableCountAsync_WithNonExistentPad_ReturnFalse()
    {
        // Arrange
        var padId = Guid.NewGuid();

        _mockDbSet.Setup(d => d.FindAsync(new object[] { padId }, It.IsAny<CancellationToken>()))
            .ReturnsAsync((PrescriptionPad?)null);

        // Act
        var result = await _repository.DecrementAvailableCountAsync(padId, 1, CancellationToken.None);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task DecrementAvailableCountAsync_WithInsufficientAvailability_ReturnFalse()
    {
        // Arrange
        var padId = Guid.NewGuid();
        var doctorId = Guid.NewGuid();
        var padTypeId = Guid.NewGuid();

        var pad = new PrescriptionPad(
            doctorId: doctorId,
            padTypeId: padTypeId,
            totalCount: 100,
            expirationDate: DateTime.UtcNow.AddDays(30));

        // Manually set available count to 0
        var availableProperty = typeof(PrescriptionPad).GetProperty("AvailableCount");
        availableProperty?.SetValue(pad, 0);

        _mockDbSet.Setup(d => d.FindAsync(new object[] { padId }, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pad);

        // Act
        var result = await _repository.DecrementAvailableCountAsync(padId, 1, CancellationToken.None);

        // Assert
        Assert.False(result);
    }
}
