"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Download, Ban, CheckCircle, Trash2, ArrowLeft, ShieldAlert, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx"; // You might need to install this, see instructions below

interface UserData {
  id: string;
  displayName: string;
  email: string;
  stats: {
    totalScore: number;
    problemsSolved: number;
  };
  isBanned?: boolean;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // 1. Fetch All Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("stats.totalScore", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 2. EXPORT TO EXCEL (CSV)
  const handleExport = () => {
    const dataToExport = users.map(user => ({
      Rank: users.indexOf(user) + 1,
      Name: user.displayName,
      Email: user.email,
      Score: user.stats?.totalScore || 0,
      Solved: user.stats?.problemsSolved || 0,
      Status: user.isBanned ? "DISQUALIFIED" : "Active"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Final Results");
    XLSX.writeFile(workbook, "CodeCrackers_Results.xlsx");
  };

  // 3. ELIMINATION (BAN USER)
  const toggleBan = async (userId: string, currentStatus: boolean, name: string) => {
    const action = currentStatus ? "Unban" : "Disqualify";
    if (!confirm(`Are you sure you want to ${action} ${name}?`)) return;

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isBanned: !currentStatus });
      
      // Update UI immediately
      setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !currentStatus } : u));
    } catch (error) {
      alert("Failed to update user status.");
    }
  };

  // Filter Users
  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-gray-500">Loading participants...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-900 transition self-start md:self-auto">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admin
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-green-600/20"
            >
              <Download className="w-4 h-4" /> Export Results
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Participants</h1>
              <p className="text-gray-500 text-sm">Monitor scores and eliminate cheaters.</p>
            </div>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search user..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className={`group hover:bg-gray-50 transition ${user.isBanned ? "bg-red-50/50" : ""}`}>
                    <td className="px-6 py-4 font-mono text-gray-500">#{index + 1}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">{user.displayName}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-blue-600">
                      {user.stats?.totalScore || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.isBanned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          <Ban className="w-3 h-3" /> Disqualified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleBan(user.id, !!user.isBanned, user.displayName)}
                        className={`p-2 rounded-lg transition border ${
                          user.isBanned 
                            ? "bg-white border-gray-200 text-gray-500 hover:text-green-600" 
                            : "bg-white border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700"
                        }`}
                        title={user.isBanned ? "Revoke Ban" : "Disqualify User"}
                      >
                        {user.isBanned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}