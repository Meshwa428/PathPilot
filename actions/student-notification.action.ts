'use server';

import { supabaseAdmin } from "@/lib/supabase-admin";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const { userId } = await auth();
  if (!userId) return [];

  const { data: student } = await supabaseAdmin
    .from('students')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (!student) return [];

  const { data: notifications } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('student_id', student.id)
    .order('created_at', { ascending: false });

  return notifications || [];
}

export async function respondToOffer(notificationId: number, accept: boolean) {
  const status = accept ? 'accepted' : 'rejected';
  
  await supabaseAdmin
    .from('notifications')
    .update({ status })
    .eq('id', notificationId);

  revalidatePath('/dashboard');
}