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

        // Foreign Keys
        builder.Property(pd => pd.PrescriptionId)
            .HasColumnName("PRESCRIPTION_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Properties
        builder.Property(pd => pd.Cie10Code)
            .HasColumnName("CIE10_CODE")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(pd => pd.IsPrimary)
            .HasColumnName("IS_PRIMARY")
            .HasDefaultValue(false);

        builder.Property(pd => pd.Notes)
            .HasColumnName("NOTES")
            .HasMaxLength(1000);

        builder.Property(pd => pd.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired();

        // IMPORTANT: UpdatedAt does NOT exist in Oracle table
        builder.Ignore(pd => pd.UpdatedAt);

        // Indexes
        builder.HasIndex(pd => pd.PrescriptionId)
            .HasDatabaseName("IDX_PRESCRIPTION_DIAGNOSES_RX");

        builder.HasIndex(pd => pd.Cie10Code)
            .HasDatabaseName("IDX_PRESCRIPTION_DIAGNOSES_CIE10");

        // Relationships - already configured from PrescriptionConfiguration
        // Note: Cie10Code is a string FK to CIE10_CATALOG.CODE, not a navigation property
        // We need to explicitly tell EF Core that there's NO navigation to Cie10Catalog
        // to prevent it from creating shadow properties
        
        // This is a string-based FK, not an entity relationship
        // The FK constraint exists at DB level but not in EF Core model
    }
}
