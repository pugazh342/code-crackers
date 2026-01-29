// src/components/contest/ProblemDescription.tsx
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Problem } from "@/src/types/problem";

export default function ProblemDescription({ problemId }: { problemId: string }) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;
      const docRef = doc(db, "problems", problemId); // Fetch specific doc
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProblem({ id: docSnap.id, ...docSnap.data() } as Problem);
      }
      setLoading(false);
    };
    fetchProblem();
  }, [problemId]);

  if (loading) return <div>Loading problem...</div>;
  if (!problem) return <div>Problem not found</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
      
      <div className="flex gap-2 text-sm">
        <span className={`px-2 py-1 rounded bg-gray-800 font-bold ${
          problem.difficulty === "Easy" ? "text-green-400" : "text-red-400"
        }`}>
          {problem.difficulty}
        </span>
      </div>

      <div className="mt-4 text-gray-300 whitespace-pre-line">
        {problem.description}
      </div>

      {/* Examples */}
      <div className="mt-6">
        <h3 className="font-bold text-white">Input:</h3>
        <div className="bg-gray-900 p-3 rounded font-mono text-sm mt-1">
          {problem.sampleInput || "No sample input"}
        </div>
        
        <h3 className="font-bold text-white mt-4">Output:</h3>
        <div className="bg-gray-900 p-3 rounded font-mono text-sm mt-1">
          {problem.sampleOutput || "No sample output"}
        </div>
      </div>
    </div>
  );
}