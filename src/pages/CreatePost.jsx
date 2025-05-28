import { useState, useEffect } from "react";
import TiptapEditor from "../components/TiptapEditor";
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  X,
  CheckCircle,
  BookOpen,
  PenSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../utils/post";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setImagePreview(null);
    setSuccess(false);
    setError("");
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!content || content === "<p>Start writing your blog post...</p>") {
      setError("Please enter some content");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const postData = {
        title,
        description: content,
        image,
      };
      await createPost(postData);
      setSuccess(true);
    } catch (err) {
      if (err.error === "Authentication required. Please login first.") {
        navigate("/login");
      } else {
        setError(err.error || "Failed to create post");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Post Created Successfully!
            </h2>
            <p className="text-gray-400 mb-6">
              Your blog post has been published.
            </p>
            <div className="flex flex-col space-y-4 w-full">
              <button
                onClick={() => navigate("/explore")}
                className="flex items-center justify-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Explore Blog
              </button>
              <button
                onClick={resetForm}
                className="flex items-center justify-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <PenSquare className="h-5 w-5 mr-2" />
                Write Another Post
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-gray-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-lg shadow-sm">
          {/* Title Input */}
          <div className="p-6 border-b border-gray-700">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title..."
              className="w-full text-3xl font-bold text-gray-100 placeholder-gray-500 bg-transparent focus:outline-none"
            />
          </div>

          {/* Image Upload */}
          <div className="p-6 border-b border-gray-700">
            <label className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 cursor-pointer">
              <ImageIcon className="h-5 w-5" />
              <span>Upload Cover Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 rounded-lg object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="p-6">
            <TiptapEditor onUpdate={setContent} />
          </div>
        </div>
        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
        {/* Publish Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className={`flex items-center px-6 py-3 bg-violet-600 text-white rounded-lg transition-colors ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-violet-700"
            }`}
          >
            <Send className="h-5 w-5 mr-2" />
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
