'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateEmbedding, generateText } from "@/lib/gemini";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { parsePDF } from "@/lib/pdf-parser"; // ✅ USING THE HELPER

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

    if (downloadError) {
        console.error("Supabase Download Error:", downloadError);
        throw new Error("Failed to download resume");
    }

    if (!fileData) throw new Error("File data is empty");

    // 2. Extract Text from PDF
    console.log("2. Parsing PDF...");
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // ✅ CALL THE HELPER (Do not use 'pdf(buffer)' here)
    const resumeText = await parsePDF(buffer);

    if (!resumeText || resumeText.length < 50) {
        console.warn("Extracted text is too short. The PDF might be an image scan.");
    }

    // 3. Generate AI Summary
    console.log("3. Generating Summary...");
    const summaryPrompt = `
      Analyze this resume text.
      Create a professional profile summary (max 150 words).
      Highlight: Top 3 Hard Skills, Years of Experience (if any), and Key Achievement.
      Format: Plain text paragraph.
      
      Resume: ${resumeText.substring(0, 10000)}
    `;
    
    const profileSummary = await generateText(summaryPrompt, "You are an expert HR assistant.");

    // 4. Generate Embedding
    console.log("4. Generating Embeddings...");
    const searchableText = `Summary: ${profileSummary} \n\n Full Content: ${resumeText}`;
    const embedding = await generateEmbedding(searchableText);

    // 5. Get Student ID
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (!student) throw new Error("Student record not found");

    // 6. Save to Database
    console.log("5. Saving to DB...");
    
    await supabaseAdmin
      .from('students')
      .update({ profile_summary: profileSummary })
      .eq('id', student.id);

    await supabaseAdmin
      .from('student_embeddings')
      .delete()
      .eq('student_id', student.id);

    await supabaseAdmin
      .from('student_embeddings')
      .insert({
        student_id: student.id,
        content: searchableText,
        embedding: embedding
      });

    revalidatePath('/dashboard');
    return { success: true, message: "Resume processed & AI profile updated." };

  } catch (error) {
    console.error("Resume Processing Error:", error);
    return { success: false, message: "Failed to process resume." };
  }
}