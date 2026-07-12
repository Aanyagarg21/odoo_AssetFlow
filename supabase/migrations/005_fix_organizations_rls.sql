-- Fix organizations and profiles RLS to allow signup flow
-- Ensure policies are created correctly, even if some don't exist yet

-- 1. First, make sure RLS is still enabled (in case it was accidentally disabled)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Fix organizations RLS: drop existing conflicting policies first
DO $$
BEGIN
    -- Drop any existing select policies on organizations to replace them
    DROP POLICY IF EXISTS "Organizations are viewable by organization members" ON public.organizations;
    DROP POLICY IF EXISTS "Anyone can view organizations" ON public.organizations;
    DROP POLICY IF EXISTS "Anyone can create organizations" ON public.organizations;
    DROP POLICY IF EXISTS "Organization members can update their organization" ON public.organizations;
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Ignore errors if policies don't exist
END $$;

-- Now create the correct policies for organizations
CREATE POLICY "Anyone can view organizations"
ON public.organizations FOR SELECT
USING (true);

CREATE POLICY "Anyone can create organizations"
ON public.organizations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Organization members can update their organization"
ON public.organizations FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.organization_id = public.organizations.id
        AND p.id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.organization_id = public.organizations.id
        AND p.id = auth.uid()
    )
);

-- 3. Fix profiles RLS: allow inserting own profile
DO $$
BEGIN
    -- Drop existing insert policy on profiles
    DROP POLICY IF EXISTS "Profiles are insertable by admins only" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);
