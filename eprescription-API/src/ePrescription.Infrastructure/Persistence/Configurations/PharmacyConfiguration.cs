using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PharmacyConfiguration : IEntityTypeConfiguration<Pharmacy>
{
    public void Configure(EntityTypeBuilder<Pharmacy> builder)
    {
        builder.ToTable("PHARMACIES");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("PHARMACY_ID");
        builder.Property(p => p.PharmacyName).HasColumnName("PHARMACY_NAME").HasMaxLength(200).IsRequired();
        builder.Property(p => p.LicenseNumber).HasColumnName("LICENSE_NUMBER").HasMaxLength(50).IsRequired();
        builder.Property(p => p.PhoneNumber).HasColumnName("PHONE_NUMBER").HasMaxLength(20);
        builder.Property(p => p.Email).HasColumnName("EMAIL").HasMaxLength(200);
        builder.Property(p => p.IsActive).HasColumnName("IS_ACTIVE").HasDefaultValue(true);
        builder.Property(p => p.AddressId).HasColumnName("ADDRESS_ID");
        builder.Property(p => p.CreatedAt).HasColumnName("CREATED_AT");
        builder.Property(p => p.UpdatedAt).HasColumnName("UPDATED_AT");
        builder.HasIndex(p => p.LicenseNumber).IsUnique();
    }
}
