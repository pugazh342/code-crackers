import { NextResponse } from "next/server";

// Language Map (Same as Submit API)
const languageMap: Record<number, { language: string; version: string }> = {
  71: { language: "python", version: "3.10.0" },
  54: { language: "c++", version: "10.2.0" },
  62: { language: "java", version: "15.0.2" },
  63: { language: "javascript", version: "18.15.0" },
  50: { language: "c", version: "10.2.0" },
};

export async function POST(req: Request) {
  try {
    const { code, languageId, input } = await req.json();

    const selectedLang = languageMap[languageId];
    if (!selectedLang) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }

    // Call Piston (Execution Engine)
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: selectedLang.language,
        version: selectedLang.version,
        files: [{ content: code }],
        stdin: input || "", // Use provided input or empty string
      }),
    });

    const result = await response.json();

    // Return the raw output (stdout or stderr)
    return NextResponse.json({ 
      output: result.run.stdout || "", 
      error: result.run.stderr || "",
      compile_output: result.compile?.output || "" 
    });

  } catch (error) {
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}