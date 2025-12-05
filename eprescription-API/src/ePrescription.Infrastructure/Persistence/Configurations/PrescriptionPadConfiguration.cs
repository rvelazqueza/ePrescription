using EPrescription.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PrescriptionPadConfiguration : IEntityTypeConfiguration<PrescriptionPad>
{
    public void Configure(EntityTypeBuilder<PrescriptionPad> builder)
    {
        builder.ToTable("PRESCRIPTION_PADS");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("PRESCRIPTION_PAD_ID")
            .HasColumnType("RAW(16)");

        builder.Property(x => x.DoctorId)
            .HasColumnName("DOCTOR_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        builder.Property(x => x.PadTypeId)
            .HasColumnName("PAD_TYPE_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        builder.Property(x => x.PadNumber)
            .HasColumnName("PAD_NUMBER")
            .HasColumnType("VARCHAR2(50)")
            .IsRequired();

        builder.Property(x => x.AvailableCount)
            .HasColumnName("AVAILABLE_COUNT")
            .HasColumnType("NUMBER(5,0)")
            .IsRequired();

        builder.Property(x => x.TotalCount)
            .HasColumnName("TOTAL_COUNT")
            .HasColumnType("NUMBER(5,0)")
            .IsRequired();

        builder.Property(x => x.ExpirationDate)
            .HasColumnName("EXPIRATION_DATE")
            .HasColumnType("DATE")
            .IsRequired();

        builder.Property(x => x.IsActive)
            .HasColumnName("IS_ACTIVE")
            .HasColumnType("NUMBER(1,0)")
            .HasDefaultValue(1);

        builder.Property(x => x.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraint
        builder.HasIndex(x => new { x.DoctorId, x.PadTypeId, x.PadNumber })
            .IsUnique()
            .HasDatabaseName("UK_PAD_DOCTOR_TYPE_NUMBER");

        // Check constraint
        builder.ToTable(t => t.HasCheckConstraint("CHK_PAD_COUNT", "AVAILABLE_COUNT <= TOTAL_COUNT"));

        // Foreign keys
        builder.HasOne(x => x.Doctor)
            .WithMany()
            .HasForeignKey(x => x.DoctorId)
            .HasConstraintName("FK_PAD_DOCTOR")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.PadType)
            .WithMany(x => x.PrescriptionPads)
            .HasForeignKey(x => x.PadTypeId)
            .HasConstraintName("FK_PAD_TYPE")
            .OnDelete(DeleteBehavior.Restrict);

        // Navigation properties
        builder.HasMany(x => x.PrescriptionSlips)
            .WithOne(x => x.PrescriptionPad)
            .HasForeignKey(x => x.PrescriptionPadId)
            .HasConstraintName("FK_SLIP_PAD")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
