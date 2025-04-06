import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { MapPin, MoreVertical, Edit, Trash2, Bookmark } from "lucide-react";
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
}

const JobCard: React.FC<JobCardProps> = ({ job, isEmployer, onDelete }) => {
  const [mounted, setMounted] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const maxChars = 800; // Limit for description
  const maxSkillsToShow = 3; // Limit for skills displayed

  const timeAgo = job.createdAt
    ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
    : "Some time ago";

  useEffect(() => {
    setMounted(true);
    const org = localStorage.getItem("organization");
    if (org) {
      setOrganization(JSON.parse(org) as Organization);
    }
  }, []);

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

  const handleSaveJob = async () => {
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

      setIsSaved(true);
      alert("Job saved successfully!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error saving job. Please try again.");
    }
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <Card className="h-full py-6 px-4 sm:px-8 shadow-md border-gray-200 border-t-0 rounded-lg transition-all relative hover:shadow-lg flex flex-col">
      {/* Header with time and actions */}
      <div className="flex justify-between items-start mb-3">
        <p className="text-gray-500 text-sm">{timeAgo}</p>
        
        <div className="flex items-center gap-2">
          {/* Employment Type Badge */}
          <Badge
            className={`px-3 py-1 text-sm rounded-md ${
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
          
          {/* Save Job Button */}
          <button
            onClick={handleSaveJob}
            className="p-2 rounded-full text-gray-600 hover:bg-sky-100 hover:text-sky-600 transition-colors"
            aria-label="Save job"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-sky-500 text-sky-500' : ''}`} />
          </button>
          
          {/* Employer Actions */}
          {isEmployer && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <MoreVertical className="w-5 h-5 text-gray-500" />
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
      <div className="flex flex-col sm:flex-row gap-4 items-start mb-4">
        <div className="flex-shrink-0">
          <Image
            src="/logo-demo.png"
            alt="Company Logo"
            width={60}
            height={60}
            className="rounded-md"
          />
        </div>
        <div className="flex-grow">
          <Link href={isEmployer ? `/jobs/employer-job-details/${job.id}` : `/jobs/job-details/${job.id}`}>
            <h2 className="text-xl font-semibold text-sky-800 hover:text-cyan-400 hover:underline cursor-pointer line-clamp-2">
              {job.title}
            </h2>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-blue-500 text-sm font-medium">
              {job.status}
            </span>
          </div>
        </div>
      </div>

      {/* Location & Salary */}
      <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-4 text-sm">
        <div className="flex items-center gap-1">
          <MapPin size={16} className="text-gray-500" />
          <span className="truncate">{job.location}</span>
        </div>
        {job?.salaryRange?.minimum && job?.salaryRange?.maximum && (
          <div className="flex items-center">
            <span className="font-semibold text-md">
              ${job?.salaryRange?.minimum} - ${job?.salaryRange?.maximum}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mt-3 text-gray-600 text-sm font-[Inter] leading-relaxed flex-grow">
        {/* Show full or truncated description */}
        {showFullDescription ? (
          <div
            className="description-content"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        ) : (
          <div
            className="description-content line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: `${job.description.slice(0, maxChars)}...`,
            }}
          />
        )}

        {/* Show See More/See Less button if description is longer than maxChars */}
        {job.description.length > maxChars && (
          <button
            className="text-blue-600 text-sm font-medium mt-2 hover:underline"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? "See Less" : "See More"}
          </button>
        )}
      </div>

      {/* Skills & Applicants */}
      <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            {job?.applicationCount || 0} applicants
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {job.skill.slice(0, maxSkillsToShow).map((skill) => (
            <Badge
              key={skill}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-blue-500 px-2 py-1 rounded-md text-xs truncate max-w-[120px]"
              title={skill}
            >
              {skill.length > 15 ? `${skill.slice(0, 15)}...` : skill}
            </Badge>
          ))}
          {job.skill.length > maxSkillsToShow && (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-600 px-2 py-1 rounded-md text-xs">
              +{job.skill.length - maxSkillsToShow} more
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
