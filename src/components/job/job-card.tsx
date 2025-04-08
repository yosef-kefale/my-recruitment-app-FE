import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { MapPin, MoreVertical, Edit, Trash2, Bookmark, Building2, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { confirmAlert } from "react-confirm-alert"; // Import confirmation alert library
import "react-confirm-alert/src/react-confirm-alert.css"; // Import styles
import { JobPosting } from "../../app/models/jobPosting";
import { Organization } from "../../app/models/organization";

interface JobCardProps {
  job: JobPosting;
  isEmployer: boolean;
  onDelete?: (id: string) => void;
  onClick?: (job: JobPosting) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isEmployer, onDelete }) => {
  const [mounted, setMounted] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [timeAgo, setTimeAgo] = useState<string>("Some time ago");

  // Update timeAgo every minute
  useEffect(() => {
    if (job.createdAt && typeof job.createdAt === 'string') {
      const updateTimeAgo = () => {
        setTimeAgo(formatDistanceToNow(new Date(job.createdAt as string), { addSuffix: true }));
      };
      
      // Initial update
      updateTimeAgo();
      
      // Update every minute
      const interval = setInterval(updateTimeAgo, 60000);
      
      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }
  }, [job.createdAt]);

  useEffect(() => {
    setMounted(true);
    const org = localStorage.getItem("organization");
    if (org) {
      setOrganization(JSON.parse(org) as Organization);
    }
  }, []);

  // Update isSaved state when job.isSaved changes
  useEffect(() => {
    setIsSaved(job.isSaved || false);
  }, [job.isSaved]);

  const handleEdit = () => {
    console.log("Editing job:", job.id);
  };

  const handleDeleteJob = async () => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this job?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              const token = localStorage.getItem("token");
              const apiUrl = `http://196.188.249.24:3010/api/jobs/${job.id}`;

              const res = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!res.ok) throw new Error("Failed to delete job");

              // Notify parent component
              if (onDelete) onDelete(job.id as string);
            } catch (error) {
              console.error("Error deleting job:", error);
            }
          },
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const handleSaveJob = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://196.188.249.24:3010/api/save-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobPostId: job?.id,
          userId: organization?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      setIsSaved(!isSaved);
      
      // Update the job object to reflect the new saved state
      job.isSaved = !isSaved;
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <Card 
      className="group h-full p-2 sm:p-3 shadow-sm hover:shadow-md border-gray-200 border-t-0 rounded-lg transition-all relative flex flex-col overflow-hidden duration-300 cursor-pointer"
    >
      {/* Header with time and actions */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Badge
            className={`px-2 py-0.5 text-xs rounded-md ${
              job.employmentType === "Full-time"
                ? "bg-green-100 text-green-800"
                : job.employmentType === "Part-time"
                ? "bg-red-100 text-red-800"
                : job.employmentType === "Commission"
                ? "bg-orange-100 text-orange-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {job.employmentType}
          </Badge>
          <span className="text-gray-400 text-xs">{timeAgo}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {!isEmployer && (
            <button
              onClick={handleSaveJob}
              className="p-1.5 rounded-full text-gray-400 hover:bg-sky-50 hover:text-sky-600 transition-colors"
              aria-label="Save job"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-sky-500 text-sky-500' : ''}`} />
            </button>
          )}
          
          {isEmployer && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1.5 rounded-full hover:bg-gray-50">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-white border shadow-md rounded-md p-2 w-32">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={handleDeleteJob}
                  className="flex items-center gap-2 w-full p-2 text-sm text-red-600 hover:bg-red-100 rounded-md"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Title & Company Info */}
      <div className="flex gap-2 items-start mb-2">
        <div className="flex-shrink-0">
          <Image
            src="/logo-demo.png"
            alt="Company Logo"
            width={36}
            height={36}
            className="rounded-md"
          />
        </div>
        <div className="flex-grow min-w-0">
          <Link href={isEmployer ? `/jobs/employer-job-details/${job.id}` : `/jobs/job-details/${job.id}`}>
            <h2 className="text-base font-semibold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-1">
              {job.title}
            </h2>
          </Link>
          <div className="flex items-center gap-1.5 mt-0.5 text-sm text-gray-500">
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate">{job.companyName || "Company Name"}</span>
          </div>
        </div>
      </div>

      {/* Key Information Grid - Simplified */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{job.location || job.city}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Briefcase className="w-3.5 h-3.5" />
          <span className="truncate">{job.experienceLevel || "Experience Level"}</span>
        </div>
      </div>

      {/* Description - Shorter */}
      <div className="text-gray-500 text-xs leading-relaxed flex-grow">
        <div
          className="description-content line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: job.description.length > 150 
              ? `${job.description.slice(0, 150)}...` 
              : job.description,
          }}
        />
      </div>

      {/* Skills - Simplified */}
      <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
        {job.skill.slice(0, 2).map((skill) => (
          <Badge
            key={skill}
            className="bg-gray-50 text-gray-600 hover:bg-gray-100 px-2 py-0.5 rounded text-xs truncate max-w-[100px]"
            title={skill}
          >
            {skill.length > 12 ? `${skill.slice(0, 12)}...` : skill}
          </Badge>
        ))}
        {job.skill.length > 2 && (
          <Badge className="bg-sky-50 text-sky-600 hover:bg-sky-100 px-2 py-0.5 rounded text-xs">
            +{job.skill.length - 2}
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default JobCard;
