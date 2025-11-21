using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("PATIENTS");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("PATIENT_ID");

        builder.Property(p => p.IdentificationNumber)
            .HasColumnName("IDENTIFICATION_NUMBER")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.FirstName)
            .HasColumnName("FIRST_NAME")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(p => p.LastName)
            .HasColumnName("LAST_NAME")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(p => p.DateOfBirth)
            .HasColumnName("DATE_OF_BIRTH")
            .IsRequired();

        builder.Property(p => p.Gender)
            .HasColumnName("GENDER")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(p => p.BloodType)
            .HasColumnName("BLOOD_TYPE")
            .HasMaxLength(5);

        builder.Property(p => p.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .ValueGeneratedOnAdd();

        builder.Property(p => p.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .ValueGeneratedNever(); // Managed by Oracle trigger

        builder.HasIndex(p => p.IdentificationNumber).IsUnique();

        // Relationships
        // Configure relationships explicitly to avoid EF Core shadow properties
        builder.HasMany(p => p.Contacts)
            .WithOne(c => c.Patient)
            .HasForeignKey(c => c.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Allergies)
            .WithOne(a => a.Patient)
            .HasForeignKey(a => a.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        // Note: Prescription relationship removed to avoid EF Core shadow properties
        // Prescription has PatientId FK but Patient doesn't have Prescriptions navigation
        // Use repository queries to get prescriptions by PatientId instead
    }
}
