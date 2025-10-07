-- Enable Row Level Security on all tables
ALTER TABLE executors ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Create policies for executors table
-- Allow everyone to read executors
CREATE POLICY "Allow public read access to executors"
ON executors FOR SELECT
TO public
USING (true);

-- Only authenticated users can insert/update/delete executors
CREATE POLICY "Allow authenticated users to insert executors"
ON executors FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update executors"
ON executors FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete executors"
ON executors FOR DELETE
TO authenticated
USING (true);

-- Create policies for scripts table
-- Allow everyone to read scripts
CREATE POLICY "Allow public read access to scripts"
ON scripts FOR SELECT
TO public
USING (true);

-- Only authenticated users can insert/update/delete scripts
CREATE POLICY "Allow authenticated users to insert scripts"
ON scripts FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update scripts"
ON scripts FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete scripts"
ON scripts FOR DELETE
TO authenticated
USING (true);
