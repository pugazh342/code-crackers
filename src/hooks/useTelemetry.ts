// src/hooks/useTelemetry.ts
"use client";

import { useEffect, useRef } from "react";
import { db } from "@/lib/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const useTelemetry = (userId: string, problemId: string) => {
  // We use refs to avoid re-triggering effects on every keystroke
  const pasteCount = useRef(0);
  const blurCount = useRef(0); // Times they left the tab
  
  useEffect(() => {
    if (!userId || !problemId) return;

    // 1. Log Tab Switching (Blur/Focus)
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        blurCount.current += 1;
        await logEvent("TAB_SWITCH", { status: "hidden" });
        console.log("👀 User left the tab!");
      } else {
        await logEvent("TAB_SWITCH", { status: "visible" });
        console.log("👀 User returned.");
      }
    };

    // 2. Log Copy/Paste (Prevent massive dumps of AI code)
    const handlePaste = async (e: ClipboardEvent) => {
      pasteCount.current += 1;
      // Get the length of pasted text to see if it's a full solution
      const pastedText = e.clipboardData?.getData("text") || "";
      
      await logEvent("PASTE", { 
        length: pastedText.length,
        content_preview: pastedText.substring(0, 50) + "..." // Log first 50 chars
      });
      
      console.log("📋 User pasted code!", pastedText.length);
    };

    // Helper to send data to Firestore
    const logEvent = async (type: string, data: any) => {
      try {
        await addDoc(collection(db, "logs"), {
          userId,
          problemId,
          type,
          data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.error("Failed to log telemetry:", error);
      }
    };

    // Attach Listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("paste", handlePaste as any); 

    // Cleanup Listeners when component unmounts
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("paste", handlePaste as any);
    };
  }, [userId, problemId]);

  return { pasteCount, blurCount };
};