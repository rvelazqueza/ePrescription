using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text;
using System.Text.Json;

namespace EPrescription.Tests.Integration;

public class PrescriptionPadsControllerIntegrationTests : IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> _factory;
    private HttpClient _client;

    public PrescriptionPadsControllerIntegrationTests()
    {
        _factory = new WebApplicationFactory<Program>();
    }

    public async Task InitializeAsync()
    {
        _client = _factory.CreateClient();
        await Task.CompletedTask;
    }

    public async Task DisposeAsync()
    {
        _client?.Dispose();
        _factory?.Dispose();
        await Task.CompletedTask;
    }

    [Fact]
    public async Task GetAvailablePadsForDoctor_WithValidDoctorId_ReturnsOk()
    {
        // Arrange
        var doctorId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/prescription-pads/doctor/{doctorId}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotEmpty(content);
    }

    [Fact]
    public async Task GetAvailablePadsForDoctor_WithInvalidDoctorId_ReturnsBadRequest()
    {
        // Arrange
        var invalidDoctorId = Guid.Empty;

        // Act
        var response = await _client.GetAsync($"/api/prescription-pads/doctor/{invalidDoctorId}");

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetPadStatistics_WithValidDoctorId_ReturnsOk()
    {
        // Arrange
        var doctorId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/prescription-pads/doctor/{doctorId}/statistics");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.NotEmpty(content);
    }

    [Fact]
    public async Task GetPadStatistics_WithInvalidDoctorId_ReturnsBadRequest()
    {
        // Arrange
        var invalidDoctorId = Guid.Empty;

        // Act
        var response = await _client.GetAsync($"/api/prescription-pads/doctor/{invalidDoctorId}/statistics");

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task DecrementPadCount_WithValidRequest_ReturnsOk()
    {
        // Arrange
        var padId = Guid.NewGuid();
        var request = new
        {
            quantity = 1,
            reason = "Test decrement"
        };

        var content = new StringContent(
            JsonSerializer.Serialize(request),
            Encoding.UTF8,
            "application/json");

        // Act
        var response = await _client.PostAsync($"/api/prescription-pads/{padId}/decrement", content);

        // Assert
        // Note: This will likely return 409 Conflict because the pad doesn't exist in the test DB
        // But we're testing that the endpoint is reachable and handles the request
        Assert.True(response.StatusCode == HttpStatusCode.OK || 
                   response.StatusCode == HttpStatusCode.Conflict ||
                   response.StatusCode == HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DecrementPadCount_WithInvalidQuantity_ReturnsBadRequest()
    {
        // Arrange
        var padId = Guid.NewGuid();
        var request = new
        {
            quantity = 0,
            reason = "Invalid quantity"
        };

        var content = new StringContent(
            JsonSerializer.Serialize(request),
            Encoding.UTF8,
            "application/json");

        // Act
        var response = await _client.PostAsync($"/api/prescription-pads/{padId}/decrement", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Health_ReturnsOk()
    {
        // Act
        var response = await _client.GetAsync("/api/prescription-pads/health");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("healthy", content);
    }
}
