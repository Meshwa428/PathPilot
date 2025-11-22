'use server'

import { supabase } from "@/lib/supabase";
import { auth, currentUser } from "@clerk/nextjs/server";
// REMOVE: import { redirect } from "next/navigation"; 
import { revalidatePath } from "next/cache";

export async function createUserProfile(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) throw new Error("Unauthorized");

  const role = formData.get("role") as string;
  const name = `${user.firstName} ${user.lastName}`;
  const email = user.emailAddresses[0].emailAddress;

  // --- RECRUITER ---
  if (role === 'recruiter') {
    const orgName = formData.get("orgName") as string;
    const website = formData.get("website") as string;
    const industry = formData.get("industry") as string;

    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: orgName, website: website, industry: industry })
      .select()
      .single();

    if (orgError) throw new Error("Failed to create organization");

    const { error: recruiterError } = await supabase
      .from('recruiters')
      .upsert({
        clerk_id: userId,
        org_id: orgData.id,
        name: name,
        email: email
      }, { onConflict: 'clerk_id' });

    if (recruiterError) throw new Error("Failed to create recruiter profile");
    
    // ✅ CHANGED: Return success instead of redirecting
    return { success: true, role: 'recruiter' };
  }

  // --- STUDENT ---
  if (role === 'student') {
    const collegeId = formData.get("collegeId");
    const branch = formData.get("branch");
    const year = parseInt(formData.get("year") as string);
    const cgpa = parseFloat(formData.get("cgpa") as string);
    const skillsString = formData.get("skills") as string;
    const skills = skillsString ? skillsString.split(",").map(s => s.trim()) : [];
    const githubUrl = formData.get("githubUrl");
    const linkedinUrl = formData.get("linkedinUrl");

    const { error } = await supabase
      .from('students')
      .upsert({
        clerk_id: userId,
        role: 'student',
        name,
        email,
        photo: user.imageUrl,
        college_id: collegeId,
        branch,
        year,
        cgpa,
        skills,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
      }, { onConflict: 'clerk_id' });

    if (error) throw new Error("Failed to save student profile");

    // ✅ CHANGED: Return success instead of redirecting
    return { success: true, role: 'student' };
  }

  if (role === 'admin') {
     return { success: true, role: 'admin' };
  }
}

// ... (Keep getUserById and updateStudentProfile as they are) ...
export async function getUserById(clerkId: string) {
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (student) return { ...student, type: 'student' };

  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('*, organizations(*)') 
    .eq('clerk_id', clerkId)
    .single();

  if (recruiter) return { ...recruiter, type: 'recruiter' };

  return null;
}

export async function updateStudentProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const githubUrl = formData.get("githubUrl") as string;
  const linkedinUrl = formData.get("linkedinUrl") as string;
  const skillsString = formData.get("skills") as string;
  const skills = skillsString ? skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];

  const { error } = await supabase
    .from('students')
    .update({
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      skills: skills
    })
    .eq('clerk_id', userId);

  if (error) throw new Error("Failed to update profile");

  revalidatePath('/dashboard');
}