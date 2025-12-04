$query = @"
SELECT column_name, data_type, data_length, nullable
FROM user_tab_columns
WHERE table_name = 'PRESCRIPTION_MEDICATIONS'
ORDER BY column_id;
EXIT;
"@

$query | docker exec -i eprescription-oracle-db sqlplus -s eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1
