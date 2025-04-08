"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  type?: string;
  postedAt: string;
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!query) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://196.188.249.24:3010/api/jobs/get-all-job-postings?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [query]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{error}</p>
          <Link href="/" className="mt-4 inline-block text-sky-500 hover:text-sky-600">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">
          Search Results for "{query}"
        </h1>
        
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No jobs found</p>
            <Link href="/" className="text-sky-500 hover:text-sky-600">
              Browse All Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500 text-sm">{job.location}</p>
                <Link 
                  href={`/jobs/job-details/${job.id}`}
                  className="text-sky-500 hover:text-sky-600 mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 