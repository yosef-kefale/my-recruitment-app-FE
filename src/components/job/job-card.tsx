import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { MapPin, MoreVertical, Edit, Trash2, Bookmark, Building2, Briefcase, Calendar, Users, DollarSign, GraduationCap, Globe2, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { JobPosting } from "../../app/models/jobPosting";
import { Organization } from "../../app/models/organization";
import { API_URL } from "@/lib/api";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface JobCardProps {
  job: JobPosting;
  isEmployer: boolean;
  onDelete?: (id: string) => void;
  onClick?: (job: JobPosting) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isEmployer, onDelete }) => {
  const { toast } = useToast();
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
              const apiUrl = `${API_URL}/jobs/${job.id}`;

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
      if (isSaved) {
        await axios.delete(`${API_URL}/save-jobs/${job.id}`);
      } else {
        await axios.post(`${API_URL}/save-jobs`, { jobId: job.id });
      }
      
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
    }
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <Card className="group relative overflow-hidden bg-white border border-gray-200 hover:border-sky-200 transition-all duration-300">
      {/* Save Button - Absolute Positioned */}
      {!isEmployer && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleSaveJob}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:bg-sky-50 hover:text-sky-600 transition-colors"
              aria-label="Save job"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-sky-500 text-sky-500' : ''}`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSaved ? 'Remove from saved jobs' : 'Save job'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      )}

      {/* Main Content */}
      <div className="p-4">
        {/* Header Section with Location and Applicants */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100">
              <Image
                src={typeof job.companyLogo === 'string' ? job.companyLogo : "/logo-demo.png"}
                alt={`${job.companyName || 'Company'} Logo`}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2">
              <Link href={isEmployer ? `/jobs/employer-job-details/${job.id}` : `/jobs/job-details/${job.id}`}>
                <h2 className="text-base font-semibold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                  {job.title}
                </h2>
              </Link>
              {job.skill && job.skill.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CheckCircle className="w-6 h-6 mr-0.5 mb-2 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your skills match this job</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              {job.companyName && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{job.companyName}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Company name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
              {(job.location || job.city) && job.companyName && <span className="text-gray-300">•</span>}
              {(job.location || job.city) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{job.location || job.city}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Location</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {(job.location || job.city || job.companyName) && (
                <span className="text-gray-300">•</span>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{job.applicationCount || 0}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of applicants</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-gray-300">•</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      className={`px-2 py-0.5 text-xs ${
                        job.status === 'active' ? 'bg-green-50 text-green-600' :
                        job.status === 'closed' ? 'bg-red-50 text-red-600' :
                        job.status === 'draft' ? 'bg-gray-50 text-gray-600' :
                        'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Job status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Quick Info Pills and Description */}
        <div className="flex gap-3 mb-3">
          <div className="flex flex-wrap gap-1.5 flex-grow">
            {job.employmentType && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="bg-blue-50 text-blue-600 px-2 py-0.5 text-xs">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {job.employmentType}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Employment type</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {job.educationLevel && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="bg-purple-50 text-purple-600 px-2 py-0.5 text-xs">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      {job.educationLevel}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Education level</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {job.remotePolicy && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="bg-green-50 text-green-600 px-2 py-0.5 text-xs">
                      <Globe2 className="w-3 h-3 mr-1" />
                      {job.remotePolicy}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remote work policy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <div className="mb-3">
            <div 
              className="prose prose-sm max-w-none text-gray-600 line-clamp-2 text-sm"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        )}

        {/* Skills and Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {job.skill && job.skill.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.skill.slice(0, 2).map((skill) => (
                <TooltipProvider key={skill}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-sky-50 text-sky-600 hover:bg-sky-100 cursor-default px-2 py-0.5 text-xs">
                        {skill}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Required skill</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {job.skill.length > 2 && (
                <Badge className="bg-gray-50 text-gray-600 hover:bg-sky-100 cursor-default px-2 py-0.5 text-xs">
                  +{job.skill.length - 2}
                </Badge>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timeAgo}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Posted {timeAgo}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {job.deadline && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-red-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Application deadline</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {isEmployer && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-gray-50">
                    <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
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
      </div>
    </Card>
  );
};

export default JobCard;
