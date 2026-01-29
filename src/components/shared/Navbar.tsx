"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Code2, LogOut, LayoutDashboard, Trophy, List, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-gray-900 tracking-tight hover:opacity-80 transition">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            Code Crackers
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/problems" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition">
              <List className="w-4 h-4" />
              Problems
            </Link>
            <Link href="/leaderboard" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-yellow-600 transition">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Link>
          </div>
        </div>

        {/* Right Side: User Profile & Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              
              {/* Clickable Profile Name */}
              <Link 
                href="/profile" 
                className="text-right hidden sm:block group cursor-pointer"
                title="View Profile History"
              >
                <span className="block text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">
                  {user.displayName || "Developer"}
                </span>
                <span className="block text-xs text-gray-500 group-hover:text-blue-500 transition">
                  View Profile
                </span>
              </Link>
              
              {/* Mobile Profile Icon (Visible only on small screens) */}
              <Link href="/profile" className="sm:hidden p-2 text-gray-600">
                 <User className="w-5 h-5" />
              </Link>

              <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

              <button
                onClick={logout}
                className="group p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition border border-transparent hover:border-red-100"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 transition shadow-sm shadow-blue-600/20"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}