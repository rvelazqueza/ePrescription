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

        builder.Property(p => p.PharmacyName)
            .HasColumnName("PHARMACY_NAME")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(p => p.LicenseNumber)
            .HasColumnName("LICENSE_NUMBER")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.AddressId)
            .HasColumnName("ADDRESS_ID");

        builder.Property(p => p.Phone)
            .HasColumnName("PHONE")
            .HasMaxLength(20);

        builder.Property(p => p.Email)
            .HasColumnName("EMAIL")
            .HasMaxLength(200);

        // IMPORTANT: City field does NOT exist in database - ignore it
        builder.Ignore(p => p.City);

        builder.Property(p => p.IsActive)
            .HasColumnName("IS_ACTIVE")
            .IsRequired();

        builder.Property(p => p.CreatedAt).HasColumnName("CREATED_AT");
        builder.Property(p => p.UpdatedAt).HasColumnName("UPDATED_AT");

        builder.HasIndex(p => p.LicenseNumber).IsUnique();
        builder.HasIndex(p => p.AddressId);

        // Relationships
        builder.HasOne(p => p.Address)
            .WithMany()
            .HasForeignKey(p => p.AddressId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Inventory)
            .WithOne()
            .HasForeignKey("PHARMACY_ID")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Dispensations)
            .WithOne()
            .HasForeignKey("PHARMACY_ID")
            .OnDelete(DeleteBehavior.Restrict);
    }
}
