"use client";

import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Trophy, Activity, ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* 1. Welcome Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition hover:shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, <span className="text-blue-600">{user?.displayName?.split(" ")[0] || "Developer"}</span>! 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            You have a pending challenge. Ready to crack some code today?
          </p>
        </div>
        <Link 
          href="/problems" 
          className="group flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold transition shadow-xl shadow-gray-900/10"
        >
          Solve Problems <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        
        {/* Card 1: Solved */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Solved</span>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {user?.stats?.problemsSolved || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1 font-medium">Problems completed</p>
        </div>

        {/* Card 2: Score */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl group-hover:bg-yellow-100 transition">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Score</span>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {user?.stats?.totalScore || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1 font-medium">Points earned</p>
        </div>

        {/* Card 3: Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Account Status</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">
            Active ✅
          </p>
          <p className="text-sm text-gray-500 mt-1 font-medium">System operational</p>
        </div>

      </div>

      {/* 3. Pro Tip Section */}
      <div className="grid grid-cols-1">
         <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">💡 Pro Tip for Winners</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                Our <strong>Anti-Cheat System</strong> is active. Switching tabs or pasting large blocks of code 
                during a problem attempt may flag your account for review. Stay focused on the editor to keep your 
                suspicion score low!
              </p>
            </div>
         </div>
      </div>

    </div>
  );
}