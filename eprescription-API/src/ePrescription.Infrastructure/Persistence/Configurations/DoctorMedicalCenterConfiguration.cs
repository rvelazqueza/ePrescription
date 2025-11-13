using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence.Configurations;

public class DoctorMedicalCenterConfiguration : IEntityTypeConfiguration<DoctorMedicalCenter>
{
    public void Configure(EntityTypeBuilder<DoctorMedicalCenter> builder)
    {
        builder.ToTable("DOCTOR_MEDICAL_CENTERS");
        builder.HasKey(dmc => dmc.Id);
        builder.Property(dmc => dmc.Id).HasColumnName("DOCTOR_MEDICAL_CENTER_ID");
        builder.Property(dmc => dmc.DoctorId).HasColumnName("DOCTOR_ID").IsRequired();
        builder.Property(dmc => dmc.MedicalCenterId).HasColumnName("MEDICAL_CENTER_ID").IsRequired();
        builder.Property(dmc => dmc.AssignedAt).HasColumnName("ASSIGNED_AT");

        // Relationships - Many-to-Many between Doctors and Medical Centers
        builder.HasOne<Doctor>()
            .WithMany(d => d.MedicalCenterAssignments)
            .HasForeignKey(dmc => dmc.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<MedicalCenter>()
            .WithMany(mc => mc.DoctorAssignments)
            .HasForeignKey(dmc => dmc.MedicalCenterId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unique constraint: a doctor can be assigned to a medical center only once
        builder.HasIndex(dmc => new { dmc.DoctorId, dmc.MedicalCenterId }).IsUnique();
    }
}
