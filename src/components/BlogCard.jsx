import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BlogCard({
  post,
  onMouseEnter,
  onMouseLeave,
  onDelete,
  variant = 'view' // 'view' or 'manage'
}) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (typeof onMouseEnter === 'function') {
      onMouseEnter(post.id);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (typeof onMouseLeave === 'function') {
      onMouseLeave();
    }
  };

  const handleCardClick = () => {
    // If we're in the dashboard or variant is manage, use the manage route
    if (location.pathname.includes('/dashboard') || variant === 'manage') {
      navigate(`/post/${post.id}`);
    } else {
      // Otherwise use the view route (for explore page)
      navigate(`/view/${post.id}`);
    }
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D";
  const coverImage = post.image_url || post.image || defaultImage;

  function stripAllHtmlTags(html) {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  }

  let previewText = "";
  if (post.description) {
    const plain = stripAllHtmlTags(post.description);
    previewText = plain.length > 80 ? plain.substring(0, 80) + "..." : plain;
  } else if (post.excerpt) {
    const plain = stripAllHtmlTags(post.excerpt);
    previewText = plain.length > 80 ? plain.substring(0, 80) + "..." : plain;
  } else if (post.content) {
    const plain = stripAllHtmlTags(post.content);
    previewText = plain.length > 80 ? plain.substring(0, 80) + "..." : plain;
  }

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-all duration-500 h-[280px] flex flex-col cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
    >
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-600 z-10"
          title="Delete Post"
        >
          Delete
        </button>
      )}
      <div className="relative overflow-hidden h-40">
        <img
          src={coverImage}
          alt={post.title || "Blog post cover"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 line-clamp-1">
          {post.title}
        </h3>
        {(post.fname || post.lname) && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            By {post.fname} {post.lname}
          </div>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {previewText}
        </p>

        <div className="flex items-center justify-end mt-auto">
          <span className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
            <MessageCircle className="h-4 w-4 mr-1" />
          </span>
        </div>
      </div>
    </div>
  );
}
