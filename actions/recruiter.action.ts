'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateEmbedding } from "@/lib/gemini";
import { auth } from "@clerk/nextjs/server";

// --- HELPER: Cosine Similarity ---
function cosineSimilarity(vecA: number[], vecB: number[]) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// --- HELPER: Fuzzy Search (Fallback) ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function performFuzzySearch(students: any[], query: string) {
  const lowerQuery = query.toLowerCase();
  const keywords = lowerQuery.split(' ').filter(k => k.length > 2);

  return students.map(student => {
    let score = 0;
    const skills = (student.skills || []).map((s: string) => s.toLowerCase());
    const summary = (student.profile_summary || "").toLowerCase();
    const branch = (student.branch || "").toLowerCase();

    skills.forEach((skill: string) => {
      if (keywords.some(k => skill.includes(k))) score += 3;
    });

    if (keywords.some(k => branch.includes(k))) score += 2;
    if (keywords.some(k => summary.includes(k))) score += 1;

    return { ...student, score };
  })
  .filter(s => s.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 15);
}

// --- MAIN SEARCH FUNCTION ---
export async function searchCandidates(query: string) {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    // 1. Try Vector Search
    let sortedStudents = [];
    let usedFallback = false;

    try {
      const queryEmbedding = await generateEmbedding(query);
      
      if (queryEmbedding) {
        const { data: allEmbeddings } = await supabaseAdmin
          .from('student_embeddings')
          .select('student_id, embedding');

        if (allEmbeddings && allEmbeddings.length > 0) {
          const scoredIds = allEmbeddings.map((record) => {
            let vec = record.embedding;
            if (typeof vec === 'string') try { vec = JSON.parse(vec); } catch { vec = []; }
            return {
              student_id: record.student_id,
              similarity: cosineSimilarity(queryEmbedding, vec)
            };
          })
          .filter(r => r.similarity > 0.45)
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 10)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((r: any) => r.student_id);

          if (scoredIds.length > 0) {
            const { data: students } = await supabaseAdmin
              .from('students')
              .select('*')
              .in('id', scoredIds);
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sortedStudents = scoredIds.map((id: any) => students?.find((s: any) => s.id === id)).filter(Boolean);
          }
        }
      }
    } catch (e) {
      console.warn("Vector search failed, switching to fallback.", e);
    }

    // 2. Fallback to Fuzzy Search
    if (sortedStudents.length === 0) {
      usedFallback = true;
      const { data: allStudents } = await supabaseAdmin.from('students').select('*');
      if (allStudents) {
        // @ts-expect-error - Fuzzy logic handles types
        sortedStudents = performFuzzySearch(allStudents, query);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return sortedStudents.map((s: any) => ({ ...s, _isFallback: usedFallback }));

  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}

// --- SEND OFFER ---
export async function sendDirectOffer(studentId: string, message: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data: recruiter } = await supabaseAdmin
    .from('recruiters')
    .select('organizations(name)')
    .eq('clerk_id', userId)
    .single();

  if (!recruiter) throw new Error("Recruiter not found");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orgName = (recruiter.organizations as any)?.name || "Recruiter";

  const { error } = await supabaseAdmin
    .from('notifications')
    .insert({
      student_id: studentId,
      org_name: orgName,
      message: message,
      type: 'offer',
      status: 'unread'
    });

  if (error) throw new Error("Failed to send offer");
  return { success: true };
}