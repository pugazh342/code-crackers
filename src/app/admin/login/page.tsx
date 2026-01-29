// src/app/admin/login/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, LockKeyhole, AlertCircle } from "lucide-react";

// 🔐 MUST MATCH THE LAYOUT CONFIG
const ADMIN_EMAILS = ["kpugazhmani21@gmail.com"];

export default function AdminLoginPage() {
  const { user, signInWithGoogle, logout } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  // Check user after login
  useEffect(() => {
    if (user) {
      if (ADMIN_EMAILS.includes(user.email || "")) {
        // ✅ Authorized Admin
        router.push("/admin");
      } else {
        // ❌ Unauthorized User
        setError("Access Denied. This account is not an administrator.");
        logout(); // Force logout so they can try a different account
      }
    }
  }, [user, router, logout]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
      
      {/* Dark "Hacker" Background for Admin Area */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#1f2937 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        
        {/* Admin Card */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-4 bg-gray-900 rounded-full ring-1 ring-gray-700 mb-4">
              <LockKeyhole className="w-8 h-8 text-gray-200" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Restricted Access</h1>
            <p className="text-gray-500 text-sm mt-2">
              Code Crackers Administration Portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-200 font-bold py-3 px-4 rounded-lg transition-all duration-200"
            >
              <ShieldCheck className="w-5 h-5" />
              Authenticate with Google
            </button>

            <p className="text-center text-xs text-gray-600 mt-6 font-mono">
              IP ADDRESS LOGGED FOR SECURITY
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}