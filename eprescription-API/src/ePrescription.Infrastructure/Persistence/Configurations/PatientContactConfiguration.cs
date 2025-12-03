using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PatientContactConfiguration : IEntityTypeConfiguration<PatientContact>
{
    public void Configure(EntityTypeBuilder<PatientContact> builder)
    {
        builder.ToTable("PATIENT_CONTACTS");

        // Primary Key
        builder.HasKey(pc => pc.Id);
        builder.Property(pc => pc.Id)
            .HasColumnName("CONTACT_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        // Foreign Key
        builder.Property(pc => pc.PatientId)
            .HasColumnName("PATIENT_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes))
            .IsRequired();

        // Properties
        builder.Property(pc => pc.ContactType)
            .HasColumnName("CONTACT_TYPE")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(pc => pc.ContactValue)
            .HasColumnName("CONTACT_VALUE")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(pc => pc.IsPrimary)
            .HasColumnName("IS_PRIMARY")
            .HasConversion<int>()
            .HasDefaultValue(0);

        // Timestamps
        builder.Property(pc => pc.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .ValueGeneratedOnAdd();

        // IMPORTANT: UpdatedAt does NOT exist in Oracle table
        builder.Ignore(pc => pc.UpdatedAt);

        // Indexes
        builder.HasIndex(pc => pc.PatientId)
            .HasDatabaseName("IDX_CONTACT_PATIENT");

        builder.HasIndex(pc => pc.ContactType)
            .HasDatabaseName("IDX_CONTACT_TYPE");

        builder.HasIndex(new[] { "PatientId", "IsPrimary" })
            .HasDatabaseName("IDX_CONTACT_PRIMARY");
    }
}
