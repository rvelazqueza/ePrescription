using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EPrescription.API.Authorization;
using EPrescription.Application.Interfaces;
using EPrescription.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EPrescription.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class RolesController : ControllerBase
{
    private readonly EPrescriptionDbContext _context;
    private readonly IAuthorizationService _authorizationService;
    private readonly ILogger<RolesController> _logger;

    public RolesController(
        EPrescriptionDbContext context,
        IAuthorizationService authorizationService,
        ILogger<RolesController> logger)
    {
        _context = context;
        _authorizationService = authorizationService;
        _logger = logger;
    }

    /// <summary>
    /// Get all roles
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<RoleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _context.Roles
            .Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(roles);
    }

    /// <summary>
    /// Get role by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(RoleDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetRole(Guid id)
    {
        var role = await _context.Roles
            .Include(r => r.RolePermissions)
            .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (role == null)
        {
            return NotFound(new { message = "Role not found" });
        }

        var roleDto = new RoleDetailDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            CreatedAt = role.CreatedAt,
            Permissions = role.RolePermissions.Select(rp => new PermissionDto
            {
                Id = rp.Permission.Id,
                Name = rp.Permission.Name,
                Description = rp.Permission.Description
            }).ToList()
        };

        return Ok(roleDto);
    }

    /// <summary>
    /// Create a new role (Admin only)
    /// </summary>
    [HttpPost]
    [RequireRole(Roles.Admin)]
    [ProducesResponseType(typeof(RoleDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request)
    {
        // Validate request
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Role name is required" });
        }

        // Check if role already exists
        var existingRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == request.Name);

        if (existingRole != null)
        {
            return BadRequest(new { message = "Role already exists" });
        }

        // Create role
        var role = new Domain.Entities.Role
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Role {RoleName} created by user {Username}", 
            role.Name, User.Identity?.Name);

        var roleDto = new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            CreatedAt = role.CreatedAt
        };

        return CreatedAtAction(nameof(GetRole), new { id = role.Id }, roleDto);
    }

    /// <summary>
    /// Update role (Admin only)
    /// </summary>
    [HttpPut("{id}")]
    [RequireRole(Roles.Admin)]
    [ProducesResponseType(typeof(RoleDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleRequest request)
    {
        var role = await _context.Roles.FindAsync(id);

        if (role == null)
        {
            return NotFound(new { message = "Role not found" });
        }

        // Update properties
        if (!string.IsNullOrWhiteSpace(request.Description))
        {
            role.Description = request.Description;
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Role {RoleName} updated by user {Username}", 
            role.Name, User.Identity?.Name);

        var roleDto = new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            CreatedAt = role.CreatedAt
        };

        return Ok(roleDto);
    }

    /// <summary>
    /// Delete role (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [RequireRole(Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        var role = await _context.Roles.FindAsync(id);

        if (role == null)
        {
            return NotFound(new { message = "Role not found" });
        }

        // Check if role is a system role (cannot be deleted)
        var systemRoles = new[] { "admin", "doctor", "pharmacist", "patient", "auditor" };
        if (systemRoles.Contains(role.Name.ToLower()))
        {
            return BadRequest(new { message = "System roles cannot be deleted" });
        }

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Role {RoleName} deleted by user {Username}", 
            role.Name, User.Identity?.Name);

        return NoContent();
    }

    /// <summary>
    /// Assign permission to role (Admin only)
    /// </summary>
    [HttpPost("{roleId}/permissions/{permissionId}")]
    [RequireRole(Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> AssignPermissionToRole(Guid roleId, Guid permissionId)
    {
        var role = await _context.Roles.FindAsync(roleId);
        var permission = await _context.Permissions.FindAsync(permissionId);

        if (role == null || permission == null)
        {
            return NotFound(new { message = "Role or permission not found" });
        }

        // Check if already assigned
        var existing = await _context.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);

        if (existing != null)
        {
            return BadRequest(new { message = "Permission already assigned to role" });
        }

        // Assign permission
        var rolePermission = new Domain.Entities.RolePermission
        {
            RoleId = roleId,
            PermissionId = permissionId
        };

        _context.RolePermissions.Add(rolePermission);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Permission {PermissionName} assigned to role {RoleName} by user {Username}", 
            permission.Name, role.Name, User.Identity?.Name);

        return Ok(new { message = "Permission assigned successfully" });
    }

    /// <summary>
    /// Remove permission from role (Admin only)
    /// </summary>
    [HttpDelete("{roleId}/permissions/{permissionId}")]
    [RequireRole(Roles.Admin)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> RemovePermissionFromRole(Guid roleId, Guid permissionId)
    {
        var rolePermission = await _context.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);

        if (rolePermission == null)
        {
            return NotFound(new { message = "Permission assignment not found" });
        }

        _context.RolePermissions.Remove(rolePermission);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Permission removed from role by user {Username}", User.Identity?.Name);

        return NoContent();
    }
}

// DTOs
public class RoleDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class RoleDetailDto : RoleDto
{
    public List<PermissionDto> Permissions { get; set; } = new();
}

public class PermissionDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class CreateRoleRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateRoleRequest
{
    public string? Description { get; set; }
}
