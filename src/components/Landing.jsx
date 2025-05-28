import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Edit3, TrendingUp} from "lucide-react";
import hero from "../assets/hero.png";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center bg-white dark:bg-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-fuchsia-300 dark:bg-fuchsia-900 rounded-full opacity-20 dark:opacity-30 blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-300 dark:bg-violet-900 rounded-full opacity-20 dark:opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-cyan-300 dark:bg-cyan-900 rounded-full opacity-20 dark:opacity-30 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Hero content */}
          <div
            className={`w-full lg:w-1/2 text-center lg:text-left transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="block text-gray-900 dark:text-white">
                Share Your Story
              </span>
              <span className="block bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-transparent bg-clip-text">
                With The World
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Create, publish, and grow with our modern blogging platform
              designed for creators of all kinds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 hover:from-fuchsia-700 hover:via-violet-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-lg hover:shadow-xl"
              >
                Start Writing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                to="/explore"
                className="inline-flex items-center justify-center px-6 py-3.5 border-2 border-violet-600 dark:border-violet-500 text-base font-medium rounded-lg text-violet-600 dark:text-violet-400 bg-transparent hover:bg-violet-50/80 dark:hover:bg-gray-800/80 transition-all duration-300"
              >
                Explore Posts
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  10K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Active Writers
                </div>
              </div>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
                  5M+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Monthly Readers
                </div>
              </div>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-300">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  100K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Published Articles
                </div>
              </div>
            </div>
          </div>

          <div
            className={`w-full lg:w-1/2 transition-all duration-1000 delay-200 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative">
              {/* Main image */}
              <div className="bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[4/3] md:aspect-[16/9] w-full bg-white dark:bg-gray-800 p-4">
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <img
                      src={hero}
                      alt="Blog website"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -left-6 top-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-fuchsia-100 dark:bg-fuchsia-900/30 p-2 rounded-lg">
                    <Edit3 className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Easy Publishing
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Write once, publish everywhere
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 bottom-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transform rotate-6 hover:rotate-0 transition-transform duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Grow Audience
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Built-in SEO optimization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
