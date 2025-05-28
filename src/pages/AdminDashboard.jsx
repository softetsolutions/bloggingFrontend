import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import { Loader2, Search, User } from 'lucide-react';
import { getAllUsers, getPostsOfUser } from '../utils/user';
import { checkAdmin } from '../utils/auth';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getAllUsers();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from server');
      }
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
      if (error.message.includes('Access denied')) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        checkAdmin();
        await fetchUsers();
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setError(error.message);
        navigate(error.message.includes('Access denied') ? '/' : '/login');
      }
    };

    initializeDashboard();
  }, [navigate]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!selectedUser) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const posts = await getPostsOfUser(selectedUser.id);
        setUserPosts(Array.isArray(posts) ? posts : []);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setError(error.message);
        setUserPosts([]);
      } finally {
        setIsLoading(false);
    }
    };

    fetchUserPosts();
  }, [selectedUser]);

  const filteredUsers = users.filter(user => 
    user.fname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserList = () => (
    <div className="space-y-1 max-h-[600px] overflow-y-auto">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No users found
        </div>
      ) : (
        filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`w-full flex items-center p-2 rounded-lg transition-colors ${
              selectedUser?.id === user.id
                ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="ml-2 text-left">
              <p className="text-sm font-medium truncate">{`${user.fname} ${user.lname}`}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </button>
        ))
      )}
    </div>
  );

  const renderUserPosts = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {selectedUser ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Posts by {`${selectedUser.fname} ${selectedUser.lname}`}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
          ) : userPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={{
                    ...post,
                    author: {
                      id: selectedUser.id,
                      name: `${selectedUser.fname} ${selectedUser.lname}`,
                      email: selectedUser.email
                    }
                  }}
                  variant="manage"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No posts found for this user.
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Select a user to view their posts.
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                placeholder="Search users..."
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Users</h2>
                {renderUserList()}
              </div>
            </div>

            <div className="lg:col-span-9">
              {renderUserPosts()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 