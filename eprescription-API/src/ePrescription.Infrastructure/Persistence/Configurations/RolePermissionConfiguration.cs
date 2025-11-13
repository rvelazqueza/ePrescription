using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ToTable("ROLE_PERMISSIONS");
        builder.HasKey(rp => rp.Id);
        builder.Property(rp => rp.Id).HasColumnName("ROLE_PERMISSION_ID");
        builder.Property(rp => rp.RoleId).HasColumnName("ROLE_ID").IsRequired();
        builder.Property(rp => rp.PermissionId).HasColumnName("PERMISSION_ID").IsRequired();
        builder.Property(rp => rp.AssignedAt).HasColumnName("ASSIGNED_AT");

        // Relationships - Many-to-Many between Roles and Permissions
        builder.HasOne<Role>()
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Permission>()
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unique constraint: a role can have a permission only once
        builder.HasIndex(rp => new { rp.RoleId, rp.PermissionId }).IsUnique();
    }
}
