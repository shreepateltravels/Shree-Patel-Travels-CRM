-- 1. Custom Enums for strict data types
CREATE TYPE user_role AS ENUM ('Admin', 'Staff');

-- 2. Users Table (Links to Supabase Auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'Staff' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Add mobile number column
ALTER TABLE public.users ADD COLUMN mobile_number text;

-- 4. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Create the "VIP Bouncer" function that bypasses RLS safely
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- 6. Re-create Policy 1: Everyone can read their OWN row
CREATE POLICY "Staff can read own profile"
ON public.users FOR SELECT
USING ( auth.uid() = id );

-- 7. Re-create Policy 2: Admins can manage everyone
CREATE POLICY "Admins can manage all users"
ON public.users FOR ALL
USING ( public.get_user_role() = 'Admin' );


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'), 
    'Admin'
  );
  RETURN NEW;
END;
$$;

-- Trigger to fire the function whenever auth.users gets a new row
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();