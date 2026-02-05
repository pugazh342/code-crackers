"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Code2, Save, AlertCircle } from "lucide-react";

export default function AddProblemV2() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Basic Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [category, setCategory] = useState("Array");
  const [orderId, setOrderId] = useState("1");

  // V2: Code Configuration
  const [functionName, setFunctionName] = useState("solve"); 
  const [starterCode, setStarterCode] = useState("def solve(nums, target):\n    # Write your code here\n    pass");

  // V2: Structured Test Cases
  const [testCases, setTestCases] = useState([
    { input: "", output: "" } // Start with 1 empty case
  ]);

  // Add a new empty test case row
  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  // Update specific row
  const handleTestCaseChange = (index: number, field: "input" | "output", value: string) => {
    const newCases = [...testCases];
    newCases[index][field] = value;
    setTestCases(newCases);
  };

  // Remove a row
  const handleDeleteTestCase = (index: number) => {
    const newCases = testCases.filter((_, i) => i !== index);
    setTestCases(newCases);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation: Ensure test cases are valid JSON
      const formattedTestCases = testCases.map((tc, i) => {
        try {
          // We try to parse it to check if it's valid JSON, but we store it as string 
          // or structured object depending on your API preference. 
          // For V2, let's store them as parsed Objects to be safe.
          const parsedInput = JSON.parse(tc.input);
          const parsedOutput = JSON.parse(tc.output);
          return { input: parsedInput, output: parsedOutput };
        } catch (err) {
          throw new Error(`Test Case #${i + 1} has invalid JSON. Make sure to use double quotes and brackets!`);
        }
      });

      // Add to Firestore
      await addDoc(collection(db, "problems"), {
        title,
        description,
        difficulty,
        category,
        orderId: Number(orderId),
        functionName,  // V2 Field
        starterCode,   // V2 Field
        testCases: formattedTestCases, // V2 Field (Array of Objects)
        createdAt: new Date().toISOString(),
      });

      alert("Problem Created Successfully (V2 Format)!");
      router.push("/admin/problems");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <Code2 className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Challenge V2</h1>
          <p className="text-gray-500">Add a problem with structured JSON test cases</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">1. Problem Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Problem Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Two Sum" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Order ID</label>
              <input type="number" required value={orderId} onChange={(e) => setOrderId(e.target.value)} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 border rounded-xl outline-none">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <input required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border rounded-xl outline-none" placeholder="e.g. Array, Stack" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border rounded-xl h-32 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Explain the problem..." />
          </div>
        </div>

        {/* SECTION 2: Code Config */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">2. Code Configuration</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Function Name</label>
              <p className="text-xs text-gray-500">The exact name the user must use (e.g. 'twoSum')</p>
              <input required value={functionName} onChange={(e) => setFunctionName(e.target.value)} className="w-full p-3 border rounded-xl font-mono text-sm bg-gray-50" placeholder="twoSum" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Starter Code</label>
              <p className="text-xs text-gray-500">This code will appear in the user's editor automatically.</p>
              <textarea required value={starterCode} onChange={(e) => setStarterCode(e.target.value)} className="w-full p-3 border rounded-xl h-40 font-mono text-sm bg-gray-900 text-green-400 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* SECTION 3: JSON Test Cases */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">3. Test Cases (JSON)</h2>
            <button type="button" onClick={handleAddTestCase} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Case
            </button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            <strong>Formatting Tip:</strong> Use valid JSON. 
            <br />Strings must have double quotes: <code>"hello"</code>. 
            <br />Arrays must use brackets: <code>[1, 2]</code>.
          </div>

          <div className="space-y-4">
            {testCases.map((tc, index) => (
              <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl relative group">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Input JSON (Arguments)</label>
                  <textarea 
                    value={tc.input} 
                    onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono text-xs h-20 focus:ring-2 focus:ring-blue-500" 
                    placeholder='[ [2,7,11,15], 9 ]' 
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Output JSON (Expected)</label>
                  <textarea 
                    value={tc.output} 
                    onChange={(e) => handleTestCaseChange(index, "output", e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono text-xs h-20 focus:ring-2 focus:ring-green-500" 
                    placeholder='[0, 1]' 
                  />
                </div>
                
                {testCases.length > 1 && (
                  <button type="button" onClick={() => handleDeleteTestCase(index)} className="absolute -top-2 -right-2 bg-white p-1.5 shadow-md rounded-full text-red-500 hover:bg-red-50 border border-gray-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition flex justify-center items-center gap-2">
          {loading ? "Publishing..." : <><Save className="w-5 h-5" /> Publish Problem V2</>}
        </button>
      </form>
    </div>
  );
}
