import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

const PostContent = ({ post }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Underline,
    ],
    content: post ? (post.content || post.description || '') : '',
    editable: false,
  });

  useEffect(() => {
    if (editor && post) {
      editor.commands.setContent(post.content || post.description || '');
    }
  }, [post, editor]);

  if (!post) return null;

  const coverImage = post.image_url || post.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D";
  const author = post.fname && post.lname ? `${post.fname} ${post.lname}` : post.author || 'Unknown Author';
  const date = post.created_at ? new Date(post.created_at).toLocaleDateString() : '';

  return (
    <>
      <div className="flex items-center gap-4 mb-6 text-gray-400 text-sm">
        <span>By {author}</span>
        {date && <span>• {date}</span>}
      </div>
      <img src={coverImage} alt={post.title} className="w-full max-h-96 object-cover rounded-lg mb-8" />
      {editor && (
        <div className="prose prose-invert max-w-none">
          <EditorContent editor={editor} />
        </div>
      )}
    </>
  );
};

export default PostContent; 