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
        builder.Property(d => d.Id).HasColumnName("DISPENSATION_ID");
        builder.Property(d => d.PrescriptionId).HasColumnName("PRESCRIPTION_ID").IsRequired();
        builder.Property(d => d.PharmacyId).HasColumnName("PHARMACY_ID").IsRequired();
        builder.Property(d => d.PharmacistId).HasColumnName("PHARMACIST_ID").IsRequired();
        builder.Property(d => d.DispensationDate).HasColumnName("DISPENSATION_DATE").IsRequired();
        builder.Property(d => d.Status).HasColumnName("STATUS").HasMaxLength(20).IsRequired();
        builder.Property(d => d.Notes).HasColumnName("NOTES").HasColumnType("CLOB");
        builder.Property(d => d.CreatedAt).HasColumnName("CREATED_AT");
        builder.Property(d => d.UpdatedAt).HasColumnName("UPDATED_AT");

        // Relationships
        builder.HasOne<Prescription>()
            .WithMany(p => p.Dispensations)
            .HasForeignKey(d => d.PrescriptionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Pharmacy>()
            .WithMany()
            .HasForeignKey(d => d.PharmacyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(d => d.PharmacistId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(d => d.Items)
            .WithOne()
            .HasForeignKey("DISPENSATION_ID")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
