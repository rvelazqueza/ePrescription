using System.Security.Claims;

namespace EPrescription.Application.Interfaces;

/// <summary>
/// Service for handling authorization and permission checks
/// </summary>
public interface IAuthorizationService
{
    /// <summary>
    /// Check if user has a specific role
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="role">Role name (admin, doctor, pharmacist, patient, auditor)</param>
    /// <returns>True if user has the role</returns>
    Task<bool> HasRoleAsync(string userId, string role);

    /// <summary>
    /// Check if user has a specific permission
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="permission">Permission name</param>
    /// <returns>True if user has the permission</returns>
    Task<bool> HasPermissionAsync(string userId, string permission);

    /// <summary>
    /// Check if user has any of the specified roles
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="roles">List of role names</param>
    /// <returns>True if user has any of the roles</returns>
    Task<bool> HasAnyRoleAsync(string userId, params string[] roles);

    /// <summary>
    /// Check if user has all of the specified roles
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="roles">List of role names</param>
    /// <returns>True if user has all the roles</returns>
    Task<bool> HasAllRolesAsync(string userId, params string[] roles);

    /// <summary>
    /// Get all roles for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>List of role names</returns>
    Task<List<string>> GetUserRolesAsync(string userId);

    /// <summary>
    /// Get all permissions for a user (derived from roles)
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>List of permission names</returns>
    Task<List<string>> GetUserPermissionsAsync(string userId);

    /// <summary>
    /// Check if current user (from ClaimsPrincipal) has a specific role
    /// </summary>
    /// <param name="user">ClaimsPrincipal from HTTP context</param>
    /// <param name="role">Role name</param>
    /// <returns>True if user has the role</returns>
    bool HasRole(ClaimsPrincipal user, string role);

    /// <summary>
    /// Check if current user (from ClaimsPrincipal) has a specific permission
    /// </summary>
    /// <param name="user">ClaimsPrincipal from HTTP context</param>
    /// <param name="permission">Permission name</param>
    /// <returns>True if user has the permission</returns>
    Task<bool> HasPermissionAsync(ClaimsPrincipal user, string permission);

    /// <summary>
    /// Check if user can access a specific resource
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="resourceType">Type of resource (e.g., "Prescription", "Patient")</param>
    /// <param name="resourceId">ID of the resource</param>
    /// <param name="action">Action to perform (e.g., "read", "write", "delete")</param>
    /// <returns>True if user can access the resource</returns>
    Task<bool> CanAccessResourceAsync(string userId, string resourceType, string resourceId, string action);

    /// <summary>
    /// Validate if user can perform an action based on medical regulations
    /// For example: Only doctors can create prescriptions, only pharmacists can dispense
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="action">Medical action (e.g., "create_prescription", "dispense_medication")</param>
    /// <returns>Authorization result with success status and reason</returns>
    Task<AuthorizationResult> ValidateMedicalActionAsync(string userId, string action);
}

/// <summary>
/// Result of an authorization check
/// </summary>
public class AuthorizationResult
{
    public bool IsAuthorized { get; set; }
    public string? Reason { get; set; }
    public List<string> RequiredRoles { get; set; } = new();
    public List<string> RequiredPermissions { get; set; } = new();

    public static AuthorizationResult Success() => new() { IsAuthorized = true };
    
    public static AuthorizationResult Failure(string reason) => new() 
    { 
        IsAuthorized = false, 
        Reason = reason 
    };

    public static AuthorizationResult Failure(string reason, List<string> requiredRoles, List<string> requiredPermissions) => new()
    {
        IsAuthorized = false,
        Reason = reason,
        RequiredRoles = requiredRoles,
        RequiredPermissions = requiredPermissions
    };
}
