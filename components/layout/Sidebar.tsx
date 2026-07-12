'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Box,
  ArrowRightLeft,
  Calendar,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  MapPin,
  Bot,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { rolePermissions, type UserRole } from "@/lib/permissions/permissions";

const allNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "Organization Setup", href: "/organization", icon: Building2, key: "organization" },
  { label: "Assets", href: "/assets", icon: Box, key: "assets" },
  { label: "Allocation & Transfer", href: "/allocations", icon: ArrowRightLeft, key: "allocations" },
  { label: "Resource Booking", href: "/bookings", icon: Calendar, key: "bookings" },
  { label: "Maintenance", href: "/maintenance", icon: Wrench, key: "maintenance" },
  { label: "Audit", href: "/audits", icon: ClipboardCheck, key: "audits" },
  { label: "Reports & Analytics", href: "/reports", icon: BarChart3, key: "reports" },
  { label: "Notifications", href: "/notifications", icon: Bell, key: "notifications" },
  { label: "Digital Office Map", href: "/office-map", icon: MapPin, key: "office-map" },
  { label: "AI Assistant", href: "/ai-assistant", icon: Bot, key: "ai-assistant" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(data);
      }
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  const filteredNavItems = allNavItems.filter(item => {
    if (!profile) return true;
    return rolePermissions[profile.role as UserRole].includes(item.key as any);
  });

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="w-[260px] h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-primary" />
      </div>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className={cn(
        "bg-white border-r border-border h-screen sticky top-0 flex flex-col shadow-card z-20"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            {/* Abstract A Logo */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 20L12 4L20 20H15L12 13L9 20H4Z"
                  fill="white"
                />
                <path
                  d="M12 13L15 20H18L12 8L6 20H9L12 13Z"
                  fill="rgba(255,255,255,0.8)"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AssetFlow
            </span>
          </div>
        ) : (
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft mx-auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20L12 4L20 20H15L12 13L9 20H4Z" fill="white" />
            </svg>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "sidebar-item",
                  isActive && "sidebar-item-active"
                )}
              >
                <Icon size={20} strokeWidth={2} />
                {!collapsed && (
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-border p-4">
        {!collapsed ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold">
                {profile?.full_name ? getInitials(profile.full_name) : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {(profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1) || "User"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Settings size={18} />
                <span className="text-xs">Settings</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-muted text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut size={18} />
                <span className="text-xs">Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-10 w-10 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold">
              {profile?.full_name ? getInitials(profile.full_name) : "U"}
            </div>
            <div className="flex flex-col items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Settings size={18} />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-muted text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
