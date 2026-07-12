
export type UserRole = 
  | 'admin' 
  | 'asset_manager' 
  | 'department_head' 
  | 'employee' 
  | 'auditor' 
  | 'technician';

export type RouteAccess = 
  | 'dashboard'
  | 'assets'
  | 'allocations'
  | 'bookings'
  | 'maintenance'
  | 'audits'
  | 'reports'
  | 'notifications'
  | 'office-map'
  | 'ai-assistant'
  | 'organization'

// Define route permissions per role
export const rolePermissions: Record<UserRole, RouteAccess[]> = {
  admin: [
    'dashboard',
    'assets',
    'allocations',
    'bookings',
    'maintenance',
    'audits',
    'reports',
    'notifications',
    'office-map',
    'ai-assistant',
    'organization'
  ],
  asset_manager: [
    'dashboard',
    'assets',
    'allocations',
    'bookings',
    'maintenance',
    'audits',
    'reports',
    'notifications',
    'office-map',
    'ai-assistant'
  ],
  department_head: [
    'dashboard',
    'assets',
    'allocations',
    'bookings',
    'maintenance',
    'reports',
    'notifications',
    'office-map',
    'ai-assistant'
  ],
  employee: [
    'dashboard',
    'assets',
    'bookings',
    'maintenance',
    'allocations',
    'notifications',
    'office-map',
    'ai-assistant'
  ],
  auditor: [
    'audits',
    'assets',
    'notifications'
  ],
  technician: [
    'maintenance',
    'notifications'
  ]
};

// Check if user has access to a specific route
export function hasRouteAccess(role: UserRole | null, route: RouteAccess): boolean {
  if (!role) return false;
  return rolePermissions[role].includes(route);
}
