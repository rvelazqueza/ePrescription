using Microsoft.EntityFrameworkCore;
using EPrescription.Domain.Entities;

namespace EPrescription.Infrastructure.Persistence;

/// <summary>
/// Entity Framework Core DbContext for ePrescription system
/// Configured for Oracle 21c XE with schema EPRESCRIPTION_USER
/// Follows Clean Architecture and FDA 21 CFR Part 11 compliance
/// </summary>
public class EPrescriptionDbContext : DbContext
{
    public EPrescriptionDbContext(DbContextOptions<EPrescriptionDbContext> options)
        : base(options)
    {
    }

    // Base Entities
    public DbSet<Address> Addresses { get; set; } = null!;
    public DbSet<Cie10Catalog> Cie10Catalog { get; set; } = null!;
    public DbSet<Specialty> Specialties { get; set; } = null!;
    public DbSet<AdministrationRoute> AdministrationRoutes { get; set; } = null!;

    // Patient Entities
    public DbSet<Patient> Patients { get; set; } = null!;
    public DbSet<PatientContact> PatientContacts { get; set; } = null!;
    public DbSet<PatientAllergy> PatientAllergies { get; set; } = null!;

    // Doctor Entities
    public DbSet<Doctor> Doctors { get; set; } = null!;
    public DbSet<MedicalCenter> MedicalCenters { get; set; } = null!;
    public DbSet<DoctorMedicalCenter> DoctorMedicalCenters { get; set; } = null!;

    // Medication Entities
    public DbSet<Medication> Medications { get; set; } = null!;
    public DbSet<DrugInteraction> DrugInteractions { get; set; } = null!;

    // Prescription Entities
    public DbSet<Prescription> Prescriptions { get; set; } = null!;
    public DbSet<PrescriptionDiagnosis> PrescriptionDiagnoses { get; set; } = null!;
    public DbSet<PrescriptionMedication> PrescriptionMedications { get; set; } = null!;

    // Pharmacy Entities
    public DbSet<Pharmacy> Pharmacies { get; set; } = null!;
    public DbSet<Inventory> Inventories { get; set; } = null!;
    public DbSet<Dispensation> Dispensations { get; set; } = null!;
    public DbSet<DispensationItem> DispensationItems { get; set; } = null!;

    // Security Entities
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Permission> Permissions { get; set; } = null!;
    public DbSet<UserRole> UserRoles { get; set; } = null!;
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;

    // Audit Entities (Immutable - FDA 21 CFR Part 11)
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;
    public DbSet<AIAnalysisLog> AIAnalysisLogs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Set default schema for Oracle
        modelBuilder.HasDefaultSchema("EPRESCRIPTION_USER");

        // Apply all entity configurations from assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EPrescriptionDbContext).Assembly);

        // Configure Oracle-specific settings
        ConfigureOracleConventions(modelBuilder);
    }

    /// <summary>
    /// Configures Oracle-specific conventions and settings
    /// </summary>
    private void ConfigureOracleConventions(ModelBuilder modelBuilder)
    {
        // Oracle uses uppercase table and column names by default
        // EF Core will handle this automatically with Oracle provider

        // Configure RAW(16) for Guid primary keys (Oracle GUID storage)
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties()
                .Where(p => p.PropertyType == typeof(Guid) || p.PropertyType == typeof(Guid?));

            foreach (var property in properties)
            {
                modelBuilder.Entity(entityType.ClrType)
                    .Property(property.Name)
                    .HasColumnType("RAW(16)");
            }
        }

        // Configure TIMESTAMP(6) for DateTime properties
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties()
                .Where(p => p.PropertyType == typeof(DateTime) || p.PropertyType == typeof(DateTime?));

            foreach (var property in properties)
            {
                modelBuilder.Entity(entityType.ClrType)
                    .Property(property.Name)
                    .HasColumnType("TIMESTAMP(6)");
            }
        }
    }

    /// <summary>
    /// Override SaveChanges to update timestamps automatically
    /// </summary>
    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    /// <summary>
    /// Override SaveChangesAsync to update timestamps automatically
    /// </summary>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Updates CreatedAt and UpdatedAt timestamps for tracked entities
    /// </summary>
    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
