using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PatientAllergyConfiguration : IEntityTypeConfiguration<PatientAllergy>
{
    public void Configure(EntityTypeBuilder<PatientAllergy> builder)
    {
        builder.ToTable("PATIENT_ALLERGIES");

        // Primary Key
        builder.HasKey(pa => pa.Id);
        builder.Property(pa => pa.Id)
            .HasColumnName("ALLERGY_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Foreign Key
        builder.Property(pa => pa.PatientId)
            .HasColumnName("PATIENT_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        // Properties
        builder.Property(pa => pa.AllergenType)
            .HasColumnName("ALLERGEN_TYPE")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(pa => pa.AllergenName)
            .HasColumnName("ALLERGEN_NAME")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(pa => pa.Severity)
            .HasColumnName("SEVERITY")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(pa => pa.Notes)
            .HasColumnName("NOTES")
            .HasColumnType("CLOB");

        // Timestamps
        builder.Property(pa => pa.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .ValueGeneratedOnAdd();

        // IMPORTANT: UpdatedAt does NOT exist in Oracle table
        builder.Ignore(pa => pa.UpdatedAt);

        // Indexes
        builder.HasIndex(pa => pa.PatientId)
            .HasDatabaseName("IDX_ALLERGY_PATIENT");

        builder.HasIndex(pa => pa.AllergenType)
            .HasDatabaseName("IDX_ALLERGY_TYPE");
    }
}
