"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { API_URL } from "@/lib/api";

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

function SearchResultsContent() {
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
        const response = await fetch(`${API_URL}/jobs/get-all-job-postings?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [query]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-8 w-8 text-sky-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-lg text-gray-600">Loading results...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Link href="/" className="mt-4 inline-block text-sky-500 hover:text-sky-600">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            Found {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No jobs found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your search terms</p>
            <Link href="/" className="text-sky-500 hover:text-sky-600">
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h2>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{job.location}</span>
                      {job.type && <span>• {job.type}</span>}
                      {job.salary && <span>• {job.salary}</span>}
                    </div>
                  </div>
                  <button className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
                    Apply Now
                  </button>
                </div>
                <p className="mt-4 text-gray-600 line-clamp-2">{job.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-sky-500 hover:text-sky-600 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-8 w-8 text-sky-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-lg text-gray-600">Loading...</span>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
} 