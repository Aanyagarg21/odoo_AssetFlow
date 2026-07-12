
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { hasRouteAccess, type RouteAccess } from './lib/permissions/permissions';

// Route to role mapping
const routeMap: Record<string, RouteAccess> = {
  '/dashboard': 'dashboard',
  '/assets': 'assets',
  '/allocations': 'allocations',
  '/bookings': 'bookings',
  '/maintenance': 'maintenance',
  '/audits': 'audits',
  '/reports': 'reports',
  '/notifications': 'notifications',
  '/office-map': 'office-map',
  '/ai-assistant': 'ai-assistant',
  '/organization': 'organization'
};

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser();

  // If user, get their profile
  let profile = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('role, organization_id').eq('id', user.id).single();
    profile = data;
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // Public routes
  if (
    path === '/' ||
    path.startsWith('/login') ||
    path.startsWith('/signup') ||
    path.startsWith('/forgot-password') ||
    path.startsWith('/reset-password') ||
    path.startsWith('/onboarding')
  ) {
    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (user && path !== '/onboarding') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // Protected routes
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check route permissions
  for (const [routePattern, routeKey] of Object.entries(routeMap)) {
    if (path.startsWith(routePattern)) {
      if (!profile || !hasRouteAccess(profile.role as any, routeKey)) {
        // Redirect to dashboard if no access
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      break;
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
