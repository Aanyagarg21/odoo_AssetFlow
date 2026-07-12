'use client';

import { motion } from "framer-motion";
import {
  Box,
  Users,
  ArrowRightLeft,
  Calendar,
  Wrench,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

const statCards = [
  {
    title: "Total Assets",
    value: "1,248",
    change: "+12.5%",
    isPositive: true,
    icon: Box,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Active Employees",
    value: "342",
    change: "+5.2%",
    isPositive: true,
    icon: Users,
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Pending Transfers",
    value: "18",
    change: "-3.1%",
    isPositive: false,
    icon: ArrowRightLeft,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Upcoming Bookings",
    value: "47",
    change: "+8.3%",
    isPositive: true,
    icon: Calendar,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    title: "Maintenance Requests",
    value: "9",
    change: "+2.0%",
    isPositive: false,
    icon: Wrench,
    color: "from-red-500 to-red-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Welcome back, John"
        description="Here's what's happening with your assets today."
      />

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-premium"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-soft`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${
                    stat.isPositive ? "text-success" : "text-destructive"
                  }`}
                >
                  {stat.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat.title}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card-premium"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Asset Activity</h2>
              <p className="text-sm text-muted-foreground">Last 7 days of asset usage</p>
            </div>
            <select className="bg-muted border-none rounded-lg px-4 py-2 text-sm text-muted-foreground focus:ring-1 focus:ring-primary">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 text-primary/50 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Chart Placeholder</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-premium"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { user: "Sarah K.", action: "Allocated laptop", time: "2 min ago", type: "success" },
              { user: "Mike L.", action: "Created booking", time: "15 min ago", type: "info" },
              { user: "Anna M.", action: "Updated asset", time: "1 hour ago", type: "warning" },
              { user: "David W.", action: "Maintenance done", time: "2 hours ago", type: "success" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div
                  className={`h-2 w-2 rounded-full mt-2 ${
                    item.type === "success"
                      ? "bg-success"
                      : item.type === "warning"
                      ? "bg-warning"
                      : "bg-info"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{item.user}</span> {item.action}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
