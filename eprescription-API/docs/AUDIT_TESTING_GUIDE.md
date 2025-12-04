# Audit System Testing Guide

## Overview

This guide explains how to test the audit logging system with CRUD operations to verify that all changes are properly tracked.

## Prerequisites

1. **API Running**: Ensure the API is running locally
   ```powershell
   .\quick-start-local.ps1
   ```

2. **Authentication**: You need a valid JWT token
   - Login through Keycloak
   - Use admin or auditor role for full access

3. **Test Tools**: 
   - PowerShell (for test script)
   - Postman (for manual testing)
   - Oracle SQL Developer (to verify database)

## Automated Testing

### Run the Test Script

```powershell
.\test-audit-system.ps1
```

This script tests:
- ✅ Basic audit log retrieval
- ✅ Date range filtering
- ✅ Action type filtering
- ✅ Entity type filtering
- ✅ Specific log retrieval by ID
- ✅ Audit log integrity validation
- ✅ Audit statistics
- ✅ Retention policy information
- ✅ Archivable logs count
- ✅ Pagination

## Manual CRUD Testing

### Test 1: Create Operation

**Objective**: Verify that CREATE operations are logged

1. **Create a Patient** (or any entity):
   ```http
   POST http://localhost:5000/api/patients
   Authorization: Bearer {your_token}
   Content-Type: application/json

   {
     "firstName": "John",
     "lastName": "Doe",
     "dateOfBirth": "1990-01-15",
     "email": "john.doe@example.com",
     "phoneNumber": "+1234567890"
   }
   ```

2. **Check Audit Logs**:
   ```http
   GET http://localhost:5000/api/audit?action=Created&entityType=Patient&pageSize=10
   Authorization: Bearer {your_token}
   ```

3. **Verify**:
   - ✅ Log exists with `actionType: "Created"`
   - ✅ `entityType: "Patient"`
   - ✅ `entityId` matches the created patient ID
   - ✅ `afterValue` contains the patient data (JSON)
   - ✅ `beforeValue` is null (no previous state)
   - ✅ `userId` and `username` are captured
   - ✅ `ipAddress` is captured
   - ✅ `timestamp` is correct

### Test 2: Update Operation

**Objective**: Verify that UPDATE operations are logged with before/after values

1. **Update the Patient**:
   ```http
   PUT http://localhost:5000/api/patients/{id}
   Authorization: Bearer {your_token}
   Content-Type: application/json

   {
     "firstName": "John",
     "lastName": "Smith",
     "dateOfBirth": "1990-01-15",
     "email": "john.smith@example.com",
     "phoneNumber": "+1234567890"
   }
   ```

2. **Check Audit Logs**:
   ```http
   GET http://localhost:5000/api/audit?action=Updated&entityType=Patient&entityId={id}
   Authorization: Bearer {your_token}
   ```

3. **Verify**:
   - ✅ Log exists with `actionType: "Updated"`
   - ✅ `beforeValue` contains old data (lastName: "Doe")
   - ✅ `afterValue` contains new data (lastName: "Smith")
   - ✅ Both values are valid JSON
   - ✅ Timestamp is after the create operation

### Test 3: Delete Operation

**Objective**: Verify that DELETE operations are logged

1. **Delete the Patient**:
   ```http
   DELETE http://localhost:5000/api/patients/{id}
   Authorization: Bearer {your_token}
   ```

2. **Check Audit Logs**:
   ```http
   GET http://localhost:5000/api/audit?action=Deleted&entityType=Patient&entityId={id}
   Authorization: Bearer {your_token}
   ```

3. **Verify**:
   - ✅ Log exists with `actionType: "Deleted"`
   - ✅ `beforeValue` contains the deleted data
   - ✅ `afterValue` is null (no state after deletion)
   - ✅ Entity can no longer be retrieved

### Test 4: Authentication Logging

**Objective**: Verify that login/logout operations are logged

1. **Login**:
   ```http
   POST http://localhost:8080/realms/eprescription/protocol/openid-connect/token
   Content-Type: application/x-www-form-urlencoded

   grant_type=password&client_id=eprescription-api&username=admin&password=admin123
   ```

2. **Check Audit Logs**:
   ```http
   GET http://localhost:5000/api/audit?action=LOGIN&entityType=Authentication
   Authorization: Bearer {your_token}
   ```

3. **Verify**:
   - ✅ Log exists with `actionType: "LOGIN"`
   - ✅ `entityType: "Authentication"`
   - ✅ `metadata` contains success status
   - ✅ IP address is captured

### Test 5: Immutability

**Objective**: Verify that audit logs cannot be modified or deleted

