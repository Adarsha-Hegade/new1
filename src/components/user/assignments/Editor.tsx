import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

export default function Editor({ content, onChange, readOnly = false }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your answer here...',
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {!readOnly && (
        <div className="flex items-center gap-1 p-2 border-b">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('bold') ? 'bg-gray-100' : ''
            }`}
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('italic') ? 'bg-gray-100' : ''
            }`}
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('bulletList') ? 'bg-gray-100' : ''
            }`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('orderedList') ? 'bg-gray-100' : ''
            }`}
          >
            <ListOrdered size={16} />
          </button>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <EditorContent
          editor={editor}
          className="h-full prose max-w-none p-4"
        />
      </div>
    </div>
  );
}