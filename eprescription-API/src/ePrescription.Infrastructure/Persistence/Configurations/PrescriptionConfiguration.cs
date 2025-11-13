using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
{
    public void Configure(EntityTypeBuilder<Prescription> builder)
    {
        builder.ToTable("PRESCRIPTIONS");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("PRESCRIPTION_ID");

        builder.Property(p => p.PrescriptionNumber)
            .HasColumnName("PRESCRIPTION_NUMBER")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.PatientId).HasColumnName("PATIENT_ID").IsRequired();
        builder.Property(p => p.DoctorId).HasColumnName("DOCTOR_ID").IsRequired();
        builder.Property(p => p.MedicalCenterId).HasColumnName("MEDICAL_CENTER_ID");

        builder.Property(p => p.PrescriptionDate)
            .HasColumnName("PRESCRIPTION_DATE")
            .IsRequired();

        builder.Property(p => p.ExpirationDate)
            .HasColumnName("EXPIRATION_DATE");

        builder.Property(p => p.Status)
            .HasColumnName("STATUS")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(p => p.ClinicalNotes)
            .HasColumnName("CLINICAL_NOTES")
            .HasColumnType("CLOB");

        builder.Property(p => p.CreatedAt).HasColumnName("CREATED_AT");
        builder.Property(p => p.UpdatedAt).HasColumnName("UPDATED_AT");

        builder.HasIndex(p => p.PrescriptionNumber).IsUnique();

        // Relationships
        builder.HasOne<Patient>()
            .WithMany(p => p.Prescriptions)
            .HasForeignKey(p => p.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Doctor>()
            .WithMany(d => d.Prescriptions)
            .HasForeignKey(p => p.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<MedicalCenter>()
            .WithMany()
            .HasForeignKey(p => p.MedicalCenterId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Diagnoses)
            .WithOne()
            .HasForeignKey("PRESCRIPTION_ID")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Medications)
            .WithOne()
            .HasForeignKey("PRESCRIPTION_ID")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Dispensations)
            .WithOne()
            .HasForeignKey("PRESCRIPTION_ID")
            .OnDelete(DeleteBehavior.Restrict);
    }
}
