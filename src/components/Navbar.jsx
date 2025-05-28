import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PenSquare, User, LogOut, LayoutDashboard } from "lucide-react";
import { logout } from "../utils/user";
import { getAuthInfo } from "../utils/auth";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Check authentication status and role
    const checkAuth = () => {
      const authInfo = getAuthInfo();
      setIsAuthenticated(!!authInfo);
      setIsAdmin(authInfo?.role === 'admin');
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    checkAuth();
    window.addEventListener("scroll", handleScroll);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (!result.success) {
        throw new Error(result.message);
      }
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if the server request fails
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate("/login");
    }
  };

  const handleDashboardClick = () => {
    setIsDropdownOpen(false);
    navigate(isAdmin ? '/admin' : '/dashboard');
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700"
          : "bg-white dark:bg-gray-900 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-transparent bg-clip-text">
                Blogify
              </span>
            </Link>
          </div>

          {/* nav items */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
              {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center text-gray-800 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 px-2 sm:px-3 py-2 text-sm sm:text-base font-medium transition-colors duration-300"
                >
                  <PenSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span>Write</span>
                </Link>
                <div className="relative dropdown-container">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center text-gray-800 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 px-2 sm:px-3 py-2 text-sm sm:text-base font-medium transition-colors duration-300"
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleDashboardClick}
                        className="w-full flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {location.pathname !== '/explore' && (
                  <Link
                    to="/explore"
                    className="text-gray-800 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 px-2 sm:px-3 py-2 text-sm sm:text-base font-medium transition-colors duration-300"
                  >
                    Explore
                  </Link>
                )}
                <Link
                  to="/login"
                  className="text-gray-800 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 px-2 sm:px-3 py-2 text-sm sm:text-base font-medium transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 hover:from-fuchsia-700 hover:via-violet-700 hover:to-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
