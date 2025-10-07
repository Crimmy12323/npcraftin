-- Update any Free or NULL access types to Keyless
UPDATE scripts SET access_type = 'Keyless' WHERE access_type IS NULL OR access_type = 'Free';

-- Set default to Keyless for new entries
ALTER TABLE scripts ALTER COLUMN access_type SET DEFAULT 'Keyless';
