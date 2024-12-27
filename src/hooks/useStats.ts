import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalAssignments: number;
  completedSubmissions: number;
  pendingReviews: number;
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: totalUsers },
          { count: totalAssignments },
          { count: completedSubmissions },
          { count: pendingReviews },
        ] = await Promise.all([
          supabase.from('regular_users').select('*', { count: 'exact', head: true }),
          supabase.from('assignments').select('*', { count: 'exact', head: true }),
          supabase
            .from('user_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed'),
          supabase
            .from('user_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('score_status', 'pending'),
        ]);

        setStats({
          totalUsers: totalUsers || 0,
          totalAssignments: totalAssignments || 0,
          completedSubmissions: completedSubmissions || 0,
          pendingReviews: pendingReviews || 0,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}