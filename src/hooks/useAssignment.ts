import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UserAssignment } from '../types/assignment';

const AUTOSAVE_INTERVAL = 120000; // 2 minutes in milliseconds

export function useAssignment(assignmentId: string) {
  const [assignment, setAssignment] = useState<UserAssignment | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssignment() {
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
          .eq('id', assignmentId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Assignment not found');

        setAssignment(data);
        setContent(data.content || '');
        setLastSaved(data.last_saved);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignment();
  }, [assignmentId]);

  const saveContent = useCallback(async () => {
    if (!assignment || assignment.status === 'completed') return;

    try {
      const { error } = await supabase
        .from('user_assignments')
        .update({
          content,
          last_saved: new Date().toISOString(),
        })
        .eq('id', assignmentId);

      if (error) throw error;
      setLastSaved(new Date().toISOString());
    } catch (err: any) {
      console.error('Error saving content:', err);
    }
  }, [assignment, assignmentId, content]);

  const submitAssignment = async () => {
    if (!assignment || assignment.status === 'completed') return;

    try {
      const { error } = await supabase
        .from('user_assignments')
        .update({
          content,
          status: 'completed',
          submitted_at: new Date().toISOString(),
          last_saved: new Date().toISOString(),
        })
        .eq('id', assignmentId);

      if (error) throw error;

      setAssignment(prev => prev ? {
        ...prev,
        status: 'completed',
        submitted_at: new Date().toISOString(),
        last_saved: new Date().toISOString(),
      } : null);
    } catch (err: any) {
      console.error('Error submitting assignment:', err);
      throw err;
    }
  };

  // Set up autosave
  useEffect(() => {
    if (!assignment || assignment.status === 'completed') return;

    const interval = setInterval(saveContent, AUTOSAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [assignment, saveContent]);

  return {
    assignment,
    content,
    setContent,
    loading,
    error,
    saveContent,
    submitAssignment,
    lastSaved,
  };
}