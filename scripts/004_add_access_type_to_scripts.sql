-- Add access_type column to scripts table
ALTER TABLE scripts ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'Free';
