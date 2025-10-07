-- Add access_type column to executors table
ALTER TABLE executors ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'Keyless';

-- Update any NULL values to Keyless
UPDATE executors SET access_type = 'Keyless' WHERE access_type IS NULL;
