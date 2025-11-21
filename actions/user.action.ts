'use server'

import { supabase } from " @/lib/supabase";
import { auth } from " @clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createUserProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const skillsString = formData.get("skills") as string;
  
  const { error } = await supabase
    .from('students')
    .insert({
      clerk_id: userId,
      name: formData.get("name"),
      email: formData.get("email"),
      college_id: formData.get("collegeId"),
      branch: formData.get("branch"),
      cgpa: parseFloat(formData.get("cgpa") as string),
      year: parseInt(formData.get("year") as string),
      skills: skillsString.split(",").map(s => s.trim()),
      github_url: formData.get("githubUrl"), // New Field
      linkedin_url: formData.get("linkedinUrl"), // New Field
    });

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error("Failed to create profile");
  }

  redirect("/dashboard");
}

export async function getUserById(clerkId: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  return data;
}
