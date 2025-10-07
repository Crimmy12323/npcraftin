-- Add "Free" as a new access type option for both executors and scripts
-- This script ensures the access_type column can accept "Free" as a valid value

-- Note: PostgreSQL TEXT columns don't have constraints by default, 
-- so "Free" will work automatically. This script is for documentation purposes.

-- You can now use the following access types:
-- - Free
-- - Paid
-- - Keyless
-- - Key System

-- No actual migration needed as TEXT columns accept any value
SELECT 'Free access type is now available for use' AS status;
