import { useState } from 'react';
import { Loader2, Edit2, X, Check } from 'lucide-react';
import { createComment, updateComment, deleteComment } from '../utils/comment';

const Comments = ({ postId, comments: initialComments, user }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setCommentError('');

    try {
      const result = await createComment(postId, newComment);
      setComments(prev => [...prev, result]);
      setNewComment('');
    } catch (err) {
      setCommentError(err.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const result = await updateComment(commentId, editCommentText);
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? result : comment
      ));
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (err) {
      setCommentError(err.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      setCommentError(err.message || 'Failed to delete comment');
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.comment);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
          rows="3"
        />
        {commentError && (
          <p className="text-red-400 text-sm mt-2">{commentError}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="mt-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Posting...
            </span>
          ) : (
            'Post Comment'
          )}
        </button>
      </form>

      {/* Comments List */}
      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-800 rounded-lg p-4">
              {editingCommentId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="px-3 py-1 bg-violet-600 text-white rounded hover:bg-violet-700"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-gray-200">{comment.comment}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-gray-400">
                      {comment.created_at && (
                        <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                    {user && user.id === comment.user_id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(comment)}
                          className="p-1 text-gray-400 hover:text-violet-400"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {user.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-1 text-gray-400 hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-400">No comments yet. Be the first to comment!</div>
      )}
    </div>
  );
};

export default Comments; 