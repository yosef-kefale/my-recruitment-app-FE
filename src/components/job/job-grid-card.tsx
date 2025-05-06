import { useState, useEffect } from "react";
import { MapPin, Briefcase, Clock, DollarSign, Bookmark, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { JobPosting } from "@/models/jobPosting";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface JobGridCardProps {
  job: JobPosting;
  isEmployer: boolean;
  onDelete?: (jobId: string) => void;
  onClick?: () => void;
}

const JobGridCard = ({ job, isEmployer, onDelete, onClick }: JobGridCardProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeAgo, setTimeAgo] = useState<string>("Recently posted");

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

  // Validate job data
  if (!job || typeof job !== 'object') {
    console.error('Invalid job data:', job);
    return null;
  }

  const handleSaveJob = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to save jobs",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_URL}/save-jobs`, {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobPostId: job.id }),
      });

      if (!response.ok) throw new Error("Failed to save job");

      setIsSaved(!isSaved);
      toast({
        title: "Success",
        description: isSaved ? "Job removed from saved jobs" : "Job saved successfully",
      });
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure we have valid data before rendering
  const jobTitle = typeof job.title === 'string' ? job.title : "Untitled Job";
  const companyName = typeof job.companyName === 'string' ? job.companyName : "Company Name";
  const companyLogo = job.companyLogo?.path || undefined;
  const location = typeof job.location === 'string' ? job.location : "Remote";
  const employmentType = typeof job.employmentType === 'string' ? job.employmentType : "Full-time";
  const salaryRange = job.salaryRange 
    ? `${job.salaryRange.minimum ? `$${job.salaryRange.minimum}K` : ''}${job.salaryRange.minimum && job.salaryRange.maximum ? ' - ' : ''}${job.salaryRange.maximum ? `$${job.salaryRange.maximum}K` : ''}`
    : undefined;
  const requiredSkills = Array.isArray(job.skill) ? job.skill.filter(skill => typeof skill === 'string') : [];
  const applicationCount = job?.applicationCount || 0;
  const createdAt = typeof job.createdAt === 'string' ? job.createdAt : undefined;

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200 cursor-pointer h-[300px] flex flex-col"
      onClick={() => {
        if (isEmployer) {
          router.push(`/jobs/employer-job-details/${job.id}`);
        } else if (onClick) {
          onClick();
        }
      }}
    >
      <div className="absolute top-0 right-0 p-2 z-10">
        {!isEmployer && (
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full transition-colors ${
              isSaved ? "text-blue-600 hover:text-blue-700" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleSaveJob();
            }}
            disabled={isLoading}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        )}
      </div>

      <CardContent className="p-4 space-y-3 flex-1 overflow-hidden">
        {/* Company Logo and Title */}
        <div className="flex items-start gap-3 pr-10">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt={companyName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 
              className="font-semibold text-lg line-clamp-2 break-words hover:text-blue-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (isEmployer) {
                  router.push(`/jobs/employer-job-details/${job.id}`);
                } else {
                  router.push(`/jobs/job-details/${job.id}`);
                }
              }}
            >
              {jobTitle}
            </h3>
            <p className="text-sm text-gray-500 truncate">{companyName}</p>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{employmentType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{applicationCount} applicants</span>
          </div>
          {salaryRange && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{salaryRange} per year</span>
            </div>
          )}
        </div>

        {/* Skills/Tags */}
        <div className="flex flex-wrap gap-1">
          {requiredSkills.slice(0, 3).map((skill: string, index: number) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-blue-50 text-blue-700"
            >
              {skill}
            </Badge>
          ))}
          {requiredSkills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{requiredSkills.length - 3} more
            </Badge>
          )}
        </div>

        {/* Posted Time */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">{timeAgo}</span>
        </div>
      </CardContent>
          <br/>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full bg-white hover:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            if (isEmployer) {
              router.push(`/jobs/employer-job-details/${job.id}`);
            } else {
              router.push(`/jobs/job-details/${job.id}`);
            }
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobGridCard; 