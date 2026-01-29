"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Trash2, ArrowLeft, Code2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  order: number;
}

export default function ManageProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Fetch Problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const q = query(collection(db, "problems"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Problem));
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // 2. Delete Logic
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?\nThis cannot be undone.`)) return;

    try {
      await deleteDoc(doc(db, "problems", id));
      // Remove from UI immediately
      setProblems(problems.filter(p => p.id !== id));
      alert("Problem deleted successfully.");
    } catch (error) {
      console.error("Error deleting problem:", error);
      alert("Failed to delete problem.");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading library...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-900 transition">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admin
          </button>
          <Link href="/admin/add-problem" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-lg shadow-blue-600/20">
            + Create New
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-6">
            <div className="p-3 bg-red-50 rounded-xl">
              <Code2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Challenges</h1>
              <p className="text-gray-500 text-sm">Delete outdated or incorrect problems.</p>
            </div>
          </div>

          {problems.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Code2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No problems found in the library.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {problems.map((problem) => (
                    <tr key={problem.id} className="group hover:bg-red-50/10 transition">
                      <td className="px-6 py-4 font-mono text-gray-400">#{problem.order}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{problem.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          problem.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                          problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{problem.category}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(problem.id, problem.title)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Problem"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}