namespace EPrescription.API.DTOs;

// Role DTOs
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

public class CreateRoleRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateRoleRequest
{
    public string? Description { get; set; }
}

// Permission DTOs
public class PermissionDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class PermissionDetailDto : PermissionDto
{
    public List<RoleDto> Roles { get; set; } = new();
}

public class CreatePermissionRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdatePermissionRequest
{
    public string? Description { get; set; }
}

// Assignment DTOs
public class AssignPermissionRequest
{
    public Guid PermissionId { get; set; }
}

public class AssignRoleRequest
{
    public Guid RoleId { get; set; }
}
