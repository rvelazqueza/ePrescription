using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

/// <summary>
/// EF Core configuration for UserRole entity
/// Maps to existing USER_ROLES table in Oracle with legacy schema
/// </summary>
public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("USER_ROLES");

        // Primary Key - maps to USER_ROLE_ID in Oracle
        builder.HasKey(ur => ur.Id);
        builder.Property(ur => ur.Id)
            .HasColumnName("USER_ROLE_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        // Foreign Keys
        builder.Property(ur => ur.UserId)
            .HasColumnName("USER_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        builder.Property(ur => ur.RoleId)
            .HasColumnName("ROLE_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        builder.Property(ur => ur.AssignedBy)
            .HasColumnName("ASSIGNED_BY")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.HasValue ? guid.Value.ToByteArray() : null,
                bytes => bytes != null ? new Guid(bytes) : (Guid?)null);

        // Timestamps
        builder.Property(ur => ur.AssignedAt)
            .HasColumnName("ASSIGNED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired();

        // IMPORTANT: CreatedAt and UpdatedAt do NOT exist in Oracle table
        // The table only has ASSIGNED_AT
        builder.Ignore(ur => ur.CreatedAt);
        builder.Ignore(ur => ur.UpdatedAt);

        // Indexes
        builder.HasIndex(ur => new { ur.UserId, ur.RoleId })
            .IsUnique()
            .HasDatabaseName("UK_USER_ROLES_USER_ROLE");

        builder.HasIndex(ur => ur.UserId)
            .HasDatabaseName("IDX_USER_ROLES_USER");

        builder.HasIndex(ur => ur.RoleId)
            .HasDatabaseName("IDX_USER_ROLES_ROLE");

        // Relationships
        builder.HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ur => ur.AssignedByUser)
            .WithMany()
            .HasForeignKey(ur => ur.AssignedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
