using Xunit;
using Moq;
using AutoMapper;
using EPrescription.Application.Commands.PrescriptionPads;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EPrescription.Tests.Unit.PrescriptionPads;

public class DecrementPadCountCommandHandlerTests
{
    private readonly Mock<IPrescriptionPadRepository> _mockPadRepository;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IMapper> _mockMapper;
    private readonly Mock<ILogger<DecrementPadCountCommandHandler>> _mockLogger;
    private readonly DecrementPadCountCommandHandler _handler;

    public DecrementPadCountCommandHandlerTests()
    {
        _mockPadRepository = new Mock<IPrescriptionPadRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _mockLogger = new Mock<ILogger<DecrementPadCountCommandHandler>>();

        _handler = new DecrementPadCountCommandHandler(
            _mockPadRepository.Object,
            _mockUnitOfWork.Object,
            _mockMapper.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task Handle_WithValidPad_DecrementSuccessfully()
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

        var command = new DecrementPadCountCommand(padId, 1, "Test decrement");

        var expectedDto = new PrescriptionPadDto
        {
            Id = padId,
            DoctorId = doctorId,
            PadTypeId = padTypeId,
            TotalCount = 100,
            AvailableCount = 99,
            ExpirationDate = DateTime.UtcNow.AddDays(30),
            Status = "active"
        };

        _mockPadRepository.Setup(r => r.GetByIdAsync(padId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pad);

        _mockPadRepository.Setup(r => r.DecrementAvailableCountAsync(padId, 1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _mockPadRepository.Setup(r => r.GetByIdAsync(padId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pad);

        _mockMapper.Setup(m => m.Map<PrescriptionPadDto>(It.IsAny<PrescriptionPad>()))
            .Returns(expectedDto);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(padId, result.Id);
        Assert.Equal(99, result.AvailableCount);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithNonExistentPad_ThrowsInvalidOperationException()
    {
        // Arrange
        var padId = Guid.NewGuid();
        var command = new DecrementPadCountCommand(padId, 1);

        _mockPadRepository.Setup(r => r.GetByIdAsync(padId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((PrescriptionPad?)null);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_WithInsufficientAvailability_ThrowsInvalidOperationException()
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

        var command = new DecrementPadCountCommand(padId, 1);

        _mockPadRepository.Setup(r => r.GetByIdAsync(padId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pad);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_WithExpiredPad_ThrowsInvalidOperationException()
    {
        // Arrange
        var padId = Guid.NewGuid();
        var doctorId = Guid.NewGuid();
        var padTypeId = Guid.NewGuid();

        var pad = new PrescriptionPad(
            doctorId: doctorId,
            padTypeId: padTypeId,
            totalCount: 100,
            expirationDate: DateTime.UtcNow.AddDays(-1)); // Expired

        var command = new DecrementPadCountCommand(padId, 1);

        _mockPadRepository.Setup(r => r.GetByIdAsync(padId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pad);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_WithMultipleQuantity_DecrementCorrectly()
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

        var command = new DecrementPadCountCommand(padId, 5, "Batch decrement");

        var expectedDto = new PrescriptionPadDto
        {
            Id = padId,
            DoctorId = doctorId,
            PadTypeId = padTypeId,
            TotalCount = 100,
            AvailableCount = 95,
            ExpirationDate = DateTime.UtcNow.AddDays(30),
            Status = "active"
        };

        _mockPadRepository.Setup(r => r.GetByIdAsync(padId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pad);

        _mockPadRepository.Setup(r => r.DecrementAvailableCountAsync(padId, 5, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _mockMapper.Setup(m => m.Map<PrescriptionPadDto>(It.IsAny<PrescriptionPad>()))
            .Returns(expectedDto);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(95, result.AvailableCount);
        _mockPadRepository.Verify(r => r.DecrementAvailableCountAsync(padId, 5, It.IsAny<CancellationToken>()), Times.Once);
    }
}
