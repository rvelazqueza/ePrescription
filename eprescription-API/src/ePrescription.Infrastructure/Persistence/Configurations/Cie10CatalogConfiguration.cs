using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class Cie10CatalogConfiguration : IEntityTypeConfiguration<Cie10Catalog>
{
    public void Configure(EntityTypeBuilder<Cie10Catalog> builder)
    {
        builder.ToTable("CIE10_CATALOG");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("CIE10_ID");
        builder.Property(c => c.Code).HasColumnName("CODE").HasMaxLength(10).IsRequired();
        builder.Property(c => c.DescriptionEs).HasColumnName("DESCRIPTION_ES").HasMaxLength(500).IsRequired();
        builder.Property(c => c.DescriptionEn).HasColumnName("DESCRIPTION_EN").HasMaxLength(500);
        builder.Property(c => c.Category).HasColumnName("CATEGORY").HasMaxLength(100);
        builder.Property(c => c.Chapter).HasColumnName("CHAPTER").HasMaxLength(200);
        builder.Property(c => c.IsActive).HasColumnName("IS_ACTIVE").HasDefaultValue(true);
        builder.Property(c => c.Source).HasColumnName("SOURCE").HasMaxLength(20).HasDefaultValue("MANUAL");
        builder.Property(c => c.LastUpdated).HasColumnName("LAST_UPDATED");
        builder.Property(c => c.CreatedAt).HasColumnName("CREATED_AT");
        builder.HasIndex(c => c.Code).IsUnique();
    }
}