1. **Try to Update a Log** (should fail):
   ```sql
   -- In Oracle SQL Developer
   UPDATE AUDIT_LOGS 
   SET ACTION_TYPE = 'MODIFIED' 
   WHERE AUDIT_ID = (SELECT AUDIT_ID FROM AUDIT_LOGS WHERE ROWNUM = 1);
   ```

2. **Expected Result**:
   ```
   ORA-20001: AUDIT_LOGS es inmutable. No se permiten UPDATE ni DELETE para cumplimiento FDA 21 CFR Part 11
   ```

3. **Try to Delete a Log** (should fail):
   ```sql
   DELETE FROM AUDIT_LOGS WHERE ROWNUM = 1;
   ```

4. **Expected Result**:
   ```
   ORA-20001: AUDIT_LOGS es inmutable. No se permiten UPDATE ni DELETE para cumplimiento FDA 21 CFR Part 11
   ```

5. **Verify**:
   - ✅ UPDATE operation is blocked by trigger
   - ✅ DELETE operation is blocked by trigger
   - ✅ Error message references FDA compliance

### Test 6: Filtering

**Objective**: Verify that all filters work correctly

1. **Filter by Date Range**:
   ```http
   GET http://localhost:5000/api/audit?startDate=2024-11-01&endDate=2024-11-17&pageSize=20
   Authorization: Bearer {your_token}
   ```

2. **Filter by User**:
   ```http
   GET http://localhost:5000/api/audit?userId=admin&pageSize=20
   Authorization: Bearer {your_token}
   ```

3. **Filter by Action**:
   ```http
   GET http://localhost:5000/api/audit?action=Created&pageSize=20
   Authorization: Bearer {your_token}
   ```

4. **Filter by Entity Type**:
   ```http
   GET http://localhost:5000/api/audit?entityType=Patient&pageSize=20
   Authorization: Bearer {your_token}
   ```

5. **Combined Filters**:
   ```http
   GET http://localhost:5000/api/audit?startDate=2024-11-01&action=Updated&entityType=Patient&pageSize=20
   Authorization: Bearer {your_token}
   ```

6. **Verify**:
   - ✅ Each filter returns only matching logs
   - ✅ Combined filters work correctly (AND logic)
   - ✅ Empty results when no matches

### Test 7: Pagination

**Objective**: Verify that pagination works correctly

1. **Get First Page**:
   ```http
   GET http://localhost:5000/api/audit?pageNumber=1&pageSize=5
   Authorization: Bearer {your_token}
   ```

2. **Get Second Page**:
   ```http
   GET http://localhost:5000/api/audit?pageNumber=2&pageSize=5
   Authorization: Bearer {your_token}
   ```

3. **Verify**:
   - ✅ Response includes `totalCount`, `pageNumber`, `pageSize`, `totalPages`
   - ✅ Each page has correct number of logs (up to pageSize)
   - ✅ Different logs on different pages
   - ✅ Total pages calculation is correct
   - ✅ Last page may have fewer logs

### Test 8: Statistics

**Objective**: Verify that audit statistics are calculated correctly

1. **Get Statistics**:
   ```http
   GET http://localhost:5000/api/audit/statistics?startDate=2024-11-01&endDate=2024-11-17
   Authorization: Bearer {your_token}
   ```

2. **Verify**:
   - ✅ `totalOperations` matches log count
   - ✅ `authenticationAttempts` is accurate
   - ✅ `successfulAuthentications` + `failedAuthentications` = `authenticationAttempts`
   - ✅ `operationsByType` breakdown is correct
   - ✅ `operationsByUser` breakdown is correct
   - ✅ `mostActiveUsers` list is sorted
   - ✅ `mostCommonOperations` list is sorted

### Test 9: Retention Policy

**Objective**: Verify retention policy functionality

1. **Get Retention Policy Info**:
   ```http
   GET http://localhost:5000/api/audit/retention-policy
   Authorization: Bearer {your_token}
   ```

2. **Get Archivable Count**:
   ```http
   GET http://localhost:5000/api/audit/archivable-count?retentionYears=7
   Authorization: Bearer {your_token}
   ```

3. **Verify**:
   - ✅ Retention period is 7 years
   - ✅ Cutoff date is calculated correctly
   - ✅ Counts are accurate
   - ✅ Storage size estimate is reasonable

### Test 10: Automatic Audit Interceptor

**Objective**: Verify that EF Core interceptor logs changes automatically

1. **Perform any CRUD operation** (the interceptor should log it automatically)

