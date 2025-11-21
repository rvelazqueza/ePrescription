using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration for Permission entity
/// Maps to existing PERMISSIONS table in Oracle with legacy schema
/// </summary>
public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder.ToTable("PERMISSIONS");

        // Primary Key - maps to PERMISSION_ID in Oracle
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id)
            .HasColumnName("PERMISSION_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Properties
        builder.Property(p => p.PermissionName)
            .HasColumnName("PERMISSION_NAME")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(p => p.ResourceName)
            .HasColumnName("RESOURCE_NAME")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(p => p.Action)
            .HasColumnName("ACTION")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.Description)
            .HasColumnName("DESCRIPTION")
            .HasMaxLength(500);

        builder.Property(p => p.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired();

        // IMPORTANT: UpdatedAt does NOT exist in Oracle table
        builder.Ignore(p => p.UpdatedAt);

        // Indexes
        builder.HasIndex(p => p.PermissionName)
            .IsUnique()
            .HasDatabaseName("UK_PERMISSIONS_NAME");

        builder.HasIndex(p => new { p.ResourceName, p.Action })
            .HasDatabaseName("IDX_PERMISSIONS_RESOURCE_ACTION");

        // Relationships
        builder.HasMany(p => p.RolePermissions)
            .WithOne(rp => rp.Permission)
            .HasForeignKey(rp => rp.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
