using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PrescriptionDiagnosisConfiguration : IEntityTypeConfiguration<PrescriptionDiagnosis>
{
    public void Configure(EntityTypeBuilder<PrescriptionDiagnosis> builder)
    {
        builder.ToTable("PRESCRIPTION_DIAGNOSES");
        builder.HasKey(pd => pd.Id);
        builder.Property(pd => pd.Id).HasColumnName("PRESCRIPTION_DIAGNOSIS_ID");
        builder.Property(pd => pd.PrescriptionId).HasColumnName("PRESCRIPTION_ID").IsRequired();
        builder.Property(pd => pd.Cie10Id).HasColumnName("CIE10_ID").IsRequired();
        builder.Property(pd => pd.IsPrimary).HasColumnName("IS_PRIMARY").HasDefaultValue(false);
        builder.Property(pd => pd.Notes).HasColumnName("NOTES").HasColumnType("CLOB");
        builder.Property(pd => pd.CreatedAt).HasColumnName("CREATED_AT");

        // Relationships
        builder.HasOne<Prescription>()
            .WithMany(p => p.Diagnoses)
            .HasForeignKey(pd => pd.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Cie10Catalog>()
            .WithMany()
            .HasForeignKey(pd => pd.Cie10Id)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
