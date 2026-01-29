"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Code2, Trophy, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor (Subtle & Professional) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl" />
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.3 }}></div>
      </div>

      {/* Main Container - Split Layout on Large Screens */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Branding (Hidden on mobile/tablet vertical, visible on lg) */}
        <div className="hidden lg:flex flex-col space-y-8 pr-8">
          <div>
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <Code2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Master Algorithms.<br />
              <span className="text-blue-600">Prove Your Skills.</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-md leading-relaxed">
              Join the elite community of developers competing in secure, real-time coding challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Live Leaderboards</h3>
                <p className="text-sm text-gray-500">Compete globally in real-time.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Fair Play Certified</h3>
                <p className="text-sm text-gray-500">Anti-cheat monitored environment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
            
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="p-3 bg-blue-50 rounded-full">
                <Code2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-sm text-gray-500">
                Sign in to continue your progress
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm focus:ring-4 focus:ring-blue-50 focus:outline-none group"
              >
                {/* FIXED GOOGLE ICON */}
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  className="h-5 w-5 shrink-0"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Secure Access</span>
                </div>
              </div>
              
              <p className="text-center text-xs text-gray-400 mt-6">
                By continuing, you agree to the Code Crackers <a href="#" className="underline hover:text-blue-600">Terms of Service</a>.
              </p>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            New here? No registration required. <br/>Just sign in to start coding.
          </p>
        </div>

      </div>
    </div>
  );
}