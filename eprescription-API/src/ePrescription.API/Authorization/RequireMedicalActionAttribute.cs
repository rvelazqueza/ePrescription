using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using EPrescription.Application.Interfaces;
using System.Security.Claims;

namespace EPrescription.API.Authorization;

/// <summary>
/// Authorization attribute for medical-specific actions
/// Validates against medical regulations and role requirements
/// Usage: [RequireMedicalAction(MedicalActions.CreatePrescription)]
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class RequireMedicalActionAttribute : Attribute, IAsyncAuthorizationFilter
{
    private readonly string _action;

    /// <summary>
    /// Require authorization for a specific medical action
    /// </summary>
    /// <param name="action">Medical action (use MedicalActions constants)</param>
    public RequireMedicalActionAttribute(string action)
    {
        _action = action ?? throw new ArgumentNullException(nameof(action));
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

        // Validate medical action
        var result = await authorizationService.ValidateMedicalActionAsync(userId, _action);

        if (!result.IsAuthorized)
        {
            context.Result = new ObjectResult(new
            {
                error = "Forbidden",
                message = result.Reason,
                action = _action,
                requiredRoles = result.RequiredRoles,
                requiredPermissions = result.RequiredPermissions
            })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }
}
