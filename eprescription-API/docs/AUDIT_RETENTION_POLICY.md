# Audit Log Retention Policy

## Overview

This document describes the audit log retention policy implemented in the ePrescription system to comply with FDA 21 CFR Part 11 requirements.

## Regulatory Requirements

### FDA 21 CFR Part 11
- **Requirement**: Electronic records must be retained for a period that is at least as long as required by applicable regulations
- **Healthcare Standard**: Typically 7 years from the date of creation
- **Immutability**: Records must be maintained in a form that cannot be altered

## Implementation

### Retention Period
- **Default**: 7 years
- **Configurable**: Can be adjusted based on specific regulatory requirements
- **Minimum**: 1 year (not recommended)
- **Maximum**: 50 years

### Archival Process

The system implements a safe archival process:

1. **Identification**: Logs older than the retention period are identified
2. **Export**: Logs are exported to external archive storage (S3, Azure Blob, etc.)
3. **Verification**: Export integrity is verified
4. **Deletion**: Only after successful verification, logs are removed from active database

### Current Implementation Status

**Phase 1 (Current)**: 
- ✅ Retention policy service implemented
- ✅ API endpoints for policy management
- ✅ Count and identify archivable logs
- ⚠️ Actual deletion is disabled for safety

**Phase 2 (Future)**:
- ⏳ Integration with external archive storage (S3/Azure Blob)
- ⏳ Automated backup verification
- ⏳ Scheduled archival jobs
- ⏳ Archive retrieval functionality

## API Endpoints

### Get Retention Policy Information
```http
GET /api/audit/retention-policy
Authorization: Bearer {token}
```

**Response:**
```json
{
  "retentionYears": 7,
  "cutoffDate": "2017-11-17T00:00:00Z",
  "totalLogsCount": 15000,
  "activeLogsCount": 14500,
  "archivableLogsCount": 500,
  "totalStorageSizeBytes": 30720000,
  "lastArchivalDate": "2017-01-01T00:00:00Z"
}
```

### Get Archivable Logs Count
```http
GET /api/audit/archivable-count?retentionYears=7
Authorization: Bearer {token}
```

**Response:**
```json
{
  "count": 500,
  "retentionYears": 7,
  "cutoffDate": "2017-11-17T00:00:00Z"
}
```

### Archive Old Logs (Admin Only)
```http
POST /api/audit/archive?retentionYears=7
Authorization: Bearer {token}
```

**Response:**
```json
{
  "archivedCount": 500,
  "retentionYears": 7,
  "archivedAt": "2024-11-17T10:30:00Z",
  "message": "Found 500 logs eligible for archival. Actual archival requires external storage configuration."
}
```

## Security

### Access Control
- **Read Policy**: Requires `auditor` or `admin` role
- **Archive Logs**: Requires `admin` role only
- **Audit Trail**: All archival operations are logged

### Immutability
- Audit logs cannot be modified or deleted through normal operations
- Database triggers prevent UPDATE and DELETE operations
- Only archival process (after backup) can remove logs

## Best Practices

### Regular Monitoring
1. Monitor retention policy status monthly
2. Review archivable logs count quarterly
3. Plan archival operations during low-traffic periods

### Backup Before Archival
1. Always export logs to external storage first
2. Verify export integrity
3. Test restore process
4. Only then proceed with deletion

### Compliance Documentation
1. Document all archival operations
2. Maintain archive access logs
3. Periodic compliance audits
4. Retention policy reviews annually

## Configuration

### Application Settings
```json
{
  "Audit": {
    "RetentionYears": 7,
    "EnableAutoArchival": false,
    "ArchivalSchedule": "0 2 * * 0",
    "ArchiveStorage": {
      "Provider": "AzureBlob",
      "ConnectionString": "...",
      "Container": "audit-archive"
    }
  }
}
```

### Environment Variables
```bash
AUDIT_RETENTION_YEARS=7
AUDIT_AUTO_ARCHIVAL=false
AUDIT_ARCHIVE_STORAGE=AzureBlob
```

## Scheduled Archival (Future)

When implemented, archival will run automatically:

- **Schedule**: Weekly on Sunday at 2:00 AM
- **Process**: 
  1. Identify logs older than retention period
  2. Export to archive storage
  3. Verify export
  4. Delete from active database
  5. Send notification to admins

## Archive Storage Options

### Azure Blob Storage (Recommended)
- Cost-effective for long-term storage
- Built-in redundancy
- Easy retrieval when needed
- Compliance certifications

### AWS S3
- Similar benefits to Azure Blob
- Glacier for ultra-long-term storage
- Cross-region replication

### On-Premises Storage
- Full control over data
- May be required for certain regulations
- Higher maintenance cost

## Retrieval Process

When archived logs need to be retrieved:

1. Identify the time period needed
2. Request archive access (admin approval)
3. Download from archive storage
4. Import to temporary database
5. Query as needed
6. Document access for compliance

## Compliance Checklist

- [x] 7-year retention policy implemented
- [x] Immutability enforced (database triggers)
- [x] API endpoints for policy management
- [x] Access control (role-based)
- [x] Audit trail for archival operations
- [ ] External archive storage integration
- [ ] Automated archival process
- [ ] Archive retrieval functionality
- [ ] Compliance reporting

## Support

For questions about the retention policy:
- Technical: Contact DevOps team
- Compliance: Contact Compliance Officer
- Emergency retrieval: Contact System Administrator

## References

- FDA 21 CFR Part 11: Electronic Records; Electronic Signatures
- HIPAA: 45 CFR § 164.316(b)(2)(i)
- ISO 27001: Information Security Management
- GxP: Good Practice Guidelines

---

**Last Updated**: 2024-11-17  
**Version**: 1.0  
**Owner**: ePrescription Team
