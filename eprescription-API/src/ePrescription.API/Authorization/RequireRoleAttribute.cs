using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using EPrescription.Application.Interfaces;
using System.Security.Claims;

namespace EPrescription.API.Authorization;

/// <summary>
/// Authorization attribute to require specific roles
/// Usage: [RequireRole("doctor", "admin")]
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class RequireRoleAttribute : Attribute, IAsyncAuthorizationFilter
{
    private readonly string[] _roles;
    private readonly bool _requireAll;

    /// <summary>
    /// Require one or more roles
    /// </summary>
    /// <param name="roles">Required roles</param>
    public RequireRoleAttribute(params string[] roles)
    {
        _roles = roles ?? throw new ArgumentNullException(nameof(roles));
        _requireAll = false;
    }

    /// <summary>
    /// Require roles with option to require all or any
    /// </summary>
    /// <param name="requireAll">If true, user must have all roles. If false, user must have at least one role.</param>
    /// <param name="roles">Required roles</param>
    public RequireRoleAttribute(bool requireAll, params string[] roles)
    {
        _roles = roles ?? throw new ArgumentNullException(nameof(roles));
        _requireAll = requireAll;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        // Check if user is authenticated
        if (!context.HttpContext.User.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedObjectResult(new
            {
                error = "Unauthorized",
                message = "Authentication required"
            });
            return;
        }

        var authorizationService = context.HttpContext.RequestServices
            .GetService<IAuthorizationService>();

        if (authorizationService == null)
        {
            context.Result = new StatusCodeResult(StatusCodes.Status500InternalServerError);
            return;
        }

        var user = context.HttpContext.User;
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                     ?? user.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            context.Result = new UnauthorizedObjectResult(new
            {
                error = "Unauthorized",
                message = "User ID not found in token"
            });
            return;
        }

        bool hasAccess;

        if (_requireAll)
        {
            hasAccess = await authorizationService.HasAllRolesAsync(userId, _roles);
        }
        else
        {
            hasAccess = await authorizationService.HasAnyRoleAsync(userId, _roles);
        }

        if (!hasAccess)
        {
            var requiredRolesMessage = _requireAll
                ? $"all of these roles: {string.Join(", ", _roles)}"
                : $"one of these roles: {string.Join(", ", _roles)}";

            context.Result = new ObjectResult(new
            {
                error = "Forbidden",
                message = $"Access denied. This action requires {requiredRolesMessage}",
                requiredRoles = _roles
            })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }
}
