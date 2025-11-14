using System.Security.Claims;
using EPrescription.Application.Interfaces;

namespace EPrescription.API.Middleware;

/// <summary>
/// Middleware for authorization logging and enhanced security checks
/// </summary>
public class AuthorizationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuthorizationMiddleware> _logger;

    public AuthorizationMiddleware(
        RequestDelegate next,
        ILogger<AuthorizationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, IAuthorizationService authorizationService)
    {
        // Skip authorization for public endpoints
        var endpoint = context.GetEndpoint();
        if (endpoint?.Metadata?.GetMetadata<Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute>() != null)
        {
            await _next(context);
            return;
        }

        // Check if user is authenticated
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? context.User.FindFirst("sub")?.Value;
            var username = context.User.FindFirst(ClaimTypes.Name)?.Value 
                          ?? context.User.FindFirst("preferred_username")?.Value;

            // Log authorization attempt
            _logger.LogInformation(
                "Authorization check for user {Username} (ID: {UserId}) accessing {Method} {Path}",
                username,
                userId,
                context.Request.Method,
                context.Request.Path
            );

            // Extract roles from token
            var roles = ExtractRolesFromClaims(context.User);
            
            if (roles.Any())
            {
                _logger.LogDebug("User {Username} has roles: {Roles}", username, string.Join(", ", roles));
            }
            else
            {
                _logger.LogWarning("User {Username} has no roles assigned", username);
            }

            // Add user info to HttpContext items for easy access in controllers
            context.Items["UserId"] = userId;
            context.Items["Username"] = username;
            context.Items["UserRoles"] = roles;
        }

        await _next(context);

        // Log authorization result
        if (context.Response.StatusCode == 403)
        {
            var userId = context.Items["UserId"]?.ToString();
            var username = context.Items["Username"]?.ToString();
            
            _logger.LogWarning(
                "Authorization denied for user {Username} (ID: {UserId}) accessing {Method} {Path}",
                username,
                userId,
                context.Request.Method,
                context.Request.Path
            );
        }
    }

    private List<string> ExtractRolesFromClaims(ClaimsPrincipal user)
    {
        var roles = new List<string>();

        // Try to get roles from realm_access claim (Keycloak format)
        var realmAccessClaim = user.FindFirst("realm_access.roles")?.Value;
        if (!string.IsNullOrEmpty(realmAccessClaim))
        {
            // The claim might be a JSON array or comma-separated string
            roles.AddRange(realmAccessClaim.Split(',').Select(r => r.Trim()));
        }

        // Also check standard role claims
        var roleClaims = user.FindAll(ClaimTypes.Role);
        roles.AddRange(roleClaims.Select(c => c.Value));

        // Check for "role" claim (alternative format)
        var roleClaimsAlt = user.FindAll("role");
        roles.AddRange(roleClaimsAlt.Select(c => c.Value));

        return roles.Distinct().ToList();
    }
}

/// <summary>
/// Extension methods for AuthorizationMiddleware
/// </summary>
public static class AuthorizationMiddlewareExtensions
{
    public static IApplicationBuilder UseAuthorizationLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AuthorizationMiddleware>();
    }
}
