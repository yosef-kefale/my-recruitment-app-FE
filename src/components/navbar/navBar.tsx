"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { API_URL } from "@/lib/api";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile?: {
    path?: string;
  };
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Check if user is logged in by checking for a token
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("organization") || "null");
    setIsLoggedIn(!!token);
    
    if (token && user?.id) {
      // Fetch user data
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${API_URL}/users/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    // Add event listener when dropdown is shown
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
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
              className={`text-white text-lg font-bold ${
                pathname.startsWith("/jobs") ? "text-sky-100 border-b-2 border-sky-100" : ""
              }`}
            >
              Jobs
            </Link>
            <Link
              href="/applications"
              className={`text-white text-lg font-bold ${
                pathname === "/applications" ? "text-sky-100 border-b-2 border-sky-100" : ""
              }`}
            >
              Applications
            </Link>
            <Link 
              href="/inbox" 
              className={`text-white text-lg font-bold ${
                pathname === "/inbox" ? "text-sky-100 border-b-2 border-sky-100" : ""
              }`}
            >
              Inbox
            </Link>
          </>
        ) : (
          <>
            <Link 
              href="/" 
              className={`text-white text-lg font-bold ${
                pathname === "/" ? "text-sky-100 border-b-2 border-sky-100" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/jobs/view-all"
              className={`text-white text-lg font-bold ${
                pathname.startsWith("/jobs") ? "text-sky-100 border-b-2 border-sky-100" : ""
              }`}
            >
              Find Jobs
            </Link>
            <Link 
              href="#" 
              className={`text-white text-lg font-bold ${
                pathname === "/candidates" ? "text-sky-100 border-b-2 border-sky-100" : ""
              }`}
            >
              Find Candidates
            </Link>
            <Link 
              href="#" 
              className={`text-white text-lg font-bold ${
                pathname === "/contact" ? "text-sky-100 border-b-2 border-sky-100" : ""
              }`}
            >
              Contact
            </Link>
          </>
        )}
      </div>

      {/* User Section */}
      <div className="relative">
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            {/* Profile Picture */}
            <button onClick={() => setShowDropdown(!showDropdown)}>
              <Avatar className="w-12 h-12 border border-gray-300 cursor-pointer">
                <AvatarImage
                  src={userData?.profile?.path || "/profile.avif"}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {userData?.firstName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
                <Link
                  href="/user/profile?tab=profile"
                  className="block px-4 py-2 hover:bg-sky-400"
                >
                  Profile
                </Link>
                <Link href="/user/profile?tab=cv" className="block px-4 py-2 hover:bg-sky-400">
                  CV and Contacts
                </Link>
                <Link
                  href="/user/profile?tab=statistics"
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
