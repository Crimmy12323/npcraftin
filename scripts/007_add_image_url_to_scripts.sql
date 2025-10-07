-- Add image_url column to scripts table if it doesn't exist
ALTER TABLE scripts ADD COLUMN IF NOT EXISTS image_url TEXT;
