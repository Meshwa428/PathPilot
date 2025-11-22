'use client';

import { useState } from "react";
import UserTypeSelection from "@/components/onboarding/UserTypeSelection";
import { useUser } from "@clerk/nextjs";
import { createUserProfile } from "../../../../actions/user.action";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter(); // ✅ Initialize Router
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [userType, setUserType] = useState<'student' | 'recruiter' | 'admin' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeSelect = (type: 'student' | 'recruiter' | 'admin') => {
    setUserType(type);
    setStep('form');
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    if (!userType) return;
    
    formData.append('role', userType);
    
    try {
      // ✅ Call action (which now returns an object, doesn't throw redirect)
      const result = await createUserProfile(formData);
      
      if (result?.success) {
        // ✅ Handle Navigation Client-Side
        if (result.role === 'recruiter') {
          router.push('/recruiter/dashboard');
        } else if (result.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create profile. Please try again.");
    } finally {
      // Don't set loading to false if successful, so the user sees "Redirecting..." vibe
      // But since we are doing client-side push, it might happen instantly.
      // Ideally kept true until page unmounts, but safe to set false here.
      // setIsLoading(false); 
    }
  };

  // ... (Render remains exactly the same) ...
  if (step === 'select') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <UserTypeSelection onSelect={handleTypeSelect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {userType === 'student' && 'Student Profile'}
              {userType === 'recruiter' && 'Organization Setup'}
              {userType === 'admin' && 'Admin Setup'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {userType === 'recruiter' ? 'Register your company to start hiring.' : 'Complete your information to get started.'}
            </p>
          </div>
          <button onClick={() => setStep('select')} className="text-slate-400 hover:text-white text-sm underline">Change Role</button>
        </div>

        <div className="p-8">
          <form action={handleSubmit} className="space-y-6">
            {/* ... (Rest of your form fields remain unchanged) ... */}
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input 
                  name="name" 
                  defaultValue={user?.fullName || ""} 
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 cursor-not-allowed" 
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input 
                  name="email" 
                  defaultValue={user?.primaryEmailAddress?.emailAddress || ""} 
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 cursor-not-allowed" 
                  readOnly 
                />
              </div>
            </div>

            {userType === 'recruiter' && (
              <>
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Company Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Organization Name</label>
                      <input required name="orgName" type="text" placeholder="e.g. Acme Corp" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Website</label>
                        <input required name="website" type="url" placeholder="https://acme.com" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                        <select name="industry" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white">
                          <option value="IT">Information Technology</option>
                          <option value="Finance">Finance & Banking</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="EdTech">Education Tech</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {userType === 'student' && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">College ID / PRN</label>
                    <input required name="collegeId" type="text" placeholder="e.g., 202103456" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Current Year</label>
                    <select name="year" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Branch / Stream</label>
                    <select name="branch" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="CSE">Computer Science</option>
                      <option value="IT">Information Tech</option>
                      <option value="ECE">Electronics</option>
                      <option value="MECH">Mechanical</option>
                      <option value="CIVIL">Civil</option>
                      <option value="PHARMA">Pharmacy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Current CGPA</label>
                    <input required name="cgpa" type="number" step="0.01" max="10" placeholder="e.g., 8.5" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Top Skills</label>
                  <input name="skills" type="text" placeholder="React, Python, SQL (Comma separated)" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">GitHub URL</label>
                    <input name="githubUrl" type="url" placeholder="https://github.com/..." className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">LinkedIn URL</label>
                    <input name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full text-white py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 ${
                userType === 'recruiter' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20' : 
                userType === 'admin' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' :
                'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
              }`}
            >
              {isLoading ? 'Creating Profile...' : `Create ${userType?.charAt(0).toUpperCase() + userType!.slice(1)} Profile`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}