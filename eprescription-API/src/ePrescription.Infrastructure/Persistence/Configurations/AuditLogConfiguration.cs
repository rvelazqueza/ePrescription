using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("AUDIT_LOGS");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("AUDIT_ID");

        builder.Property(a => a.ActionType)
            .HasColumnName("ACTION_TYPE")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(a => a.EntityType)
            .HasColumnName("ENTITY_TYPE")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(a => a.EntityId)
            .HasColumnName("ENTITY_ID")
            .HasMaxLength(50);

        builder.Property(a => a.UserId).HasColumnName("USER_ID");
        builder.Property(a => a.Username).HasColumnName("USERNAME").HasMaxLength(200);
        builder.Property(a => a.IpAddress).HasColumnName("IP_ADDRESS").HasMaxLength(50);

        builder.Property(a => a.BeforeValue)
            .HasColumnName("BEFORE_VALUE")
            .HasColumnType("CLOB");

        builder.Property(a => a.AfterValue)
            .HasColumnName("AFTER_VALUE")
            .HasColumnType("CLOB");

        builder.Property(a => a.Metadata)
            .HasColumnName("METADATA")
            .HasColumnType("CLOB");

        builder.Property(a => a.Timestamp)
            .HasColumnName("TIMESTAMP")
            .IsRequired();

        // Immutable - no updates or deletes allowed (FDA 21 CFR Part 11)
        builder.HasQueryFilter(a => true); // Always readable
    }
}
