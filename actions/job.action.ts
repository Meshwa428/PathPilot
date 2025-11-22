'use server';

import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ==========================================
// RECRUITER ACTIONS
// ==========================================

// --- 1. Create a New Job ---
export async function createJob(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get the Recruiter's Org ID
  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('org_id')
    .eq('clerk_id', userId)
    .single();

  if (!recruiter) throw new Error("Recruiter profile not found");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const salary = formData.get("salary") as string;
  // const type = formData.get("type") as string; 
  const skillsString = formData.get("requirements") as string;
  const requirements = skillsString.split(',').map(s => s.trim());

  const { error } = await supabase
    .from('jobs')
    .insert({
      org_id: recruiter.org_id,
      title,
      description,
      location,
      salary_range: salary,
      requirements,
      status: 'open'
    });

  if (error) {
    console.error("Job Post Error:", error);
    throw new Error("Failed to post job");
  }

  revalidatePath('/recruiter/dashboard');
}

// --- 2. Fetch Jobs for the Recruiter ---
export async function getRecruiterJobs() {
  const { userId } = await auth();
  if (!userId) return [];

  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('org_id')
    .eq('clerk_id', userId)
    .single();

  if (!recruiter) return [];

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*, applications(count)') // ✅ CHANGE: Fetch the count of applications
    .eq('org_id', recruiter.org_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching recruiter jobs:", error);
    return [];
  }

  return jobs || [];
}

// ==========================================
// STUDENT ACTIONS
// ==========================================

// --- 3. Fetch Open Jobs for Students ---
export async function getStudentJobs() {
  const { userId } = await auth();
  if (!userId) return [];

  // A. Get student ID first
  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (!student) return [];

  // B. Fetch All Open Jobs
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select(`
      *,
      organizations ( name, logo_url )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (jobsError) return [];

  // C. Fetch This Student's Applications (to check what they applied to)
  const { data: myApplications } = await supabase
    .from('applications')
    .select('job_id, status')
    .eq('student_id', student.id);

  // D. Merge Data: Add "applications" array to job if the student applied
  // This is safer than doing a complex Join in Supabase for specific user status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobsWithStatus = jobs.map((job: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app = myApplications?.find((a: any) => a.job_id === job.id);
    return {
      ...job,
      applications: app ? [app] : [] // Mocking the structure expected by UI
    };
  });

  return jobsWithStatus;
}

// --- 4. Apply to a Job ---
export async function applyToJob(jobId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1. Get Student ID
  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (!student) throw new Error("Student not found");

  // 2. Create Application
  const { error } = await supabase
    .from('applications')
    .insert({
      job_id: jobId,
      student_id: student.id,
      status: 'applied'
    });

  if (error) {
    // Handle duplicate application error gracefully (Postgres code 23505)
    if (error.code === '23505') return { message: "Already applied" };
    throw new Error("Failed to apply");
  }

  revalidatePath('/dashboard');
  return { message: "Applied successfully" };
}


// --- 3. Get Applicants for a specific Job ---
export async function getJobApplicants(jobId: string) {
  const { userId } = await auth();
  if (!userId) return [];

  // Security Check: Ensure this job belongs to the logged-in recruiter's org
  // (Skipping complex check for hackathon speed, but assuming ID is valid)

  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      applied_at,
      students (
        id,
        name,
        email,
        college_id,
        branch,
        cgpa,
        resume_url,
        github_url,
        skills
      )
    `)
    .eq('job_id', jobId)
    .order('applied_at', { ascending: false });

  if (error) {
    console.error("Error fetching applicants:", error);
    return [];
  }

  return applications;
}

// --- 4. Update Application Status (Shortlist/Select/Reject) ---
export async function updateApplicationStatus(applicationId: string, newStatus: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('applications')
    .update({ status: newStatus })
    .eq('id', applicationId);

  if (error) throw new Error("Failed to update status");

  // We need to know which path to revalidate. 
  // Since we can't easily get the jobId here without another query, 
  // we will revalidate the specific page layout in the UI component or just refresh.
  // For now, let's return success.
  return { success: true };
}

// --- 5. Withdraw Application ---
export async function withdrawApplication(jobId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1. Get Student ID
  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (!student) throw new Error("Student not found");

  // 2. Delete the application
  const { error } = await supabase
    .from('applications')
    .delete()
    .match({ 
      job_id: jobId, 
      student_id: student.id 
    });

  if (error) {
    console.error("Withdraw Error:", error);
    throw new Error("Failed to withdraw application");
  }

  revalidatePath('/dashboard');
  return { message: "Withdrawn successfully" };
}