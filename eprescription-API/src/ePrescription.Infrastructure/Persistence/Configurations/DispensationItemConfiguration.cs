using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class DispensationItemConfiguration : IEntityTypeConfiguration<DispensationItem>
{
    public void Configure(EntityTypeBuilder<DispensationItem> builder)
    {
        builder.ToTable("DISPENSATION_ITEMS");
        
        builder.HasKey(di => di.Id);
        
        builder.Property(di => di.Id)
            .HasColumnName("DISPENSATION_ITEM_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();
            
        builder.Property(di => di.DispensationId)
            .HasColumnName("DISPENSATION_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();
            
        builder.Property(di => di.PrescriptionMedicationId)
            .HasColumnName("PRESCRIPTION_MEDICATION_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();
            
        builder.Property(di => di.InventoryId)
            .HasColumnName("INVENTORY_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();
            
        builder.Property(di => di.QuantityDispensed)
            .HasColumnName("QUANTITY_DISPENSED")
            .HasColumnType("NUMBER(10,2)")
            .IsRequired();
            
        builder.Property(di => di.BatchNumber)
            .HasColumnName("BATCH_NUMBER")
            .HasMaxLength(50);
            
        builder.Property(di => di.ExpirationDate)
            .HasColumnName("EXPIRATION_DATE");
        
        builder.Property(di => di.CreatedAt)
            .HasColumnName("CREATED_AT")
            .ValueGeneratedOnAdd();
            
        builder.Property(di => di.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .ValueGeneratedOnAddOrUpdate();

        // Relationships
        builder.HasOne(di => di.Dispensation)
            .WithMany(d => d.Items)
            .HasForeignKey(di => di.DispensationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(di => di.PrescriptionMedication)
            .WithMany()
            .HasForeignKey(di => di.PrescriptionMedicationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(di => di.Inventory)
            .WithMany(i => i.DispensationItems)
            .HasForeignKey(di => di.InventoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(di => di.DispensationId)
            .HasDatabaseName("IDX_DISP_ITEM_DISPENSATION");
            
        builder.HasIndex(di => di.PrescriptionMedicationId)
            .HasDatabaseName("IDX_DISP_ITEM_PRESC_MED");
    }
}
