using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity Framework configuration for DrugInteraction entity
/// Configures the many-to-many relationship between medications
/// </summary>
public class DrugInteractionConfiguration : IEntityTypeConfiguration<DrugInteraction>
{
    public void Configure(EntityTypeBuilder<DrugInteraction> builder)
    {
        // Table mapping
        builder.ToTable("DRUG_INTERACTIONS");
        
        // Primary key
        builder.HasKey(di => di.Id);
        builder.Property(di => di.Id).HasColumnName("INTERACTION_ID");

        // Properties
        builder.Property(di => di.MedicationId1)
            .HasColumnName("MEDICATION_ID_1")
            .IsRequired();

        builder.Property(di => di.MedicationId2)
            .HasColumnName("MEDICATION_ID_2")
            .IsRequired();

        builder.Property(di => di.InteractionSeverity)
            .HasColumnName("INTERACTION_SEVERITY")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(di => di.InteractionDescription)
            .HasColumnName("INTERACTION_DESCRIPTION")
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(di => di.ClinicalEffects)
            .HasColumnName("CLINICAL_EFFECTS")
            .HasMaxLength(2000);

        builder.Property(di => di.CreatedAt).HasColumnName("CREATED_AT");
        builder.Property(di => di.UpdatedAt).HasColumnName("UPDATED_AT");

        // Configure many-to-many relationship with Medication
        // First medication relationship
        builder.HasOne(di => di.Medication1)
            .WithMany(m => m.InteractionsAsFirst)
            .HasForeignKey(di => di.MedicationId1)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_DRUG_INTERACTIONS_MED1");

        // Second medication relationship
        builder.HasOne(di => di.Medication2)
            .WithMany(m => m.InteractionsAsSecond)
            .HasForeignKey(di => di.MedicationId2)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_DRUG_INTERACTIONS_MED2");

        // Indexes for performance
        builder.HasIndex(di => new { di.MedicationId1, di.MedicationId2 })
            .IsUnique()
            .HasDatabaseName("UK_DRUG_INTERACTIONS");

        builder.HasIndex(di => di.MedicationId1)
            .HasDatabaseName("IDX_DRUG_INTERACTIONS_MED1");

        builder.HasIndex(di => di.MedicationId2)
            .HasDatabaseName("IDX_DRUG_INTERACTIONS_MED2");

        // Check constraint to ensure MedicationId1 < MedicationId2 (enforced in entity)
        // This prevents duplicate interactions (A-B vs B-A)
    }
}
