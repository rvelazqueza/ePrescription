using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PrescriptionDiagnosisConfiguration : IEntityTypeConfiguration<PrescriptionDiagnosis>
{
    public void Configure(EntityTypeBuilder<PrescriptionDiagnosis> builder)
    {
        builder.ToTable("PRESCRIPTION_DIAGNOSES");

        // Primary Key - maps to DIAGNOSIS_ID in Oracle
        builder.HasKey(pd => pd.Id);
        builder.Property(pd => pd.Id)
            .HasColumnName("DIAGNOSIS_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Foreign Keys - match Oracle schema exactly
        builder.Property(pd => pd.PrescriptionId)
            .HasColumnName("PRESCRIPTION_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        builder.Property(pd => pd.Cie10Id)
            .HasColumnName("CIE10_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Denormalized fields from CIE10_CATALOG (for performance)
        builder.Property(pd => pd.DiagnosisCode)
            .HasColumnName("DIAGNOSIS_CODE")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(pd => pd.DiagnosisDescription)
            .HasColumnName("DIAGNOSIS_DESCRIPTION")
            .HasMaxLength(500)
            .IsRequired();

        // Diagnosis-specific properties
        builder.Property(pd => pd.IsPrimary)
            .HasColumnName("IS_PRIMARY")
            .HasDefaultValue(false);

        builder.Property(pd => pd.Notes)
            .HasColumnName("NOTES")
            .HasMaxLength(1000);

        // AI-assisted diagnosis fields
        builder.Property(pd => pd.AiSuggested)
            .HasColumnName("AI_SUGGESTED")
            .HasDefaultValue(false);

        builder.Property(pd => pd.AiConfidenceScore)
            .HasColumnName("AI_CONFIDENCE_SCORE")
            .HasPrecision(5, 2);

        // Timestamps
        builder.Property(pd => pd.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired();

        // IMPORTANT: UpdatedAt does NOT exist in Oracle table
        builder.Ignore(pd => pd.UpdatedAt);

        // Indexes for performance
        builder.HasIndex(pd => pd.PrescriptionId)
            .HasDatabaseName("IDX_PRESCRIPTION_DIAGNOSES_RX");

        builder.HasIndex(pd => pd.Cie10Id)
            .HasDatabaseName("IDX_PRESCRIPTION_DIAGNOSES_CIE10");

        builder.HasIndex(pd => pd.DiagnosisCode)
            .HasDatabaseName("IDX_PRESCRIPTION_DIAGNOSES_CODE");

        // Relationships
        // Only map the Prescription relationship, NOT Cie10Catalog
        // This prevents EF Core from creating shadow properties
        builder.HasOne(pd => pd.Prescription)
            .WithMany(p => p.Diagnoses)
            .HasForeignKey(pd => pd.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Note: Cie10Id is a real FK in Oracle to CIE10_CATALOG.ID
        // But we don't map it as a navigation property to avoid shadow properties
        // Use repository queries with Cie10Id if you need to join with CIE10_CATALOG
    }
}
