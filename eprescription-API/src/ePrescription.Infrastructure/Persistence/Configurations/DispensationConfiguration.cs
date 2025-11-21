using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class DispensationConfiguration : IEntityTypeConfiguration<Dispensation>
{
    public void Configure(EntityTypeBuilder<Dispensation> builder)
    {
        builder.ToTable("DISPENSATIONS");
        
        builder.HasKey(d => d.Id);
        
        builder.Property(d => d.Id)
            .HasColumnName("DISPENSATION_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();
            
        builder.Property(d => d.PrescriptionId)
            .HasColumnName("PRESCRIPTION_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();
            
        builder.Property(d => d.PharmacyId)
            .HasColumnName("PHARMACY_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();
            
        builder.Property(d => d.PharmacistId)
            .HasColumnName("PHARMACIST_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.HasValue ? guid.Value.ToByteArray() : null,
                bytes => bytes != null ? new Guid(bytes) : (Guid?)null);
            
        builder.Property(d => d.DispensationDate)
            .HasColumnName("DISPENSATION_DATE")
            .IsRequired();
            
        builder.Property(d => d.Status)
            .HasColumnName("STATUS")
            .HasMaxLength(20)
            .IsRequired();
            
        builder.Property(d => d.Notes)
            .HasColumnName("NOTES")
            .HasColumnType("CLOB");
        
        builder.Property(d => d.CreatedAt)
            .HasColumnName("CREATED_AT")
            .ValueGeneratedOnAdd();
            
        builder.Property(d => d.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .ValueGeneratedOnAddOrUpdate();

        // Relationships
        builder.HasOne<Prescription>()
            .WithMany(p => p.Dispensations)
            .HasForeignKey(d => d.PrescriptionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Pharmacy>()
            .WithMany()
            .HasForeignKey(d => d.PharmacyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(d => d.Pharmacist)
            .WithMany()
            .HasForeignKey(d => d.PharmacistId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(d => d.Items)
            .WithOne()
            .HasForeignKey("DISPENSATION_ID")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
