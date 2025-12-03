using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PrescriptionDiagnosisConfiguration : IEntityTypeConfiguration<PrescriptionDiagnosis>
{
    public void Configure(EntityTypeBuilder<PrescriptionDiagnosis> builder)
    {
        builder.ToTable("PRESCRIPTION_DIAGNOSES");

        // Primary Key - maps to DIAGNOSIS_ID in Oracle (not PRESCRIPTION_DIAGNOSIS_ID)
        builder.HasKey(pd => pd.Id);
        builder.Property(pd => pd.Id)
            .HasColumnName("DIAGNOSIS_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        // Foreign Keys - match Oracle schema exactly
        builder.Property(pd => pd.PrescriptionId)
            .HasColumnName("PRESCRIPTION_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        // IMPORTANT: The real Oracle table uses CIE10_CODE as VARCHAR2, not RAW(16)
        // We need to ignore Cie10Id since it doesn't map to the real schema
        builder.Ignore(pd => pd.Cie10Id);

        // IMPORTANT: These columns don't exist in the real Oracle table
        // Ignore them to prevent EF Core from trying to map them
        builder.Ignore(pd => pd.DiagnosisCode);
        builder.Ignore(pd => pd.DiagnosisDescription);
        builder.Ignore(pd => pd.AiSuggested);
        builder.Ignore(pd => pd.AiConfidenceScore);

        // Diagnosis-specific properties
        builder.Property(pd => pd.IsPrimary)
            .HasColumnName("IS_PRIMARY")
            .HasDefaultValue(false);

        builder.Property(pd => pd.Notes)
            .HasColumnName("NOTES")
            .HasMaxLength(1000);

        // Timestamps
        builder.Property(pd => pd.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired();

        builder.Property(pd => pd.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .HasColumnType("TIMESTAMP(6)");

        // Indexes for performance
        builder.HasIndex(pd => pd.PrescriptionId)
            .HasDatabaseName("IDX_PRESCRIPTION_DIAGNOSES_RX");

        // Relationships
        // Only map the Prescription relationship, NOT Cie10Catalog
        // This prevents EF Core from creating shadow properties
        builder.HasOne(pd => pd.Prescription)
            .WithMany(p => p.Diagnoses)
            .HasForeignKey(pd => pd.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
