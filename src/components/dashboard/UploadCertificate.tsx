'use client';

import { useState } from 'react';
import { supabase } from ' @/lib/supabase';
import { Loader2, UploadCloud } from 'lucide-react';

export default function UploadCertificate({ studentId }: { studentId: string }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}/${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading file');
      setUploading(false);
      return;
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // 3. Save Metadata to Database
    const { error: dbError } = await supabase
      .from('certificates')
      .insert({
        student_id: studentId,
        title: file.name,
        file_url: publicUrl,
        type: 'internship' // You can make this a dropdown
      });

    setUploading(false);
    if (!dbError) {
      alert('Certificate Uploaded Successfully!');
      // Typically you would refresh the list here
    }
  };

  return (
    <div className="mt-4">
      <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors w-fit">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
        <span className="text-sm font-medium">Upload Certificate</span>
        <input 
          type="file" 
          accept=".pdf,.jpg,.png" 
          onChange={handleUpload} 
          disabled={uploading}
          className="hidden" 
        />
      </label>
    </div>
  );
}
