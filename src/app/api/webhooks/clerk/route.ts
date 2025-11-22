import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin'; // ✅ Import the ADMIN client
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // 1. Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // 2. Verify headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occured -- no svix headers', { status: 400 });
  }

  // 3. Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // 4. Verify payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occured', { status: 400 });
  }

  const eventType = evt.type;
  console.log(`WEBHOOK RECEIVED: ${eventType}`);

  // --- HANDLE DELETION ---
  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    if (!id) {
      return new NextResponse('No user ID found in delete event', { status: 400 });
    }

    console.log(`Attempting to delete user: ${id} from Supabase...`);

    // We try to delete from both tables. 
    // Using supabaseAdmin guarantees RLS is ignored.
    
    // 1. Delete Student
    const { error: studentError } = await supabaseAdmin
      .from('students')
      .delete()
      .eq('clerk_id', id);

    // 2. Delete Recruiter
    const { error: recruiterError } = await supabaseAdmin
      .from('recruiters')
      .delete()
      .eq('clerk_id', id);

    if (studentError) console.error("Error deleting student:", studentError);
    if (recruiterError) console.error("Error deleting recruiter:", recruiterError);

    console.log(`Delete operation complete for ${id}`);
    return new NextResponse('User deleted', { status: 200 });
  }

  // --- HANDLE UPDATES ---
  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const name = `${first_name || ''} ${last_name || ''}`.trim();
    const email = email_addresses[0]?.email_address;

    // Try updating both tables using Admin client
    await supabaseAdmin.from('students').update({ name, email, photo: image_url }).eq('clerk_id', id);
    await supabaseAdmin.from('recruiters').update({ name, email }).eq('clerk_id', id);
    
    return new NextResponse('User updated', { status: 200 });
  }

  // --- HANDLE CREATION ---
  if (eventType === 'user.created') {
    // We usually wait for onboarding, but you can log it here
    console.log("User created in Clerk. Waiting for Onboarding...");
    return new NextResponse('User created', { status: 200 });
  }

  return new NextResponse('', { status: 200 });
}