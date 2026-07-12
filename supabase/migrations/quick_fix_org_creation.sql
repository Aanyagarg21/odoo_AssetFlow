
-- Quick fix: Ensure organizations table exists and has correct RLS for onboarding

-- First, make sure the organizations table is there (in case 001 wasn't fully applied)
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

-- Make sure profiles table is there too
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

-- Drop any existing RLS policies for organizations that might conflict
DROP POLICY IF EXISTS "Organizations are viewable by organization members" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can view organizations" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization members can update their organization" ON public.organizations;

-- Enable RLS just in case it's off
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Now create the policies we need for onboarding
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

-- Fix profiles RLS
DROP POLICY IF EXISTS "Profiles are insertable by admins only" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
