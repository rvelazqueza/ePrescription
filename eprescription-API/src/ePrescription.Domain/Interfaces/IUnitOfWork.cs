namespace EPrescription.Domain.Interfaces;

/// <summary>
/// Unit of Work pattern interface for managing database transactions
/// Ensures atomicity of operations across multiple repositories
/// Integrates with audit service for FDA 21 CFR Part 11 compliance
/// </summary>
public interface IUnitOfWork : IDisposable
{
    /// <summary>
    /// Patient repository
    /// </summary>
    IPatientRepository Patients { get; }

    /// <summary>
    /// Doctor repository
    /// </summary>
    IDoctorRepository Doctors { get; }

    /// <summary>
    /// Prescription repository
    /// </summary>
    IPrescriptionRepository Prescriptions { get; }

    /// <summary>
    /// Medication repository
    /// </summary>
    IMedicationRepository Medications { get; }

    /// <summary>
    /// Pharmacy repository
    /// </summary>
    IPharmacyRepository Pharmacies { get; }

    /// <summary>
    /// Dispensation repository
    /// </summary>
    IDispensationRepository Dispensations { get; }

    /// <summary>
    /// Inventory repository
    /// </summary>
    IInventoryRepository Inventory { get; }

    /// <summary>
    /// Medical Center repository
    /// </summary>
    IMedicalCenterRepository MedicalCenters { get; }

    /// <summary>
    /// CIE-10 Catalog repository
    /// </summary>
    ICie10CatalogRepository Cie10Catalog { get; }

    /// <summary>
    /// User repository
    /// </summary>
    IUserRepository Users { get; }

    /// <summary>
    /// Role repository
    /// </summary>
    IRoleRepository Roles { get; }

    /// <summary>
    /// Permission repository
    /// </summary>
    IPermissionRepository Permissions { get; }

    /// <summary>
    /// Audit Log repository (read-only for immutability)
    /// </summary>
    IAuditLogRepository AuditLogs { get; }

    /// <summary>
    /// AI Analysis Log repository
    /// </summary>
    IAIAnalysisLogRepository AIAnalysisLogs { get; }

    /// <summary>
    /// Begins a new database transaction
    /// </summary>
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Commits the current transaction
    /// </summary>
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Rolls back the current transaction
    /// </summary>
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Saves all changes to the database
    /// Automatically triggers audit logging for tracked entities
    /// </summary>
    /// <returns>Number of entities affected</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Saves changes with explicit user context for audit trail
    /// </summary>
    Task<int> SaveChangesAsync(Guid userId, string username, CancellationToken cancellationToken = default);
}
