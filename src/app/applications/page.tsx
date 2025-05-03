"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUp, ArrowDown, FileText, Calendar, Building2, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { API_URL } from "@/lib/api";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Application {
  id: string;
  userId: string;
  JobPostId: string;
  cv: {
    filename: string;
    path: string;
    originalname: string;
    mimetype: string;
    size: number;
    bucketName: string;
  };
  coverLetter: string;
  applicationInformation: Record<string, any>;
  userInfo: Record<string, any>;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  remark: string;
  notification: string;
  questionaryScore: number;
  isViewed: boolean;
  jobPost: {
    id: string;
    title: string;
    position: string;
    companyName: string;
    companyLogo: {
      filename: string;
      path: string;
    };
    location: string;
    employmentType: string;
    postedDate: string;
    deadline: string;
    status: string;
  }[];
}

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const itemsPerPage = 10;
  const { toast } = useToast();
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchApplications();
  }, [currentPage, debouncedSearch, statusFilter, sortBy, sortDirection]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const org = localStorage.getItem("organization");
      if (!org) throw new Error("No organization found");
      
      const orgData = JSON.parse(org);
      if (!orgData?.id) throw new Error("No organization ID found");

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        userId: orgData.id,
      });

      if (debouncedSearch) {
        queryParams.append("search", debouncedSearch);
      }

      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }

      const res = await fetch(`${API_URL}/applications?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await res.json();
      console.log(data);
      setApplications(data.items || []);
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const sortedApplications = [...applications].sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "date":
        const dateA = new Date(a.jobPost?.[0]?.postedDate || 0).getTime();
        const dateB = new Date(b.jobPost?.[0]?.postedDate || 0).getTime();
        result = dateB - dateA;
        break;
      case "status":
        result = (a.isViewed ? 1 : 0) - (b.isViewed ? 1 : 0);
        break;
      default:
        return 0;
    }
    return sortDirection === "asc" ? -result : result;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="not_viewed">Not Viewed</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value: "date" | "status") => setSortBy(value)}>
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                  className="h-10 w-10"
                  title={sortDirection === "asc" ? "Sort ascending" : "Sort descending"}
                >
                  {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="grid gap-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : sortedApplications.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">No applications found</h3>
                  <p className="text-gray-500 mt-2">
                    {searchQuery ? "Try adjusting your search terms" : "You haven't applied to any jobs yet"}
                  </p>
                </div>
              </Card>
            ) : (
              <>
                {sortedApplications.map((application) => (
                  <Card key={application.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {application.jobPost?.[0]?.companyLogo?.path ? (
                            <img
                              src={application.jobPost?.[0]?.companyLogo?.path}
                              alt={application.jobPost?.[0]?.companyName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.jobPost?.[0]?.title}
                            </h3>
                            <p className="text-gray-600">{application.jobPost?.[0]?.companyName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              application.isViewed
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {application.isViewed ? "Viewed" : "Not Viewed"}
                            </span>
                            <span className="text-sm text-gray-500">
                              Applied {format(new Date(application.jobPost?.[0]?.postedDate || new Date()), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{application.jobPost?.[0]?.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{application.jobPost?.[0]?.employmentType}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Deadline: {format(new Date(application.jobPost?.[0]?.deadline || new Date()), "MMM d, yyyy")}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            View Application
                          </Button>
                          {application.cv && (
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              View CV
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;