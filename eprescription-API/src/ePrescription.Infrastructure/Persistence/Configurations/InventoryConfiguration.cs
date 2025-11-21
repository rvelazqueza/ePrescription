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
        
        builder.Property(i => i.Id)
            .HasColumnName("INVENTORY_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();
            
        builder.Property(i => i.PharmacyId)
            .HasColumnName("PHARMACY_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();
            
        builder.Property(i => i.MedicationId)
            .HasColumnName("MEDICATION_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();
            
        builder.Property(i => i.BatchNumber)
            .HasColumnName("BATCH_NUMBER")
            .HasMaxLength(50)
            .IsRequired();
            
        builder.Property(i => i.QuantityAvailable)
            .HasColumnName("QUANTITY_AVAILABLE")
            .HasColumnType("NUMBER(10,2)")
            .IsRequired();
            
        builder.Property(i => i.ExpirationDate)
            .HasColumnName("EXPIRATION_DATE")
            .IsRequired();
            
        builder.Property(i => i.UnitCost)
            .HasColumnName("UNIT_COST")
            .HasColumnType("NUMBER(10,2)");
        
        builder.Property(i => i.CreatedAt)
            .HasColumnName("CREATED_AT")
            .ValueGeneratedOnAdd();
            
        builder.Property(i => i.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .ValueGeneratedOnAddOrUpdate();

        // Relationships
        builder.HasOne(i => i.Pharmacy)
            .WithMany()
            .HasForeignKey(i => i.PharmacyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.Medication)
            .WithMany()
            .HasForeignKey(i => i.MedicationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(i => i.DispensationItems)
            .WithOne()
            .HasForeignKey("INVENTORY_ID")
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(i => new { i.PharmacyId, i.MedicationId })
            .HasDatabaseName("IDX_INVENTORY_PHARMACY_MED");
            
        builder.HasIndex(i => i.ExpirationDate)
            .HasDatabaseName("IDX_INVENTORY_EXPIRATION");
    }
}
