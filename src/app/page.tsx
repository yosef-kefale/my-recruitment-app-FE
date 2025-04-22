"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { API_URL } from "@/lib/api";

// Job categories data with Ethiopian context
const jobCategories = [
  { 
    name: "Technology & IT", 
    count: 1240, 
    icon: "💻",
    image: "/images/placeholders/tech-category.jpg",
    description: "Software, IT, and Digital roles"
  },
  { 
    name: "Business & Finance", 
    count: 856, 
    icon: "💼",
    image: "/images/placeholders/business-category.jpg",
    description: "Banking, Finance, and Consulting"
  },
  { 
    name: "Manufacturing", 
    count: 732, 
    icon: "⚙️",
    image: "/images/placeholders/production-category.jpg",
    description: "Production and Manufacturing jobs"
  },
  { 
    name: "Marketing & Sales", 
    count: 945, 
    icon: "📊",
    image: "/images/placeholders/marketing-category.jpg",
    description: "Marketing, Sales, and Business Development"
  },
  { 
    name: "Education", 
    count: 543, 
    icon: "📚",
    image: "/images/placeholders/education-category.jpg",
    description: "Teaching and Training positions"
  },
  { 
    name: "Healthcare", 
    count: 678, 
    icon: "⚕️",
    image: "/images/placeholders/healthcare-category.jpg",
    description: "Medical and Healthcare professions"
  },
  { 
    name: "Agriculture", 
    count: 432, 
    icon: "🌾",
    image: "/images/placeholders/agriculture-category.jpg",
    description: "Farming and Agricultural roles"
  },
  { 
    name: "Construction", 
    count: 567, 
    icon: "🏗️",
    image: "/images/placeholders/construction-category.jpg",
    description: "Building and Construction jobs"
  }
];

// Features data
const features = [
  {
    title: "Smart Job Matching",
    description: "AI-powered matching system that connects you with the perfect opportunities based on your skills and experience",
    icon: "🎯",
    image: "/images/placeholders/feature-matching.jpg"
  },
  {
    title: "Easy Application Process",
    description: "Simple and quick application process with profile templates designed for Ethiopian job market",
    icon: "⚡",
    image: "/images/placeholders/feature-application.jpg"
  },
  {
    title: "Real-time Updates",
    description: "Get instant notifications for new opportunities in Ethiopia's fastest-growing sectors",
    icon: "🔔",
    image: "/images/placeholders/feature-updates.jpg"
  }
];

// Testimonials data
const testimonials = [
  {
    name: "Sara Haile",
    role: "Software Engineer",
    company: "Ethiopian Tech Solutions",
    testimonial: "Found my dream job at a leading Ethiopian tech company within weeks. The platform's matching algorithm is excellent!",
    avatar: "/images/placeholders/testimonial-1.jpg"
  },
  {
    name: "Abebe Bekele", 
    role: "HR Manager",
    company: "Ethio Industries",
    testimonial: "As an employer, this platform helped us find the best local talent quickly and efficiently.",
    avatar: "/images/placeholders/testimonial-2.jpg"
  },
  {
    name: "Mohammed Ahmed",
    role: "Marketing Director",
    company: "Digital Ethiopia",
    testimonial: "The best job platform for Ethiopian professionals. Modern interface and great features!",
    avatar: "/images/placeholders/testimonial-3.jpg"
  }
];

export default function Home() {
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
      const response = await fetch(`${API_URL}/jobs/get-all-job-postings?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      await response.json();
      
      // Navigate to search results page with the query
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      {!isLoggedIn ? (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-sky-600">TalentHub</h1>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-sky-600 font-medium">
                  Home
                </Link>
                <Link href="/search" className="text-gray-700 hover:text-sky-600 font-medium">
                  Find Jobs
                </Link>
                <Link
                  href="/signup-employer"
                  className="text-gray-700 hover:text-sky-600 font-medium"
                >
                  For Employers
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-sky-600 font-medium">
                  Contact
                </Link>
              </div>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={handleLoginClickEmployee}
                  className="text-gray-700 hover:text-sky-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={handleLoginClickEmployer}
                  className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors font-medium shadow-sm"
                >
                  Post a Job
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 hover:text-sky-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 space-y-4">
                <Link
                  href="/"
                  className="block text-gray-700 hover:text-sky-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/search"
                  className="block text-gray-700 hover:text-sky-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Find Jobs
                </Link>
                <Link
                  href="/signup-employer"
                  className="block text-gray-700 hover:text-sky-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  For Employers
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-700 hover:text-sky-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Contact
                </Link>
                <div className="pt-4 space-y-2">
                  <button
                    onClick={handleLoginClickEmployee}
                    className="w-full text-gray-700 hover:text-sky-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleLoginClickEmployer}
                    className="w-full bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors font-medium shadow-sm"
                  >
                    Post a Job
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      ) : (
        <div></div>
      )}

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="/images/placeholders/hero-placeholder.jpg"
            alt="Ethiopian Professional Workplace"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Dream Job in <span className="text-sky-400">Ethiopia</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            The leading platform connecting Ethiopian talent with top companies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex-1 w-full max-w-md">
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                className="w-full p-4 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-gray-300 backdrop-blur-sm focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button 
              className="w-full sm:w-auto bg-sky-500 text-white px-8 py-4 rounded-lg hover:bg-sky-600 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Searching...
                </span>
              ) : (
                'Search Jobs'
              )}
            </button>
          </div>
          {error && (
            <p className="mt-4 text-red-400 text-sm">
              {error}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
            <span className="text-gray-300 font-medium">Popular:</span>
            {["Remote", "Addis Ababa", "Entry Level", "IT"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 cursor-pointer transition-colors"
                onClick={() => {
                  setSearchQuery(tag);
                  handleSearch();
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Job Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Explore Job Categories
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover opportunities across Ethiopia&apos;s most dynamic sectors
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobCategories.map((category) => (
              <div
                key={category.name}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h4 className="font-semibold text-lg mb-1">{category.name}</h4>
                  <p className="text-sm text-gray-200 mb-2">{category.description}</p>
                  <p className="text-sm text-sky-300">
                    {category.count.toLocaleString()} jobs available
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Why Choose TalentHub Ethiopia
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            The most effective way to advance your career in Ethiopia
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-200 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Success Stories
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Hear from professionals who found success through TalentHub Ethiopia
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <p className="text-gray-600 mb-4 text-center italic">
                  &ldquo;{testimonial.testimonial}&rdquo;
                </p>
                <div className="text-center">
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/placeholders/cta-bg.jpg"
            alt="Ethiopian Office Environment"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 to-sky-800/90"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Advance Your Career in Ethiopia?
          </h2>
          <p className="text-xl mb-8 text-sky-100">
            Join thousands of professionals who have found their dream jobs through TalentHub Ethiopia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLoginClickEmployee}
              className="bg-white text-sky-900 px-8 py-4 rounded-lg hover:bg-sky-50 transition-colors font-medium shadow-lg"
            >
              Find Jobs
            </button>
            <button
              onClick={handleLoginClickEmployer}
              className="bg-sky-700 text-white px-8 py-4 rounded-lg hover:bg-sky-800 transition-colors font-medium shadow-lg border-2 border-white/20"
            >
              Post Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">TalentHub</h3>
              <p className="text-gray-400">
                Connecting talent with opportunity in the modern workplace.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Create Profile</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Job Alerts</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Career Advice</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Post a Job</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Browse Candidates</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Employer Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>© 2024 TalentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
