# Task 8 - Authorization System Testing Guide

## Overview
This guide provides instructions for testing the authorization system implemented in Task 8.

## Prerequisites

1. **Services Running**
   ```powershell
   docker-compose ps
   # Verify keycloak and oracle-db are running
   ```

2. **API Running**
   ```powershell
   cd eprescription-API/src/ePrescription.API
   & "C:\Program Files\dotnet\dotnet.exe" run
   ```

3. **Users Created with Roles**
   - admin.user (admin role)
   - doctor1 (doctor role)
   - pharmacist1 (pharmacist role)
   - patient1 (patient role)
   - auditor1 (auditor role)

## Testing Methods

### Method 1: Automated PowerShell Script

Run the comprehensive test script:

```powershell
.\test-authorization.ps1
```

This script will:
- Authenticate all 5 test users
- Test role-based access to endpoints
- Verify authorization rules
- Generate a test report (authorization-test-results.csv)

**Expected Results:**
- Admin can create roles ✓
- Doctor can create prescriptions ✓
- Pharmacist can dispense medications ✓
- Auditor can view audit logs ✓
- Non-authorized users get 403 Forbidden ✓

### Method 2: Postman Collection

1. Import the collection:
   - Open Postman
   - Import `Task-8-Authorization-Tests.postman_collection.json`

2. Run the collection:
   - Click "Run Collection"
   - Execute all requests in sequence
   - Review test results

3. Manual testing:
   - Run "1. Authentication" folder first to get tokens
   - Test individual endpoints with different user tokens
   - Verify expected responses (200 OK or 403 Forbidden)

### Method 3: Manual cURL/PowerShell

#### Step 1: Get Tokens

```powershell
# Doctor token
$body = @{
    grant_type = "password"
    client_id = "eprescription-api"
    username = "doctor1"
    password = "doctor123"
}
$response = Invoke-RestMethod -Uri "http://localhost:8080/realms/eprescription/protocol/openid-connect/token" -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"
$doctorToken = $response.access_token
```

#### Step 2: Test Endpoints

```powershell
# Test: Doctor creates prescription (should succeed)
$headers = @{ "Authorization" = "Bearer $doctorToken" }
Invoke-RestMethod -Uri "http://localhost:5000/api/examples/create-prescription" -Method Post -Headers $headers

# Test: Doctor dispenses medication (should fail with 403)
Invoke-RestMethod -Uri "http://localhost:5000/api/examples/dispense-medication" -Method Post -Headers $headers
```

## Test Scenarios

### Scenario 1: Role-Based Endpoint Access

| Endpoint | Admin | Doctor | Pharmacist | Patient | Auditor |
|----------|-------|--------|------------|---------|---------|
| GET /api/roles | ✓ | ✓ | ✓ | ✓ | ✓ |
| POST /api/roles | ✓ | ✗ | ✗ | ✗ | ✗ |
| POST /api/examples/create-prescription | ✓ | ✓ | ✗ | ✗ | ✗ |
| POST /api/examples/dispense-medication | ✓ | ✗ | ✓ | ✗ | ✗ |
| GET /api/examples/audit-logs | ✓ | ✗ | ✗ | ✗ | ✓ |

### Scenario 2: Medical Action Validation

Test that medical regulations are enforced:

1. **Only doctors can create prescriptions**
   - Doctor → 200 OK ✓
   - Pharmacist → 403 Forbidden ✓
   - Patient → 403 Forbidden ✓

2. **Only pharmacists can dispense medications**
   - Pharmacist → 200 OK ✓
   - Doctor → 403 Forbidden ✓
   - Patient → 403 Forbidden ✓

3. **Only auditors can view audit logs**
   - Auditor → 200 OK ✓
   - Doctor → 403 Forbidden ✓
   - Patient → 403 Forbidden ✓

### Scenario 3: Permission Verification

Test GET /api/examples/my-permissions with each user:

**Expected Permissions:**

- **Admin**: All permissions (14 total)
- **Doctor**: prescription.create, prescription.read, prescription.update, patient.*, medication.read
- **Pharmacist**: medication.dispense, medication.read, prescription.read, patient.read
- **Patient**: patient.read.own, prescription.read (own only)
- **Auditor**: audit.read, audit.export

## Validation Checklist

- [ ] All users can authenticate successfully
- [ ] Admin can create/update/delete roles
- [ ] Non-admin users cannot create roles (403)
- [ ] Doctor can create prescriptions
- [ ] Non-doctor users cannot create prescriptions (403)
- [ ] Pharmacist can dispense medications
- [ ] Non-pharmacist users cannot dispense (403)
- [ ] Auditor can view audit logs
- [ ] Non-auditor users cannot view audit logs (403)
- [ ] All users can view their own permissions
- [ ] Permissions match expected role assignments
- [ ] Authorization middleware logs access attempts
- [ ] 403 responses include clear error messages

## Troubleshooting

### Issue: 401 Unauthorized

**Cause**: Token is invalid or expired

**Solution**:
```powershell
# Re-authenticate to get a fresh token
.\test-keycloak-auth.ps1 -Username "doctor1" -Password "doctor123"
```

### Issue: 500 Internal Server Error

**Cause**: Database not initialized or service not registered

**Solution**:
1. Check API logs for errors
2. Verify DbContext is configured
3. Ensure KeycloakSyncService ran on startup
4. Check that roles and permissions exist in database

### Issue: All requests return 403

**Cause**: Roles not synced to database

**Solution**:
1. Restart API to trigger KeycloakSyncService
2. Verify roles exist in database
3. Check user-role assignments

### Issue: Roles not in JWT token

**Cause**: Keycloak client not configured for realm roles

**Solution**:
```powershell
.\keycloak\fix-roles-in-token.ps1
```

## Success Criteria

✅ **Task 8 is complete when:**

1. All automated tests pass (>90% success rate)
2. Role-based access control works correctly
3. Medical action validation enforces regulations
4. Unauthorized access returns 403 with clear messages
5. All users can view their permissions
6. Authorization is logged for audit trail

## Next Steps

After successful testing:
1. Mark task 8.9 as complete
2. Optionally create unit tests (8.10)
3. Final commit and push (8.11)
4. Merge to develop branch
5. Proceed to Task 9 (Audit System)

## Notes

- The authorization system integrates with Keycloak JWT tokens
- Roles are synced from Keycloak to local database on startup
- Permissions are assigned based on medical regulations
- All authorization attempts are logged for audit
- System roles (admin, doctor, etc.) cannot be deleted
