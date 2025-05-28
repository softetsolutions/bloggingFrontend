import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BookOpen } from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "All Posts", href: "/dashboard/posts", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Posts" value="0" />
          <StatsCard title="Total Views" value="< 500" />
          <StatsCard title="Total Followers" value="0" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <ul>
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        isActive(item.href)
                          ? "bg-gray-100 dark:bg-gray-700 font-medium"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
    </div>
  );
}
