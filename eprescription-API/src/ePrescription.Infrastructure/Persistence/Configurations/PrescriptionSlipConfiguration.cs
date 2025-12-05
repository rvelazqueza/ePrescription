using EPrescription.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PrescriptionSlipConfiguration : IEntityTypeConfiguration<PrescriptionSlip>
{
    public void Configure(EntityTypeBuilder<PrescriptionSlip> builder)
    {
        builder.ToTable("PRESCRIPTION_SLIPS");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("SLIP_ID")
            .HasColumnType("RAW(16)");

        builder.Property(x => x.PrescriptionPadId)
            .HasColumnName("PRESCRIPTION_PAD_ID")
            .HasColumnType("RAW(16)")
            .IsRequired();

        builder.Property(x => x.SlipNumber)
            .HasColumnName("SLIP_NUMBER")
            .HasColumnType("NUMBER(5,0)")
            .IsRequired();

        builder.Property(x => x.Status)
            .HasColumnName("STATUS")
            .HasColumnType("VARCHAR2(20)")
            .HasDefaultValue("available");

        builder.Property(x => x.UsedByPrescriptionId)
            .HasColumnName("USED_BY_PRESCRIPTION_ID")
            .HasColumnType("RAW(16)");

        builder.Property(x => x.UsedAt)
            .HasColumnName("USED_AT")
            .HasColumnType("TIMESTAMP(6)");

        builder.Property(x => x.CreatedAt)
            .HasColumnName("CREATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .HasColumnType("TIMESTAMP(6)")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraint
        builder.HasIndex(x => new { x.PrescriptionPadId, x.SlipNumber })
            .IsUnique()
            .HasDatabaseName("UK_SLIP_PAD_NUMBER");

        // Foreign keys
        builder.HasOne(x => x.PrescriptionPad)
            .WithMany(x => x.PrescriptionSlips)
            .HasForeignKey(x => x.PrescriptionPadId)
            .HasConstraintName("FK_SLIP_PAD")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.UsedByPrescription)
            .WithMany()
            .HasForeignKey(x => x.UsedByPrescriptionId)
            .HasConstraintName("FK_SLIP_PRESCRIPTION")
            .OnDelete(DeleteBehavior.SetNull);
    }
}
