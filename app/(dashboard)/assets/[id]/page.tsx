
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AssetDetailsClient from './AssetDetailsClient';

export default async function AssetDetailsPage({ params }: { params: { id: string } }) {
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

  // Fetch asset
  const { data: asset } = await supabase
    .from('assets')
    .select('*, category:asset_categories(*), assigned_employee:profiles(*), department:departments(*), location:locations(*), created_by_user:profiles(*)')
    .eq('id', params.id)
    .eq('organization_id', profile.organization_id)
    .single();

  if (!asset) {
    return redirect('/assets');
  }

  return <AssetDetailsClient asset={asset} />;
}
