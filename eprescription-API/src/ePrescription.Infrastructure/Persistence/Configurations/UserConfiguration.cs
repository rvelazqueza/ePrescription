using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("USERS");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).HasColumnName("USER_ID");
        builder.Property(u => u.Username).HasColumnName("USERNAME").HasMaxLength(100).IsRequired();
        builder.Property(u => u.Email).HasColumnName("EMAIL").HasMaxLength(200).IsRequired();
        builder.Property(u => u.KeycloakUserId).HasColumnName("KEYCLOAK_USER_ID").HasMaxLength(100);
        builder.Property(u => u.IsActive).HasColumnName("IS_ACTIVE").HasDefaultValue(true);
        builder.Property(u => u.CreatedAt).HasColumnName("CREATED_AT");
        builder.Property(u => u.UpdatedAt).HasColumnName("UPDATED_AT");
        builder.HasIndex(u => u.Username).IsUnique();
        builder.HasIndex(u => u.Email).IsUnique();
    }
}
