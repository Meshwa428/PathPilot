'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateEmbedding, analyzeResumePDF } from "@/lib/gemini";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function processResume(fileUrl: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    console.log("1. Downloading PDF from:", fileUrl);
    
    const filePath = fileUrl.split('/resumes/').pop(); 
    if (!filePath) throw new Error("Invalid file URL");

    const decodedPath = decodeURIComponent(filePath);

    const { data: fileData, error: downloadError } = await supabaseAdmin
      .storage
      .from('resumes')
      .download(decodedPath);

    if (downloadError || !fileData) throw new Error("Failed to download resume");

    // 2. Analyze PDF with Gemini Vision (No local parsing!)
    console.log("2. Sending to Gemini AI...");
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { profile_summary, search_content } = await analyzeResumePDF(buffer);

    if (!search_content || search_content.length < 50) {
        throw new Error("AI could not extract meaningful text.");
    }

    // 3. Generate Embedding from the Search Content
    console.log("3. Generating Embeddings...");
    const embedding = await generateEmbedding(search_content);

    // 4. Database Updates
    console.log("4. Saving to DB...");
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (!student) throw new Error("Student record not found");

    // A. Update Profile Summary
    await supabaseAdmin
      .from('students')
      .update({ profile_summary })
      .eq('id', student.id);

    // B. Update Vector Embedding
    await supabaseAdmin
      .from('student_embeddings')
      .delete()
      .eq('student_id', student.id);

    await supabaseAdmin
      .from('student_embeddings')
      .insert({
        student_id: student.id,
        content: search_content, // We store the full AI-extracted text
        embedding: embedding
      });

    revalidatePath('/dashboard');
    return { success: true, message: "Resume processed successfully." };

  } catch (error) {
    console.error("Resume Processing Error:", error);
    return { success: false, message: "Failed to process resume." };
  }
}

// For the Feedback Page
export async function getResumeFeedback(resumeUrl: string) {
  const filePath = resumeUrl.split('/resumes/').pop();
  if(!filePath) return "No resume found.";
  
  const decodedPath = decodeURIComponent(filePath);
  const { data: fileData } = await supabaseAdmin.storage.from('resumes').download(decodedPath);
  
  if (!fileData) return "Could not download resume.";
  
  const arrayBuffer = await fileData.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Reuse the logic but ask for feedback this time
  // (We could refactor this into gemini.ts too, but keeping it here for now)
  const { search_content } = await analyzeResumePDF(buffer);
  
  const { generateText } = await import("@/lib/gemini");
  
  const roast = await generateText(`
    REVIEW THIS RESUME BRUTALLY.
    Resume Content: "${search_content}"
  `, "You are a ruthless, cynical Senior Tech Recruiter at a FAANG company. Give a score out of 100. List 3 fatal flaws. List 3 immediate fixes. End with a brutal 'Reality Check'. Use Markdown.");

  return roast;
}