using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("ROLES");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).HasColumnName("ROLE_ID");
        builder.Property(r => r.RoleName).HasColumnName("ROLE_NAME").HasMaxLength(100).IsRequired();
        builder.Property(r => r.Description).HasColumnName("DESCRIPTION").HasMaxLength(500);
        builder.Property(r => r.KeycloakRoleId).HasColumnName("KEYCLOAK_ROLE_ID").HasMaxLength(100);
        builder.Property(r => r.CreatedAt).HasColumnName("CREATED_AT");
        builder.HasIndex(r => r.RoleName).IsUnique();
    }
}
