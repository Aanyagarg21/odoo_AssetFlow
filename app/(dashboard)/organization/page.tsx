
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OrganizationClient from './OrganizationClient';

export default async function OrganizationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single();

  // Check if user is admin
  if (profile.role !== 'admin') {
    return redirect('/dashboard');
  }

  // Fetch all data
  const [
    { data: departments },
    { data: categories },
    { data: employees },
    { data: locations },
    { data: desks }
  ] = await Promise.all([
    supabase.from('departments').select('*, department_head:profiles(*), parent_department:departments(*)').eq('organization_id', profile.organization_id),
    supabase.from('asset_categories').select('*').eq('organization_id', profile.organization_id),
    supabase.from('profiles').select('*, department:departments(*)').eq('organization_id', profile.organization_id),
    supabase.from('locations').select('*').eq('organization_id', profile.organization_id),
    supabase.from('desks').select('*, location:locations(*), assigned_employee:profiles(*)').eq('organization_id', profile.organization_id),
  ]);

  return (
    <OrganizationClient
      profile={profile}
      departments={departments}
      categories={categories}
      employees={employees}
      locations={locations}
      desks={desks}
    />
  );
}
