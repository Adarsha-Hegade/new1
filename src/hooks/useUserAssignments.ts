import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserAssignment } from '../types/assignment';

export function useUserAssignments() {
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('user_assignments')
          .select(`
            *,
            assignment:assignments (
              assignment_id,
              pdf_path
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssignments(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  return { assignments, loading, error };
}