import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="h-16 flex items-center px-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
          </div>
          <nav className="mt-6">
            <Link
              to="/dashboard"
              className="flex items-center px-6 py-3 text-sm text-gray-600 hover:bg-gray-50"
            >
              <FileText size={20} className="mr-3" />
              Assignments
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-6 py-3 text-sm text-gray-600 hover:bg-gray-50"
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}