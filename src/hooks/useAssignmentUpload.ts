import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAssignmentUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAssignment = async (assignmentId: string, file: File) => {
    setLoading(true);
    setError(null);

    try {
      // Upload PDF to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `assignments/${assignmentId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assignments')
        .getPublicUrl(filePath);

      // Create assignment record
      const { error: dbError } = await supabase
        .from('assignments')
        .insert({
          assignment_id: assignmentId,
          pdf_path: publicUrl,
        });

      if (dbError) throw dbError;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadAssignment, loading, error };
}