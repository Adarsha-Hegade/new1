import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAssignUsers(assignmentId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignUsers = async (userIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const assignments = userIds.map(userId => ({
        user_id: userId,
        assignment_id: assignmentId,
        status: 'pending',
        score_status: 'pending'
      }));

      const { error } = await supabase
        .from('user_assignments')
        .upsert(assignments);

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { assignUsers, loading, error };
}