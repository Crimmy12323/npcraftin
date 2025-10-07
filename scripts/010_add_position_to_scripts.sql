-- Add position column to scripts table
ALTER TABLE public.scripts ADD COLUMN IF NOT EXISTS position INTEGER;

-- Set initial positions based on created_at (oldest = 0, newest = highest)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS pos
  FROM public.scripts
)
UPDATE public.scripts
SET position = ranked.pos
FROM ranked
WHERE scripts.id = ranked.id;

-- Make position NOT NULL after setting initial values
ALTER TABLE public.scripts ALTER COLUMN position SET NOT NULL;

-- Set default for new records
ALTER TABLE public.scripts ALTER COLUMN position SET DEFAULT 0;
