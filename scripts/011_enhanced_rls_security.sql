-- Enhanced Row Level Security with Admin-Only Modifications
-- This script ensures that only authenticated admin users can modify data

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to insert executors" ON executors;
DROP POLICY IF EXISTS "Allow authenticated users to update executors" ON executors;
DROP POLICY IF EXISTS "Allow authenticated users to delete executors" ON executors;
DROP POLICY IF EXISTS "Allow authenticated users to insert scripts" ON scripts;
DROP POLICY IF EXISTS "Allow authenticated users to update scripts" ON scripts;
DROP POLICY IF EXISTS "Allow authenticated users to delete scripts" ON scripts;

-- Create a function to check if user is admin
-- This checks if the user's email matches the admin email
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the authenticated user's email is the admin email
  -- You should replace 'admin@npcraftin.com' with your actual admin email
  RETURN (
    auth.uid() IS NOT NULL AND 
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@npcraftin.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executors table policies - Admin only for modifications
CREATE POLICY "Only admins can insert executors"
ON executors FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update executors"
ON executors FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete executors"
ON executors FOR DELETE
TO authenticated
USING (is_admin());

-- Scripts table policies - Admin only for modifications
CREATE POLICY "Only admins can insert scripts"
ON scripts FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update scripts"
ON scripts FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete scripts"
ON scripts FOR DELETE
TO authenticated
USING (is_admin());

-- Add additional security: Prevent direct table access via SQL
-- Only allow access through the application
REVOKE ALL ON executors FROM anon;
REVOKE ALL ON scripts FROM anon;

-- Grant only SELECT to anonymous users
GRANT SELECT ON executors TO anon;
GRANT SELECT ON scripts TO anon;

-- Grant full access to authenticated users (but RLS policies will restrict to admin)
GRANT ALL ON executors TO authenticated;
GRANT ALL ON scripts TO authenticated;
