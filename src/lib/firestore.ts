// src/lib/firestore.ts
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Problem } from "@/types/problem";

export const getProblems = async (): Promise<Problem[]> => {
  try {
    // Get reference to the 'problems' collection
    const problemsRef = collection(db, "problems");
    
    // Create a query to sort by 'order' (Problem 1, 2, 3...)
    const q = query(problemsRef, orderBy("order", "asc"));
    
    // Fetch the data
    const querySnapshot = await getDocs(q);
    
    // Map the data to our TypeScript interface
    const problems: Problem[] = [];
    querySnapshot.forEach((doc) => {
      problems.push({ id: doc.id, ...doc.data() } as Problem);
    });
    
    return problems;
  } catch (error) {
    console.error("Error fetching problems:", error);
    return [];
  }
};