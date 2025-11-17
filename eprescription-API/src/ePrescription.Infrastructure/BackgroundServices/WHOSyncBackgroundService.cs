using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using EPrescription.Application.Interfaces;

namespace EPrescription.Infrastructure.BackgroundServices;

/// <summary>
/// Background service for automatic daily synchronization of ICD-10 catalog from WHO API
/// </summary>
public class WHOSyncBackgroundService : BackgroundService
{
    private readonly ILogger<WHOSyncBackgroundService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly TimeSpan _syncInterval = TimeSpan.FromHours(24); // Daily sync
    private readonly TimeSpan _syncTime = new TimeSpan(2, 0, 0); // 2:00 AM

    public WHOSyncBackgroundService(
        ILogger<WHOSyncBackgroundService> logger,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("WHO Sync Background Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var now = DateTime.Now;
                var nextSync = CalculateNextSyncTime(now);
                var delay = nextSync - now;

                _logger.LogInformation("Next WHO ICD-10 sync scheduled for: {NextSync}", nextSync);

                // Wait until next sync time
                await Task.Delay(delay, stoppingToken);

                // Perform sync
                await PerformSyncAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("WHO Sync Background Service is stopping");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in WHO Sync Background Service");
                // Wait 1 hour before retrying on error
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }

        _logger.LogInformation("WHO Sync Background Service stopped");
    }

    private DateTime CalculateNextSyncTime(DateTime now)
    {
        var today = now.Date;
        var todaySync = today.Add(_syncTime);

        // If sync time has passed today, schedule for tomorrow
        if (now >= todaySync)
        {
            return todaySync.AddDays(1);
        }

        return todaySync;
    }

    private async Task PerformSyncAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting automatic WHO ICD-10 catalog synchronization");

        using var scope = _serviceProvider.CreateScope();
        var whoApiService = scope.ServiceProvider.GetRequiredService<IWHOApiService>();
        var auditService = scope.ServiceProvider.GetRequiredService<IAuditService>();

        try
        {
            var result = await whoApiService.SyncICD10CatalogAsync(cancellationToken);

            if (result.Success)
            {
                _logger.LogInformation(
                    "WHO ICD-10 sync completed successfully. Added: {Added}, Updated: {Updated}, Removed: {Removed}, Duration: {Duration}",
                    result.CodesAdded, result.CodesUpdated, result.CodesRemoved, result.Duration);

                await auditService.LogOperationAsync(
                    "WHO_AUTO_SYNC_SUCCESS",
                    "WHOApi",
                    "AutomaticSync",
                    additionalInfo: $"Automatic sync completed: {result.CodesAdded} codes added, {result.CodesUpdated} updated, {result.CodesRemoved} removed",
                    cancellationToken: cancellationToken);
            }
            else
            {
                _logger.LogWarning(
                    "WHO ICD-10 sync completed with errors: {ErrorMessage}",
                    result.ErrorMessage);

                await auditService.LogOperationAsync(
                    "WHO_AUTO_SYNC_ERROR",
                    "WHOApi",
                    "AutomaticSync",
                    additionalInfo: $"Automatic sync failed: {result.ErrorMessage}",
                    cancellationToken: cancellationToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during automatic WHO ICD-10 synchronization");

            await auditService.LogOperationAsync(
                "WHO_AUTO_SYNC_EXCEPTION",
                "WHOApi",
                "AutomaticSync",
                additionalInfo: $"Automatic sync exception: {ex.Message}",
                cancellationToken: cancellationToken);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("WHO Sync Background Service is stopping");
        await base.StopAsync(cancellationToken);
    }
}
