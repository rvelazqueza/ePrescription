using Serilog;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/eprescription-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger/OpenAPI
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "EPrescription API",
        Version = "v1",
        Description = "API para sistema de prescripción electrónica con Clean Architecture",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "EPrescription Team"
        }
    });
});

// CORS configuration (adjust origins as needed)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add HttpClient for Keycloak
builder.Services.AddHttpClient<EPrescription.Application.Interfaces.IAuthenticationService, 
    EPrescription.Infrastructure.Authentication.KeycloakAuthenticationService>();

// Add Authorization Service
builder.Services.AddScoped<EPrescription.Application.Interfaces.IAuthorizationService,
    EPrescription.Infrastructure.Authorization.AuthorizationService>();

// Add Keycloak Sync Service
builder.Services.AddScoped<EPrescription.Infrastructure.Authorization.KeycloakSyncService>();

// Add Audit Services
builder.Services.AddScoped<EPrescription.Application.Interfaces.IAuditService,
    EPrescription.Infrastructure.Services.AuditService>();
builder.Services.AddScoped<EPrescription.Application.Interfaces.IAuditRetentionService,
    EPrescription.Infrastructure.Services.AuditRetentionService>();
builder.Services.AddScoped<EPrescription.Infrastructure.Persistence.Interceptors.AuditInterceptor>();
builder.Services.AddHttpContextAccessor(); // Required for AuditService to access HTTP context

// Configure Database
builder.Services.AddDbContext<EPrescription.Infrastructure.Persistence.EPrescriptionDbContext>((serviceProvider, options) =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var auditInterceptor = serviceProvider.GetRequiredService<EPrescription.Infrastructure.Persistence.Interceptors.AuditInterceptor>();
    options.UseOracle(connectionString)
           .AddInterceptors(auditInterceptor);
});

// Configure JWT Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        var keycloakUrl = builder.Configuration["Keycloak:Url"] ?? "http://localhost:8080";
        var realm = builder.Configuration["Keycloak:Realm"] ?? "eprescription";
        
        options.Authority = $"{keycloakUrl}/realms/{realm}";
        options.Audience = builder.Configuration["Keycloak:ClientId"] ?? "eprescription-api";
        options.RequireHttpsMetadata = false; // Set to true in production
        
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false, // Keycloak doesn't always include audience
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromMinutes(5)
        };

        // Log authentication events
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Log.Warning("Authentication failed: {Error}", context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var username = context.Principal?.Identity?.Name ?? "Unknown";
                Log.Information("Token validated for user: {Username}", username);
                return Task.CompletedTask;
            }
        };
    });

// Configure Authorization
builder.Services.AddAuthorization(options =>
{
    // Define policies based on roles
    options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("admin"));
    options.AddPolicy("RequireDoctorRole", policy => policy.RequireRole("doctor"));
    options.AddPolicy("RequirePharmacistRole", policy => policy.RequireRole("pharmacist"));
    options.AddPolicy("RequirePatientRole", policy => policy.RequireRole("patient"));
    options.AddPolicy("RequireAuditorRole", policy => policy.RequireRole("auditor"));
    
    // Combined policies
    options.AddPolicy("RequireMedicalStaff", policy => 
        policy.RequireRole("doctor", "pharmacist", "admin"));
});

// TODO: Add Application layer services (MediatR, AutoMapper, FluentValidation)
// TODO: Add Infrastructure layer services (DbContext, Repositories, External Services)

var app = builder.Build();

// Initialize roles and permissions on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var syncService = scope.ServiceProvider.GetRequiredService<EPrescription.Infrastructure.Authorization.KeycloakSyncService>();
        await syncService.InitializeRolesAndPermissionsAsync();
        Log.Information("Roles and permissions initialized successfully");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Error initializing roles and permissions");
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "EPrescription API v1");
        options.RoutePrefix = string.Empty; // Swagger at root
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Authentication & Authorization middleware (order matters!)
app.UseAuthentication();
app.UseMiddleware<EPrescription.API.Middleware.AuthorizationMiddleware>();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
   .WithName("HealthCheck")
   .WithTags("Health");

try
{
    Log.Information("Starting EPrescription API");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
