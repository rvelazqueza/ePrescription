using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
{
    public void Configure(EntityTypeBuilder<Doctor> builder)
    {
        builder.ToTable("DOCTORS");

        builder.HasKey(d => d.Id);
        builder.Property(d => d.Id)
            .HasColumnName("DOCTOR_ID")
            .HasColumnType("RAW(16)");

        builder.Property(d => d.IdentificationNumber)
            .HasColumnName("IDENTIFICATION_NUMBER")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(d => d.FirstName)
            .HasColumnName("FIRST_NAME")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(d => d.LastName)
            .HasColumnName("LAST_NAME")
            .HasMaxLength(100)
            .IsRequired();

        // CRITICAL: Map MedicalLicenseNumber to LICENSE_NUMBER column
        builder.Property(d => d.MedicalLicenseNumber)
            .HasColumnName("LICENSE_NUMBER")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(d => d.SpecialtyId)
            .HasColumnName("SPECIALTY_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        builder.Property(d => d.Email)
            .HasColumnName("EMAIL")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(d => d.Phone)
            .HasColumnName("PHONE")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(d => d.IsActive)
            .HasColumnName("IS_ACTIVE")
            .HasColumnType("NUMBER(1)")
            .HasConversion<int>()  // Convert bool to int for Oracle NUMBER(1)
            .IsRequired();

        builder.Property(d => d.CreatedAt)
            .HasColumnName("CREATED_AT")
            .ValueGeneratedOnAdd();
            
        builder.Property(d => d.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .ValueGeneratedOnAddOrUpdate();

        builder.HasIndex(d => d.IdentificationNumber).IsUnique();
        builder.HasIndex(d => d.MedicalLicenseNumber).IsUnique();
        builder.HasIndex(d => d.SpecialtyId);

        // Relationships
        builder.HasOne(d => d.Specialty)
            .WithMany(s => s.Doctors)
            .HasForeignKey(d => d.SpecialtyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(d => d.MedicalCenters)
            .WithOne()
            .HasForeignKey("DOCTOR_ID")
            .OnDelete(DeleteBehavior.Cascade);

        // Note: Prescription relationship configured from Prescription side
        // Prescription has DoctorId FK but doesn't have Doctor navigation property
        builder.HasMany(d => d.Prescriptions)
            .WithOne()
            .HasForeignKey(p => p.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
