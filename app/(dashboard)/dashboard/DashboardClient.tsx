
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Box,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  Calendar,
  Wrench,
  TrendingUp,
  TrendingDown,
  Activity,
  Plus,
  ArrowRight,
  FileText,
  Users,
  MapPin,
  Bell,
  Search
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

// Function to get greeting based on time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// KPI Card Component
function KPICard({
  icon: Icon,
  value,
  label,
  change,
  isPositive,
  color,
  href,
  isLoading = false
}: any) {
  if (isLoading) {
    return (
      <div className="card-premium animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-xl bg-gray-200"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-9 w-24 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-28 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <Link href={href || '#'} className="block">
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="card-premium hover:shadow-lg transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-soft`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {change && (
            <span
              className={`text-sm font-medium flex items-center gap-1 ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {change}
            </span>
          )}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        <div className="text-gray-600 text-sm">
          {label}
        </div>
      </motion.div>
    </Link>
  );
}

// Overdue Alert Panel
function OverdueAlert({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-center gap-4"
    >
      <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="h-5 w-5 text-red-600" />
      </div>
      <div className="flex-1">
        <h4 className="text-red-800 font-semibold">
          {count} {count === 1 ? 'asset is' : 'assets are'} overdue for return and require follow-up.
        </h4>
        <p className="text-red-600 text-sm">
          Please reach out to the respective employees to collect these assets.
        </p>
      </div>
      <Link href="/allocations" className="flex items-center gap-2 text-red-700 font-medium hover:underline">
        View all <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}

export default function DashboardClient({
  profile,
  kpis,
  assetStatusData
}: any) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setCurrentDate(dateStr);
  }, []);

  // Sample recent activities (will be replaced with real data later)
  const recentActivities = [
    { type: 'allocated', user: 'Sarah K.', action: 'Allocated Laptop (AF-0023)', time: '2 min ago' },
    { type: 'booking', user: 'Mike L.', action: 'Confirmed conference room booking', time: '15 min ago' },
    { type: 'maintenance', user: 'Anna M.', action: 'Resolved maintenance for Printer (AF-0012)', time: '1 hour ago' },
    { type: 'transfer', user: 'David W.', action: 'Approved asset transfer', time: '2 hours ago' },
  ];

  // Sample upcoming tasks
  const upcomingTasks = [
    { type: 'return', title: 'Laptop (AF-0015) due', date: 'Today, 4:00 PM', priority: 'high' },
    { type: 'maintenance', title: 'Server room equipment check', date: 'Tomorrow, 9:00 AM', priority: 'medium' },
    { type: 'booking', title: 'Projector for team meeting', date: 'Wednesday, 11:00 AM', priority: 'low' },
  ];

  // Quick actions based on role
  const quickActions = [
    { label: 'Register Asset', icon: Plus, href: '/assets', role: ['admin', 'asset_manager'] },
    { label: 'Allocate Asset', icon: ArrowRightLeft, href: '/allocations', role: ['admin', 'asset_manager', 'department_head'] },
    { label: 'Book Resource', icon: Calendar, href: '/bookings', role: ['admin', 'asset_manager', 'department_head', 'employee'] },
    { label: 'Raise Maintenance', icon: Wrench, href: '/maintenance', role: ['admin', 'asset_manager', 'department_head', 'employee'] },
    { label: 'Start Audit', icon: FileText, href: '/audits', role: ['admin', 'asset_manager', 'auditor'] },
  ];

  // Filter quick actions by user's role
  const userRole = profile?.role || 'employee';
  const filteredActions = quickActions.filter(action => action.role.includes(userRole));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {profile?.full_name?.split(' ')[0]}!
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="capitalize font-medium">{profile?.role}</span>
            <span className="text-gray-400">•</span>
            <span>{profile?.organizations?.name}</span>
            <span className="text-gray-400">•</span>
            <span>{currentDate}</span>
          </div>
        </div>
      </div>

      {/* Overdue Alert */}
      <OverdueAlert count={kpis.overdueReturns} />

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link href={action.href} key={idx}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="card-premium flex items-center gap-3 p-4"
                >
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <Icon size={20} />
                  </div>
                  <span className="font-medium text-gray-800">{action.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          icon={Box}
          value={kpis.totalAssets}
          label="Total Assets"
          change="+12.5%"
          isPositive={true}
          color="from-blue-500 to-blue-600"
          href="/assets"
        />
        <KPICard
          icon={CheckCircle}
          value={kpis.availableAssets}
          label="Available Assets"
          change="+5.2%"
          isPositive={true}
          color="from-green-500 to-green-600"
          href="/assets"
        />
        <KPICard
          icon={Users}
          value={kpis.allocatedAssets}
          label="Allocated Assets"
          change="+3.1%"
          isPositive={true}
          color="from-purple-500 to-purple-600"
          href="/allocations"
        />
        <KPICard
          icon={Wrench}
          value={kpis.underMaintenance}
          label="Under Maintenance"
          change="-2.0%"
          isPositive={false}
          color="from-orange-500 to-orange-600"
          href="/maintenance"
        />
        <KPICard
          icon={Calendar}
          value={kpis.activeBookings}
          label="Active Bookings"
          change="+8.3%"
          isPositive={true}
          color="from-cyan-500 to-cyan-600"
          href="/bookings"
        />
        <KPICard
          icon={ArrowRightLeft}
          value={kpis.pendingTransfers}
          label="Pending Transfers"
          color="from-indigo-500 to-indigo-600"
          href="/allocations"
        />
        <KPICard
          icon={Clock}
          value={kpis.upcomingReturns}
          label="Upcoming Returns"
          color="from-teal-500 to-teal-600"
          href="/allocations"
        />
        <KPICard
          icon={AlertTriangle}
          value={kpis.overdueReturns}
          label="Overdue Returns"
          color="from-red-500 to-red-600"
          href="/allocations"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Asset Status Donut Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Asset Status</h2>
                <p className="text-sm text-gray-600">Current asset distribution</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetStatusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Activity Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-premium"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Asset Activity</h2>
                <p className="text-sm text-gray-600">Last 7 days of asset usage</p>
              </div>
              <select className="bg-gray-100 border-none rounded-lg px-4 py-2 text-sm text-gray-600">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center">
                <Activity className="h-12 w-12 text-blue-500/50 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Activity chart will appear here</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Recent Activity & Upcoming */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-premium"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((item, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="h-2 w-2 rounded-full mt-2 bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{item.user}</span> {item.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-premium"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Upcoming</h2>
            <div className="space-y-4">
              {upcomingTasks.map((item, i) => {
                const priorityColors = {
                  high: 'bg-red-100 text-red-700',
                  medium: 'bg-yellow-100 text-yellow-700',
                  low: 'bg-green-100 text-green-700'
                };
                return (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[item.priority as keyof typeof priorityColors]}`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
