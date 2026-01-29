// src/app/api/submit/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from "firebase/firestore";

// Language Map: Translates Judge0 IDs (Frontend) to Piston Names (Backend)
const languageMap: Record<number, { language: string; version: string }> = {
  71: { language: "python", version: "3.10.0" },
  54: { language: "c++", version: "10.2.0" },
  62: { language: "java", version: "15.0.2" },
  63: { language: "javascript", version: "18.15.0" },
  // Add C language mapping if needed
  50: { language: "c", version: "10.2.0" },
};

export async function POST(req: Request) {
  try {
    const { userId, problemId, code, languageId } = await req.json();

    // 0. CHECK CONTEST STATUS (Admin Freeze Feature)
    // We check the global system config to see if submissions are allowed
    const configRef = doc(db, "system", "config");
    const configSnap = await getDoc(configRef);
    
    // If config exists AND isContestActive is explicitly false => REJECT
    if (configSnap.exists() && configSnap.data().isContestActive === false) {
      return NextResponse.json({ 
        verdict: "Contest Frozen", 
        message: "The contest has been paused by the administrator. No submissions allowed." 
      }, { status: 403 });
    }

    // 1. Fetch the Problem & Test Cases from Firestore
    const problemRef = doc(db, "problems", problemId);
    const problemSnap = await getDoc(problemRef);

    if (!problemSnap.exists()) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const problemData = problemSnap.data();
    const testCases = problemData.testCases || [];
    const selectedLang = languageMap[languageId];

    if (!selectedLang) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }

    let allPassed = true;
    let failedCaseIndex = -1;

    // 2. Loop through ALL test cases
    for (let i = 0; i < testCases.length; i++) {
      const { input, output } = testCases[i];

      // Prepare payload for Piston
      const payload = {
        language: selectedLang.language,
        version: selectedLang.version,
        files: [{ content: code }],
        stdin: input, // Inject the test case input
      };

      // Call Piston (Free Execution Engine)
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      // Handle compilation errors (if any)
      if (result.compile && result.compile.stderr) {
        return NextResponse.json({ 
          verdict: "Compilation Error", 
          failedCase: i + 1,
          message: result.compile.stderr 
        });
      }

      const actualOutput = result.run.stdout ? result.run.stdout.trim() : "";
      const expectedOutput = output.trim();

      // Compare Output (Strict string equality)
      if (actualOutput !== expectedOutput) {
        allPassed = false;
        failedCaseIndex = i + 1; // 1-based index for UI
        break; // Stop checking if one fails
      }
    }

    // 3. Determine Verdict
    const verdict = allPassed ? "Accepted" : "Wrong Answer";

    // 4. Save Submission to Database
    await addDoc(collection(db, "submissions"), {
      userId,
      problemId,
      code,
      languageId,
      verdict,
      failedCase: allPassed ? null : failedCaseIndex,
      timestamp: serverTimestamp(),
    });

    // 5. UPDATE USER STATS (Leaderboard Logic)
    // Only update if the user got it right!
    if (verdict === "Accepted") {
      const userRef = doc(db, "users", userId);
      
      // Atomically increment score (+100) and solved count (+1)
      await updateDoc(userRef, {
        "stats.problemsSolved": increment(1),
        "stats.totalScore": increment(100), 
      }).catch(async (error) => {
        // If 'stats' doesn't exist yet, we might need to set it (rare case if dashboard handles it)
        console.error("Could not update user stats:", error);
      });
    }

    return NextResponse.json({ verdict, failedCase: failedCaseIndex });

  } catch (error) {
    console.error("Submit Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}