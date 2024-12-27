import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAdminAuth() {
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const { count } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });
      
      setHasAdmin(count ? count > 0 : false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signUpAdmin = async (email: string, password: string) => {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create admin user record
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({
          id: authData.user.id,
          username: email.split('@')[0],
          email: email,
          password_hash: 'DEPRECATED' // Required by schema but not used (auth handled by Supabase Auth)
        });

      if (adminError) {
        // Cleanup auth user if admin creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw adminError;
      }

      // Sign in the user immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      return authData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    hasAdmin,
    loading,
    error,
    signUpAdmin,
  };
}