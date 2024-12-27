import React, { useState } from 'react';
import { Edit2, Trash2, Users } from 'lucide-react';
import { Assignment } from '../../../types/assignment';
import AssignmentForm from './AssignmentForm';
import AssignUserModal from './AssignUserModal';

interface AssignmentListItemProps {
  assignment: Assignment;
}

export default function AssignmentListItem({ assignment }: AssignmentListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {assignment.assignment_id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {assignment.pdf_path}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {new Date(assignment.created_at).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="flex gap-2">
            <button
              onClick={() => setIsAssigning(true)}
              className="text-green-600 hover:text-green-800"
              title="Assign to Users"
            >
              <Users size={16} />
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit Assignment"
            >
              <Edit2 size={16} />
            </button>
            <button 
              className="text-red-600 hover:text-red-800"
              title="Delete Assignment"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {isEditing && (
        <AssignmentForm 
          assignment={assignment} 
          onClose={() => setIsEditing(false)} 
        />
      )}

      {isAssigning && (
        <AssignUserModal
          assignment={assignment}
          onClose={() => setIsAssigning(false)}
        />
      )}
    </>
  );
}