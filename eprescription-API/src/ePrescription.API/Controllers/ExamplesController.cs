using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EPrescription.API.Authorization;
using EPrescription.Application.Constants;
using System.Security.Claims;
using AuthService = EPrescription.Application.Interfaces.IAuthorizationService;

namespace EPrescription.API.Controllers;

/// <summary>
/// Example controller demonstrating authorization usage
/// This controller shows how to use authorization attributes in real use cases
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class ExamplesController : ControllerBase
{
    private readonly AuthService _authorizationService;
    private readonly ILogger<ExamplesController> _logger;

    public ExamplesController(
        AuthService authorizationService,
        ILogger<ExamplesController> logger)
    {
        _authorizationService = authorizationService;
        _logger = logger;
    }

    /// <summary>
    /// Example 1: Endpoint accessible only by doctors
    /// Use case: Creating a prescription
    /// </summary>
    [HttpPost("create-prescription")]
    [RequireRole(Roles.Doctor)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult CreatePrescriptionExample()
    {
        var username = User.Identity?.Name;
        _logger.LogInformation("Doctor {Username} is creating a prescription", username);
        
        return Ok(new
        {
            message = "Prescription created successfully",
            createdBy = username,
            role = "doctor"
        });
    }

    /// <summary>
    /// Example 2: Endpoint accessible by doctors or pharmacists
    /// Use case: Viewing prescription details
    /// </summary>
    [HttpGet("view-prescription/{id}")]
    [RequireRole(Roles.Doctor, Roles.Pharmacist)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult ViewPrescriptionExample(string id)
    {
        var username = User.Identity?.Name;
        _logger.LogInformation("User {Username} is viewing prescription {PrescriptionId}", username, id);
        
        return Ok(new
        {
            prescriptionId = id,
            viewedBy = username,
            message = "Prescription details"
        });
    }

    /// <summary>
    /// Example 3: Endpoint using medical action validation
    /// Use case: Dispensing medication (only pharmacists)
    /// </summary>
    [HttpPost("dispense-medication")]
    [RequireMedicalAction(MedicalActions.DispenseMedication)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult DispenseMedicationExample()
    {
        var username = User.Identity?.Name;
        _logger.LogInformation("Pharmacist {Username} is dispensing medication", username);
        
        return Ok(new
        {
            message = "Medication dispensed successfully",
            dispensedBy = username,
            role = "pharmacist"
        });
    }

    /// <summary>
    /// Example 4: Endpoint accessible only by admin
    /// Use case: System configuration
    /// </summary>
    [HttpPost("system-config")]
    [RequireRole(Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult SystemConfigExample()
    {
        var username = User.Identity?.Name;
        _logger.LogInformation("Admin {Username} is updating system configuration", username);
        
        return Ok(new
        {
            message = "System configuration updated",
            updatedBy = username,
            role = "admin"
        });
    }

    /// <summary>
    /// Example 5: Endpoint accessible only by auditors
    /// Use case: Viewing audit logs
    /// </summary>
    [HttpGet("audit-logs")]
    [RequireMedicalAction(MedicalActions.ViewAuditLogs)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult ViewAuditLogsExample()
    {
        var username = User.Identity?.Name;
        _logger.LogInformation("Auditor {Username} is viewing audit logs", username);
        
        return Ok(new
        {
            message = "Audit logs retrieved",
            viewedBy = username,
            role = "auditor"
        });
    }

    /// <summary>
    /// Example 6: Programmatic authorization check
    /// Use case: Complex authorization logic within the method
    /// </summary>
    [HttpGet("patient-record/{patientId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ViewPatientRecordExample(string patientId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                     ?? User.FindFirst("sub")?.Value;
        var username = User.Identity?.Name;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User ID not found" });
        }

        // Programmatic authorization check
        var canAccess = await _authorizationService.CanAccessResourceAsync(
            userId, 
            "patient", 
            patientId, 
            "read"
        );

        if (!canAccess)
        {
            _logger.LogWarning("User {Username} denied access to patient record {PatientId}", 
                username, patientId);
            
            return Forbid();
        }

        _logger.LogInformation("User {Username} accessed patient record {PatientId}", 
            username, patientId);

        return Ok(new
        {
            patientId,
            accessedBy = username,
            message = "Patient record details"
        });
    }

    /// <summary>
    /// Example 7: Medical action validation with detailed response
    /// Use case: Validating if user can perform a medical action
    /// </summary>
    [HttpPost("validate-medical-action")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ValidateMedicalActionExample([FromBody] ValidateMedicalActionRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                     ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User ID not found" });
        }

        var result = await _authorizationService.ValidateMedicalActionAsync(userId, request.Action);

        return Ok(new
        {
            action = request.Action,
            isAuthorized = result.IsAuthorized,
            reason = result.Reason,
            requiredRoles = result.RequiredRoles,
            requiredPermissions = result.RequiredPermissions
        });
    }

    /// <summary>
    /// Example 8: Get current user's roles and permissions
    /// Use case: UI needs to know what the user can do
    /// </summary>
    [HttpGet("my-permissions")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyPermissions()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                     ?? User.FindFirst("sub")?.Value;
        var username = User.Identity?.Name;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "User ID not found" });
        }

        var roles = await _authorizationService.GetUserRolesAsync(userId);
        var permissions = await _authorizationService.GetUserPermissionsAsync(userId);

        return Ok(new
        {
            username,
            userId,
            roles,
            permissions
        });
    }
}

// Request DTOs
public class ValidateMedicalActionRequest
{
    public string Action { get; set; } = string.Empty;
}
