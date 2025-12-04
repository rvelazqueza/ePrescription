using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
{
    public void Configure(EntityTypeBuilder<Prescription> builder)
    {
        builder.ToTable("PRESCRIPTIONS");

        // Primary Key
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id)
            .HasColumnName("PRESCRIPTION_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        // Foreign Keys
        builder.Property(p => p.PatientId)
            .HasColumnName("PATIENT_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        builder.Property(p => p.DoctorId)
            .HasColumnName("DOCTOR_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        builder.Property(p => p.MedicalCenterId)
            .HasColumnName("MEDICAL_CENTER_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        // Properties
        builder.Property(p => p.PrescriptionNumber)
            .HasColumnName("PRESCRIPTION_NUMBER")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.PrescriptionDate)
            .HasColumnName("PRESCRIPTION_DATE")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired();

        builder.Property(p => p.ExpirationDate)
            .HasColumnName("EXPIRATION_DATE")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired();

        builder.Property(p => p.Status)
            .HasColumnName("STATUS")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(p => p.Notes)
            .HasColumnName("NOTES")
            .HasColumnType("CLOB");

        builder.Property(p => p.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired()
            .ValueGeneratedOnAdd();

        builder.Property(p => p.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .IsRequired()
            .ValueGeneratedOnAddOrUpdate();

        // Indexes
        builder.HasIndex(p => p.PrescriptionNumber)
            .IsUnique()
            .HasDatabaseName("UK_PRESCRIPTIONS_NUMBER");

        builder.HasIndex(p => p.PatientId)
            .HasDatabaseName("IDX_PRESCRIPTIONS_PATIENT");

        builder.HasIndex(p => p.DoctorId)
            .HasDatabaseName("IDX_PRESCRIPTIONS_DOCTOR");

        builder.HasIndex(p => p.Status)
            .HasDatabaseName("IDX_PRESCRIPTIONS_STATUS");

        builder.HasIndex(p => p.PrescriptionDate)
            .HasDatabaseName("IDX_PRESCRIPTIONS_DATE");

        // Relationships - using same pattern as PatientConfiguration
        // Use WithOne() without navigation property to avoid shadow properties
        builder.HasMany(p => p.Medications)
            .WithOne(pm => pm.Prescription)
            .HasForeignKey(pm => pm.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Diagnoses)
            .WithOne(pd => pd.Prescription)
            .HasForeignKey(pd => pd.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Dispensations)
            .WithOne()
            .HasForeignKey("PRESCRIPTION_ID")
            .OnDelete(DeleteBehavior.Restrict);
    }
}
