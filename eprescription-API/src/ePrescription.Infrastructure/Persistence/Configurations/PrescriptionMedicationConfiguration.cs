using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PrescriptionMedicationConfiguration : IEntityTypeConfiguration<PrescriptionMedication>
{
    public void Configure(EntityTypeBuilder<PrescriptionMedication> builder)
    {
        builder.ToTable("PRESCRIPTION_MEDICATIONS");

        // Primary Key
        builder.HasKey(pm => pm.Id);
        builder.Property(pm => pm.Id)
            .HasColumnName("PRESCRIPTION_MEDICATION_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Foreign Keys
        builder.Property(pm => pm.PrescriptionId)
            .HasColumnName("PRESCRIPTION_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        builder.Property(pm => pm.MedicationId)
            .HasColumnName("MEDICATION_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        builder.Property(pm => pm.AdministrationRouteId)
            .HasColumnName("ADMINISTRATION_ROUTE_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Properties
        builder.Property(pm => pm.Dosage)
            .HasColumnName("DOSAGE")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(pm => pm.Frequency)
            .HasColumnName("FREQUENCY")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(pm => pm.DurationDays)
            .HasColumnName("DURATION_DAYS")
            .IsRequired();

        builder.Property(pm => pm.Quantity)
            .HasColumnName("QUANTITY")
            .HasColumnType("NUMBER(10,2)")
            .IsRequired();

        builder.Property(pm => pm.Instructions)
            .HasColumnName("INSTRUCTIONS")
            .HasColumnType("CLOB");

        builder.Property(pm => pm.AiSuggested)
            .HasColumnName("AI_SUGGESTED")
            .HasDefaultValue(false);

        builder.Property(pm => pm.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired();

        // IMPORTANT: UpdatedAt does NOT exist in Oracle table
        builder.Ignore(pm => pm.UpdatedAt);

        // Ignore navigation properties that don't have FK columns
        builder.Ignore(pm => pm.Medication);
        builder.Ignore(pm => pm.AdministrationRoute);
        builder.Ignore(pm => pm.DispensationItems);
        
        // Relationships - already configured from PrescriptionConfiguration
    }
}
