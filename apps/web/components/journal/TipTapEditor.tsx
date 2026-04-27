"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Link as LinkIcon, Undo, Redo, CheckCircle, Loader2
} from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange?: (html: string) => void;
  onAutoSave?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
  className?: string;
}

const ToolbarButton = ({ onClick, active, title, children }: any) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded-md text-sm font-medium transition-all duration-100 ${
      active
        ? "bg-indigo-500/20 text-indigo-300 shadow-sm"
        : "text-zinc-400 hover:bg-white/8 hover:text-white"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-white/10 mx-1 self-center" />;

export function TipTapEditor({
  content,
  onChange,
  onAutoSave,
  placeholder = "Start writing...",
  readOnly = false,
  minHeight = 300,
  className = "",
}: TipTapEditorProps) {
  const [isSaved, setIsSaved] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: `prose prose-invert prose-sm max-w-none focus:outline-none text-zinc-200 leading-relaxed`,
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      setIsSaved(false);

      // Debounced auto-save (30 seconds)
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        setIsSaving(true);
        await onAutoSave?.(html);
        setTimeout(() => {
          setIsSaving(false);
          setIsSaved(true);
        }, 500);
      }, 30000);
    },
  });

  // Immediate save on content prop change
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  if (!editor) return null;

  return (
    <div className={`flex flex-col rounded-xl border border-white/8 bg-zinc-950/50 overflow-hidden ${className}`}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-white/8 bg-zinc-900/60 flex-wrap">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
            <Strikethrough size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
            <Code size={14} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
            <Heading1 size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
            <Heading2 size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
            <Heading3 size={14} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
            <ListOrdered size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
            <Quote size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
            <Code size={15} className="opacity-70" />
          </ToolbarButton>

          <Divider />

          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo size={14} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo size={14} />
          </ToolbarButton>

          <div className="ml-auto flex items-center gap-1.5 text-xs font-medium">
            {isSaving ? (
              <span className="flex items-center gap-1 text-indigo-400">
                <Loader2 size={11} className="animate-spin" /> Saving...
              </span>
            ) : isSaved ? (
              <span className="flex items-center gap-1 text-emerald-500">
                <CheckCircle size={11} /> Saved
              </span>
            ) : (
              <span className="text-zinc-500">Unsaved</span>
            )}
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className="px-5 py-4 flex-1 overflow-y-auto" style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
