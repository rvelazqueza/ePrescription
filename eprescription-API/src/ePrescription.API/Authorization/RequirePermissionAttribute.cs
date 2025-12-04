using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using EPrescription.Application.Interfaces;
using System.Security.Claims;

namespace EPrescription.API.Authorization;

/// <summary>
/// Authorization attribute to require specific permissions
/// Usage: [RequirePermission("create_prescription")]
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class RequirePermissionAttribute : Attribute, IAsyncAuthorizationFilter
{
    private readonly string[] _permissions;

    /// <summary>
    /// Require one or more permissions (user must have at least one)
    /// </summary>
    /// <param name="permissions">Required permissions</param>
    public RequirePermissionAttribute(params string[] permissions)
    {
        _permissions = permissions ?? throw new ArgumentNullException(nameof(permissions));
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

        // Check if user has any of the required permissions
        bool hasAccess = false;
        foreach (var permission in _permissions)
        {
            if (await authorizationService.HasPermissionAsync(userId, permission))
            {
                hasAccess = true;
                break;
            }
        }

        if (!hasAccess)
        {
            context.Result = new ObjectResult(new
            {
                error = "Forbidden",
                message = $"Access denied. This action requires one of these permissions: {string.Join(", ", _permissions)}",
                requiredPermissions = _permissions
            })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }
}
