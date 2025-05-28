import { getAuthInfo } from './auth';

const API_URL = import.meta.env.VITE_API_URL;

export const createPost = async (postData) => {
    try {
        const { token, username } = getAuthInfo();

        // Create FormData object
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('description', postData.description);
        formData.append('username', username);
        
        // If there's an image file, append it
        if (postData.image) {
            formData.append('image', postData.image);
        }

        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }

        const responseData = await response.json();
        return { ...responseData, username };
    } catch (error) {
        throw error.error || { error: 'Failed to create post' };
    }
};

// Get all posts
export const getAllPosts = async () => {
    try {
        const { token } = getAuthInfo();
        const response = await fetch(`${API_URL}/posts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch posts');
        }

        return await response.json();
    } catch (error) {
        throw error.message || { error: 'Failed to fetch posts' };
    }
};

// Get posts for a specific user
export const getUserPosts = async (userId) => {
    try {
        const { token, username } = getAuthInfo();

        const response = await fetch(`${API_URL}/posts/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Session expired. Please login again.');
            }
            if (response.status === 404) {
                return [];
            }
            throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        const posts = Array.isArray(data) ? data : [];
        return posts.map(post => ({
            ...post,
            currentUsername: username
        }));
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

export const getPostOfUser = async (userId) => {
    try {
        const { token } = getAuthInfo();
        const response = await fetch(`${API_URL}/posts/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user posts');
        }

        return await response.json();
    } catch (error) {
        throw error.message || { error: 'Failed to fetch user posts' };
    }
};

// Fetch a single post by ID
export const fetchPostById = async (id) => {
    try {
        const { token } = getAuthInfo();
        const response = await fetch(`${API_URL}/posts/post/${id}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch post');
        }
        return await response.json();
    } catch (error) {
        throw error.message || { error: 'Failed to fetch post' };
    }
};

export const deletePostById = async (id) => {
    const { token } = getAuthInfo();
    const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
    }
    return true;
};

export const updatePost = async (postId, postData) => {
    const { token } = getAuthInfo();
    const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(postData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post');
    }

    return await response.json();
};