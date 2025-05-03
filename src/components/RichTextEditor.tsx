'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import './RichTextEditor.css'; // Import custom styles

// Define the ref type for the RichTextEditor component
export type RichTextEditorHandle = {
  getContent: () => string;
};

interface RichTextEditorProps {
  onChange?: (content: string) => void;
  initialValue?: string;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(({ onChange, initialValue }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && editorRef.current && !quillRef.current) {
      import('quill').then((Quill) => {
        // Create a custom toolbar container
        const toolbarOptions = [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ];

        const editorElement = editorRef.current;
        if (!editorElement) return;

        // Initialize Quill with the custom toolbar
        quillRef.current = new Quill.default(editorElement, {
          theme: 'snow',
          modules: {
            toolbar: toolbarOptions,
          },
          placeholder: 'Write something...',
        });

        // Set initial value if provided
        if (initialValue) {
          quillRef.current.root.innerHTML = initialValue;
        }

        // Listen for text change events and update the parent state
        quillRef.current.on('text-change', () => {
          if (quillRef.current && onChange) {
            onChange(quillRef.current.root.innerHTML);
          }
        });
      });
    }

    return () => {
      // Clean up the editor when component unmounts
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [onChange, initialValue, isClient]);

  // Expose the getContent function to the parent component
  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (quillRef.current) {
        return quillRef.current.root.innerHTML; // Return the HTML content
      }
      return '';
    },
  }));

  if (!isClient) {
    return <div className="rich-text-editor-container" style={{ height: '300px' }} />;
  }

  return (
    <div className="rich-text-editor-container">
      <div ref={editorRef} style={{ height: '300px' }} />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;
