using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EPrescription.API.Authorization;
using EPrescription.API.DTOs;
using EPrescription.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using EPrescription.Application.Constants;

namespace EPrescription.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class PermissionsController : ControllerBase
{
    private readonly EPrescriptionDbContext _context;
    private readonly ILogger<PermissionsController> _logger;

    public PermissionsController(
        EPrescriptionDbContext context,
        ILogger<PermissionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all permissions
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<PermissionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPermissions()
    {
        var permissions = await _context.Permissions
            .Select(p => new PermissionDto
            {
                Id = p.Id,
                Name = p.PermissionName,
                Description = p.Description,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();

        return Ok(permissions);
    }

    /// <summary>
    /// Get permission by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PermissionDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPermission(Guid id)
    {
        var permission = await _context.Permissions
            .Include(p => p.RolePermissions)
            .ThenInclude(rp => rp.Role)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (permission == null)
        {
            return NotFound(new { message = "Permission not found" });
        }

        var permissionDto = new PermissionDetailDto
        {
            Id = permission.Id,
            Name = permission.PermissionName,
            Description = permission.Description,
            CreatedAt = permission.CreatedAt,
            Roles = permission.RolePermissions.Select(rp => new RoleDto
            {
                Id = rp.Role.Id,
                Name = rp.Role.RoleName,
                Description = rp.Role.Description,
                CreatedAt = rp.Role.CreatedAt
            }).ToList()
        };

        return Ok(permissionDto);
    }

    /// <summary>
    /// Create a new permission (Admin only)
    /// </summary>
    [HttpPost]
    [RequireRole(Roles.Admin)]
    [ProducesResponseType(typeof(PermissionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreatePermission([FromBody] CreatePermissionRequest request)
    {
        // Validate request
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Permission name is required" });
        }

        // Check if permission already exists
        var existingPermission = await _context.Permissions
            .FirstOrDefaultAsync(p => p.PermissionName == request.Name);

        if (existingPermission != null)
        {
            return BadRequest(new { message = "Permission already exists" });
        }

        // Parse permission name to extract resource and action
        var parts = request.Name.Split('.');
        var resourceName = parts.Length > 0 ? parts[0] : "unknown";
        var action = parts.Length > 1 ? parts[1] : "unknown";

        // Create permission
        var permission = new Domain.Entities.Permission(request.Name, resourceName, action, request.Description);

        _context.Permissions.Add(permission);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Permission {PermissionName} created by user {Username}", 
            permission.PermissionName, User.Identity?.Name);

        var permissionDto = new PermissionDto
        {
            Id = permission.Id,
            Name = permission.PermissionName,
            Description = permission.Description,
            CreatedAt = permission.CreatedAt
        };

        return CreatedAtAction(nameof(GetPermission), new { id = permission.Id }, permissionDto);
    }

    /// <summary>
    /// Update permission (Admin only)
    /// </summary>
    [HttpPut("{id}")]
    [RequireRole(Roles.Admin)]
    [ProducesResponseType(typeof(PermissionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdatePermission(Guid id, [FromBody] UpdatePermissionRequest request)
    {
        var permission = await _context.Permissions.FindAsync(id);

        if (permission == null)
        {
            return NotFound(new { message = "Permission not found" });
        }

        // Update properties
        if (!string.IsNullOrWhiteSpace(request.Description))
        {
            permission.UpdateDescription(request.Description);
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Permission {PermissionName} updated by user {Username}", 
            permission.PermissionName, User.Identity?.Name);

        var permissionDto = new PermissionDto
        {
            Id = permission.Id,
            Name = permission.PermissionName,
            Description = permission.Description,
            CreatedAt = permission.CreatedAt
        };

        return Ok(permissionDto);
    }

    /// <summary>
    /// Delete permission (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [RequireRole(Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeletePermission(Guid id)
    {
        var permission = await _context.Permissions.FindAsync(id);

        if (permission == null)
        {
            return NotFound(new { message = "Permission not found" });
        }

        _context.Permissions.Remove(permission);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Permission {PermissionName} deleted by user {Username}", 
            permission.PermissionName, User.Identity?.Name);

        return NoContent();
    }

    /// <summary>
    /// Get permissions by role
    /// </summary>
    [HttpGet("by-role/{roleId}")]
    [ProducesResponseType(typeof(List<PermissionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPermissionsByRole(Guid roleId)
    {
        var role = await _context.Roles
            .Include(r => r.RolePermissions)
            .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Id == roleId);

        if (role == null)
        {
            return NotFound(new { message = "Role not found" });
        }

        var permissions = role.RolePermissions.Select(rp => new PermissionDto
        {
            Id = rp.Permission.Id,
            Name = rp.Permission.PermissionName,
            Description = rp.Permission.Description,
            CreatedAt = rp.Permission.CreatedAt
        }).ToList();

        return Ok(permissions);
    }
}
