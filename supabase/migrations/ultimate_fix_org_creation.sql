
-- ULTIMATE FIX for Organization Creation!

-- Step 1: Safely create user_role type (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM (
            'admin',
            'asset_manager',
            'department_head',
            'employee',
            'auditor',
            'technician'
        );
    END IF;
END
$$;

-- Step 2: Create organizations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    industry TEXT,
    email_domain TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 3: Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    employee_code TEXT,
    phone TEXT,
    avatar_url TEXT,
    department_id UUID,
    role user_role NOT NULL DEFAULT 'employee',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 4: Drop any existing conflicting RLS policies (with safe checks)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'organizations') THEN
        DROP POLICY IF EXISTS "Organizations are viewable by organization members" ON public.organizations;
        DROP POLICY IF EXISTS "Anyone can view organizations" ON public.organizations;
        DROP POLICY IF EXISTS "Anyone can create organizations" ON public.organizations;
        DROP POLICY IF EXISTS "Organization members can update their organization" ON public.organizations;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles') THEN
        DROP POLICY IF EXISTS "Profiles are insertable by admins only" ON public.profiles;
        DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
    END IF;
END
$$;

-- Step 5: Ensure RLS is enabled
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Create the correct policies for onboarding!
CREATE POLICY "Anyone can view organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Anyone can create organizations" ON public.organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Organization members can update their organization" ON public.organizations FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.organization_id = public.organizations.id
        AND p.id = auth.uid()
    )
) WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.organization_id = public.organizations.id
        AND p.id = auth.uid()
    )
);

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
