
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AssetsClient from './AssetsClient';

export default async function AssetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  // Fetch all data
  const [
    { data: assets },
    { data: categories },
    { data: departments },
    { data: locations },
    { data: employees }
  ] = await Promise.all([
    supabase.from('assets').select('*, category:asset_categories(*), assigned_employee:profiles(*), department:departments(*), location:locations(*)').eq('organization_id', profile.organization_id),
    supabase.from('asset_categories').select('*').eq('organization_id', profile.organization_id).eq('is_active', true),
    supabase.from('departments').select('*').eq('organization_id', profile.organization_id).eq('is_active', true),
    supabase.from('locations').select('*').eq('organization_id', profile.organization_id).eq('is_active', true),
    supabase.from('profiles').select('*').eq('organization_id', profile.organization_id),
  ]);

  return (
    <AssetsClient
      profile={profile}
      assets={assets}
      categories={categories}
      departments={departments}
      locations={locations}
      employees={employees}
    />
  );
}
