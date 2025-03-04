import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { MapPin, DollarSign } from "lucide-react";
import Image from "next/image";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    status: string;
    workLocation: string;
    salary: number;
    employmentType: string;
    description: string;
    skill: string[];
    createdAt: string;
  };
  onOpen: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onOpen }) => {
  const timeAgo = job.createdAt
    ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
    : "Some time ago";

  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxChars = 200; // Limit for description
  const maxSkillsToShow = 3; // Limit for skills displayed

  return (
    <Card className="p-5 shadow-md border border-gray-200 rounded-lg transition-all hover:bg-gray-100 hover:shadow-xl">
      <p className="text-gray-400 text-sm">{timeAgo}</p>

      {/* Title & Employment Type */}
      <div className="flex justify-between items-center mt-1">
        <div className="flex gap-2">
          <div>
            <Image
              src="/logo-demo.png"
              alt="GitHub Avatar"
              width={60}
              height={60}
            />
          </div>
          <div>
            <h2 onClick={onOpen} className="text-xl font-semibold text-sky-800 hover:text-cyan-400 hover:underline cursor-pointer">
              {job.title}
            </h2>
            <span className="text-blue-500 text-sm font-medium">
              ({job.status})
            </span>
          </div>
        </div>
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
      </div>

      {/* Location & Salary */}
      <div className="flex items-center gap-3 text-gray-600 mt-2 text-sm">
        <div className="flex items-center gap-1">
          <MapPin size={16} className="text-gray-500" />
          {job.workLocation}
        </div>
        <div className="flex items-center">
          <DollarSign size={16} className="text-gray-500" />
          <strong>{job.salary.toLocaleString()}</strong>
        </div>
      </div>

      {/* Job Description */}
      <div className="mt-3 text-gray-500 text-sm">
        {showFullDescription
          ? job.description
          : `${job.description.slice(0, maxChars)}...`}
        {job.description.length > maxChars && (
          <button
            className="text-blue-500 text-sm font-medium ml-2"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? "See Less" : "See More"}
          </button>
        )}
      </div>

      {/* Skills & Applicants */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-500 text-sm">10 applicants</span>
        <div className="flex flex-wrap gap-2">
          {job.skill.slice(0, maxSkillsToShow).map((skill) => (
            <Badge
              key={skill}
              className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-blue-500 px-2 py-1 rounded-md text-xs"
            >
              {skill}
            </Badge>
          ))}
          {job.skill.length > maxSkillsToShow && (
            <Badge className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
              +{job.skill.length - maxSkillsToShow} more
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
