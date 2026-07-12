'use client';

import { Bell, Search, Plus, User, ChevronDown, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function TopNavbar() {
  return (
    <header className="h-16 bg-white border-b border-border sticky top-0 z-10 px-6 flex items-center justify-between shadow-soft">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Home size={16} />
        <span className="text-foreground font-medium">Dashboard</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search assets, employees, or resources..."
            className="pl-10 bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary shadow-soft rounded-lg"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Button
          className="btn-primary"
        >
          <Plus size={18} className="mr-2" />
          Quick Create
        </Button>
        <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-semibold">
            JD
          </div>
          <ChevronDown size={16} className="text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
