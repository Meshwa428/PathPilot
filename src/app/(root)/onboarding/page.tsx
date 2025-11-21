// Assuming this is your onboarding page content
// You might need to adjust imports and the overall structure
// to fit your actual application's design.

import { createUserProfile } from "../../../../actions/user.action"; // Adjust path as needed
import { redirect } from "next/navigation";

export default function OnboardingPage() {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    try {
      await createUserProfile(formData);
      redirect("/dashboard"); // Redirect after successful profile creation
    } catch (error) {
      console.error("Failed to create user profile:", error);
      // Handle error, e.g., display a message to the user
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>
      <form action={handleSubmit} className="space-y-6">
        {/* Existing form fields would go here */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input name="name" id="name" type="text" placeholder="Your Name" className="w-full p-3 rounded-lg border border-slate-300 outline-none" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input name="email" id="email" type="email" placeholder="your@example.com" className="w-full p-3 rounded-lg border border-slate-300 outline-none" required />
        </div>
        <div>
          <label htmlFor="collegeId" className="block text-sm font-medium text-slate-700 mb-1">College ID</label>
          <input name="collegeId" id="collegeId" type="text" placeholder="Your College ID" className="w-full p-3 rounded-lg border border-slate-300 outline-none" />
        </div>
        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
          <input name="branch" id="branch" type="text" placeholder="Your Branch" className="w-full p-3 rounded-lg border border-slate-300 outline-none" />
        </div>
        <div>
          <label htmlFor="cgpa" className="block text-sm font-medium text-slate-700 mb-1">CGPA</label>
          <input name="cgpa" id="cgpa" type="number" step="0.01" placeholder="e.g., 8.5" className="w-full p-3 rounded-lg border border-slate-300 outline-none" />
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-1">Year</label>
          <input name="year" id="year" type="number" placeholder="e.g., 3" className="w-full p-3 rounded-lg border border-slate-300 outline-none" />
        </div>
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-1">Skills (comma-separated)</label>
          <input name="skills" id="skills" type="text" placeholder="e.g., React, Node.js, SQL" className="w-full p-3 rounded-lg border border-slate-300 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Profile</label>
            <input name="githubUrl" type="url" placeholder="https://github.com/username" className="w-full p-3 rounded-lg border border-slate-300 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile</label>
            <input name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." className="w-full p-3 rounded-lg border border-slate-300 outline-none" />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          Save Profile
        </button>
      </form>
    </div>
  );
}
