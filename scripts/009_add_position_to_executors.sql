-- Add position column to executors table
ALTER TABLE public.executors ADD COLUMN IF NOT EXISTS position INTEGER;

-- Set initial positions based on created_at (oldest = 0, newest = highest)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS pos
  FROM public.executors
)
UPDATE public.executors
SET position = ranked.pos
FROM ranked
WHERE executors.id = ranked.id;

-- Make position NOT NULL after setting initial values
ALTER TABLE public.executors ALTER COLUMN position SET NOT NULL;

-- Set default for new records
ALTER TABLE public.executors ALTER COLUMN position SET DEFAULT 0;
