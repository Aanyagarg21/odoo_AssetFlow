
'use client';

import { useEffect, useState } from 'react';
import { Bell, Search, Plus, Home, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function TopNavbar() {
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };
    getProfile();
  }, [supabase]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 px-6 flex items-center justify-between">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Home size={16} />
        <span className="text-gray-800 font-medium">Dashboard</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search assets, employees, or resources..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={18} />
          Quick Create
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center text-blue-600 font-semibold">
            {profile?.full_name ? getInitials(profile.full_name) : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
