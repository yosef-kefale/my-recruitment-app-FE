"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [applications, setApplications] = useState(0);
  const [users, setUsers] = useState(0);
  const [companies, setCompanies] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Set your target numbers here
  const targetApplications = 45000;
  const targetUsers = 15000000;
  const targetCompanies = 2000;



  useEffect(() => {
    const animateCount = (setter: React.Dispatch<React.SetStateAction<number>>, target: number) => {
      let start = 0;
      const increment = Math.ceil(target / 100);
      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(start);
        }
      }, 20);
    };

    animateCount(setApplications, targetApplications);
    animateCount(setUsers, targetUsers);
    animateCount(setCompanies, targetCompanies);

    const token = localStorage.getItem("token");

    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}

      {!isLoggedIn ? (

      <nav className="flex justify-between items-center p-6 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-sky-600">JobPortal</h1>
        <div className="space-x-6">
          <Link href="#" className="text-gray-700 hover:text-sky-600">
            Home
          </Link>
          <Link href="#" className="text-gray-700 hover:text-sky-600">
            Find Jobs
          </Link>
          <Link href="#" className="text-gray-700 hover:text-sky-600">
            Find Candidates
          </Link>
          <Link href="#" className="text-gray-700 hover:text-sky-600">
            Contact
          </Link>
        </div>
        <div className="space-x-4">
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-sky-600"
          >
            Sign In
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-lg">
            Get Started
          </button>
        </div>
      </nav>
      ): <div></div>}

      {/* Hero Section */}
      <header className="text-center py-20 bg-sky-100">
        <h2 className="text-4xl font-bold text-gray-800">
          Modernizing Job Search Experience
        </h2>
        <p className="text-gray-600 mt-4">
          The fast and reliable way to discover, hire, and manage freelance
          talent.
        </p>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search your needs..."
            className="p-3 rounded-l-lg border border-gray-300 w-1/3"
          />
          <button className="bg-sky-600 text-white p-3 rounded-r-lg">
            Search
          </button>
        </div>
      </header>

            {/* Counts */}
            <section className="flex justify-center items-center bg-sky-100 gap-4">
        <div className="flex flex-col items-center justify-center p-6 ">
          <h6 className="text-4xl font-bold text-gray-800 flex items-center">
            {applications.toLocaleString()} {/* Format number with commas */}
            <Plus className="ml-2 text-green-500 w-6 h-6" />
          </h6>
          <p className="text-gray-500 text-sm">Total Applications Received</p>
        </div>

        <div className="flex flex-col items-center justify-center p-6">
          <h6 className="text-4xl font-bold text-gray-800 flex items-center">
            {users.toLocaleString()} {/* Format number with commas */}
            <Plus className="ml-2 text-green-500 w-6 h-6" />
          </h6>
          <p className="text-gray-500 text-sm">Total Applications Received</p>
        </div>

        <div className="flex flex-col items-center justify-center p-6">
          <h6 className="text-4xl font-bold text-gray-800 flex items-center">
            {companies.toLocaleString()} {/* Format number with commas */}
            <Plus className="ml-2 text-green-500 w-6 h-6" />
          </h6>
          <p className="text-gray-500 text-sm">Total Applications Received</p>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 px-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Popular Job Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "Design & Development",
            "Business Consulting",
            "Production Operation",
            "Marketing & Sales",
            "Web Developer",
            "Project Manager",
            "Business analyst",
            "Education & Training",
          ].map((category) => (
            <div
              key={category}
              className="bg-white p-6 shadow-md rounded-lg text-center"
            >
              <h4 className="font-bold text-gray-700">{category}</h4>
              <p className="text-gray-500">+49 Jobs Available</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Job Circulars */}
      <section className="py-16 px-10">
        <h3 className="text-2xl text-center font-semibold text-gray-800 mb-6">
          Featured Job Circulars
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-28">
          {[
            "Design & Development",
            "Business Consulting",
            "Production Operation",
          ].map((category) => (
            <div
              key={category}
              className="bg-white min-h-[350px] p-6 shadow-md rounded-lg text-center"
            >
              <h4 className="font-bold text-gray-700">{category}</h4>
              <p className="text-gray-500">+49 Jobs Available</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-200 text-gray-600">
        © 2024 JobPortal. All rights reserved.
      </footer>
    </div>
  );
}
