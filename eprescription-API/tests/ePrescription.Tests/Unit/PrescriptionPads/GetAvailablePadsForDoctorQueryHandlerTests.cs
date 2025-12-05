using Xunit;
using Moq;
using AutoMapper;
using EPrescription.Application.Queries.PrescriptionPads;
using EPrescription.Application.DTOs;
using EPrescription.Domain.Entities;
using EPrescription.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace EPrescription.Tests.Unit.PrescriptionPads;

public class GetAvailablePadsForDoctorQueryHandlerTests
{
    private readonly Mock<IPrescriptionPadRepository> _mockPadRepository;
    private readonly Mock<IPrescriptionSlipRepository> _mockSlipRepository;
    private readonly Mock<IMapper> _mockMapper;
    private readonly Mock<ILogger<GetAvailablePadsForDoctorQueryHandler>> _mockLogger;
    private readonly GetAvailablePadsForDoctorQueryHandler _handler;

    public GetAvailablePadsForDoctorQueryHandlerTests()
    {
        _mockPadRepository = new Mock<IPrescriptionPadRepository>();
        _mockSlipRepository = new Mock<IPrescriptionSlipRepository>();
        _mockMapper = new Mock<IMapper>();
        _mockLogger = new Mock<ILogger<GetAvailablePadsForDoctorQueryHandler>>();

        _handler = new GetAvailablePadsForDoctorQueryHandler(
            _mockPadRepository.Object,
            _mockSlipRepository.Object,
            _mockMapper.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task Handle_WithValidDoctor_ReturnAvailablePads()
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

        var pads = new List<PrescriptionPad> { pad1, pad2 };

        var query = new GetAvailablePadsForDoctorQuery(doctorId);

        var padDtos = new List<PrescriptionPadDto>
        {
            new PrescriptionPadDto { Id = pad1.Id, AvailableCount = 100 },
            new PrescriptionPadDto { Id = pad2.Id, AvailableCount = 50 }
        };

        _mockPadRepository.Setup(r => r.GetAvailablePadsForDoctorAsync(doctorId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pads);

        _mockSlipRepository.Setup(r => r.GetSlipStatisticsForDoctorAsync(doctorId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((150, 50, 100));

        _mockMapper.Setup(m => m.Map<List<PrescriptionPadDto>>(It.IsAny<IEnumerable<PrescriptionPad>>()))
            .Returns(padDtos);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(doctorId, result.DoctorId);
        Assert.Equal(2, result.Pads.Count);
        Assert.Equal(150, result.TotalAvailable);
        Assert.Equal(100, result.TotalSlips);
    }

    [Fact]
    public async Task Handle_WithNoPads_ReturnEmptyList()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var query = new GetAvailablePadsForDoctorQuery(doctorId);

        _mockPadRepository.Setup(r => r.GetAvailablePadsForDoctorAsync(doctorId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<PrescriptionPad>());

        _mockSlipRepository.Setup(r => r.GetSlipStatisticsForDoctorAsync(doctorId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((0, 0, 0));

        _mockMapper.Setup(m => m.Map<List<PrescriptionPadDto>>(It.IsAny<IEnumerable<PrescriptionPad>>()))
            .Returns(new List<PrescriptionPadDto>());

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(doctorId, result.DoctorId);
        Assert.Empty(result.Pads);
        Assert.Equal(0, result.TotalAvailable);
    }

    [Fact]
    public async Task Handle_WithPadTypeFilter_ReturnFilteredPads()
    {
        // Arrange
        var doctorId = Guid.NewGuid();
        var padTypeId = Guid.NewGuid();

        var pad = new PrescriptionPad(
            doctorId: doctorId,
            padTypeId: padTypeId,
            totalCount: 100,
            expirationDate: DateTime.UtcNow.AddDays(30));

        var pads = new List<PrescriptionPad> { pad };

        var query = new GetAvailablePadsForDoctorQuery(doctorId, padTypeId);

        var padDtos = new List<PrescriptionPadDto>
        {
            new PrescriptionPadDto { Id = pad.Id, AvailableCount = 100 }
        };

        _mockPadRepository.Setup(r => r.GetPadsByDoctorAndTypeAsync(doctorId, padTypeId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pads);

        _mockSlipRepository.Setup(r => r.GetSlipStatisticsForDoctorAsync(doctorId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((100, 0, 100));

        _mockMapper.Setup(m => m.Map<List<PrescriptionPadDto>>(It.IsAny<IEnumerable<PrescriptionPad>>()))
            .Returns(padDtos);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Single(result.Pads);
        _mockPadRepository.Verify(r => r.GetPadsByDoctorAndTypeAsync(doctorId, padTypeId, It.IsAny<CancellationToken>()), Times.Once);
    }
}
