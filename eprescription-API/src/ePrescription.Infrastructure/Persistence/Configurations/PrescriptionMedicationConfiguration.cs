using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PrescriptionMedicationConfiguration : IEntityTypeConfiguration<PrescriptionMedication>
{
    public void Configure(EntityTypeBuilder<PrescriptionMedication> builder)
    {
        builder.ToTable("PRESCRIPTION_MEDICATIONS");
        builder.HasKey(pm => pm.Id);
        builder.Property(pm => pm.Id).HasColumnName("PRESCRIPTION_MEDICATION_ID");
        builder.Property(pm => pm.PrescriptionId).HasColumnName("PRESCRIPTION_ID").IsRequired();
        builder.Property(pm => pm.MedicationId).HasColumnName("MEDICATION_ID").IsRequired();
        builder.Property(pm => pm.Dosage).HasColumnName("DOSAGE").HasMaxLength(100).IsRequired();
        builder.Property(pm => pm.Frequency).HasColumnName("FREQUENCY").HasMaxLength(100).IsRequired();
        builder.Property(pm => pm.DurationDays).HasColumnName("DURATION_DAYS").IsRequired();
        builder.Property(pm => pm.AdministrationRouteId).HasColumnName("ADMINISTRATION_ROUTE_ID").IsRequired();
        builder.Property(pm => pm.AiSuggested).HasColumnName("AI_SUGGESTED").HasDefaultValue(false);
        builder.Property(pm => pm.Quantity).HasColumnName("QUANTITY").HasPrecision(10, 2).IsRequired();
        builder.Property(pm => pm.Instructions).HasColumnName("INSTRUCTIONS").HasColumnType("CLOB");
        builder.Property(pm => pm.CreatedAt).HasColumnName("CREATED_AT");

        // Relationships
        builder.HasOne<Prescription>()
            .WithMany(p => p.Medications)
            .HasForeignKey(pm => pm.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Medication>()
            .WithMany()
            .HasForeignKey(pm => pm.MedicationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<AdministrationRoute>()
            .WithMany()
            .HasForeignKey(pm => pm.AdministrationRouteId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
