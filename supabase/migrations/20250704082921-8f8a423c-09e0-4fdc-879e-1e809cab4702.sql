-- Create admin user account in auth.users
-- Note: This will need to be done manually in Supabase as we can't insert into auth.users directly
-- Instead, let's create a helper function for admin verification

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN user_email = 'admin@gmail.com';
END;
$$;