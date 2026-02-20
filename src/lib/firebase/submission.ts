import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./config";

export type SubmissionRecord = {
  id?: string;
  userId: string;
  userName: string;
  problemId: string;
  problemTitle: string;
  code: string;
  language: string;
  submittedAt?: any; 
};

// 🟢 Function 1: Save a new submission (We will call this when a user solves a problem)
export const saveSubmission = async (data: SubmissionRecord) => {
  try {
    const submissionsRef = collection(db, "submissions");
    await addDoc(submissionsRef, {
      ...data,
      submittedAt: serverTimestamp(),
    });
    console.log("Submission saved for Admin review!");
  } catch (error) {
    console.error("Error saving submission: ", error);
  }
};

// 🔵 Function 2: Get all submissions (We will call this on the Admin Page)
export const getAllSubmissions = async () => {
  try {
    const submissionsRef = collection(db, "submissions");
    // Order by newest first
    const q = query(submissionsRef, orderBy("submittedAt", "desc")); 
    const snapshot = await getDocs(q);
    
    const records: SubmissionRecord[] = [];
    snapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as SubmissionRecord);
    });
    
    return records;
  } catch (error) {
    console.error("Error fetching submissions: ", error);
    return [];
  }
};