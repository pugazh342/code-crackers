"use client";

import { useEffect, useState } from "react";
import { getProblems } from "@/lib/firestore";
import { Problem } from "@/types/problem";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      const data = await getProblems();
      setProblems(data);
      setLoading(false);
    };
    fetchProblems();
  }, []);

  if (loading) return <div className="p-10 text-gray-500">Loading challenges...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Challenge Library</h1>
          <p className="text-gray-500 mt-2">Select a problem to sharpen your algorithm skills.</p>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {problems.map((problem) => (
              <tr 
                key={problem.id} 
                className="group transition-colors hover:bg-blue-50/50"
              >
                <td className="px-6 py-4">
                  <div className="p-1.5 bg-gray-100 rounded-full w-fit group-hover:bg-blue-100 transition">
                    {/* Placeholder for "Solved" checkmark */}
                    <div className="h-2 w-2 rounded-full bg-gray-400 group-hover:bg-blue-600 transition" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-700 group-hover:text-blue-700 transition">
                    {problem.order}. {problem.title}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                    problem.difficulty === "Easy" ? "bg-green-50 text-green-700 border-green-200" : 
                    problem.difficulty === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : 
                    "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 font-medium">
                  {problem.category}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/problems/${problem.id}`} 
                    className="inline-flex items-center gap-1 text-blue-600 font-bold text-xs uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"
                  >
                    Solve <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}