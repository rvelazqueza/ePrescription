using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.ToTable("ADDRESSES");
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("ADDRESS_ID");
        builder.Property(a => a.StreetAddress).HasColumnName("STREET_ADDRESS").HasMaxLength(200).IsRequired();
        builder.Property(a => a.City).HasColumnName("CITY").HasMaxLength(100).IsRequired();
        builder.Property(a => a.StateProvince).HasColumnName("STATE_PROVINCE").HasMaxLength(100).IsRequired();
        builder.Property(a => a.PostalCode).HasColumnName("POSTAL_CODE").HasMaxLength(20);
        builder.Property(a => a.Country).HasColumnName("COUNTRY").HasMaxLength(100).IsRequired().HasDefaultValue("Costa Rica");
        builder.Property(a => a.Latitude).HasColumnName("LATITUDE").HasPrecision(10, 7);
        builder.Property(a => a.Longitude).HasColumnName("LONGITUDE").HasPrecision(10, 7);
        
        builder.Property(a => a.CreatedAt)
            .HasColumnName("CREATED_AT")
            .ValueGeneratedOnAdd();
            
        builder.Property(a => a.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .ValueGeneratedOnAddOrUpdate();
    }
}
