import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, BookOpen, Users, Tag, User, Building2, Headphones, BarChart2, EyeOff, Upload } from "lucide-react"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Posts", href: "/dashboard/posts", icon: FileText, count: 0 },
    { name: "Series", href: "/dashboard/series", icon: BookOpen },
    { name: "Followers", href: "/dashboard/followers", icon: Users, count: 0 },
    { name: "Following tags", href: "/dashboard/following-tags", icon: Tag, count: 6 },
    { name: "Following users", href: "/dashboard/following-users", icon: User, count: 0 },
    { name: "Following organizations", href: "/dashboard/following-orgs", icon: Building2, count: 0 },
    { name: "Following podcasts", href: "/dashboard/following-podcasts", icon: Headphones, count: 0 },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { name: "Hidden tags", href: "/dashboard/hidden-tags", icon: EyeOff, count: 0 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total post reactions" value="0" />
          <StatsCard title="Total post comments" value="0" />
          <StatsCard title="Total post views" value="< 500" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        pathname === item.href
                          ? "bg-gray-100 dark:bg-gray-700 font-medium"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <span>{item.name}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 text-xs font-medium text-gray-800 dark:text-gray-200">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/dashboard/upload"
                    className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <Upload className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    <span>Upload a video</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content - Outlet */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
    </div>
  )
}
