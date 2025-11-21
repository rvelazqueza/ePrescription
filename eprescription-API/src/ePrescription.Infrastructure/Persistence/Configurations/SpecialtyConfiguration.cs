using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class SpecialtyConfiguration : IEntityTypeConfiguration<Specialty>
{
    public void Configure(EntityTypeBuilder<Specialty> builder)
    {
        builder.ToTable("SPECIALTIES");

        // Configure primary key with explicit Oracle RAW(16) handling
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id)
            .HasColumnName("SPECIALTY_ID")
            .HasColumnType("RAW(16)")
            .HasConversion(
                guid => guid.ToByteArray(),
                bytes => new Guid(bytes)
            )
            .IsRequired();

        builder.Property(s => s.SpecialtyCode)
            .HasColumnName("SPECIALTY_CODE")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(s => s.SpecialtyName)
            .HasColumnName("SPECIALTY_NAME")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(s => s.Description)
            .HasColumnName("DESCRIPTION")
            .HasMaxLength(500);

        // Shadow properties for audit fields (if they exist in DB)
        builder.Property(s => s.CreatedAt).HasColumnName("CREATED_AT");
        builder.Ignore(s => s.UpdatedAt); // UPDATED_AT column doesn't exist in SPECIALTIES table

        builder.HasIndex(s => s.SpecialtyCode).IsUnique();

        // Relationships
        builder.HasMany(s => s.Doctors)
            .WithOne(d => d.Specialty)
            .HasForeignKey(d => d.SpecialtyId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
