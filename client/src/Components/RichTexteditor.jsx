import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

const RichTextEditor = ({ content, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(
    !content || !String(content).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
  );

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] focus:outline-none px-4 py-3 text-base-content",
      },
      handleDOMEvents: {
        focus: () => {
          if (!editor?.getText().trim()) {
            editor.commands.clearContent();
          }
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      const isEmpty = editor.getText().trim().length === 0;
      setShowPlaceholder(isEmpty && !isFocused);
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const isEmpty = editor.getText().trim().length === 0;
    setShowPlaceholder(isEmpty && !isFocused);
  }, [content, editor, isFocused]);

  if (!editor) return null;

  const wordCount = editor
    .getText()
    .split(/\s+/)
    .filter(Boolean).length;

  const ToolbarButton = ({ onClick, active, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded transition ${
        active
          ? "bg-primary/10 text-primary"
          : "text-base-content/70 hover:bg-base-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-base-300 rounded-xl overflow-hidden bg-base-100">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-base-300 px-3 py-2 bg-base-100">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>

        <div className="w-px h-5 bg-base-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote size={16} />
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
            <Undo size={16} />
          </ToolbarButton>

          <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
            <Redo size={16} />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div
        className="relative"
        onFocus={() => {
          setIsFocused(true);
          setShowPlaceholder(false);
        }}
        onBlur={() => {
          setIsFocused(false);
          setShowPlaceholder(editor.getText().trim().length === 0);
        }}
      >
        <EditorContent editor={editor} />
        {showPlaceholder && (
          <div className="pointer-events-none absolute inset-0 flex items-start px-4 py-3 text-base-content/40 text-sm">
            Write your thought and experience here....
          </div>
        )}
      </div>

      {/* Word count */}
      <div className="text-right text-xs text-base-content/60 px-4 pb-2">
        {wordCount} words
      </div>
    </div>
  );
};

export default RichTextEditor;