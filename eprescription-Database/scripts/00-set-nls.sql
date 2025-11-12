-- =====================================================
-- Script: 00-set-nls.sql
-- Description: Configure Oracle session for UTF-8 Spanish
-- Must be executed before any data insertion scripts
-- =====================================================

ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';
ALTER SESSION SET NLS_DATE_FORMAT='YYYY-MM-DD';
ALTER SESSION SET NLS_TIMESTAMP_FORMAT='YYYY-MM-DD HH24:MI:SS';

-- Verify settings
SELECT 
  'NLS Configuration Set' as status,
  parameter, 
  value 
FROM nls_session_parameters 
WHERE parameter IN ('NLS_LANGUAGE', 'NLS_TERRITORY', 'NLS_DATE_FORMAT');

PROMPT NLS Configuration completed successfully!
