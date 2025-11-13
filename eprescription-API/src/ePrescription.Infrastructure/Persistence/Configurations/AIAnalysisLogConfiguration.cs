using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class AIAnalysisLogConfiguration : IEntityTypeConfiguration<AIAnalysisLog>
{
    public void Configure(EntityTypeBuilder<AIAnalysisLog> builder)
    {
        builder.ToTable("AI_ANALYSIS_LOGS");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("ANALYSIS_ID");

        builder.Property(a => a.AnalysisType)
            .HasColumnName("ANALYSIS_TYPE")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(a => a.InputData)
            .HasColumnName("INPUT_DATA")
            .HasColumnType("CLOB")
            .IsRequired();

        builder.Property(a => a.OutputData)
            .HasColumnName("OUTPUT_DATA")
            .HasColumnType("CLOB")
            .IsRequired();

        builder.Property(a => a.AIProvider)
            .HasColumnName("AI_PROVIDER")
            .HasMaxLength(100);

        builder.Property(a => a.ProcessingTimeMs)
            .HasColumnName("PROCESSING_TIME_MS");

        builder.Property(a => a.ConfidenceScore)
            .HasColumnName("CONFIDENCE_SCORE")
            .HasPrecision(5, 4);

        builder.Property(a => a.WasAccepted)
            .HasColumnName("WAS_ACCEPTED")
            .HasDefaultValue(false);

        builder.Property(a => a.UserId).HasColumnName("USER_ID");
        builder.Property(a => a.PrescriptionId).HasColumnName("PRESCRIPTION_ID");

        builder.Property(a => a.Timestamp)
            .HasColumnName("TIMESTAMP")
            .IsRequired();
    }
}
