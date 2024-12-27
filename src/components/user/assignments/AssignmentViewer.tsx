import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Send } from 'lucide-react';
import { useAssignment } from '../../../hooks/useAssignment';
import PDFViewer from './PDFViewer';
import Editor from './Editor';

export default function AssignmentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    assignment,
    content,
    setContent,
    loading,
    error,
    saveContent,
    submitAssignment,
    lastSaved,
  } = useAssignment(id!);

  useEffect(() => {
    if (error) {
      // Redirect to assignments list if assignment not found or not accessible
      navigate('/dashboard');
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assignment) return null;

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit this assignment? This action cannot be undone.')) {
      await submitAssignment();
      navigate('/dashboard');
    }
  };

  const isCompleted = assignment.status === 'completed';

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Assignment {assignment.assignment.assignment_id}
        </h2>
        <div className="flex items-center gap-4">
          {!isCompleted && (
            <>
              <span className="text-sm text-gray-500">
                {lastSaved ? `Last saved: ${new Date(lastSaved).toLocaleString()}` : ''}
              </span>
              <button
                onClick={() => saveContent()}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                <Send size={16} />
                Submit
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <div className="h-full overflow-hidden rounded-lg border border-gray-200">
          <PDFViewer pdfUrl={assignment.assignment.pdf_path} />
        </div>
        <div className="h-full overflow-hidden rounded-lg border border-gray-200">
          <Editor
            content={content}
            onChange={setContent}
            readOnly={isCompleted}
          />
        </div>
      </div>
    </div>
  );
}