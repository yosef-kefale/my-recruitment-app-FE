'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import './RichTextEditor.css'; // Import custom styles

// Define the ref type for the RichTextEditor component
export type RichTextEditorHandle = {
  getContent: () => string;
};

interface RichTextEditorProps {
  onChange?: (content: string) => void;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(({ onChange }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    // Only initialize if not already initialized
    if (editorRef.current && !quillRef.current) {
      // Create a custom toolbar container
      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ];

      // Initialize Quill with the custom toolbar
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
        },
        placeholder: 'Write something...',
      });

      // Listen for text change events and update the parent state
      quillRef.current.on('text-change', () => {
        if (quillRef.current && onChange) {
          onChange(quillRef.current.root.innerHTML);
        }
      });
    }

    return () => {
      // Clean up the editor when component unmounts
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [onChange]);

  // Expose the getContent function to the parent component
  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (quillRef.current) {
        return quillRef.current.root.innerHTML; // Return the HTML content
      }
      return '';
    },
  }));

  return (
    <div className="rich-text-editor-container">
      <div ref={editorRef} style={{ height: '300px' }} />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;
