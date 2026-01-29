"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldAlert, Copy } from "lucide-react";

// 🔐 SECURITY CONFIGURATION
const ADMIN_EMAILS = ["kpugazhmani21@gmail.com"]; // We will fix this in a second

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthorized(true);
      return;
    }

    if (!loading) {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      // CHECK: If email matches, authorize.
      if (ADMIN_EMAILS.includes(user.email || "")) {
        setIsAuthorized(true);
      }
      // NOTE: We removed the automatic router.push("/dashboard") here
      // so you can see the error screen below instead of being redirected.
    }
  }, [user, loading, pathname, router]);

  if (loading) return <div className="p-10">Loading...</div>;

  // 🛑 ACCESS DENIED SCREEN (DEBUG MODE)
  if (!isAuthorized && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-8 text-center">
        <ShieldAlert className="w-16 h-16 text-red-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          Your email does not match the Admin Allowlist.
        </p>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg max-w-md w-full text-left">
          <p className="text-xs uppercase font-bold text-gray-400 mb-1">Your Detected Email:</p>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border border-gray-200 mb-4">
            <code className="text-blue-600 font-mono font-bold select-all">
              {user?.email}
            </code>
          </div>

          <p className="text-xs uppercase font-bold text-gray-400 mb-1">Allowed Emails in Code:</p>
          <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 font-mono text-xs text-gray-600">
            {JSON.stringify(ADMIN_EMAILS)}
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500 max-w-lg">
          <strong>To Fix:</strong> Copy the blue email above 👆 and paste it inside the 
          <code>ADMIN_EMAILS</code> array in <code>src/app/admin/layout.tsx</code>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}