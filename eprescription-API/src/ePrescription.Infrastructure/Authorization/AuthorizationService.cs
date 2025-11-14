using System.Security.Claims;
using EPrescription.Application.Constants;
using EPrescription.Application.Interfaces;
using EPrescription.Domain.Entities;
using EPrescription.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EPrescription.Infrastructure.Authorization;

/// <summary>
/// Implementation of authorization service
/// Integrates with Keycloak roles and local database permissions
/// </summary>
public class AuthorizationService : IAuthorizationService
{
    private readonly EPrescriptionDbContext _context;
    private readonly ILogger<AuthorizationService> _logger;

    public AuthorizationService(
        EPrescriptionDbContext context,
        ILogger<AuthorizationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> HasRoleAsync(string userId, string role)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.KeycloakUserId == userId);

            if (user == null)
            {
                _logger.LogWarning("User {UserId} not found in database", userId);
                return false;
            }

            return user.UserRoles.Any(ur => ur.Role.RoleName == role);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking role {Role} for user {UserId}", role, userId);
            return false;
        }
    }

    public async Task<bool> HasPermissionAsync(string userId, string permission)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .ThenInclude(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
                .FirstOrDefaultAsync(u => u.KeycloakUserId == userId);

            if (user == null)
            {
                _logger.LogWarning("User {UserId} not found in database", userId);
                return false;
            }

            return user.UserRoles
                .SelectMany(ur => ur.Role.RolePermissions)
                .Any(rp => rp.Permission.PermissionName == permission);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking permission {Permission} for user {UserId}", permission, userId);
            return false;
        }
    }

    public async Task<bool> HasAnyRoleAsync(string userId, params string[] roles)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.KeycloakUserId == userId);

            if (user == null)
            {
                return false;
            }

            return user.UserRoles.Any(ur => roles.Contains(ur.Role.RoleName));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking roles for user {UserId}", userId);
            return false;
        }
    }

    public async Task<bool> HasAllRolesAsync(string userId, params string[] roles)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.KeycloakUserId == userId);

            if (user == null)
            {
                return false;
            }

            var userRoles = user.UserRoles.Select(ur => ur.Role.RoleName).ToList();
            return roles.All(role => userRoles.Contains(role));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking all roles for user {UserId}", userId);
            return false;
        }
    }

    public async Task<List<string>> GetUserRolesAsync(string userId)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.KeycloakUserId == userId);

            if (user == null)
            {
                return new List<string>();
            }

            return user.UserRoles.Select(ur => ur.Role.RoleName).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting roles for user {UserId}", userId);
            return new List<string>();
        }
    }

    public async Task<List<string>> GetUserPermissionsAsync(string userId)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .ThenInclude(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
                .FirstOrDefaultAsync(u => u.KeycloakUserId == userId);

            if (user == null)
            {
                return new List<string>();
            }

            return user.UserRoles
                .SelectMany(ur => ur.Role.RolePermissions)
                .Select(rp => rp.Permission.PermissionName)
                .Distinct()
                .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting permissions for user {UserId}", userId);
            return new List<string>();
        }
    }

    public bool HasRole(ClaimsPrincipal user, string role)
    {
        if (user == null || !user.Identity?.IsAuthenticated == true)
        {
            return false;
        }

        // Check realm_access.roles claim from Keycloak JWT
        var rolesClaim = user.FindFirst("realm_access.roles")?.Value;
        if (!string.IsNullOrEmpty(rolesClaim))
        {
            return rolesClaim.Contains(role);
        }

        // Fallback to standard role claims
        return user.IsInRole(role);
    }

    public async Task<bool> HasPermissionAsync(ClaimsPrincipal user, string permission)
    {
        if (user == null || !user.Identity?.IsAuthenticated == true)
        {
            return false;
        }

        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                     ?? user.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return false;
        }

        return await HasPermissionAsync(userId, permission);
    }

    public async Task<bool> CanAccessResourceAsync(string userId, string resourceType, string resourceId, string action)
    {
        try
        {
            // Get user roles
            var roles = await GetUserRolesAsync(userId);

            // Admin can access everything
            if (roles.Contains(Roles.Admin))
            {
                return true;
            }

            // Resource-specific access control
            switch (resourceType.ToLower())
            {
                case "prescription":
                    return await CanAccessPrescriptionAsync(userId, resourceId, action, roles);

                case "patient":
                    return await CanAccessPatientAsync(userId, resourceId, action, roles);

                case "dispensation":
                    return await CanAccessDispensationAsync(userId, resourceId, action, roles);

                case "auditlog":
                    return roles.Contains(Roles.Auditor) || roles.Contains(Roles.Admin);

                default:
                    _logger.LogWarning("Unknown resource type: {ResourceType}", resourceType);
                    return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking resource access for user {UserId}", userId);
            return false;
        }
    }

    public async Task<AuthorizationResult> ValidateMedicalActionAsync(string userId, string action)
    {
        try
        {
            var roles = await GetUserRolesAsync(userId);

            switch (action)
            {
                case MedicalActions.CreatePrescription:
                case MedicalActions.UpdatePrescription:
                case MedicalActions.CancelPrescription:
                    if (roles.Contains(Roles.Doctor) || roles.Contains(Roles.Admin))
                    {
                        return AuthorizationResult.Success();
                    }
                    return AuthorizationResult.Failure(
                        "Only doctors can create, update, or cancel prescriptions",
                        new List<string> { Roles.Doctor },
                        new List<string>()
                    );

                case MedicalActions.DispenseMedication:
                    if (roles.Contains(Roles.Pharmacist) || roles.Contains(Roles.Admin))
                    {
                        return AuthorizationResult.Success();
                    }
                    return AuthorizationResult.Failure(
                        "Only pharmacists can dispense medications",
                        new List<string> { Roles.Pharmacist },
                        new List<string>()
                    );

                case MedicalActions.ViewAuditLogs:
                case MedicalActions.ExportAuditLogs:
                    if (roles.Contains(Roles.Auditor) || roles.Contains(Roles.Admin))
                    {
                        return AuthorizationResult.Success();
                    }
                    return AuthorizationResult.Failure(
                        "Only auditors can view audit logs",
                        new List<string> { Roles.Auditor },
                        new List<string>()
                    );

                case MedicalActions.ManageUsers:
                case MedicalActions.ManageRoles:
                case MedicalActions.ManagePermissions:
                    if (roles.Contains(Roles.Admin))
                    {
                        return AuthorizationResult.Success();
                    }
                    return AuthorizationResult.Failure(
                        "Only administrators can manage users, roles, and permissions",
                        new List<string> { Roles.Admin },
                        new List<string>()
                    );

                default:
                    return AuthorizationResult.Failure($"Unknown medical action: {action}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating medical action {Action} for user {UserId}", action, userId);
            return AuthorizationResult.Failure("An error occurred during authorization");
        }
    }

    // Private helper methods for resource-specific access control

    private async Task<bool> CanAccessPrescriptionAsync(string userId, string prescriptionId, string action, List<string> roles)
    {
        // Doctors can access prescriptions they created
        // Pharmacists can view prescriptions for dispensation
        // Patients can view their own prescriptions
        // Admins can access all prescriptions

        if (roles.Contains(Roles.Admin))
        {
            return true;
        }

        var prescription = await _context.Prescriptions
            .Include(p => p.Doctor)
            .Include(p => p.Patient)
            .FirstOrDefaultAsync(p => p.Id.ToString() == prescriptionId);

        if (prescription == null)
        {
            return false;
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.KeycloakUserId == userId);
        if (user == null)
        {
            return false;
        }

        // Doctor can access their own prescriptions
        if (roles.Contains(Roles.Doctor) && prescription.DoctorId == user.Id)
        {
            return true;
        }

        // Pharmacist can view prescriptions for dispensation
        if (roles.Contains(Roles.Pharmacist) && action == "read")
        {
            return true;
        }

        // Patient can view their own prescriptions
        if (roles.Contains(Roles.Patient) && prescription.PatientId == user.Id)
        {
            return action == "read";
        }

        return false;
    }

    private async Task<bool> CanAccessPatientAsync(string userId, string patientId, string action, List<string> roles)
    {
        if (roles.Contains(Roles.Admin))
        {
            return true;
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.KeycloakUserId == userId);
        if (user == null)
        {
            return false;
        }

        // Patient can access their own record
        if (roles.Contains(Roles.Patient) && user.Id.ToString() == patientId)
        {
            return action == "read";
        }

        // Doctors can access patient records for their patients
        if (roles.Contains(Roles.Doctor))
        {
            var hasActivePrescription = await _context.Prescriptions
                .AnyAsync(p => p.PatientId.ToString() == patientId && p.DoctorId == user.Id);

            return hasActivePrescription;
        }

        return false;
    }

    private async Task<bool> CanAccessDispensationAsync(string userId, string dispensationId, string action, List<string> roles)
    {
        if (roles.Contains(Roles.Admin))
        {
            return true;
        }

        // Pharmacists can access dispensations
        if (roles.Contains(Roles.Pharmacist))
        {
            return true;
        }

        // Patients can view their own dispensations
        if (roles.Contains(Roles.Patient))
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.KeycloakUserId == userId);
            if (user == null)
            {
                return false;
            }

            var dispensation = await _context.Dispensations
                .Include(d => d.Prescription)
                .FirstOrDefaultAsync(d => d.Id.ToString() == dispensationId);

            return dispensation != null && dispensation.Prescription.PatientId == user.Id && action == "read";
        }

        return false;
    }
}
