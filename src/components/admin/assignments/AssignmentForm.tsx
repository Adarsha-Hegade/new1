import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from '../../../hooks/useForm';
import { useAssignmentUpload } from '../../../hooks/useAssignmentUpload';

interface AssignmentFormProps {
  onClose: () => void;
}

export default function AssignmentForm({ onClose }: AssignmentFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadAssignment, loading: uploading } = useAssignmentUpload();
  
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      assignment_id: '',
    },
    onSubmit: async (values) => {
      if (!selectedFile) {
        throw new Error('Please select a PDF file');
      }
      await uploadAssignment(values.assignment_id, selectedFile);
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create Assignment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assignment ID
            </label>
            <input
              type="text"
              name="assignment_id"
              value={values.assignment_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {errors.assignment_id && (
              <p className="mt-1 text-sm text-red-600">{errors.assignment_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              PDF File
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
          </div>

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
              disabled={isSubmitting || uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {isSubmitting || uploading ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}