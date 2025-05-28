import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import { getPostOfUser } from '../utils/post';
import BlogCard from '../components/BlogCard';
import { getAuthInfo } from '../utils/auth';

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const authInfo = getAuthInfo();
        if (!authInfo) {
          navigate('/login');
          return;
        }

        const data = await getPostOfUser(authInfo.id);
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (error.message?.includes('not authenticated') || error.message?.includes('Session expired')) {
          navigate('/login');
          return;
        }
        setError(error.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Posts</h2>
        <Link
          to="/create"
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <PenSquare className="h-5 w-5 mr-2" />
          Create Post
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">You haven't created any posts yet</div>
          <Link
            to="/create"
            className="text-violet-600 dark:text-violet-400 hover:underline"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="relative flex flex-col group">
              <BlogCard
                post={{
                  ...post,
                  image: post.image_url,
                  excerpt: post.description,
                  content: post.description,
                  date: new Date(post.created_at).toLocaleDateString(),
                  comments: post.comments || [],
                  readTime: post.readTime || '',
                  hideAuthor: true
                }}
                variant="manage"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 