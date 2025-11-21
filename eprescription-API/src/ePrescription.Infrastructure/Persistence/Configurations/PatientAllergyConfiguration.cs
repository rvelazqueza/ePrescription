using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PatientAllergyConfiguration : IEntityTypeConfiguration<PatientAllergy>
{
    public void Configure(EntityTypeBuilder<PatientAllergy> builder)
    {
        builder.ToTable("PATIENT_ALLERGIES");

        builder.HasKey(pa => pa.Id);
        builder.Property(pa => pa.Id).HasColumnName("ALLERGY_ID");

        builder.Property(pa => pa.PatientId)
            .HasColumnName("PATIENT_ID")
            .IsRequired();

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

        builder.Property(pa => pa.CreatedAt).HasColumnName("CREATED_AT");
        builder.Property(pa => pa.UpdatedAt).HasColumnName("UPDATED_AT");

        builder.HasIndex(pa => pa.PatientId);
        builder.HasIndex(pa => pa.AllergenType);

        // Relationships
        builder.HasOne(pa => pa.Patient)
            .WithMany(p => p.Allergies)
            .HasForeignKey(pa => pa.PatientId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
