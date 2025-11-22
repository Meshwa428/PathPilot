'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Check if current user is admin
async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  
  // Ideally, you store admin IDs in an ENV or a specific table.
  // For hackathon, we assume the user accessing this route has the 'admin' role in metadata or DB
  // Here we just assume if they reach the dashboard logic successfully (handled in page)
  return true;
}

export async function getAdminStats() {
  await checkAdmin();

  const { count: studentCount } = await supabaseAdmin.from('students').select('*', { count: 'exact', head: true });
  const { count: recruiterCount } = await supabaseAdmin.from('recruiters').select('*', { count: 'exact', head: true });
  const { count: jobCount } = await supabaseAdmin.from('jobs').select('*', { count: 'exact', head: true });
  const { count: appCount } = await supabaseAdmin.from('applications').select('*', { count: 'exact', head: true });

  return {
    students: studentCount || 0,
    recruiters: recruiterCount || 0,
    jobs: jobCount || 0,
    applications: appCount || 0
  };
}

export async function getAllUsers() {
  await checkAdmin();

  const { data: students } = await supabaseAdmin
    .from('students')
    .select('id, name, email, branch, cgpa, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: recruiters } = await supabaseAdmin
    .from('recruiters')
    .select('id, name, email, organizations(name), created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  return { students, recruiters };
}