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
        builder.Property(d => d.Id).HasColumnName("DOCTOR_ID");

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

        builder.Property(d => d.MedicalLicenseNumber)
            .HasColumnName("MEDICAL_LICENSE_NUMBER")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(d => d.Email)
            .HasColumnName("EMAIL")
            .HasMaxLength(200);

        builder.Property(d => d.Phone)
            .HasColumnName("PHONE")
            .HasMaxLength(20);

        builder.Property(d => d.IsActive)
            .HasColumnName("IS_ACTIVE")
            .HasDefaultValue(true);

        builder.Property(d => d.SpecialtyId).HasColumnName("SPECIALTY_ID");
        builder.Property(d => d.CreatedAt).HasColumnName("CREATED_AT");
        builder.Property(d => d.UpdatedAt).HasColumnName("UPDATED_AT");

        builder.HasIndex(d => d.IdentificationNumber).IsUnique();
        builder.HasIndex(d => d.MedicalLicenseNumber).IsUnique();

        // Relationships
        builder.HasOne<Specialty>()
            .WithMany()
            .HasForeignKey(d => d.SpecialtyId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(d => d.Prescriptions)
            .WithOne()
            .HasForeignKey("DOCTOR_ID")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(d => d.MedicalCenterAssignments)
            .WithOne()
            .HasForeignKey("DOCTOR_ID")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
