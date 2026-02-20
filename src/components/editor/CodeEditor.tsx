"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";
import { useTelemetry } from "@/hooks/useTelemetry"; 
import { saveSubmission } from "@/lib/firebase/submission"; // 🟢 Firebase integration

// Props interface to receive data from the parent page
interface CodeEditorProps {
  problemId: string;
  userId: string;
  userName?: string;
}

// 🟢 MAP: Connects your dropdown menu to the Piston execution engine
const PISTON_MAP: Record<string, { lang: string; ver: string; name: string }> = {
  "71": { lang: "python", ver: "3.10.0", name: "Python" },
  "54": { lang: "cpp", ver: "10.2.0", name: "C++" },
  "62": { lang: "java", ver: "15.0.2", name: "Java" },
  "63": { lang: "javascript", ver: "18.15.0", name: "JavaScript" },
};

export default function CodeEditor({ problemId, userId, userName = "Student" }: CodeEditorProps) {
  // 🕵️‍♂️ Activate Anti-Cheat Telemetry
  useTelemetry(userId, problemId);

  // State Management
  const [code, setCode] = useState("# Write your code here\nprint('Hello, World!')");
  const [language, setLanguage] = useState("71"); // Default: Python (71)
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // "Running...", "Success ✅", etc.

  // 1. 🟢 RUN CODE (Piston Compiler API)
  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    setStatus("Running...");

    try {
      const selected = PISTON_MAP[language];

      // 🟢 FIXED URL: The official Piston Execution API
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selected.lang,
          version: selected.ver,
          files: [{ content: code }],
        }),
      });

      const data = await response.json();

      // Handle the compiler response
      if (data.run && data.run.code === 0) {
        setOutput(data.run.stdout || "Execution successful (no output printed).");
        setStatus("Success ✅");
      } else {
        const errorMsg = data.run?.stderr || data.message || "Unknown compilation error";
        setOutput(data.run?.stdout ? `${data.run.stdout}\n\nError:\n${errorMsg}` : errorMsg);
        setStatus("Runtime Error ❌");
      }
    } catch (error) {
      setOutput("Execution failed: Network error connecting to compiler.");
      setStatus("System Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // 2. 🟢 SUBMIT CODE (Send to Admin Dashboard)
  const handleSubmit = async () => {
    if (!userId) {
      alert("Please login to submit.");
      return;
    }

    setLoading(true);
    setStatus("Sending to Admin...");
    setOutput("");

    try {
      const selected = PISTON_MAP[language];

      // Save directly to Firebase 'submissions' collection
      await saveSubmission({
        userId: userId,
        userName: userName,
        problemId: problemId,
        problemTitle: `Problem: ${problemId}`, // Fallback title
        code: code,
        language: selected.name,
      });

      setStatus("🎉 Accepted!");
      setOutput("Success! Your code has been securely transmitted to the Admin Dashboard.");
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus("Error ⚠️");
      setOutput("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 border-l border-gray-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white text-sm px-3 py-1 rounded border border-gray-700 outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="71">Python (3.10)</option>
          <option value="54">C++ (GCC 10)</option>
          <option value="62">Java (OpenJDK 15)</option>
          <option value="63">JavaScript (Node 18)</option>
        </select>

        <div className="flex items-center gap-4">
          <span className={`text-sm font-bold ${
            status.includes("Accepted") || status.includes("Success") ? "text-green-400" : 
            status.includes("Error") || status.includes("Wrong") ? "text-red-400" : "text-gray-400"
          }`}>
            {status}
          </span>
          
          {/* Run Button */}
          <button 
            onClick={handleRun}
            disabled={loading}
            className={`px-4 py-1.5 rounded text-sm font-bold transition border border-gray-600 ${
              loading ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}
          >
            Run ▶
          </button>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-1.5 rounded text-sm font-bold transition flex items-center gap-2 ${
              loading ? "bg-gray-700 cursor-not-allowed text-gray-400" : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
            }`}
          >
            {loading ? "..." : "Submit ☁️"}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-grow relative">
        <Editor
          height="100%"
          theme="vs-dark"
          language={PISTON_MAP[language].lang}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 }
          }}
        />
      </div>

      {/* Output Terminal */}
      <div className="h-[30vh] bg-black border-t border-gray-800 p-4 overflow-y-auto font-mono text-sm">
        <div className="text-gray-500 text-xs uppercase mb-2 font-bold tracking-wider">Terminal Output</div>
        {output ? (
          <pre className={`whitespace-pre-wrap ${
            status.includes("Error") || status.includes("Wrong") ? "text-red-400" : "text-gray-300"
          }`}>{output}</pre>
        ) : (
          <div className="text-gray-600 italic">Run or Submit code to see output...</div>
        )}
      </div>
    </div>
  );
}