import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="relative h-screen">
        {/* Hero Image */}
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Education Hero"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Assignment Portal</h1>
            <p className="text-xl mb-8">Your gateway to learning and assessment</p>
            
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogIn size={20} />
              Login to Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}