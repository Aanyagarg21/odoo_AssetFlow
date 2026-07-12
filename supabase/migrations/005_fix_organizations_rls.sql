-- Fix organizations and profiles RLS to allow signup flow

-- Fix organizations RLS
DROP POLICY IF EXISTS "Organizations are viewable by organization members" ON public.organizations;

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

-- Fix profiles RLS: allow users to insert their own profile right after signup
DROP POLICY IF EXISTS "Profiles are insertable by admins only" ON public.profiles;

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);
