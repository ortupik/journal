'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { useCallback } from 'react';

interface TiptapEditorProps {
  initialContent?: string;
  onChange: (html: string) => void;
  className?: string;
}

// Simple toolbar button component
const ToolbarButton = ({
  icon,
  isActive = false,
  onClick
}: {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}) => (
  <button
    type='button'
    className={`rounded-md p-2 ${isActive ? 'bg-gray-200' : ''} hover:bg-gray-100`}
    onClick={onClick}
  >
    {icon}
  </button>
);

const TiptapEditor = ({
  initialContent = '',
  onChange,
  className = ''
}: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Start writing your thoughts and experiences here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
      TextStyle,
      Color
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  // Toolbar action handlers
  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const alignLeft = useCallback(() => {
    editor?.chain().focus().setTextAlign('left').run();
  }, [editor]);

  const alignCenter = useCallback(() => {
    editor?.chain().focus().setTextAlign('center').run();
  }, [editor]);

  const alignRight = useCallback(() => {
    editor?.chain().focus().setTextAlign('right').run();
  }, [editor]);

  const setColor = useCallback(
    (color: string) => {
      editor?.chain().focus().setColor(color).run();
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className={`rounded-md border border-gray-300 ${className}`}>
      {/* Editor toolbar */}
      <div className='flex flex-wrap gap-1 border-b border-gray-300 bg-gray-50 p-2'>
        <ToolbarButton
          icon={<span className='font-bold'>B</span>}
          isActive={editor.isActive('bold')}
          onClick={toggleBold}
        />
        <ToolbarButton
          icon={<span className='italic'>I</span>}
          isActive={editor.isActive('italic')}
          onClick={toggleItalic}
        />
        <ToolbarButton
          icon={<span className='underline'>U</span>}
          isActive={editor.isActive('underline')}
          onClick={toggleUnderline}
        />
        <div className='mx-1 h-6 w-px bg-gray-300' />
        <ToolbarButton
          icon={<span className='text-sm'>H1</span>}
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => toggleHeading(1)}
        />
        <ToolbarButton
          icon={<span className='text-sm'>H2</span>}
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => toggleHeading(2)}
        />
        <ToolbarButton
          icon={<span className='text-sm'>H3</span>}
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => toggleHeading(3)}
        />
        <div className='mx-1 h-6 w-px bg-gray-300' />
        <ToolbarButton
          icon={<span>•</span>}
          isActive={editor.isActive('bulletList')}
          onClick={toggleBulletList}
        />
        <ToolbarButton
          icon={<span>1.</span>}
          isActive={editor.isActive('orderedList')}
          onClick={toggleOrderedList}
        />
        <div className='mx-1 h-6 w-px bg-gray-300' />
        <ToolbarButton
          icon={<span>⟵</span>}
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={alignLeft}
        />
        <ToolbarButton
          icon={<span>⟷</span>}
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={alignCenter}
        />
        <ToolbarButton
          icon={<span>⟶</span>}
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={alignRight}
        />
        <div className='mx-1 h-6 w-px bg-gray-300' />
        <div className='flex items-center gap-1'>
          {[
            '#000000',
            '#FF0000',
            '#0000FF',
            '#008000',
            '#FFA500',
            '#800080'
          ].map((color) => (
            <button
              key={color}
              type='button'
              className='h-5 w-5 rounded border border-gray-300'
              style={{ backgroundColor: color }}
              onClick={() => setColor(color)}
            />
          ))}
        </div>
      </div>

      {/* Editor content area */}
      <EditorContent
        editor={editor}
        className='prose min-h-[12rem] max-w-none p-4'
      />
    </div>
  );
};

export default TiptapEditor;
