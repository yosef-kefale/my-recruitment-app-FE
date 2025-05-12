"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import JobCard from "../../../components/job/job-card";
import JobGridCard from "../../../components/job/job-grid-card";
import FilterSidebar from "../../../components/job/filter-sidebar";
import JobDetail from "../../../components/job/job-detail";
import { Grid, List, RefreshCw, Loader2, Bookmark, Search, Filter, X, ChevronLeft, ChevronRight, ArrowUpDown, Eraser, ArrowUp, ArrowDown } from "lucide-react";
import { JobPosting } from "../../../models/jobPosting";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "../../../lib/api";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axios from "axios";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ViewJobs = () => {
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedViewJob, setSelectedViewJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isListView, setIsListView] = useState(true);
  const [isEmployeeView, setIsEmployeeView] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [sortBy, setSortBy] = useState<"date" | "salary" | "title">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filterValues, setFilterValues] = useState<{
    salary?: number;
    jobType?: string;
    location?: string;
    availability?: {
      freelance?: boolean;
      fullTime?: boolean;
      readyWork?: boolean;
    };
    jobPreference?: string;
    specialties?: Array<{ name: string; checked: boolean }>;
    industry?: string;
    experienceLevel?: string;
    educationLevel?: string;
    employmentType?: string;
  }>({
    salary: 1500,
    jobType: "All",
    location: "New York",
    availability: {
      freelance: true,
      fullTime: true,
      readyWork: true,
    },
    specialties: [
      { name: "Graphic Designer", checked: true },
      { name: "UI Designer", checked: true },
      { name: "UX Designer", checked: true },
      { name: "Web Design", checked: true },
    ],
  });

  const [appliedFilters, setAppliedFilters] = useState<typeof filterValues>({});

  const buildFilterQuery = () => {
    const filters: string[] = [];

    // Add type filter (jobType in our UI corresponds to type in API)
    if (appliedFilters.jobType && appliedFilters.jobType !== "All") {
      filters.push(`type:=:${encodeURIComponent(appliedFilters.jobType)}`);
    }

    // Add employment type filter
    if (appliedFilters.employmentType) {
      filters.push(`employmentType:=:${encodeURIComponent(appliedFilters.employmentType)}`);
    }

    // Add location filter only if it's different from the default
    if (appliedFilters.location && appliedFilters.location !== "New York") {
      filters.push(`location:=:${encodeURIComponent(appliedFilters.location)}`);
    }

    // Add industry filter
    if (appliedFilters.industry) {
      filters.push(`industry:=:${encodeURIComponent(appliedFilters.industry)}`);
    }

    // Add experience level filter
    if (appliedFilters.experienceLevel) {
      filters.push(`experienceLevel:=:${encodeURIComponent(appliedFilters.experienceLevel)}`);
    }

    // Add education level filter
    if (appliedFilters.educationLevel) {
      filters.push(`educationLevel:=:${encodeURIComponent(appliedFilters.educationLevel)}`);
    }

    // Add salary range filter only if it's different from the default
    if (appliedFilters.salary && appliedFilters.salary !== 1500) {
      filters.push(`salaryRange:=:${encodeURIComponent(appliedFilters.salary.toString())}`);
    }

    // Join filters with | if multiple filters exist
    return filters.length > 0 ? `w=${filters.join('|')}` : '';
  };

  const handleApplyFilters = () => {
    // Create a new object with only the non-default values
    const nonDefaultFilters = { ...filterValues };
    
    // Remove default values
    if (nonDefaultFilters.location === "New York") {
      delete nonDefaultFilters.location;
    }
    if (nonDefaultFilters.salary === 1500) {
      delete nonDefaultFilters.salary;
    }
    
    setAppliedFilters(nonDefaultFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, appliedFilters]);

  const validateJobData = (job: any): JobPosting => {
    if (!job.id) {
      throw new Error("Job ID is required");
    }
    
    return {
      id: String(job.id),
      title: String(job.title || ''),
      description: String(job.description || ''),
      location: String(job.location || ''),
      employmentType: String(job.employmentType || ''),
      salaryRange: job.salaryRange ? {
        minimum: job.salaryRange.minimum || 0,
        maximum: job.salaryRange.maximum || 0
      } : undefined,
      skill: Array.isArray(job.skill) 
        ? job.skill.map((skill: any) => String(skill || ''))
        : [],
      createdAt: String(job.createdAt || ''),
      isSaved: Boolean(job.isSaved),
      companyName: String(job.company?.name || ''),
      companyLogo: job.company?.logo ? {
        filename: String(job.company.logo.filename || ''),
        path: String(job.company.logo.path || ''),
        originalname: String(job.company.logo.originalname || ''),
        mimetype: String(job.company.logo.mimetype || ''),
        size: Number(job.company.logo.size || 0),
        bucketName: String(job.company.logo.bucketName || '')
      } : undefined,
      position: String(job.position || ''),
      industry: String(job.industry || ''),
      type: String(job.type || ''),
      city: String(job.city || ''),
      deadline: String(job.deadline || ''),
      requirementId: String(job.requirementId || ''),
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
      status: String(job.status || ''),
      gender: String(job.gender || ''),
      minimumGPA: Number(job.minimumGPA || 0),
      postedDate: String(job.postedDate || ''),
      applicationURL: String(job.applicationURL || ''),
      applicationCount: Number(job.applicationCount || 0),
      experienceLevel: String(job.experienceLevel || ''),
      fieldOfStudy: String(job.fieldOfStudy || ''),
      educationLevel: String(job.educationLevel || ''),
      howToApply: String(job.howToApply || ''),
      remotePolicy: String(job.remotePolicy || '')
    };
  };

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/jobs`);
      const data = response.data;
      
      // Validate and transform the data
      const validatedJobs = (data.items || []).map(validateJobData);

      // Update total items and calculate total pages
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));

      // Sort jobs by createdAt in descending order (newest first)
      const sortedJobs = validatedJobs.sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setFilteredJobs(sortedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = (deletedJobId: string) => {
    setFilteredJobs((prevJobs) => prevJobs.filter((job) => job.id !== deletedJobId));
  };

  const handleFilterChange = (updatedFilters: {
    salary?: number;
    jobType?: string;
    location?: string;
    availability?: { freelance?: boolean; fullTime?: boolean; readyWork?: boolean };
    jobPreference?: string;
    specialties?: { name: string; checked: boolean }[];
    industry?: string;
    experienceLevel?: string;
    educationLevel?: string;
    employmentType?: string;
  }) => {
    setFilterValues((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        ...updatedFilters,
      };

      return newFilters;
    });
  };

  // Filter jobs based on search query
  const getFilteredJobsBySearch = () => {
    if (!searchQuery.trim()) return filteredJobs;
    
    return filteredJobs.filter(job => 
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.position?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get saved jobs
  const getSavedJobs = () => {
    return filteredJobs.filter(job => job.isSaved === true);
  };

  // Update pagination when search results or filters change
  useEffect(() => {
    const filteredJobsBySearch = getFilteredJobsBySearch();
    const savedJobs = getSavedJobs();
    const jobsToDisplay = activeTab === "saved" ? savedJobs : filteredJobsBySearch;
    
    // Update total items and pages
    setTotalItems(jobsToDisplay.length);
    setTotalPages(Math.ceil(jobsToDisplay.length / itemsPerPage));
    
    // Reset to first page if current page is invalid
    if (currentPage > Math.ceil(jobsToDisplay.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [searchQuery, activeTab, filteredJobs]);

  // Update displayed jobs when sort changes
  useEffect(() => {
    const filteredJobsBySearch = getFilteredJobsBySearch();
    const savedJobs = getSavedJobs();
    const jobsToDisplay = activeTab === "saved" ? savedJobs : filteredJobsBySearch;
    
    // Sort the jobs
    const sortedJobs = [...jobsToDisplay].sort((a, b) => {
      let result = 0;
      switch (sortBy) {
        case "date":
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          result = dateB - dateA;
          break;
        case "salary":
          const aSalary = a.salaryRange?.maximum || 0;
          const bSalary = b.salaryRange?.maximum || 0;
          result = bSalary - aSalary;
          break;
        case "title":
          result = (a.title || '').localeCompare(b.title || '');
          break;
        default:
          return 0;
      }
      return sortDirection === "asc" ? -result : result;
    });
    
    setTotalItems(sortedJobs.length);
    setTotalPages(Math.ceil(sortedJobs.length / itemsPerPage));
    
    if (currentPage > Math.ceil(sortedJobs.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [sortBy, sortDirection, searchQuery, activeTab, filteredJobs]);

  // Calculate pagination for displayed jobs
  const filteredJobsBySearch = getFilteredJobsBySearch();
  const savedJobs = getSavedJobs();
  const jobsToDisplay = activeTab === "saved" ? savedJobs : filteredJobsBySearch;
  const sortedJobs = [...jobsToDisplay].sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "date":
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        result = dateB - dateA;
        break;
      case "salary":
        const aSalary = a.salaryRange?.maximum || 0;
        const bSalary = b.salaryRange?.maximum || 0;
        result = bSalary - aSalary;
        break;
      case "title":
        result = (a.title || '').localeCompare(b.title || '');
        break;
      default:
        return 0;
    }
    return sortDirection === "asc" ? -result : result;
  });
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedJobs = sortedJobs.slice(startIndex, endIndex);

  // Update search query when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch]);

  const resetFilters = () => {
    setFilterValues({
      salary: 1500,
      jobType: "All",
      location: "New York",
      availability: {
        freelance: true,
        fullTime: true,
        readyWork: true,
      },
      specialties: [
        { name: "Graphic Designer", checked: true },
        { name: "UI Designer", checked: true },
        { name: "UX Designer", checked: true },
        { name: "Web Design", checked: true },
      ],
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* Filter Section - Desktop */}
          {isEmployeeView && (
            <div className={`hidden md:block sticky top-6 self-start transition-all duration-300 ${
              isSidebarVisible 
                ? 'w-1/4 lg:w-1/5' 
                : 'w-12'
            }`}>
              <Card className={`shadow-md rounded-lg max-h-[calc(100vh-3rem)] overflow-y-auto transition-all duration-300 ${
                isSidebarVisible 
                  ? 'w-full' 
                  : 'w-20'
              }`}>
                <div className="flex justify-between items-center p-2 sm:p-4 border-b">
                  {isSidebarVisible ? (
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800">Filters</h3>
                    </div>
                  ) : (
                    <div className="w-0" />
                  )}
                  <div className="flex items-center gap-2">
                    {!isSidebarVisible && (
                      <span className="text-blue-600">
                        <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                      title={isSidebarVisible ? "Hide filters" : "Show filters"}
                    >
                      {isSidebarVisible ? <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </Button>
                    {isSidebarVisible && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={resetFilters}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        title="Clear all filters"
                      >
                        <Eraser className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {isSidebarVisible && (
                  <>
                    <FilterSidebar
                      filterValues={filterValues}
                      onFilterChange={handleFilterChange}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                    />
                    <div className="p-2 sm:p-4 border-t">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base" 
                        onClick={handleApplyFilters}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}

          {/* Job List Section */}
          <div className={`flex flex-col h-[calc(100vh-6rem)] ${isEmployeeView ? (isSidebarVisible ? 'md:ml-4' : '') : ''} w-full`}>
            {/* Fixed Header with Search, Tabs and Buttons */}
            <div className="sticky top-0 bg-slate-50 z-10 pb-2">
              <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 w-full items-stretch md:items-center">
                {/* Search + Filter Button */}
                <div className="flex flex-row gap-2 w-full md:w-auto order-1">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search jobs by title..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-9 h-8 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  {isEmployeeView && (
                    <div className="w-auto flex items-center">
                      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="md:hidden flex items-center gap-2"
                          >
                            <Filter className="h-4 w-4" />
                            <span>Filters</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-full sm:w-[400px] p-0">
                          <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center p-4 border-b">
                              <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-base text-gray-800">Filters</h3>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={resetFilters}
                                className="h-8 w-8 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                title="Clear all filters"
                              >
                                <Eraser className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                              <FilterSidebar
                                filterValues={filterValues}
                                onFilterChange={handleFilterChange}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                              />
                            </div>
                            <div className="p-4 border-t">
                              <Button 
                                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                onClick={() => {
                                  handleApplyFilters();
                                  setIsMobileFilterOpen(false);
                                }}
                              >
                                Apply Filters
                              </Button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  )}
                </div>

                {/* Tabs (always full width, next row on mobile) */}
                {isEmployeeView && (
                  <div className="w-full order-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                      <TabsList className="flex space-x-1 h-8 w-full md:w-auto">
                        <TabsTrigger value="all" className="flex items-center gap-1 text-sm px-3">
                          <List className="h-3 w-3" />
                          All Jobs
                        </TabsTrigger>
                        <TabsTrigger value="saved" className="flex items-center gap-1 text-sm px-3">
                          <Bookmark className="h-3 w-3" />
                          Saved Jobs
                          {savedJobs.length > 0 && (
                            <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 rounded-full">
                              {savedJobs.length}
                            </span>
                          )}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                )}

                {/* Sort, Sort Direction, Refresh, View Toggles (compact row) */}
                <div className="flex flex-row gap-1 w-full md:w-auto order-3 items-center justify-between md:justify-start">
                  <div className="flex items-center gap-1">
                    <Select value={sortBy} onValueChange={(value: "date" | "salary" | "title") => setSortBy(value)}>
                      <SelectTrigger className="h-8 w-[90px] md:w-[140px] text-xs md:text-sm">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="title">Job Title</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                      className="h-8 w-8"
                      title={sortDirection === "asc" ? "Sort ascending" : "Sort descending"}
                    >
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={fetchJobs}
                      className="h-8 w-8 rounded-full"
                      title="Refresh jobs"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setIsListView(true)}
                      className={`p-1.5 rounded-md transition-colors ${
                        isListView ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                      title="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsListView(false)}
                      className={`p-1.5 rounded-md transition-colors ${
                        !isListView ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                      }`}
                      title="Grid view"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings with Pagination */}
            <div className="flex-1 overflow-y-auto px-0 md:px-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Loading jobs...</span>
                </div>
              ) : (activeTab === "saved" && savedJobs.length === 0) ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Bookmark className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">No saved jobs</h3>
                    <p className="text-gray-500 mt-2">
                      You haven&apos;t saved any jobs yet. Click the bookmark icon on a job card to save it.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("all")}
                    >
                      View all jobs
                    </Button>
                  </div>
                </Card>
              ) : displayedJobs.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">No jobs found</h3>
                    <p className="text-gray-500 mt-2">
                      {searchQuery ? "Try adjusting your search terms" : "No jobs match your current filters"}
                    </p>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <>
                  <div className={`grid w-full ${isListView ? 'grid-cols-1' : `grid-cols-1 md:grid-cols-2 ${isSidebarVisible ? 'lg:grid-cols-3' : 'lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}`} gap-4`}>
                    {(activeTab === "saved" ? savedJobs : displayedJobs).map((job) => (
                      <div key={job.id} className={isListView ? '' : 'h-full'}>
                        {isListView ? (
                          <JobCard 
                            job={job} 
                            isEmployer={!isEmployeeView} 
                            onDelete={handleDeleteJob}
                            onClick={() => setSelectedViewJob(job)}
                          />
                        ) : (
                          <JobGridCard
                            job={job}
                            isEmployer={!isEmployeeView}
                            onDelete={handleDeleteJob}
                            onClick={() => setSelectedViewJob(job)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {activeTab !== "saved" && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {/* First Page */}
                          {currentPage > 2 && (
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(1)}
                                isActive={currentPage === 1}
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                          )}

                          {/* Ellipsis before current page */}
                          {currentPage > 3 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}

                          {/* Previous page */}
                          {currentPage > 1 && (
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(currentPage - 1)}
                              >
                                {currentPage - 1}
                              </PaginationLink>
                            </PaginationItem>
                          )}

                          {/* Current page */}
                          <PaginationItem>
                            <PaginationLink
                              isActive
                            >
                              {currentPage}
                            </PaginationLink>
                          </PaginationItem>

                          {/* Next page */}
                          {currentPage < totalPages && (
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(currentPage + 1)}
                              >
                                {currentPage + 1}
                              </PaginationLink>
                            </PaginationItem>
                          )}

                          {/* Ellipsis after current page */}
                          {currentPage < totalPages - 2 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}

                          {/* Last page */}
                          {currentPage < totalPages - 1 && (
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(totalPages)}
                                isActive={currentPage === totalPages}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          )}

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

      {/* Job Details Drawer */}
      {selectedViewJob && (
        <JobDetail
          job={selectedViewJob}
          onClose={() => setSelectedViewJob(null)}
        />
      )}
    </div>
  );
};

export default ViewJobs;
