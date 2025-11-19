using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration for RolePermission entity
/// Maps to existing ROLE_PERMISSIONS table in Oracle with legacy schema
/// </summary>
public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ToTable("ROLE_PERMISSIONS");

        // Primary Key - maps to ROLE_PERMISSION_ID in Oracle
        builder.HasKey(rp => rp.Id);
        builder.Property(rp => rp.Id)
            .HasColumnName("ROLE_PERMISSION_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Foreign Keys
        builder.Property(rp => rp.RoleId)
            .HasColumnName("ROLE_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        builder.Property(rp => rp.PermissionId)
            .HasColumnName("PERMISSION_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Timestamps
        builder.Property(rp => rp.GrantedAt)
            .HasColumnName("GRANTED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired();

        // IMPORTANT: CreatedAt and UpdatedAt do NOT exist in Oracle table
        // The table only has GRANTED_AT
        builder.Ignore(rp => rp.CreatedAt);
        builder.Ignore(rp => rp.UpdatedAt);

        // Indexes
        builder.HasIndex(rp => new { rp.RoleId, rp.PermissionId })
            .IsUnique()
            .HasDatabaseName("UK_ROLE_PERMISSIONS_ROLE_PERM");

        builder.HasIndex(rp => rp.RoleId)
            .HasDatabaseName("IDX_ROLE_PERMISSIONS_ROLE");

        builder.HasIndex(rp => rp.PermissionId)
            .HasDatabaseName("IDX_ROLE_PERMISSIONS_PERMISSION");

        // Relationships
        builder.HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(rp => rp.Permission)
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
