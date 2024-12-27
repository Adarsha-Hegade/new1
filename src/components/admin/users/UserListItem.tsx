import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { User } from '../../../types/user';
import UserForm from './UserForm';

interface UserListItemProps {
  user: User;
}

export default function UserListItem({ user }: UserListItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {user.username}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {user.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {user.email}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {user.phone}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit2 size={16} />
            </button>
            <button className="text-red-600 hover:text-red-800">
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {isEditing && (
        <UserForm user={user} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}