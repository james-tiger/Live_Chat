-- Add bio field to profiles for user profile management
ALTER TABLE public.profiles 
ADD COLUMN bio TEXT;

-- Create admin table for admin credentials
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can manage admin accounts" 
ON public.admins 
FOR ALL 
USING (true);

-- Add blocked status to profiles for admin user management
ALTER TABLE public.profiles 
ADD COLUMN is_blocked BOOLEAN DEFAULT false;

-- Allow admins to update any profile (for blocking users)
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admins 
  WHERE admins.email = current_setting('request.jwt.claims', true)::json->>'email'
));

-- Allow admins to delete messages
CREATE POLICY "Admins can delete any message" 
ON public.messages 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.admins 
  WHERE admins.email = current_setting('request.jwt.claims', true)::json->>'email'
));