using EPrescription.Domain.Entities;
using EPrescription.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EPrescription.Infrastructure.Authorization;

/// <summary>
/// Service to synchronize Keycloak roles with local database
/// </summary>
public class KeycloakSyncService
{
    private readonly EPrescriptionDbContext _context;
    private readonly ILogger<KeycloakSyncService> _logger;

    public KeycloakSyncService(
        EPrescriptionDbContext context,
        ILogger<KeycloakSyncService> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Initialize roles and permissions in the database
    /// This should be called on application startup
    /// </summary>
    public async Task InitializeRolesAndPermissionsAsync()
    {
        _logger.LogInformation("Initializing roles and permissions...");

        try
        {
            // Create roles if they don't exist
            await EnsureRolesExistAsync();

            // Create permissions if they don't exist
            await EnsurePermissionsExistAsync();

            // Assign permissions to roles
            await AssignPermissionsToRolesAsync();

            _logger.LogInformation("Roles and permissions initialized successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing roles and permissions");
            throw;
        }
    }

    private async Task EnsureRolesExistAsync()
    {
        var roles = new[]
        {
            new { Name = "admin", Description = "Administrator with full system access" },
            new { Name = "doctor", Description = "Medical doctor who can create prescriptions" },
            new { Name = "pharmacist", Description = "Pharmacist who can dispense medications" },
            new { Name = "patient", Description = "Patient who can view their own medical records" },
            new { Name = "auditor", Description = "Auditor who can view system logs and reports" }
        };

        foreach (var roleData in roles)
        {
            var existingRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName == roleData.Name);

            if (existingRole == null)
            {
                var role = new Role(roleData.Name, roleData.Description);

                _context.Roles.Add(role);
                _logger.LogInformation("Created role: {RoleName}", roleData.Name);
            }
        }

        await _context.SaveChangesAsync();
    }

    private async Task EnsurePermissionsExistAsync()
    {
        var permissions = new[]
        {
            // Prescription permissions
            new { Name = "prescription.create", Description = "Create new prescriptions" },
            new { Name = "prescription.read", Description = "View prescriptions" },
            new { Name = "prescription.update", Description = "Update prescriptions" },
            new { Name = "prescription.delete", Description = "Delete prescriptions" },
            
            // Medication permissions
            new { Name = "medication.dispense", Description = "Dispense medications" },
            new { Name = "medication.read", Description = "View medication information" },
            
            // Patient permissions
            new { Name = "patient.create", Description = "Create patient records" },
            new { Name = "patient.read", Description = "View patient records" },
            new { Name = "patient.update", Description = "Update patient records" },
            new { Name = "patient.read.own", Description = "View own patient record" },
            
            // Audit permissions
            new { Name = "audit.read", Description = "View audit logs" },
            new { Name = "audit.export", Description = "Export audit logs" },
            
            // System permissions
            new { Name = "system.manage.users", Description = "Manage system users" },
            new { Name = "system.manage.roles", Description = "Manage roles and permissions" },
            new { Name = "system.configure", Description = "Configure system settings" }
        };

        foreach (var permData in permissions)
        {
            var existingPerm = await _context.Permissions
                .FirstOrDefaultAsync(p => p.PermissionName == permData.Name);

            if (existingPerm == null)
            {
                // Parse permission name to extract resource and action
                var parts = permData.Name.Split('.');
                var resourceName = parts.Length > 0 ? parts[0] : "unknown";
                var action = parts.Length > 1 ? parts[1] : "unknown";
                
                var permission = new Permission(permData.Name, resourceName, action, permData.Description);

                _context.Permissions.Add(permission);
                _logger.LogInformation("Created permission: {PermissionName}", permData.Name);
            }
        }

        await _context.SaveChangesAsync();
    }

    private async Task AssignPermissionsToRolesAsync()
    {
        // Admin: All permissions
        await AssignPermissionsToRole("admin", new[]
        {
            "prescription.create", "prescription.read", "prescription.update", "prescription.delete",
            "medication.dispense", "medication.read",
            "patient.create", "patient.read", "patient.update",
            "audit.read", "audit.export",
            "system.manage.users", "system.manage.roles", "system.configure"
        });

        // Doctor: Prescription and patient management
        await AssignPermissionsToRole("doctor", new[]
        {
            "prescription.create", "prescription.read", "prescription.update",
            "patient.create", "patient.read", "patient.update",
            "medication.read"
        });

        // Pharmacist: Medication dispensation and prescription viewing
        await AssignPermissionsToRole("pharmacist", new[]
        {
            "prescription.read",
            "medication.dispense", "medication.read",
            "patient.read"
        });

        // Patient: View own records only
        await AssignPermissionsToRole("patient", new[]
        {
            "patient.read.own",
            "prescription.read" // Own prescriptions only
        });

        // Auditor: View logs and reports
        await AssignPermissionsToRole("auditor", new[]
        {
            "audit.read", "audit.export"
        });

        await _context.SaveChangesAsync();
    }

    private async Task AssignPermissionsToRole(string roleName, string[] permissionNames)
    {
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
        if (role == null)
        {
            _logger.LogWarning("Role {RoleName} not found", roleName);
            return;
        }

        foreach (var permName in permissionNames)
        {
            var permission = await _context.Permissions.FirstOrDefaultAsync(p => p.PermissionName == permName);
            if (permission == null)
            {
                _logger.LogWarning("Permission {PermissionName} not found", permName);
                continue;
            }

            var existingAssignment = await _context.RolePermissions
                .FirstOrDefaultAsync(rp => rp.RoleId == role.Id && rp.PermissionId == permission.Id);

            if (existingAssignment == null)
            {
                var rolePermission = new RolePermission(role.Id, permission.Id);

                _context.RolePermissions.Add(rolePermission);
                _logger.LogDebug("Assigned permission {PermissionName} to role {RoleName}", 
                    permName, roleName);
            }
        }
    }

    /// <summary>
    /// Sync a user from Keycloak to local database
    /// </summary>
    public async Task SyncUserAsync(string keycloakUserId, string username, string email, List<string> roles)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.KeycloakUserId == keycloakUserId);

        if (user == null)
        {
            // Create new user
            user = new User(username, email, keycloakUserId);

            _context.Users.Add(user);
            _logger.LogInformation("Created user {Username} from Keycloak", username);
        }
        else
        {
            // Update existing user
            user.UpdateProfile(email);
        }

        await _context.SaveChangesAsync();

        // Sync user roles
        await SyncUserRolesAsync(user.Id, roles);
    }

    private async Task SyncUserRolesAsync(Guid userId, List<string> roleNames)
    {
        // Remove existing role assignments
        var existingAssignments = await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .ToListAsync();

        _context.UserRoles.RemoveRange(existingAssignments);

        // Add new role assignments
        foreach (var roleName in roleNames)
        {
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
            if (role != null)
            {
                var userRole = new UserRole(userId, role.Id);

                _context.UserRoles.Add(userRole);
            }
        }

        await _context.SaveChangesAsync();
    }
}
