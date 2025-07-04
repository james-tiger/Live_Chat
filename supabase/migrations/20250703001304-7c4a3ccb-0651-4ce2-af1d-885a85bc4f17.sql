-- Fix the foreign key relationship and add profile features
-- Add foreign key from messages to profiles via user_id
ALTER TABLE public.messages 
ADD CONSTRAINT messages_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

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

-- Insert admin user (password will be hashed by app)
INSERT INTO public.admins (email, password_hash) 
VALUES ('admin@gmail.com', '$2a$10$placeholder_will_be_replaced');

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