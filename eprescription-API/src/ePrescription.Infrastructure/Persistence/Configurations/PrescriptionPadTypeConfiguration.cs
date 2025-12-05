using EPrescription.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class PrescriptionPadTypeConfiguration : IEntityTypeConfiguration<PrescriptionPadType>
{
    public void Configure(EntityTypeBuilder<PrescriptionPadType> builder)
    {
        builder.ToTable("PRESCRIPTION_PAD_TYPES");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("PAD_TYPE_ID")
            .HasColumnType("RAW(16)");

        builder.Property(x => x.PadTypeName)
            .HasColumnName("PAD_TYPE_NAME")
            .HasColumnType("VARCHAR2(100)")
            .IsRequired();

        builder.Property(x => x.PadTypeCode)
            .HasColumnName("PAD_TYPE_CODE")
            .HasColumnType("VARCHAR2(20)")
            .IsRequired();

        builder.HasIndex(x => x.PadTypeCode)
            .IsUnique()
            .HasDatabaseName("UK_PAD_TYPE_CODE");

        builder.Property(x => x.DefaultQuantity)
            .HasColumnName("DEFAULT_QUANTITY")
            .HasColumnType("NUMBER(5,0)")
            .HasDefaultValue(50);

        builder.Property(x => x.Description)
            .HasColumnName("DESCRIPTION")
            .HasColumnType("VARCHAR2(500)");

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

        // Navigation properties
        builder.HasMany(x => x.PrescriptionPads)
            .WithOne(x => x.PadType)
            .HasForeignKey(x => x.PadTypeId)
            .HasConstraintName("FK_PAD_TYPE")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Medications)
            .WithOne(x => x.PadType)
            .HasForeignKey(x => x.PadTypeId)
            .HasConstraintName("FK_MED_PAD_TYPE")
            .OnDelete(DeleteBehavior.SetNull);
    }
}
