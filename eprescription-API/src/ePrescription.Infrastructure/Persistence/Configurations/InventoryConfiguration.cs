using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class InventoryConfiguration : IEntityTypeConfiguration<Inventory>
{
    public void Configure(EntityTypeBuilder<Inventory> builder)
    {
        builder.ToTable("INVENTORY");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.Id).HasColumnName("INVENTORY_ID");
        builder.Property(i => i.PharmacyId).HasColumnName("PHARMACY_ID").IsRequired();
        builder.Property(i => i.MedicationId).HasColumnName("MEDICATION_ID").IsRequired();
        builder.Property(i => i.BatchNumber).HasColumnName("BATCH_NUMBER").HasMaxLength(50).IsRequired();
        builder.Property(i => i.Quantity).HasColumnName("QUANTITY").HasPrecision(10, 2).IsRequired();
        builder.Property(i => i.ExpirationDate).HasColumnName("EXPIRATION_DATE").IsRequired();
        builder.Property(i => i.CreatedAt).HasColumnName("CREATED_AT");
        builder.Property(i => i.UpdatedAt).HasColumnName("UPDATED_AT");

        // Relationships
        builder.HasOne<Pharmacy>()
            .WithMany()
            .HasForeignKey(i => i.PharmacyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Medication>()
            .WithMany()
            .HasForeignKey(i => i.MedicationId)
            .OnDelete(DeleteBehavior.Restrict);

        // Unique constraint: pharmacy + medication + batch
        builder.HasIndex(i => new { i.PharmacyId, i.MedicationId, i.BatchNumber }).IsUnique();
    }
}
