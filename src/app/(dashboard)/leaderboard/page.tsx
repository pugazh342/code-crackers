"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Medal, Trophy } from "lucide-react";

interface LeaderboardEntry {
  uid: string;
  displayName: string;
  stats: {
    totalScore: number;
    problemsSolved: number;
  };
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef);
        const snapshot = await getDocs(q);
        
        const leaderboardData: LeaderboardEntry[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          leaderboardData.push({
            uid: doc.id,
            displayName: data.displayName || "Anonymous",
            stats: data.stats || { totalScore: 0, problemsSolved: 0 },
          });
        });

        // Sort Highest Score First
        leaderboardData.sort((a, b) => b.stats.totalScore - a.stats.totalScore);
        setUsers(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="p-10 text-gray-500">Loading rankings...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex p-3 bg-yellow-50 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Global Leaderboard</h1>
        <p className="text-gray-500 mt-2">See who's leading the race in real-time.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4 w-20 text-center">Rank</th>
              <th className="px-6 py-4">Developer</th>
              <th className="px-6 py-4 text-center">Problems Solved</th>
              <th className="px-6 py-4 text-right">Total Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user, index) => (
              <tr key={user.uid} className={`hover:bg-gray-50 transition ${
                index < 3 ? "bg-yellow-50/10" : ""
              }`}>
                <td className="px-6 py-4 text-center">
                  {index === 0 ? (
                    <span className="text-2xl">🥇</span>
                  ) : index === 1 ? (
                    <span className="text-2xl">🥈</span>
                  ) : index === 2 ? (
                    <span className="text-2xl">🥉</span>
                  ) : (
                    <span className="font-mono text-gray-400 font-bold">#{index + 1}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-400" : "bg-blue-600"
                    }`}>
                      {user.displayName.charAt(0)}
                    </div>
                    <span className={`font-semibold ${index < 3 ? "text-gray-900" : "text-gray-600"}`}>
                      {user.displayName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {user.stats.problemsSolved} Solved
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-gray-900 text-lg">
                  {user.stats.totalScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}