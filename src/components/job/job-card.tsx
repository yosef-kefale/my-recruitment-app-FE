import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface JobCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  job: any;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  // Calculate the time difference dynamically
  const timeAgo = job.createdAt
    ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
    : "Some time ago";

  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxChars = 200; // Maximum characters before truncation for description

  return (
    <Card className="p-4 shadow-md">
      <p className="text-gray-400 text-sm">{timeAgo}</p>
      <div className="flex justify-between">
        <div>
          <span className="text-2xl text-sky-800 hover:text-cyan-400 hover:underline cursor-pointer">
            {job.title}
          </span>
          <span className="text-blue-500 text-sm font-medium mt-1">({job.status})</span>
          <br />
          <span className="text-gray-800">
            {job.workLocation} - <strong>${job.salary}</strong>
          </span>
        </div>
        <div>
          <Badge
            className={`p-2 text-center flex items-center justify-center ${
              job?.employmentType === "Full-time"
                ? "bg-green-200 text-green-800"
                : job?.employmentType === "Part-time"
                ? "bg-red-200 text-red-800"
                : job?.employmentType === "Commission"
                ? "bg-orange-200 text-orange-800"
                : "bg-gray-200 text-gray-800" // Default case
            }`}
            variant="secondary"
          >
            {job?.employmentType}
          </Badge>
        </div>
      </div>
      {/* Job Description with See More */}
      <div className="mt-2">
        <p className="text-gray-500 text-sm">
          {showFullDescription
            ? job.description
            : `${job.description.slice(0, maxChars)}...`}
          &nbsp;
          {job.description.length > maxChars && (
            <button
              className="text-blue-500 text-sm font-medium mt-1"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "See Less" : "See More"}
            </button>
          )}
        </p>
      </div>
      <div className="flex justify-between gap-6 pt-4">
        <span className="text-gray-500 text-sm">{"10 applicants"}</span>
        <div className="flex justify-start gap-2">
          {job?.skill.map((skill: string) => (
            <Badge
              key={skill}
              className="p-2text-center cursor-default flex items-center justify-center"
              variant="secondary"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
