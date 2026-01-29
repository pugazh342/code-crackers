"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Editor from "@monaco-editor/react";
import { Play, Send, AlertCircle, CheckCircle2, RotateCcw, ArrowLeft, Loader2, Code2, Terminal } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const LANGUAGES = [
  { id: 71, name: "Python (3.10)", label: "python" },
  { id: 63, name: "JavaScript (Node.js 18)", label: "javascript" },
  { id: 54, name: "C++ (GCC 9)", label: "cpp" },
  { id: 62, name: "Java (OpenJDK 13)", label: "java" },
];

const STARTER_CODE: Record<string, string> = {
  python: "def solve():\n    # Read input like this:\n    # import sys\n    # input = sys.stdin.read\n    print('Hello World')\n\nsolve()",
  javascript: "console.log('Hello World');",
  cpp: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello World\";\n    return 0;\n}",
  java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}"
};

export default function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [code, setCode] = useState(STARTER_CODE["python"]);
  const [languageId, setLanguageId] = useState(71);
  const [currentLangLabel, setCurrentLangLabel] = useState("python");
  
  // Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"output" | "result">("output");
  
  // Outputs
  const [runOutput, setRunOutput] = useState<{ stdout: string; stderr: string } | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // 1. Fetch Problem
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const docRef = doc(db, "problems", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProblem({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = Number(e.target.value);
    const langObj = LANGUAGES.find(l => l.id === newId);
    if (langObj) {
      setLanguageId(newId);
      setCurrentLangLabel(langObj.label);
      setCode(STARTER_CODE[langObj.label] || "");
    }
  };

  // 🏃‍♂️ RUN CODE (Test against Example Case)
  const handleRun = async () => {
    setIsProcessing(true);
    setActiveTab("output");
    setRunOutput(null);

    try {
      // Use the first test case input, or empty string if none exists
      const exampleInput = problem.testCases?.[0]?.input || "";

      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          languageId,
          input: exampleInput,
        }),
      });

      const data = await res.json();
      setRunOutput({
        stdout: data.output,
        stderr: data.error || data.compile_output,
      });

    } catch (error) {
      setRunOutput({ stdout: "", stderr: "Failed to execute code." });
    } finally {
      setIsProcessing(false);
    }
  };

  // 🚀 SUBMIT CODE (Grade against Hidden Cases)
  const handleSubmit = async () => {
    if (!user) return alert("Please login to submit.");
    setIsProcessing(true);
    setActiveTab("result");
    setSubmissionResult(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          problemId: id,
          code,
          languageId,
        }),
      });

      const data = await res.json();
      setTimeout(() => {
        setSubmissionResult(data);
        setIsProcessing(false);
      }, 500);

    } catch (error) {
      setSubmissionResult({ verdict: "Error", message: "Server error." });
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-500">Loading Workspace...</div>;
  if (!problem) return <div className="flex h-screen items-center justify-center text-red-500">Problem not found</div>;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col lg:flex-row h-full">
      
      {/* LEFT PANEL: Problem Info */}
      <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 flex flex-col h-full lg:h-auto overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <Link href="/problems" className="flex items-center text-gray-500 hover:text-gray-900 text-sm mb-4 transition">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{problem.order}. {problem.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              problem.difficulty === "Easy" ? "bg-green-100 text-green-700" :
              problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>
              {problem.difficulty}
            </span>
          </div>
        </div>
        
        <div className="p-6 space-y-6 flex-grow">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Examples</h3>
            {problem.testCases && problem.testCases.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 font-mono text-sm">
                <div className="mb-2">
                  <span className="text-gray-500">Input:</span> 
                  <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                    {problem.testCases[0].input}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Expected Output:</span>
                  <div className="mt-1 p-2 bg-white border border-gray-200 rounded text-gray-900">
                     {problem.testCases[0].output}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic">No public examples available.</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Editor & Console */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e]">
        
        {/* Toolbar */}
        <div className="h-14 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Code2 className="w-4 h-4" />
                <span className="font-bold">Editor</span>
             </div>
             <select 
               value={languageId} 
               onChange={handleLanguageChange}
               className="bg-[#3e3e42] text-white text-xs px-2 py-1.5 rounded border border-gray-600 outline-none focus:border-blue-500"
             >
               {LANGUAGES.map(lang => (
                 <option key={lang.id} value={lang.id}>{lang.name}</option>
               ))}
             </select>
          </div>

          <div className="flex items-center gap-2">
             <button onClick={() => setCode(STARTER_CODE[currentLangLabel])} className="p-2 text-gray-400 hover:text-white transition" title="Reset Code">
                <RotateCcw className="w-4 h-4" />
             </button>
             
             {/* RUN BUTTON */}
             <button 
                onClick={handleRun}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-bold transition bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
             >
                {isProcessing && activeTab === "output" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                Run
             </button>

             {/* SUBMIT BUTTON */}
             <button 
                onClick={handleSubmit} 
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-bold transition bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20"
             >
                {isProcessing && activeTab === "result" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Submit
             </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-grow relative h-3/5">
           <Editor
             height="100%"
             theme="vs-dark"
             language={currentLangLabel}
             value={code}
             onChange={(value) => setCode(value || "")}
             options={{
               minimap: { enabled: false },
               fontSize: 14,
               scrollBeyondLastLine: false,
               automaticLayout: true,
             }}
           />
        </div>

        {/* CONSOLE / OUTPUT PANEL */}
        <div className="h-2/5 min-h-[150px] bg-[#1e1e1e] border-t border-[#3e3e42] flex flex-col">
          
          {/* Console Tabs */}
          <div className="flex border-b border-[#3e3e42]">
            <button 
              onClick={() => setActiveTab("output")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                activeTab === "output" ? "text-white border-blue-500 bg-[#252526]" : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              Output
            </button>
            <button 
              onClick={() => setActiveTab("result")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                activeTab === "result" ? "text-white border-green-500 bg-[#252526]" : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              Verdict
            </button>
          </div>

          {/* Console Content */}
          <div className="flex-grow p-4 overflow-y-auto font-mono text-sm">
            
            {/* TAB: RUN OUTPUT */}
            {activeTab === "output" && (
              <div className="space-y-2">
                {!runOutput && !isProcessing && <div className="text-gray-500 italic">Click "Run" to test your code against the example case.</div>}
                
                {runOutput && (
                  <>
                    <div className="text-gray-400 mb-1 text-xs">Standard Output:</div>
                    {runOutput.stdout ? (
                      <pre className="text-white bg-[#2d2d2d] p-3 rounded border border-gray-700 whitespace-pre-wrap">{runOutput.stdout}</pre>
                    ) : (
                      <div className="text-gray-500 italic">No output returned.</div>
                    )}

                    {runOutput.stderr && (
                      <div className="mt-3">
                        <div className="text-red-400 mb-1 text-xs">Error Log:</div>
                        <pre className="text-red-300 bg-red-900/20 p-3 rounded border border-red-900/50 whitespace-pre-wrap">{runOutput.stderr}</pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB: SUBMISSION RESULT */}
            {activeTab === "result" && (
               <div className="space-y-4">
                 {!submissionResult && !isProcessing && <div className="text-gray-500 italic">Click "Submit" to grade your solution.</div>}
                 
                 {submissionResult && (
                   <div className={`p-4 rounded-lg border ${
                     submissionResult.verdict === "Accepted" ? "bg-green-900/20 border-green-900/50" : "bg-red-900/20 border-red-900/50"
                   }`}>
                      <div className="flex items-center gap-3 mb-2">
                        {submissionResult.verdict === "Accepted" ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-red-500" />
                        )}
                        <span className={`text-xl font-bold ${
                           submissionResult.verdict === "Accepted" ? "text-green-400" : "text-red-400"
                        }`}>
                          {submissionResult.verdict}
                        </span>
                      </div>
                      
                      {submissionResult.message && (
                        <p className="text-gray-300 ml-9">{submissionResult.message}</p>
                      )}
                      
                      {submissionResult.verdict === "Accepted" && (
                        <p className="text-green-300/70 ml-9 text-sm">
                          +100 Points added to your profile.
                        </p>
                      )}
                   </div>
                 )}
               </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}