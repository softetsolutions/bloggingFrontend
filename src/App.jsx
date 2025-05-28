import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/DashboardLayout";
import AllPosts from "./pages/AllPosts";
import ProtectedRoute from "./components/ProtectedRoute";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import CreatePost from "./pages/CreatePost";
import ViewPostPage from "./pages/ViewPostPage";
import ManagePostPage from "./pages/ManagePostPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/create" element={<CreatePost />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/posts" replace />} />
        <Route path="posts" element={<AllPosts />} />
      </Route>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/view/:id" element={<ViewPostPage />} />
      <Route 
        path="/post/:id" 
        element={
          <ProtectedRoute>
            <ManagePostPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
