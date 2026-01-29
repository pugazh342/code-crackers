"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { User, Clock, CheckCircle2, XCircle, Code, Calendar } from "lucide-react";

interface Submission {
  id: string;
  problemId: string; // We will use this to look up the title if needed, or just show ID
  verdict: string;
  languageId: number;
  createdAt: any;
  code: string;
}

const LANGUAGE_MAP: Record<number, string> = {
  71: "Python",
  54: "C++",
  62: "Java",
  63: "JavaScript",
  50: "C",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        const subRef = collection(db, "submissions");
        // Get last 20 submissions for this user
        const q = query(
          subRef, 
          where("userId", "==", user.uid), 
          orderBy("timestamp", "desc"), 
          limit(20)
        );
        
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Submission));
        
        setSubmissions(data);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) return <div className="p-10 text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* 1. Profile Header */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
          {user?.displayName?.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.displayName}</h1>
          <div className="flex items-center gap-4 text-gray-500 mt-1 text-sm">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {user?.email}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined recently</span>
          </div>
        </div>
      </div>

      {/* 2. Submission History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" /> Recent Submissions
          </h2>
        </div>

        {submissions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Code className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No submissions yet. Go solve some problems!</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Verdict</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Problem ID</th>
                <th className="px-6 py-4 text-right">Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      sub.verdict === "Accepted" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {sub.verdict === "Accepted" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {sub.verdict}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">
                    {LANGUAGE_MAP[sub.languageId] || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {sub.problemId}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedCode(sub.code)}
                      className="text-blue-600 font-bold text-xs hover:underline flex items-center justify-end gap-1 w-full"
                    >
                      <Code className="w-3 h-3" /> View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 3. Code Viewer Modal */}
      {selectedCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Code className="w-4 h-4" /> Submission Source
              </h3>
              <button onClick={() => setSelectedCode(null)} className="text-gray-400 hover:text-gray-900 font-bold px-2">✕</button>
            </div>
            <div className="p-0 bg-[#1e1e1e] overflow-auto max-h-[60vh]">
              <pre className="text-gray-300 font-mono text-sm p-4 leading-relaxed">
                <code>{selectedCode}</code>
              </pre>
            </div>
            <div className="p-4 border-t border-gray-100 text-right bg-white">
              <button 
                onClick={() => setSelectedCode(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}