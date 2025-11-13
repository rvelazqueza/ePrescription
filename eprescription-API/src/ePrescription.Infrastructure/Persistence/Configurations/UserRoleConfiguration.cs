using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("USER_ROLES");
        builder.HasKey(ur => ur.Id);
        builder.Property(ur => ur.Id).HasColumnName("USER_ROLE_ID");
        builder.Property(ur => ur.UserId).HasColumnName("USER_ID").IsRequired();
        builder.Property(ur => ur.RoleId).HasColumnName("ROLE_ID").IsRequired();
        builder.Property(ur => ur.AssignedAt).HasColumnName("ASSIGNED_AT");

        // Relationships - Many-to-Many between Users and Roles
        builder.HasOne<User>()
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Role>()
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unique constraint: a user can have a role only once
        builder.HasIndex(ur => new { ur.UserId, ur.RoleId }).IsUnique();
    }
}
