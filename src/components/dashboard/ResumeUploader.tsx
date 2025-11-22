'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, UploadCloud, Loader2, CheckCircle, Eye, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResumeUploader({ 
  studentId, 
  currentResumeUrl 
}: { 
  studentId: string, 
  currentResumeUrl?: string | null 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // New error state
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null); // Reset error
    
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // --- 1. FRONTEND VALIDATION ---
    
    // Check File Type (MIME)
    if (file.type !== 'application/pdf') {
      setErrorMsg("Only PDF files are allowed.");
      return;
    }

    // Check File Size (3MB = 3 * 1024 * 1024 bytes)
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg("File size must be less than 3MB.");
      return;
    }

    setIsUploading(true);
    
    // 2. Unique File Name
    const fileName = `${studentId}-${Date.now()}.pdf`; // Force .pdf extension
    const filePath = `${fileName}`;

    try {
      // 3. Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          contentType: 'application/pdf', // Explicitly set content type
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 4. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // 5. Update DB
      const { error: dbError } = await supabase
        .from('students')
        .update({ resume_url: publicUrl })
        .eq('clerk_id', studentId);

      if (dbError) throw dbError;

      router.refresh();
      
    } catch (error) {
      console.error("Upload failed", error);
      setErrorMsg("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-500" />
          Resume
        </h3>
        {currentResumeUrl && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Uploaded
          </span>
        )}
      </div>

      {/* Error Message Banner */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      {currentResumeUrl ? (
        <div className="space-y-3">
          <a 
            href={currentResumeUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <Eye className="w-4 h-4" /> View Resume
          </a>
          <div className="relative">
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button className="w-full py-2 text-blue-600 text-xs font-bold hover:underline disabled:opacity-50">
              {isUploading ? 'Updating...' : 'Replace Resume'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative group">
          <input 
            type="file" 
            accept=".pdf"
            onChange={handleUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
            )}
            <p className="text-sm font-medium text-slate-600">
              {isUploading ? 'Uploading...' : 'Click to upload PDF'}
            </p>
            <p className="text-xs text-slate-400">Max 3MB</p>
          </div>
        </div>
      )}
    </div>
  );
}