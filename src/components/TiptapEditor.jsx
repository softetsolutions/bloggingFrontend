import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Heading from '@tiptap/extension-heading'
import Underline from '@tiptap/extension-underline'
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline as UnderlineIcon
} from 'lucide-react'
import { useState, useEffect } from 'react'

const TiptapEditor = ({ onUpdate, initialContent }) => {
  const [isImageUploading, setIsImageUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
      }),
      Heading.configure({
        levels: [1, 2],
        HTMLAttributes: {
          class: 'heading-node',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-violet-400 hover:text-violet-300 underline',
        },
      }),
      Underline,
    ],
    content: initialContent || '<p>Start writing your blog post...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-5 border border-gray-700 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 bg-gray-800 text-gray-100',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onUpdate?.(content);
    },
  })

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setIsImageUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Image = e.target.result
      editor.chain().focus().setImage({ src: base64Image }).run()
      setIsImageUploading(false)
    }
    reader.onerror = () => {
      alert('Error reading file')
      setIsImageUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const addImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = handleImageUpload
    input.click()
  }

  const addLink = () => {
    // If text is already a link, remove it
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      return
    }

    const selectedText = editor.state.selection.content().content.firstChild?.textContent || ''
    if (selectedText) {
      // Convert selected text to URL-friendly format
      const url = `https://example.com/${selectedText.toLowerCase().replace(/\s+/g, '-')}`
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const toggleHeading = (level) => {
    editor.chain().focus().toggleHeading({ level }).run()
  }

  return (
    <div className="max-w-4xl mx-auto">
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-1"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-700 text-gray-200 ${editor.isActive('bold') ? 'bg-gray-700 text-violet-400' : ''}`}
            title="Bold"
          >
            <BoldIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-700 text-gray-200 ${editor.isActive('italic') ? 'bg-gray-700 text-violet-400' : ''}`}
            title="Italic"
          >
            <ItalicIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-700 text-gray-200 ${editor.isActive('underline') ? 'bg-gray-700 text-violet-400' : ''}`}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleHeading(1)}
            className={`p-2 rounded hover:bg-gray-700 text-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-700 text-violet-400' : ''}`}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleHeading(2)}
            className={`p-2 rounded hover:bg-gray-700 text-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-700 text-violet-400' : ''}`}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            onClick={addLink}
            className={`p-2 rounded hover:bg-gray-700 text-gray-200 ${editor.isActive('link') ? 'bg-gray-700 text-violet-400' : ''}`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-700 text-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-700 text-violet-400' : ''}`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-700 text-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-700 text-violet-400' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            onClick={addImage}
            disabled={isImageUploading}
            className={`p-2 rounded hover:bg-gray-700 text-gray-200 ${isImageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor