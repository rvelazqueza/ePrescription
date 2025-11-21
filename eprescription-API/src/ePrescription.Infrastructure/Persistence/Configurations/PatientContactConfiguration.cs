using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PatientContactConfiguration : IEntityTypeConfiguration<PatientContact>
{
    public void Configure(EntityTypeBuilder<PatientContact> builder)
    {
        builder.ToTable("PATIENT_CONTACTS");

        builder.HasKey(pc => pc.Id);
        builder.Property(pc => pc.Id).HasColumnName("CONTACT_ID");

        builder.Property(pc => pc.PatientId)
            .HasColumnName("PATIENT_ID")
            .IsRequired();

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
            .IsRequired();

        builder.Property(pc => pc.CreatedAt).HasColumnName("CREATED_AT");
        builder.Property(pc => pc.UpdatedAt).HasColumnName("UPDATED_AT");

        builder.HasIndex(pc => pc.PatientId);
        builder.HasIndex(pc => pc.ContactType);

        // Relationships
        builder.HasOne(pc => pc.Patient)
            .WithMany(p => p.Contacts)
            .HasForeignKey(pc => pc.PatientId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
