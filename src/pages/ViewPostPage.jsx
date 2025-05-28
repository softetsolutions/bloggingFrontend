import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchPostById } from '../utils/post';
import { getPostComments } from '../utils/comment';
import { getAuthInfo } from '../utils/auth';
import PostContent from '../components/PostContent';
import Comments from '../components/Comments';

const ViewPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
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

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center">{error}</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4 pt-24">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </div>
        
        <PostContent post={post} />
        
        <Comments postId={id} comments={comments} user={user} />
      </div>
    </div>
  );
};

export default ViewPostPage; 