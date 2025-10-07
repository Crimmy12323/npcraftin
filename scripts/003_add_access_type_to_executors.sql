-- Add access_type column to executors table
ALTER TABLE executors ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'Free';

-- Update to use separate Keyless and Paid options instead of combined
UPDATE executors SET access_type = CASE 
  WHEN is_paid = true THEN 'Paid'
  ELSE 'Free'
END;
