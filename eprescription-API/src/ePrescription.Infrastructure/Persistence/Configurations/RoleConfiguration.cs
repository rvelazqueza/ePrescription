using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration for Role entity
/// Maps to existing ROLES table in Oracle with legacy schema
/// </summary>
public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("ROLES");

        // Primary Key - maps to ROLE_ID in Oracle
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id)
            .HasColumnName("ROLE_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Properties
        builder.Property(r => r.RoleName)
            .HasColumnName("ROLE_NAME")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(r => r.Description)
            .HasColumnName("DESCRIPTION")
            .HasMaxLength(500);

        builder.Property(r => r.KeycloakRoleId)
            .HasColumnName("KEYCLOAK_ROLE_ID")
            .HasMaxLength(100);

        builder.Property(r => r.IsActive)
            .HasColumnName("IS_ACTIVE")
            .HasDefaultValue(true);

        builder.Property(r => r.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired();

        // IMPORTANT: UpdatedAt does NOT exist in Oracle table
        // Ignore it to prevent ORA-00904 errors
        builder.Ignore(r => r.UpdatedAt);

        // Indexes
        builder.HasIndex(r => r.RoleName)
            .IsUnique()
            .HasDatabaseName("UK_ROLES_ROLE_NAME");

        builder.HasIndex(r => r.KeycloakRoleId)
            .HasDatabaseName("IDX_ROLES_KEYCLOAK_ID");

        // Relationships
        builder.HasMany(r => r.UserRoles)
            .WithOne(ur => ur.Role)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(r => r.RolePermissions)
            .WithOne(rp => rp.Role)
            .HasForeignKey(rp => rp.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
