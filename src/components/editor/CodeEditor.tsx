// src/components/editor/CodeEditor.tsx
"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";
import { useTelemetry } from "@/hooks/useTelemetry"; // 👈 New Security Hook

// Props interface to receive data from the parent page
interface CodeEditorProps {
  problemId: string;
  userId: string;
}

export default function CodeEditor({ problemId, userId }: CodeEditorProps) {
  // 🕵️‍♂️ Activate Anti-Cheat Telemetry
  // This automatically starts listening for tab switches and pastes
  useTelemetry(userId, problemId);

  // State Management
  const [code, setCode] = useState("# Write your Python code here\nimport sys\n\n# Read input\ndata = sys.stdin.read().split()\n\n# Your Logic Here...");
  const [language, setLanguage] = useState("71"); // Default: Python (71)
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // "Running", "Accepted", "Wrong Answer"

  // 1. RUN CODE (Test only - No Score)
  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    setStatus("Running...");

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, languageId: parseInt(language) }),
      });

      const data = await response.json();

      if (data.stdout) {
        setOutput(data.stdout);
        setStatus("Success ✅");
      } else if (data.stderr) {
        setOutput(data.stderr);
        setStatus("Runtime Error ❌");
      } else if (data.compile_output) {
        setOutput(data.compile_output);
        setStatus("Compilation Error ⚠️");
      } else {
        setOutput("No output returned.");
        setStatus("Finished");
      }
    } catch (error) {
      setOutput("Error connecting to server.");
      setStatus("System Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // 2. SUBMIT CODE (Judge against hidden cases + Update Score)
  const handleSubmit = async () => {
    if (!userId) {
      alert("Please login to submit.");
      return;
    }

    setLoading(true);
    setStatus("Judging...");
    setOutput("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          problemId,
          code,
          languageId: parseInt(language),
        }),
      });

      const data = await response.json();

      if (data.verdict === "Accepted") {
        setStatus("🎉 Accepted!");
        setOutput("All test cases passed! Points added to leaderboard.");
      } else {
        setStatus("❌ Wrong Answer");
        setOutput(`Failed on Test Case #${data.failedCase}\nCheck your logic and try again.`);
      }
    } catch (error) {
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
          className="bg-gray-800 text-white text-sm px-3 py-1 rounded border border-gray-700 outline-none focus:border-blue-500"
        >
          <option value="71">Python (3.8)</option>
          <option value="54">C++ (GCC 9.2)</option>
          <option value="62">Java (OpenJDK 13)</option>
          <option value="63">JavaScript (Node)</option>
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
            className={`px-4 py-1 rounded text-sm font-bold transition border border-gray-600 ${
              loading ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}
          >
            Run ▶
          </button>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-1 rounded text-sm font-bold transition flex items-center gap-2 ${
              loading ? "bg-gray-700 cursor-not-allowed text-gray-400" : "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
            }`}
          >
            {loading ? "..." : "Submit ☁️"}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-grow">
        <Editor
          height="60vh"
          theme="vs-dark"
          language={language === "71" ? "python" : language === "54" ? "cpp" : language === "62" ? "java" : "javascript"}
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
            status.includes("Error") || status.includes("Wrong") ? "text-red-300" : "text-gray-300"
          }`}>{output}</pre>
        ) : (
          <div className="text-gray-600 italic">Run or Submit code to see output...</div>
        )}
      </div>
    </div>
  );
}