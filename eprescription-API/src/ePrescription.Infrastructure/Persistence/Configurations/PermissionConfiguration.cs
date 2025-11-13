using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder.ToTable("PERMISSIONS");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("PERMISSION_ID");
        builder.Property(p => p.PermissionName).HasColumnName("PERMISSION_NAME").HasMaxLength(100).IsRequired();
        builder.Property(p => p.ResourceName).HasColumnName("RESOURCE_NAME").HasMaxLength(100).IsRequired();
        builder.Property(p => p.Action).HasColumnName("ACTION").HasMaxLength(50).IsRequired();
        builder.Property(p => p.Description).HasColumnName("DESCRIPTION").HasMaxLength(500);
        builder.Property(p => p.CreatedAt).HasColumnName("CREATED_AT");
        builder.HasIndex(p => p.PermissionName).IsUnique();
    }
}
