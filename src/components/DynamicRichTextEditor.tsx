'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] border rounded-md bg-gray-50 animate-pulse" />
  ),
});

export type { RichTextEditorHandle } from './RichTextEditor';

interface DynamicRichTextEditorProps {
  onChange?: (content: string) => void;
}

const DynamicRichTextEditor = ({ onChange }: DynamicRichTextEditorProps) => {
  return (
    <Suspense fallback={
      <div className="h-[300px] border rounded-md bg-gray-50 animate-pulse" />
    }>
      <RichTextEditor onChange={onChange} />
    </Suspense>
  );
};

export default DynamicRichTextEditor; 