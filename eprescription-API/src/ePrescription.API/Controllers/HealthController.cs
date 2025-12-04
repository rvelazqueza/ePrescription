using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EPrescription.Infrastructure.Persistence;
using System.Diagnostics;

namespace ePrescription.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous] // Health check debe ser público
    public class HealthController : ControllerBase
    {
        private readonly EPrescriptionDbContext _context;
        private readonly ILogger<HealthController> _logger;

        public HealthController(EPrescriptionDbContext context, ILogger<HealthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealthStatus()
        {
            try
            {
                var healthStatus = new
                {
                    timestamp = DateTime.UtcNow,
                    status = "healthy",
                    checks = new
                    {
                        database = await CheckDatabaseHealth(),
                        api = CheckApiHealth(),
                        memory = CheckMemoryHealth(),
                        responseTime = await CheckResponseTime()
                    }
                };

                return Ok(healthStatus);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Health check failed");
                return StatusCode(500, new
                {
                    timestamp = DateTime.UtcNow,
                    status = "unhealthy",
                    error = ex.Message
                });
            }
        }

        private async Task<object> CheckDatabaseHealth()
        {
            try
            {
                var stopwatch = Stopwatch.StartNew();
                await _context.Database.ExecuteSqlRawAsync("SELECT 1 FROM DUAL");
                stopwatch.Stop();

                return new
                {
                    status = "healthy",
                    responseTime = stopwatch.ElapsedMilliseconds,
                    message = "Database connection successful"
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    status = "unhealthy",
                    responseTime = -1,
                    message = $"Database connection failed: {ex.Message}"
                };
            }
        }

        private object CheckApiHealth()
        {
            try
            {
                return new
                {
                    status = "healthy",
                    message = "API is responding",
                    version = "1.0.0"
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    status = "unhealthy",
                    message = $"API check failed: {ex.Message}"
                };
            }
        }

        private object CheckMemoryHealth()
        {
            try
            {
                var process = Process.GetCurrentProcess();
                var memoryUsageMB = process.WorkingSet64 / 1024 / 1024;
                var maxMemoryMB = 1024; // 1GB threshold

                var healthPercentage = Math.Max(0, 100 - (memoryUsageMB * 100 / maxMemoryMB));

                return new
                {
                    status = memoryUsageMB < maxMemoryMB ? "healthy" : "warning",
                    memoryUsageMB = memoryUsageMB,
                    healthPercentage = Math.Round((double)healthPercentage, 1),
                    message = $"Memory usage: {memoryUsageMB}MB"
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    status = "unhealthy",
                    message = $"Memory check failed: {ex.Message}"
                };
            }
        }

        private async Task<object> CheckResponseTime()
        {
            try
            {
                var stopwatch = Stopwatch.StartNew();
                
                // Simulate a quick operation
                await Task.Delay(1);
                
                stopwatch.Stop();
                var responseTime = stopwatch.ElapsedMilliseconds;

                return new
                {
                    status = responseTime < 100 ? "healthy" : "warning",
                    responseTimeMs = responseTime,
                    message = $"Response time: {responseTime}ms"
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    status = "unhealthy",
                    message = $"Response time check failed: {ex.Message}"
                };
            }
        }
    }
}
