import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Assignment } from '../../../types/assignment';
import { useUsers } from '../../../hooks/useUsers';
import { useAssignUsers } from '../../../hooks/useAssignUsers';

interface AssignUserModalProps {
  assignment: Assignment;
  onClose: () => void;
}

export default function AssignUserModal({ assignment, onClose }: AssignUserModalProps) {
  const { users, loading: loadingUsers } = useUsers();
  const { assignUsers, loading: assigning } = useAssignUsers(assignment.id);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await assignUsers(selectedUsers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Assign Users</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loadingUsers ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center space-x-3 py-2"
                >
                  <input
                    type="checkbox"
                    value={user.id}
                    checked={selectedUsers.includes(user.id!)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id!]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900">{user.name}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={assigning || selectedUsers.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {assigning ? 'Assigning...' : 'Assign Selected Users'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}