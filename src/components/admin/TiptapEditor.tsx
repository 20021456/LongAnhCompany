'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { AdminIcon } from './AdminIcon';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

/** Toolbar button that mirrors `.ne-body-toolbar button` styling. */
function ToolButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.4 : 1,
        background: active ? 'var(--ad-primary-soft)' : undefined,
        color: active ? 'var(--ad-primary)' : undefined,
        fontWeight: active ? 600 : undefined,
      }}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="ne-body-toolbar" aria-label="Thanh công cụ định dạng">
      <ToolButton
        title="Đậm (Ctrl+B)"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <b style={{ fontSize: 13 }}>B</b>
      </ToolButton>
      <ToolButton
        title="Nghiêng (Ctrl+I)"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i style={{ fontSize: 13 }}>I</i>
      </ToolButton>
      <ToolButton
        title="Gạch ngang"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <s style={{ fontSize: 13 }}>S</s>
      </ToolButton>
      <ToolButton
        title="Code inline"
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{'</>'}</span>
      </ToolButton>
      <div className="sep" />
      <ToolButton
        title="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <b style={{ fontSize: 11 }}>H₂</b>
      </ToolButton>
      <ToolButton
        title="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <b style={{ fontSize: 11 }}>H₃</b>
      </ToolButton>
      <ToolButton
        title="Trích dẫn"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        &quot;
      </ToolButton>
      <div className="sep" />
      <ToolButton
        title="Danh sách dấu chấm"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <AdminIcon name="list" size={13} />
      </ToolButton>
      <ToolButton
        title="Danh sách số"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <span style={{ fontSize: 11, fontWeight: 600 }}>1.</span>
      </ToolButton>
      <ToolButton
        title="Đường ngang"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <span style={{ fontSize: 11 }}>—</span>
      </ToolButton>
      <div className="sep" />
      <ToolButton
        title="Hoàn tác (Ctrl+Z)"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <AdminIcon name="refresh" size={13} />
      </ToolButton>
      <ToolButton
        title="Làm lại (Ctrl+Y)"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>
          <AdminIcon name="refresh" size={13} />
        </span>
      </ToolButton>
    </div>
  );
}

/**
 * Tiptap-based rich-text editor for article bodies. The value is serialised
 * to HTML — plain enough to render via `dangerouslySetInnerHTML` on the
 * public site. The component is `immediatelyRender: false` so it works
 * cleanly under Next's server-rendering of the parent.
 */
export function TiptapEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'ne-body',
        'data-placeholder': placeholder ?? '',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep the editor in sync when the external `value` changes (e.g. when the
  // user switches the active language tab — different value to render).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
