using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class MedicationConfiguration : IEntityTypeConfiguration<Medication>
{
    public void Configure(EntityTypeBuilder<Medication> builder)
    {
        builder.ToTable("MEDICATIONS");
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasColumnName("MEDICATION_ID");
        builder.Property(m => m.MedicationCode).HasColumnName("MEDICATION_CODE").HasMaxLength(50).IsRequired();
        builder.Property(m => m.CommercialName).HasColumnName("COMMERCIAL_NAME").HasMaxLength(200).IsRequired();
        builder.Property(m => m.GenericName).HasColumnName("GENERIC_NAME").HasMaxLength(200).IsRequired();
        builder.Property(m => m.ActiveIngredient).HasColumnName("ACTIVE_INGREDIENT").HasMaxLength(200);
        builder.Property(m => m.Presentation).HasColumnName("PRESENTATION").HasMaxLength(100);
        builder.Property(m => m.Concentration).HasColumnName("CONCENTRATION").HasMaxLength(100);
        builder.Property(m => m.RequiresPrescription).HasColumnName("REQUIRES_PRESCRIPTION").HasDefaultValue(true);
        builder.Property(m => m.IsActive).HasColumnName("IS_ACTIVE").HasDefaultValue(true);
        builder.Property(m => m.AdministrationRouteId).HasColumnName("ADMINISTRATION_ROUTE_ID");
        
        builder.Property(m => m.CreatedAt)
            .HasColumnName("CREATED_AT")
            .ValueGeneratedOnAdd();
            
        builder.Property(m => m.UpdatedAt)
            .HasColumnName("UPDATED_AT")
            .ValueGeneratedOnAddOrUpdate();
        builder.HasIndex(m => m.MedicationCode).IsUnique();
    }
}
