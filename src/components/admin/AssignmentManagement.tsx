import React, { useState } from 'react';
import AssignmentList from './assignments/AssignmentList';
import AssignmentForm from './assignments/AssignmentForm';
import { Plus } from 'lucide-react';

export default function AssignmentManagement() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Assignment Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Create Assignment
        </button>
      </div>

      {isCreating && (
        <AssignmentForm onClose={() => setIsCreating(false)} />
      )}

      <AssignmentList />
    </div>
  );
}