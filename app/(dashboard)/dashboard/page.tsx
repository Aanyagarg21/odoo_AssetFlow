
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(name)')
    .eq('id', user.id)
    .single();

  // Fetch KPI data
  const { data: assets } = await supabase
    .from('assets')
    .select('status, condition, department_id')
    .eq('organization_id', profile.organization_id);

  const { data: allocations } = await supabase
    .from('asset_allocations')
    .select('status, expected_return_date, actual_return_date')
    .eq('organization_id', profile.organization_id);

  const { data: bookings } = await supabase
    .from('resource_bookings')
    .select('status, start_time, end_time')
    .eq('organization_id', profile.organization_id);

  const { data: transfers } = await supabase
    .from('transfer_requests')
    .select('status')
    .eq('organization_id', profile.organization_id);

  const { data: maintenance } = await supabase
    .from('maintenance_requests')
    .select('status, priority')
    .eq('organization_id', profile.organization_id);

  // Calculate KPI values
  const totalAssets = assets?.length || 0;
  const availableAssets = assets?.filter(a => a.status === 'available').length || 0;
  const allocatedAssets = assets?.filter(a => a.status === 'allocated').length || 0;
  const underMaintenance = assets?.filter(a => a.status === 'under_maintenance').length || 0;
  
  const activeBookings = bookings?.filter(b => b.status === 'ongoing').length || 0;
  const pendingTransfers = transfers?.filter(t => t.status === 'requested' || t.status === 'approved').length || 0;
  
  const today = new Date();
  const upcomingReturns = allocations?.filter(a => {
    if (!a.expected_return_date || a.status === 'returned') return false;
    const returnDate = new Date(a.expected_return_date);
    return returnDate > today;
  }).length || 0;
  
  const overdueReturns = allocations?.filter(a => {
    if (!a.expected_return_date || a.status !== 'active') return false;
    const returnDate = new Date(a.expected_return_date);
    return returnDate < today;
  }).length || 0;

  // Prepare chart data
  const assetStatusData = [
    { name: 'Available', value: availableAssets, color: '#22c55e' },
    { name: 'Allocated', value: allocatedAssets, color: '#3b82f6' },
    { name: 'Maintenance', value: underMaintenance, color: '#f59e0b' },
    { name: 'Other', value: totalAssets - availableAssets - allocatedAssets - underMaintenance, color: '#6b7280' }
  ];

  return (
    <DashboardClient
      profile={profile}
      kpis={{
        totalAssets,
        availableAssets,
        allocatedAssets,
        underMaintenance,
        activeBookings,
        pendingTransfers,
        upcomingReturns,
        overdueReturns
      }}
      assetStatusData={assetStatusData}
    />
  );
}