2. **Check that two logs are created**:
   - One from the interceptor (automatic)
   - One from manual logging (if implemented in the service)

3. **Verify**:
   - ✅ Interceptor captures entity changes
   - ✅ Before/after values are serialized correctly
   - ✅ All entity types are tracked

## Database Verification

### Check Logs in Oracle

```sql
-- Connect to Oracle
sqlplus eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- View recent audit logs
SELECT 
    AUDIT_ID,
    TIMESTAMP,
    USERNAME,
    ACTION_TYPE,
    ENTITY_TYPE,
    ENTITY_ID
FROM AUDIT_LOGS
ORDER BY TIMESTAMP DESC
FETCH FIRST 20 ROWS ONLY;

-- Count logs by action type
SELECT 
    ACTION_TYPE,
    COUNT(*) as COUNT
FROM AUDIT_LOGS
GROUP BY ACTION_TYPE
ORDER BY COUNT DESC;

-- Count logs by entity type
SELECT 
    ENTITY_TYPE,
    COUNT(*) as COUNT
FROM AUDIT_LOGS
GROUP BY ENTITY_TYPE
ORDER BY COUNT DESC;

-- View logs for a specific user
SELECT 
    TIMESTAMP,
    ACTION_TYPE,
    ENTITY_TYPE,
    ENTITY_ID
FROM AUDIT_LOGS
WHERE USERNAME = 'admin'
ORDER BY TIMESTAMP DESC;

-- Check storage size
SELECT 
    COUNT(*) as TOTAL_LOGS,
    ROUND(SUM(DBMS_LOB.GETLENGTH(BEFORE_VALUE)) / 1024 / 1024, 2) as BEFORE_VALUE_MB,
    ROUND(SUM(DBMS_LOB.GETLENGTH(AFTER_VALUE)) / 1024 / 1024, 2) as AFTER_VALUE_MB
FROM AUDIT_LOGS;
```

## Performance Testing

### Test with Large Volume

1. **Create many logs** (simulate high traffic):
   ```powershell
   # Run this in a loop
   for ($i = 1; $i -le 1000; $i++) {
       # Create/Update/Delete operations
   }
   ```

2. **Test query performance**:
   ```http
   GET http://localhost:5000/api/audit?pageSize=100
   Authorization: Bearer {your_token}
   ```

3. **Verify**:
   - ✅ Queries remain fast (< 1 second)
   - ✅ Pagination works with large datasets
   - ✅ Filters don't slow down significantly
   - ✅ Database indexes are being used

### Check Index Usage

```sql
-- Check if indexes are being used
SELECT 
    INDEX_NAME,
    TABLE_NAME,
    UNIQUENESS,
    STATUS
FROM USER_INDEXES
WHERE TABLE_NAME = 'AUDIT_LOGS';

-- Analyze query execution plan
EXPLAIN PLAN FOR
SELECT * FROM AUDIT_LOGS
WHERE TIMESTAMP >= SYSDATE - 7
AND ACTION_TYPE = 'Created'
ORDER BY TIMESTAMP DESC;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

## Compliance Verification

### FDA 21 CFR Part 11 Checklist

- [x] **Audit Trail**: All operations are logged
- [x] **Immutability**: Logs cannot be modified or deleted
- [x] **User Identification**: User ID and username captured
- [x] **Timestamp**: Accurate timestamps for all operations
- [x] **Before/After Values**: Changes are tracked
- [x] **Retention**: 7-year retention policy implemented
- [x] **Access Control**: Only auditors can view logs
- [x] **Integrity Validation**: Validation endpoint available

## Troubleshooting

### No Logs Appearing

1. Check that the interceptor is registered in `Program.cs`
2. Verify database connection
3. Check that operations are actually modifying the database
4. Look for errors in application logs

### Logs Missing Information

1. Verify HTTP context is available (for user info)
2. Check that entity changes are being tracked by EF Core
3. Ensure serialization is working correctly

### Performance Issues

1. Check database indexes
2. Verify pagination is being used
3. Consider archiving old logs
4. Monitor database query execution plans

## Next Steps

After completing these tests:

1. ✅ Document test results
2. ✅ Create unit tests for audit service
3. ✅ Create integration tests
4. ✅ Set up automated testing in CI/CD
5. ✅ Configure monitoring and alerts

## References

- [Audit Retention Policy](./AUDIT_RETENTION_POLICY.md)
- [FDA 21 CFR Part 11](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/part-11-electronic-records-electronic-signatures-scope-and-application)
- [HIPAA Audit Requirements](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)

---

**Last Updated**: 2024-11-17  
**Version**: 1.0  
**Author**: ePrescription Team
