namespace EPrescription.Application.Constants;

/// <summary>
/// Medical actions constants for authorization
/// </summary>
public static class MedicalActions
{
    public const string CreatePrescription = "create_prescription";
    public const string UpdatePrescription = "update_prescription";
    public const string CancelPrescription = "cancel_prescription";
    public const string DispenseMedication = "dispense_medication";
    public const string ViewAuditLogs = "view_audit_logs";
    public const string ExportAuditLogs = "export_audit_logs";
    public const string ManageUsers = "manage_users";
    public const string ManageRoles = "manage_roles";
    public const string ManagePermissions = "manage_permissions";
}
