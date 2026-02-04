"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Trophy, CheckCircle, Code2, Flame } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  
  // 1. Local state to hold the Database Data
  const [userData, setUserData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  // 2. Fetch User Stats from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user stats:", error);
        }
      }
      setLoadingData(false);
    };

    if (!authLoading) {
      fetchUserData();
    }
  }, [user, authLoading]);

  if (authLoading || loadingData) {
    return <div className="p-10 text-gray-500">Loading dashboard...</div>;
  }

  // Safely access stats with defaults (|| 0)
  const stats = userData?.stats || { totalScore: 0, problemsSolved: 0 };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.displayName || "Developer"}! 👋
        </h1>
        <p className="text-blue-100">
          Ready to crack some code today? Your compiler is waiting.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Score Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {stats.totalScore}
            </p>
            <p className="text-sm text-gray-500 mt-1 font-medium">Total Score</p>
          </div>
        </div>

        {/* Solved Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {stats.problemsSolved}
            </p>
            <p className="text-sm text-gray-500 mt-1 font-medium">Problems Solved</p>
          </div>
        </div>

        {/* Rank Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Beginner
            </p>
            <p className="text-sm text-gray-500 mt-1 font-medium">Current Rank</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/problems" className="group bg-white border border-gray-200 p-8 rounded-3xl shadow-sm hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Solve Problems</h3>
          </div>
          <p className="text-gray-500 leading-relaxed">
            Browse the library of challenges, run your code against test cases, and climb the leaderboard.
          </p>
        </Link>

        <Link href="/leaderboard" className="group bg-white border border-gray-200 p-8 rounded-3xl shadow-sm hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10 transition cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl group-hover:bg-yellow-500 group-hover:text-white transition">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Leaderboard</h3>
          </div>
          <p className="text-gray-500 leading-relaxed">
            See where you stand against other developers. Compete for the top spot in the global rankings.
          </p>
        </Link>
      </div>
    </div>
  );
}
