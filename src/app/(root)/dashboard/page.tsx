import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserById } from "../../../../actions/user.action";
import { fetchGithubRepos } from "../../../../actions/github.action";
import { getStudentJobs } from "../../../../actions/job.action"; // ✅ Import this
import StudentDashboard from "@/components/dashboard/StudentDashboard";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const userProfile = await getUserById(userId);

  if (!userProfile) return redirect("/onboarding");
  if (userProfile.type === 'recruiter') return redirect("/recruiter/dashboard");
  if (userProfile.role === 'admin') return redirect("/admin/dashboard");

  const repos = await fetchGithubRepos(userProfile.github_url);
  
  // ✅ Fetch Jobs
  const jobs = await getStudentJobs();

  // ✅ Pass jobs to component
  return <StudentDashboard student={userProfile} repos={repos} jobs={jobs} />;
}