import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_URL } from "../../lib/api";
import { Separator } from "../ui/separator";

interface NavBarNotLoggedProps {
  viewType: "candidate" | "employer";
  onViewTypeChange: (type: "candidate" | "employer") => void;
}

export default function NavBarNotLogged({
  viewType,
  onViewTypeChange,
}: NavBarNotLoggedProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/jobs/get-all-job-postings?q=${encodeURIComponent(
          searchQuery
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      await response.json();
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLoginClickEmployee = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleLoginClickEmployer = () => {
    localStorage.removeItem("token");
    router.push("/login?employer=true");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                TalentHub
              </h1>
            </Link>
          </div>

          {/* Right-aligned content */}
          <div className="flex items-center space-x-6">
            {/* Primary Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/about"
                className="text-gray-600 hover:text-sky-600 font-medium transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-sky-600 font-medium transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {viewType === "candidate" && (
              <button
              onClick={handleLoginClickEmployee}
              className="text-gray-600 hover:text-sky-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Sign In
            </button>
              )}

              {viewType === "employer" && (
              <button
              onClick={handleLoginClickEmployer}
              className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm"
              >
                Post a Job
              </button>
              )}
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* View Type Toggle - Desktop */}
            <div className="hidden md:flex items-center space-x-1 bg-gray-50 p-1 rounded-full">
              <button
                onClick={() => onViewTypeChange("candidate")}
                className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
                  viewType === "candidate"
                    ? "text-white bg-sky-600 shadow-sm font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Job Seeker
              </button>
              <button
                onClick={() => onViewTypeChange("employer")}
                className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
                  viewType === "employer"
                    ? "text-white bg-sky-600 shadow-sm font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Employer
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-sky-600 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-100">
            {/* View Type Toggle - Mobile */}
            <div className="flex items-center justify-center space-x-1 bg-gray-50 p-1 rounded-full mx-4">
              <button
                onClick={() => onViewTypeChange("candidate")}
                className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
                  viewType === "candidate"
                    ? "bg-white text-sky-600 shadow-sm font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Job Seeker
              </button>
              <button
                onClick={() => onViewTypeChange("employer")}
                className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
                  viewType === "employer"
                    ? "bg-white text-sky-600 shadow-sm font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Employer
              </button>
            </div>

            <div className="px-4 space-y-2">
              <Link
                href="/about"
                className="block text-gray-600 hover:text-sky-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block text-gray-600 hover:text-sky-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Contact
              </Link>
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleLoginClickEmployee}
                  className="w-full text-gray-600 hover:text-sky-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={handleLoginClickEmployer}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-2 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm"
                >
                  Post a Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
