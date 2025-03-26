"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for a token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center px-4 py-2 shadow-md bg-sky-400 fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-white">TalentHub</h1>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        {isLoggedIn ? (
          <>
            <Link
              href="/jobs/view-all"
              className="text-white text-lg font-bold hover:text-sky-600"
            >
              Jobs
            </Link>
            <Link
              href="/jobs/applications"
              className="text-white text-lg font-bold hover:text-sky-600"
            >
              Applications
            </Link>
            <Link href="/inbox" className="text-white text-lg font-bold hover:text-sky-600">
              Inbox
            </Link>
          </>
        ) : (
          <>
            <Link href="/" className="text-white text-lg font-bold hover:text-sky-600">
              Home
            </Link>
            <Link
              href="/jobs/view-all"
              className="text-white text-lg font-bold hover:text-sky-600"
            >
              Find Jobs
            </Link>
            <Link href="#" className="text-white text-lg font-bold hover:text-sky-600">
              Find Candidates
            </Link>
            <Link href="#" className="text-white text-lg font-bold hover:text-sky-600">
              Contact
            </Link>
          </>
        )}
      </div>

      {/* User Section */}
      <div className="relative">
        {isLoggedIn ? (
          <div className="relative">
            {/* Profile Picture */}
            <button onClick={() => setShowDropdown(!showDropdown)}>
              <Image
                src="/profile.avif"
                alt="Profile"
                width={50}
                height={50}
                className="w-12 h-12 rounded-full border border-gray-300 cursor-pointer"
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-sky-400"
                >
                  Profile
                </Link>
                <Link href="/cv" className="block px-4 py-2 hover:bg-sky-400">
                  CV and Contacts
                </Link>
                <Link
                  href="/hires"
                  className="block px-4 py-2 hover:bg-sky-400"
                >
                  Hires
                </Link>
                <Link
                  href="/statistics"
                  className="block px-4 py-2 hover:bg-sky-400"
                >
                  My Statistics
                </Link>

                <hr className="my-2 border-gray-200" />

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-4 flex items-center">
            <button
              onClick={() => router.push("/login")}
              className="text-gray-700 hover:text-sky-600"
            >
              Sign In
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-lg">
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
