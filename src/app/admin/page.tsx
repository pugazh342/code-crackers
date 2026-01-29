"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  doc, 
  setDoc, 
  onSnapshot,
  getCountFromServer 
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  Terminal, 
  AlertTriangle, 
  PlusCircle, 
  Lock, 
  Unlock, 
  Code2,
  Trophy,
  Server,
  FileCode
} from "lucide-react";

// 🔐 SECURITY CONFIGURATION
const ADMIN_EMAILS = ["kpugazhmani21@gmail.com"];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Data State
  const [logs, setLogs] = useState<any[]>([]);
  const [suspiciousUsers, setSuspiciousUsers] = useState<any[]>([]);
  
  // System State
  const [isContestActive, setIsContestActive] = useState(true);
  const [stats, setStats] = useState({ users: 0, problems: 0, submissions: 0 });

  // 1. SECURITY & CONFIG CHECK
  useEffect(() => {
    if (!loading) {
      if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
        router.push("/dashboard");
        return;
      }
    }

    const unsubscribe = onSnapshot(doc(db, "system", "config"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setIsContestActive(data.isContestActive !== undefined ? data.isContestActive : true);
      }
    });

    return () => unsubscribe();
  }, [user, loading, router]);

  // 2. TOGGLE CONTEST
  const toggleContest = async () => {
    const newState = !isContestActive;
    try {
      await setDoc(doc(db, "system", "config"), { isContestActive: newState }, { merge: true });
      setIsContestActive(newState);
    } catch (error) {
      console.error("Failed to toggle contest:", error);
      alert("Error updating contest status.");
    }
  };

  // 3. FETCH DASHBOARD DATA (Logs + Stats)
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // A. Fetch Logs & Suspicion
        const logsRef = collection(db, "logs");
        const q = query(logsRef, orderBy("timestamp", "desc"), limit(50));
        const snapshot = await getDocs(q);
        const rawLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLogs(rawLogs);

        // Calculate Suspicion
        const userSuspicion: Record<string, number> = {};
        rawLogs.forEach((log: any) => {
          if (log.type === "PASTE") userSuspicion[log.userId] = (userSuspicion[log.userId] || 0) + 10;
          if (log.type === "TAB_SWITCH") userSuspicion[log.userId] = (userSuspicion[log.userId] || 0) + 5;
        });
        const susList = Object.entries(userSuspicion).map(([uid, score]) => ({ uid, score }));
        setSuspiciousUsers(susList.sort((a, b) => b.score - a.score));

        // B. Fetch Counts (Stats)
        // Note: In a huge app, we would cache this. For a contest, counting directly is fine.
        const userCount = await getCountFromServer(collection(db, "users"));
        const probCount = await getCountFromServer(collection(db, "problems"));
        const subCount = await getCountFromServer(collection(db, "submissions"));

        setStats({
          users: userCount.data().count,
          problems: probCount.data().count,
          submissions: subCount.data().count
        });

      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, [user]);

  if (loading || !user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Verifying Admin Access...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. HEADER AREA */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="p-4 bg-gray-900 text-white rounded-2xl shadow-lg shadow-gray-900/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Watchtower</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-sm text-gray-500 font-medium">System Operational</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full xl:w-auto justify-center xl:justify-end">
            <Link href="/admin/users" className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl font-bold transition shadow-sm">
              <Users className="w-5 h-5" /> Participants
            </Link>
            <Link href="/admin/problems" className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-xl font-bold transition shadow-sm">
              <Code2 className="w-5 h-5" /> Manage Library
            </Link>
            <Link href="/admin/add-problem" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-600/20">
              <PlusCircle className="w-5 h-5" /> Add Problem
            </Link>
            <button 
              onClick={toggleContest}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition shadow-lg border ${
                isContestActive 
                  ? "bg-white text-red-600 border-red-200 hover:bg-red-50" 
                  : "bg-red-600 text-white border-red-600 hover:bg-red-700"
              }`}
            >
              {isContestActive ? <><Lock className="w-5 h-5" /> Freeze</> : <><Unlock className="w-5 h-5" /> Resume</>}
            </button>
          </div>
        </div>

        {/* 2. STATS OVERVIEW CARDS (New Section) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
              <p className="text-2xl font-black text-gray-900">{stats.users}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Problems</p>
              <p className="text-2xl font-black text-gray-900">{stats.problems}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Submissions</p>
              <p className="text-2xl font-black text-gray-900">{stats.submissions}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Piston Engine</p>
              <p className="text-lg font-bold text-gray-900">Online ✅</p>
            </div>
          </div>

        </div>

        {/* STATUS BANNER */}
        {!isContestActive && (
          <div className="bg-red-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold animate-pulse shadow-lg shadow-red-600/20">
            <Lock className="w-5 h-5" /> 
            THE CONTEST IS CURRENTLY FROZEN. NO SUBMISSIONS ALLOWED.
          </div>
        )}

        {/* 3. MAIN DASHBOARD PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: SUSPICION RADAR */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Suspicion Radar
              </h2>
            </div>
            
            <div className="overflow-y-auto flex-grow pr-2">
              {suspiciousUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 p-8 text-center">
                  <ShieldAlert className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-sm">Clean contest.</p>
                  <p className="text-xs opacity-50">No flags detected yet.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {suspiciousUsers.map((sus) => (
                    <li key={sus.uid} className="flex justify-between items-center bg-red-50 border border-red-100 p-3 rounded-xl">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 shrink-0 bg-red-200 text-red-700 rounded-full flex items-center justify-center font-bold text-xs">!</div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-mono text-xs font-bold text-gray-700 truncate w-24">
                            {sus.uid}
                          </span>
                          <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Flagged</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-white rounded-lg font-bold text-red-600 shadow-sm text-xs border border-red-100">
                        {sus.score}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* RIGHT: LIVE TELEMETRY (Wider) */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Live Telemetry
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                LISTENING_EVENTS
              </div>
            </div>

            <div className="flex-grow bg-[#0c0c0c] rounded-xl p-4 overflow-y-auto font-mono text-xs border border-gray-800 shadow-inner relative">
              <div className="sticky top-0 bg-[#0c0c0c] pb-2 mb-2 border-b border-gray-800 flex items-center gap-2 text-gray-500 z-10">
                <Terminal className="w-3 h-3" />
                <span className="uppercase tracking-widest text-[10px]">system_stream.log</span>
              </div>
              
              <div className="space-y-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3 p-1.5 hover:bg-white/5 rounded transition border-l-2 border-transparent hover:border-blue-500">
                    <span className="text-gray-600 shrink-0 select-none w-14 text-right">
                      {new Date(log.timestamp?.toDate()).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute:"2-digit" })}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={
                          log.type === "PASTE" ? "text-yellow-500 font-bold" : 
                          log.type === "TAB_SWITCH" ? "text-red-500 font-bold" : "text-blue-400"
                        }>
                          {log.type}
                        </span>
                        <span className="text-gray-500 text-[10px] select-all">
                          UID: {log.userId}
                        </span>
                      </div>
                      <span className="text-gray-400 break-all mt-0.5">
                        {log.type === "PASTE" 
                          ? `Detected massive clipboard insertion (${log.data?.length || 0} chars). Potential cheat snippet.` 
                          : "Focus lost. User switched tabs or minimized browser window."}
                      </span>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-700">
                    <Activity className="w-8 h-8 mb-2 opacity-20 animate-pulse" />
                    <p>Awaiting data stream...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}