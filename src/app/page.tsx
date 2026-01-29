import Link from "next/link";
import { ArrowRight, Code2, ShieldAlert, Trophy, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      
      {/* Navigation Header */}
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between p-6">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span>Code Crackers</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
            Sign In
          </Link>
          <Link href="/login" className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 mt-10 mb-20">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wide mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Live Competition System
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl">
          The Secure Platform for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Competitive Coding
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          Challenge yourself with hidden test cases, climb the live leaderboard, 
          and prove your skills in an AI-monitored secure environment.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/login"
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-gray-900/10"
          >
            Start Coding Now <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/leaderboard"
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg transition"
          >
            View Leaderboard 🏆
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full text-left">
          
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
              <Terminal className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Language Support</h3>
            <p className="text-gray-500 leading-relaxed">
              Run Python, C++, Java, and JavaScript instantly in our secure cloud sandbox.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-6">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Rankings</h3>
            <p className="text-gray-500 leading-relaxed">
              Score points based on test cases passed. Watch your name climb the global leaderboard.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Anti-Cheat System</h3>
            <p className="text-gray-500 leading-relaxed">
              Advanced telemetry tracks tab switching and copy-paste behavior to ensure fair play.
            </p>
          </div>

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
        © 2026 Code Crackers. Built for the Challenge.
      </footer>
    </div>
  );
}