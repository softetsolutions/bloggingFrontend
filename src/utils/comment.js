import { getAuthInfo } from './auth';

const API_URL = import.meta.env.VITE_API_URL;

export const createComment = async (postId, comment) => {
  try {
    const { token } = getAuthInfo();
    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ postId, comment })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create comment');
    }

    return await response.json();
  } catch (error) {
    throw error.message || { error: 'Failed to create comment' };
  }
};

export const updateComment = async (commentId, comment) => {
  try {
    const { token } = getAuthInfo();
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ comment })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update comment');
    }

    return await response.json();
  } catch (error) {
    throw error.message || { error: 'Failed to update comment' };
  }
};

export const deleteComment = async (commentId) => {
  try {
    const { token } = getAuthInfo();
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete comment');
    }

    return true;
  } catch (error) {
    throw error.message || { error: 'Failed to delete comment' };
  }
};

export const getPostComments = async (postId) => {
  try {
    const { token } = getAuthInfo();
    const response = await fetch(`${API_URL}/comments/${postId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch comments');
    }

    return data;
  } catch (error) {
    throw error.message || { error: 'Failed to fetch comments' };
  }
}; 