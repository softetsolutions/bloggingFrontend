import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchPostById, deletePostById, updatePost } from '../utils/post';
import { getPostComments } from '../utils/comment';
import { Edit2, Trash2 } from 'lucide-react';
import { getAuthInfo } from '../utils/auth';
import PostContent from '../components/PostContent';
import Comments from '../components/Comments';
import TiptapEditor from '../components/TiptapEditor';

const ManagePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const { user } = getAuthInfo();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchPostById(id);
        setPost(data);
        const commentsData = await getPostComments(id);
        setComments(commentsData);
      } catch (err) {
        setError(err.message || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePostById(id);
      navigate('/dashboard/posts');
    } catch (err) {
      alert(err.message || 'Failed to delete post');
    }
  };

  const handleEdit = () => {
    setEditForm({
      title: post.title,
      description: post.content || post.description || ''
    });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedPost = await updatePost(id, editForm);
      setPost(updatedPost);
      setIsEditing(false);
      setEditForm({ title: '', description: '' });
    } catch (err) {
      alert(err.message || 'Failed to update post');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ title: '', description: '' });
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center">{error}</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4 pt-24">
        {isEditing ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-2xl font-bold"
              placeholder="Post title"
            />
            <div className="mb-4">
              <TiptapEditor
                onUpdate={(content) => setEditForm(prev => ({ ...prev, description: content }))}
                initialContent={editForm.description}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-1 bg-violet-500 text-white rounded-full px-3 py-1 text-sm hover:bg-violet-600 transition shadow-sm"
                  title="Edit Post"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 bg-red-500 text-white rounded-full px-3 py-1 text-sm hover:bg-red-600 transition shadow-sm"
                  title="Delete Post"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
            
            <PostContent post={post} />
            
            <Comments postId={id} comments={comments} user={user} />
          </>
        )}
      </div>
    </div>
  );
};

export default ManagePostPage; 