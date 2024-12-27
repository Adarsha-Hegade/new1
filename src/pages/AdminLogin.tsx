import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { Shield } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminSignupForm from '../components/admin/AdminSignupForm';

export default function AdminLogin() {
  const { hasAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {hasAdmin ? 'Admin Login' : 'Create Admin Account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* {hasAdmin ? (
            <LoginForm role="admin" />
          ) : (
            <AdminSignupForm />
          )} */}

           <LoginForm role="admin" />
        </div>
      </div>
    </div>
  );
}