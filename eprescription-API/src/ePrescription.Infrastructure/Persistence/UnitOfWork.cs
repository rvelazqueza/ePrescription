using Microsoft.EntityFrameworkCore.Storage;
using EPrescription.Domain.Interfaces;
using EPrescription.Infrastructure.Persistence.Repositories;

namespace EPrescription.Infrastructure.Persistence;

/// <summary>
/// Unit of Work implementation with integrated audit trail
/// Manages transactions and coordinates repository operations
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly EPrescriptionDbContext _context;
    private IDbContextTransaction? _transaction;

    // Lazy-loaded repositories
    private IPatientRepository? _patients;
    private IDoctorRepository? _doctors;
    private IPrescriptionRepository? _prescriptions;
    private IMedicationRepository? _medications;
    private IPharmacyRepository? _pharmacies;
    private IDispensationRepository? _dispensations;
    private IInventoryRepository? _inventory;
    private IMedicalCenterRepository? _medicalCenters;
    private ICie10CatalogRepository? _cie10Catalog;
    private IUserRepository? _users;
    private IRoleRepository? _roles;
    private IPermissionRepository? _permissions;
    private IAuditLogRepository? _auditLogs;
    private IAIAnalysisLogRepository? _aiAnalysisLogs;

    public UnitOfWork(EPrescriptionDbContext context)
    {
        _context = context;
    }

    public IPatientRepository Patients => _patients ??= new PatientRepository(_context);
    public IDoctorRepository Doctors => _doctors ??= new DoctorRepository(_context);
    public IPrescriptionRepository Prescriptions => _prescriptions ??= new PrescriptionRepository(_context);
    public IMedicationRepository Medications => _medications ??= new MedicationRepository(_context);
    public IPharmacyRepository Pharmacies => _pharmacies ??= new PharmacyRepository(_context);
    public IDispensationRepository Dispensations => _dispensations ??= new DispensationRepository(_context);
    public IInventoryRepository Inventory => _inventory ??= new InventoryRepository(_context);
    public IMedicalCenterRepository MedicalCenters => _medicalCenters ??= new MedicalCenterRepository(_context);
    public ICie10CatalogRepository Cie10Catalog => _cie10Catalog ??= new Cie10CatalogRepository(_context);
    public IUserRepository Users => _users ??= new UserRepository(_context);
    public IRoleRepository Roles => _roles ??= new RoleRepository(_context);
    public IPermissionRepository Permissions => _permissions ??= new PermissionRepository(_context);
    public IAuditLogRepository AuditLogs => _auditLogs ??= new AuditLogRepository(_context);
    public IAIAnalysisLogRepository AIAnalysisLogs => _aiAnalysisLogs ??= new AIAnalysisLogRepository(_context);

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _context.SaveChangesAsync(cancellationToken);
            if (_transaction != null)
            {
                await _transaction.CommitAsync(cancellationToken);
            }
        }
        catch
        {
            await RollbackTransactionAsync(cancellationToken);
            throw;
        }
        finally
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<int> SaveChangesAsync(Guid userId, string username, CancellationToken cancellationToken = default)
    {
        // TODO: Implement audit tracking with user context
        // This will be enhanced when audit interceptor is implemented
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
