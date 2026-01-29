"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft, Code2 } from "lucide-react";

export default function AddProblemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [category, setCategory] = useState("Array");
  const [order, setOrder] = useState(1);
  
  // Test Cases State (Array of Maps)
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);

  // Add a new empty test case row
  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  // Remove a test case row
  const removeTestCase = (index: number) => {
    const newCases = testCases.filter((_, i) => i !== index);
    setTestCases(newCases);
  };

  // Handle Input Changes for Test Cases
  const handleTestCaseChange = (index: number, field: "input" | "output", value: string) => {
    const newCases = [...testCases];
    newCases[index][field] = value;
    setTestCases(newCases);
  };

  // Submit to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "problems"), {
        title,
        description,
        difficulty,
        category,
        order: Number(order),
        testCases, // Saves the array of maps
        createdAt: serverTimestamp(),
      });
      alert("Problem Created Successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Error adding problem:", error);
      alert("Failed to add problem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Code2 className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Challenge</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Problem Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Two Sum" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Order ID</label>
                <input required type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg outline-none">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <input required type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg outline-none" placeholder="e.g., Arrays, DP" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Explain the problem here..." />
            </div>

            {/* Test Cases Manager */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-gray-700">Test Cases (Hidden)</label>
                <button type="button" onClick={addTestCase} className="text-sm flex items-center gap-1 text-blue-600 font-bold hover:underline">
                  <Plus className="w-4 h-4" /> Add Case
                </button>
              </div>

              {testCases.map((tc, index) => (
                <div key={index} className="flex gap-4 mb-3 items-start">
                  <div className="flex-1">
                    <input type="text" value={tc.input} onChange={(e) => handleTestCaseChange(index, "input", e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded" placeholder="Input (e.g., 1 2 3)" />
                  </div>
                  <div className="flex-1">
                    <input type="text" value={tc.output} onChange={(e) => handleTestCaseChange(index, "output", e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded" placeholder="Expected Output" />
                  </div>
                  <button type="button" onClick={() => removeTestCase(index)} className="p-2 text-red-500 hover:bg-red-100 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2">
              {loading ? "Saving..." : <><Save className="w-5 h-5" /> Publish Problem</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}